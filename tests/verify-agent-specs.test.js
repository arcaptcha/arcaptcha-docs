const test = require("node:test");
const assert = require("node:assert");
const fs = require("node:fs");
const path = require("node:path");

const repoRoot = path.resolve(__dirname, "..");
const staticDir = path.join(repoRoot, "static");
const buildDir = path.join(repoRoot, "build");

test("v4 Installation documents init.js as an optional loader", () => {
  const installationPath = path.join(repoRoot, "versioned_docs", "version-4.0.0", "installation.md");
  const content = fs.readFileSync(installationPath, "utf8");

  assert.match(content, /Optional: Use the multi-domain `init\.js` loader/);
  assert.match(content, /https:\/\/nwidget\.arcaptcha\.ir\/1\/api\.js/, "direct api.js remains the standard example");
  assert.match(content, /https:\/\/widget\.arcaptcha\.ir\/init\.js/, "init.js is documented as an alternative");
  assert.match(content, /data-backup-urls=.*widget\.arcaptcha\.co.*widget\.arcaptcha\.net/);
});

test("v4 Bypass Mode guide explains outage policy and includes its flow diagram", () => {
  const guidePath = path.join(repoRoot, "versioned_docs", "version-4.0.0", "bypass-mode.md");
  const content = fs.readFileSync(guidePath, "utf8");
  const faGuidePath = path.join(repoRoot, "i18n", "fa", "docusaurus-plugin-content-docs", "version-4.0.0", "bypass-mode.md");
  const faContent = fs.readFileSync(faGuidePath, "utf8");

  assert.match(content, /https:\/\/api\.arcaptcha\.ir\/arcaptcha\/api\/heartbeat/);
  assert.match(content, /OK.*true/);
  assert.match(content, /fail-closed/i);
  assert.match(content, /fail-open/i);
  assert.match(content, /success: false/);
  assert.match(content, /https:\/\/github\.com\/arcaptcha\/arcaptcha-bypass-mode-demo/);
  assert.doesNotMatch(content, /geetest/i);
  assert.doesNotMatch(content, /```(?:js|javascript)/i);
  assert.match(faContent, /https:\/\/github\.com\/arcaptcha\/arcaptcha-bypass-mode-demo/);
  assert.doesNotMatch(faContent, /geetest/i);
  assert.doesNotMatch(faContent, /```(?:js|javascript)/i);
  assert.match(content, /\/img\/arcaptcha-bypass-flow\.svg/);
  assert.ok(fs.existsSync(path.join(staticDir, "img", "arcaptcha-bypass-flow.svg")));
});

