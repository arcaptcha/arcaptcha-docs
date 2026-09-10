#!/usr/bin/env bash
set -Eeuo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$ROOT"

PORT="${PORT:-3100}"
BASE_URL="${BASE_URL:-http://127.0.0.1:${PORT}}"
OUTPUT="${OUTPUT:-arcaptcha-fa.pdf}"
PDF_DIR="${PDF_DIR:-${ROOT}/pdf}"
CRAWLER_IMAGE="${CRAWLER_IMAGE:-openbayes/docusaurus-prince-pdf:latest}"
PRINCE_VERSION="${PRINCE_VERSION:-15.4}"
PRINCE_IMAGE="${PRINCE_IMAGE:-arcaptcha-prince:${PRINCE_VERSION}}"
LIST_FILE="pages.txt"
PRINT_CSS_FILE="print.css"
START_PATH="${START_PATH:-/fa/quick%20start}"

SERVE_PID=""
PRINCE_BUILD_DIR=""
DOCKER_CMD=(docker)

log() {
  printf '[generate-docs] %s\n' "$*"
}

fail() {
  printf '[generate-docs] ERROR: %s\n' "$*" >&2
  exit 1
}

cleanup() {
  if [[ -n "$PRINCE_BUILD_DIR" && -d "$PRINCE_BUILD_DIR" ]]; then
    rm -rf "$PRINCE_BUILD_DIR"
  fi
  if [[ -n "$SERVE_PID" ]] && kill -0 "$SERVE_PID" 2>/dev/null; then
    kill "$SERVE_PID" 2>/dev/null || true
    wait "$SERVE_PID" 2>/dev/null || true
  fi
}
trap cleanup EXIT INT TERM

need_cmd() {
  command -v "$1" >/dev/null 2>&1 || fail "Missing required command: $1"
}

ensure_docker() {
  if docker info >/dev/null 2>&1; then
    return
  fi

  if command -v sudo >/dev/null 2>&1 && sudo docker info >/dev/null 2>&1; then
    DOCKER_CMD=(sudo docker)
    return
  fi

  fail "Docker is not running or the current user cannot access it"
}

repair_generated_permissions() {
  local path mismatch
  local uid gid

  uid="$(id -u)"
  gid="$(id -g)"
  for path in node_modules build .docusaurus "$PDF_DIR"; do
    [[ -e "$path" ]] || continue
    mismatch="$(find "$path" ! -user "$uid" -print -quit 2>/dev/null || true)"
    if [[ -n "$mismatch" ]]; then
      command -v sudo >/dev/null 2>&1 || fail "$path contains files owned by another user"
      log "Fixing ownership of $path"
      sudo chown -R "${uid}:${gid}" "$path"
    fi
  done
}

wait_for_site() {
  local attempt

  for attempt in {1..90}; do
    if curl --fail --silent "$BASE_URL" >/dev/null 2>&1; then
      return
    fi
    kill -0 "$SERVE_PID" 2>/dev/null || fail "Docusaurus server exited early"
    sleep 1
  done

  fail "Timed out waiting for $BASE_URL"
}

build_prince_image() {
  local prince_arch

  if "${DOCKER_CMD[@]}" image inspect "$PRINCE_IMAGE" >/dev/null 2>&1; then
    return
  fi

  case "$(uname -m)" in
    x86_64|amd64) prince_arch="x86_64" ;;
    aarch64|arm64) prince_arch="aarch64" ;;
    *) fail "Unsupported architecture for Prince: $(uname -m)" ;;
  esac

  PRINCE_BUILD_DIR="$(mktemp -d)"
  cat >"${PRINCE_BUILD_DIR}/Dockerfile" <<'DOCKERFILE'
