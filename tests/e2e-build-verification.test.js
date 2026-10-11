const test = require("node:test");
const assert = require("node:assert");
const fs = require("node:fs");
const path = require("node:path");

const repoRoot = path.resolve(__dirname, "..");
const buildDir = path.join(repoRoot, "build");
const faBuildDir = path.join(buildDir, "fa");

test("Docusaurus configuration enforces zero broken links with onBrokenLinks: throw", () => {
  const configPath = path.join(repoRoot, "docusaurus.config.js");
  assert.ok(fs.existsSync(configPath), "docusaurus.config.js must exist");
  const configContent = fs.readFileSync(configPath, "utf8");
  assert.match(
    configContent,
    /onBrokenLinks:\s*["']throw["']/,
    "docusaurus.config.js must have onBrokenLinks set to 'throw'"
  );
});

test("Production static output directory contains /onboard.md, /llms.txt, and /llms-full.txt", () => {
  const staticFiles = ["onboard.md", "llms.txt", "llms-full.txt"];

  for (const file of staticFiles) {
    const rootPath = path.join(buildDir, file);
    assert.ok(
      fs.existsSync(rootPath),
      `build/${file} must exist in the root build directory`
    );
    const stat = fs.statSync(rootPath);
    assert.ok(stat.size > 0, `build/${file} must not be empty`);

    const faPath = path.join(faBuildDir, file);
    assert.ok(
      fs.existsSync(faPath),
      `build/fa/${file} must exist in the localized build directory`
    );
  }
});

test("Desktop TOC AgentBox widget renders cleanly in production HTML bundles", () => {
  const pagesToCheck = [
    path.join(buildDir, "quick start/index.html"),
    path.join(buildDir, "agent/index.html"),
    path.join(faBuildDir, "quick start/index.html"),
    path.join(faBuildDir, "agent/index.html"),
  ];

  for (const pagePath of pagesToCheck) {
    assert.ok(fs.existsSync(pagePath), `HTML page must exist at ${pagePath}`);
    const html = fs.readFileSync(pagePath, "utf8");

    // AgentBox container
    assert.match(
      html,
      /agentBoxContainer/i,
      `${pagePath} must contain agentBoxContainer element`
    );

    // AgentBox Title
    assert.match(
      html,
      /Add to your Agent/i,
      `${pagePath} must render 'Add to your Agent' title`
    );

    // 4 Agent buttons
    assert.match(html, /Claude Code/i, `${pagePath} must render Claude Code button`);
    assert.match(html, /Cursor/i, `${pagePath} must render Cursor button`);
    assert.match(html, /ChatGPT/i, `${pagePath} must render ChatGPT button`);
    assert.match(html, /OpenCode/i, `${pagePath} must render OpenCode button`);

    // Utility actions
    assert.match(
      html,
      /Copy Text Content/i,
      `${pagePath} must render Copy Text Content button`
    );
    assert.match(
      html,
      /Open Markdown/i,
      `${pagePath} must render Open Markdown button`
    );

    // Locale-specific checks
    if (pagePath.includes('/fa/')) {
      assert.match(html, /افزودن به ایجنت/, `${pagePath} must render Persian 'افزودن به ایجنت' title`);
      assert.match(html, /کپی مارک‌داون/, `${pagePath} must render Persian 'کپی مارک‌داون' button`);
      assert.match(html, /مشاهده مارک‌داون/, `${pagePath} must render Persian 'مشاهده مارک‌داون' button`);
    }
  }
});

test("Persian configuration anchor matches invisible captcha link target", () => {
  const faConfigDoc = path.join(
    repoRoot,
    "i18n/fa/docusaurus-plugin-content-docs/version-4.0.0/configuration.md"
  );
  assert.ok(fs.existsSync(faConfigDoc), "Persian configuration.md must exist");
  const content = fs.readFileSync(faConfigDoc, "utf8");
  assert.match(
    content,
    /\{#explicitly-render-arcaptcha\}/,
    "Persian configuration.md must contain explicit anchor {#explicitly-render-arcaptcha}"
  );
});