test("v4 Invisible Widget explains silent completion and conditional challenges", () => {
  const pagePath = path.join(repoRoot, "versioned_docs", "version-4.0.0", "invisible captcha.md");
  const content = fs.readFileSync(pagePath, "utf8");
  const faPagePath = path.join(repoRoot, "i18n", "fa", "docusaurus-plugin-content-docs", "version-4.0.0", "invisible captcha.md");
  const faContent = fs.readFileSync(faPagePath, "utf8");
  const llmsIndex = fs.readFileSync(path.join(staticDir, "llms.txt"), "utf8");
  const llmsFull = fs.readFileSync(path.join(staticDir, "llms-full.txt"), "utf8");

  assert.match(content, /^# Invisible Widget/m);
  assert.match(content, /arcaptcha\.execute/);
  assert.match(content, /without interrupting|no interruption/i);
  assert.match(content, /pop-up challenge/i);
  assert.match(content, /not a reCAPTCHA v3-style score/i);
  assert.match(faContent, /^# ویجت نامرئی/m);
  assert.match(llmsIndex, /\[Invisible Widget\]/);
  assert.match(llmsFull, /## 5\. Invisible Widget/);
});

test("static/onboard.md satisfies agent skill format and technical requirements", () => {
  const onboardPath = path.join(staticDir, "onboard.md");
  assert.ok(fs.existsSync(onboardPath), "static/onboard.md must exist");

  const content = fs.readFileSync(onboardPath, "utf8");

  // Client widget script injection
  assert.match(
    content,
    /https:\/\/nwidget\.arcaptcha\.ir\/1\/api\.js/,
    "onboard.md must include widget script URL"
  );
  assert.match(content, /https:\/\/docs\.arcaptcha\.co\/bypass-mode/, "onboard.md must link to outage guidance");
  assert.match(content, /https:\/\/github\.com\/arcaptcha\/arcaptcha-bypass-mode-demo/, "onboard.md must link to sample project");
  assert.match(content, /https:\/\/api\.arcaptcha\.ir\/arcaptcha\/api\/heartbeat/, "onboard.md must include heartbeat URL");

  // Container placement
  assert.match(
    content,
    /class=["']arcaptcha["']|data-site-key/i,
    "onboard.md must detail arcaptcha container and data-site-key"
  );

  // Server verification endpoint
  assert.match(
    content,
    /https:\/\/api\.arcaptcha\.co\/arcaptcha\/api\/verify/,
    "onboard.md must include verify endpoint"
  );

  // Strict differentiation between public Site Key and private Secret Key
  assert.match(
    content,
    /site[ -]?key/i,
    "onboard.md must document site key"
  );
  assert.match(
    content,
    /secret[ -]?key/i,
    "onboard.md must document secret key"
  );
  assert.match(
    content,
    /(never.*client|server.*only|private|environment variable)/i,
    "onboard.md must explicitly warn against exposing secret key on client-side"
  );

  // Official SDKs
  assert.match(
    content,
    /SDK|libraries/i,
    "onboard.md must document SDKs/libraries"
  );
  assert.match(content, /React|Vue|Node\.js|Python|PHP|Go/i, "onboard.md must mention common SDK stacks");

  // REST fallback
  assert.match(
    content,
    /challenge_id/i,
    "onboard.md must document challenge_id parameter for REST fallback"
  );
  assert.match(
    content,
    /application\/json/i,
    "onboard.md must document Content-Type application/json header"
  );
});

test("static/llms.txt provides structured index of ARCaptcha documentation", () => {
  const llmsPath = path.join(staticDir, "llms.txt");
  assert.ok(fs.existsSync(llmsPath), "static/llms.txt must exist");

  const content = fs.readFileSync(llmsPath, "utf8");

  assert.ok(content.length > 50, "llms.txt should not be empty");
  assert.match(content, /ARCaptcha/i, "llms.txt should refer to ARCaptcha");
  assert.match(content, /quick start/i, "llms.txt must index quick start");
  assert.match(content, /installation/i, "llms.txt must index installation");
  assert.match(content, /configuration/i, "llms.txt must index configuration");
  assert.match(content, /plugins/i, "llms.txt must index plugins");
  assert.match(content, /verify/i, "llms.txt must index verify API");
  assert.match(content, /https:\/\/api\.arcaptcha\.ir\/arcaptcha\/api\/heartbeat/, "llms.txt must index the heartbeat endpoint");
});

test("static/llms-full.txt provides consolidated documentation context", () => {
  const llmsFullPath = path.join(staticDir, "llms-full.txt");
  assert.ok(fs.existsSync(llmsFullPath), "static/llms-full.txt must exist");

  const content = fs.readFileSync(llmsFullPath, "utf8");

  assert.ok(content.length > 500, "llms-full.txt should contain comprehensive documentation");
  assert.match(content, /https:\/\/nwidget\.arcaptcha\.ir\/1\/api\.js/, "llms-full.txt must contain script details");
  assert.match(content, /https:\/\/api\.arcaptcha\.co\/arcaptcha\/api\/verify/, "llms-full.txt must contain verify endpoint");
});

test("AGENTS.md contains binding documentation sync rule", () => {
  const agentsMdPath = path.join(repoRoot, "AGENTS.md");
  assert.ok(fs.existsSync(agentsMdPath), "AGENTS.md must exist");

  const content = fs.readFileSync(agentsMdPath, "utf8");

  assert.match(
    content,
    /llms\.txt/i,
    "AGENTS.md must mention llms.txt in sync rule"
  );
  assert.match(
    content,
    /onboard\.md/i,
    "AGENTS.md must mention onboard.md in sync rule"
  );
});

test("Static files exist in build output root after build", () => {
  if (fs.existsSync(buildDir)) {
    assert.ok(
      fs.existsSync(path.join(buildDir, "onboard.md")),
      "build/onboard.md must exist in build output"
    );
    assert.ok(
      fs.existsSync(path.join(buildDir, "llms.txt")),
      "build/llms.txt must exist in build output"
    );
    assert.ok(
      fs.existsSync(path.join(buildDir, "llms-full.txt")),
      "build/llms-full.txt must exist in build output"
    );
  }
});
