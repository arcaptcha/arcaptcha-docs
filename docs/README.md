### Generate PDF documentation

The `generate-docs.sh` script converts the Docusaurus documentation into a single PDF. The complete process is:

1. **Loads the configuration.** The script starts in the repository root and reads its configuration from environment variables. If no overrides are provided, it uses port `3100`, the Persian start page `/fa/quick%20start`, the output file `arcaptcha-fa.pdf`, and the `pdf` output directory.

2. **Checks the required tools.** It verifies that `node`, `npm`, `curl`, and `docker` are installed. It also checks whether the Docker daemon is accessible. If the current user cannot access Docker directly, the script attempts to use `sudo docker`.

3. **Repairs generated-file permissions.** Docker or a previous `sudo` run may leave `node_modules`, `build`, `.docusaurus`, or `pdf` owned by another user. The script detects this and, when necessary, uses `sudo chown` to restore ownership to the current user.

4. **Installs production dependencies.** When `package-lock.json` exists, the script runs `npm ci --omit=dev`; otherwise, it runs `npm install --omit=dev --package-lock=false`.

5. **Builds the documentation website.** It runs `npm run build`, which generates the production Docusaurus site in the `build` directory. PDF generation uses this production build instead of the development server.

6. **Starts a local web server.** It runs the production site with `npm run serve -- --host 0.0.0.0 --port 3100`. The port can be changed with `PORT`. The script polls `BASE_URL` for up to 90 seconds and stops with an error if the server does not become available.

7. **Creates print-specific CSS.** It writes `pdf/print.css` to hide navigation, sidebars, breadcrumbs, pagination, page footers, tables of contents, and other website-only elements. It also hides videos and iframes and adjusts the page layout for printing.

8. **Prepares the Docker images.** It pulls the configured Docusaurus PDF crawler image. It then checks for the local Prince image. If that image does not exist, the script detects the machine architecture, downloads Prince, and builds the local Docker image. This build normally happens only on the first run or after the image name or Prince version changes.

9. **Collects documentation URLs.** The crawler starts at `BASE_URL + START_PATH`, follows the documentation pages, and writes the ordered URL list to `pdf/pages.txt`. The language is selected by `START_PATH`: `/fa/quick%20start` for Persian and `/quick%20start` for English. The script stops if the crawler does not produce a non-empty URL list.

10. **Generates the PDF.** Prince reads every URL from `pdf/pages.txt`, applies `pdf/print.css`, renders the pages, and combines them into the filename specified by `OUTPUT` inside `PDF_DIR`.

11. **Validates and cleans up.** The script confirms that the generated PDF exists and is not empty. It then stops the local Docusaurus server and removes the temporary Prince build directory. Cleanup also runs if the script is interrupted or fails. The generated PDF, `pages.txt`, and `print.css` remain in the output directory.

The script stops immediately when a command fails and prints errors with the `[generate-docs] ERROR:` prefix.

The script requires Node.js, npm, curl, and a running Docker daemon. On the first run, it pulls the crawler image and builds a local Prince image, so an internet connection is also required.

Make the script executable if needed:

```bash
chmod +x ./generate-docs.sh
```

Generate the Persian (FA) documentation. Persian is the script's default language:

```bash
./generate-docs.sh
```

This creates `pdf/arcaptcha-fa.pdf`.

Generate the English (EN) documentation by overriding the starting route and output filename:

```bash
START_PATH='/quick%20start' OUTPUT='arcaptcha-en.pdf' ./generate-docs.sh
```

This creates `pdf/arcaptcha-en.pdf`.

The script can also be configured with these environment variables:

- `START_PATH`: first documentation page the crawler visits; defaults to `/fa/quick%20start`
- `OUTPUT`: generated PDF filename; defaults to `arcaptcha-fa.pdf`
- `PDF_DIR`: output directory; defaults to `./pdf`
- `PORT`: local Docusaurus server port; defaults to `3100`
- `BASE_URL`: URL used by the crawler; defaults to `http://127.0.0.1:$PORT`
- `CRAWLER_IMAGE`: Docker image used to collect documentation URLs
- `PRINCE_VERSION`: Prince version used to build the PDF image; defaults to `15.4`
- `PRINCE_IMAGE`: local Docker image name used to generate the PDF