FROM debian:bookworm-slim
ARG PRINCE_VERSION
ARG PRINCE_ARCH
RUN apt-get update \
  && apt-get install -y --no-install-recommends ca-certificates curl fontconfig fonts-dejavu-core \
  && curl -fsSLO "https://www.princexml.com/download/prince-${PRINCE_VERSION}-linux-generic-${PRINCE_ARCH}.tar.gz" \
  && tar -xzf "prince-${PRINCE_VERSION}-linux-generic-${PRINCE_ARCH}.tar.gz" \
  && cd "prince-${PRINCE_VERSION}-linux-generic-${PRINCE_ARCH}" \
  && yes "" | ./install.sh \
  && cd / \
  && rm -rf /var/lib/apt/lists/* "prince-${PRINCE_VERSION}-linux-generic-${PRINCE_ARCH}"*
ENTRYPOINT ["prince"]
DOCKERFILE

  log "Building local Prince ${PRINCE_VERSION} image"
  "${DOCKER_CMD[@]}" build \
    --build-arg "PRINCE_VERSION=${PRINCE_VERSION}" \
    --build-arg "PRINCE_ARCH=${prince_arch}" \
    --tag "$PRINCE_IMAGE" \
    "$PRINCE_BUILD_DIR"
}

need_cmd node
need_cmd npm
need_cmd curl
need_cmd docker
ensure_docker
repair_generated_permissions

log "Installing JavaScript dependencies"
if [[ -f package-lock.json ]]; then
  npm ci --omit=dev
else
  npm install --omit=dev --package-lock=false
fi

log "Building the Docusaurus site"
npm run build

log "Serving the production build at $BASE_URL"
npm run serve -- --host 0.0.0.0 --port "$PORT" &
SERVE_PID=$!
wait_for_site

mkdir -p "$PDF_DIR"

cat >"${PDF_DIR}/${PRINT_CSS_FILE}" <<'CSS'
@media print {
  .row {
    display: block !important;
  }

  .markdown header h1 {
    string-set: doctitle content();
  }

  iframe,
  video {
    display: none !important;
    width: 0 !important;
    height: 0 !important;
    margin: 0 !important;
    padding: 0 !important;
  }

  @page {
    prince-shrink-to-fit: auto;
  }

  .navbar,
  .pagination-nav,
  .theme-doc-breadcrumbs,
  a.hash-link,
  div[class*="docItemContainer"] article footer,
  aside[class*="docSidebarContainer"],
  a[class*="skipToContent"],
  div[class*="lastUpdated"],
  div[class*="tocCollapsible"],
  div[class*="tableOfContents"],
  .footer {
    display: none !important;
  }
}
CSS

log "Pulling the PDF crawler image"
"${DOCKER_CMD[@]}" pull "$CRAWLER_IMAGE"
build_prince_image

log "Collecting PDF page URLs"
"${DOCKER_CMD[@]}" run --rm --init --network host \
  --user "$(id -u):$(id -g)" \
  --volume "${PDF_DIR}:/app/pdf" \
  "$CRAWLER_IMAGE" \
  --url "${BASE_URL}${START_PATH}" \
  --include-index \
  --dest /app/pdf \
  --file "/app/pdf/${LIST_FILE}" \
  --list-only

[[ -s "${PDF_DIR}/${LIST_FILE}" ]] || fail "Crawler did not create ${LIST_FILE}"

log "Generating ${PDF_DIR}/${OUTPUT}"
"${DOCKER_CMD[@]}" run --rm --init --network host \
  --user "$(id -u):$(id -g)" \
  --env HOME=/tmp \
  --volume "${PDF_DIR}:/app/pdf" \
  "$PRINCE_IMAGE" \
  --no-warn-css \
  --style="/app/pdf/${PRINT_CSS_FILE}" \
  --input-list="/app/pdf/${LIST_FILE}" \
  --output="/app/pdf/${OUTPUT}"

[[ -s "${PDF_DIR}/${OUTPUT}" ]] || fail "Prince did not create ${PDF_DIR}/${OUTPUT}"
log "PDF written to ${PDF_DIR}/${OUTPUT}"
