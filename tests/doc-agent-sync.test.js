const test = require("node:test");
const assert = require("node:assert");
const fs = require("node:fs");
const path = require("node:path");

const repoRoot = path.resolve(__dirname, "..");
const enQuickStartPath = path.join(repoRoot, "versioned_docs/version-4.0.0/quick start.md");
const faQuickStartPath = path.join(repoRoot, "i18n/fa/docusaurus-plugin-content-docs/version-4.0.0/quick start.md");
const enAgentPath = path.join(repoRoot, "versioned_docs/version-4.0.0/agent.md");
const faAgentPath = path.join(repoRoot, "i18n/fa/docusaurus-plugin-content-docs/version-4.0.0/agent.md");

const ONBOARD_PROMPT = "Please read https://docs.arcaptcha.co/onboard.md and help me integrate ARCaptcha into this project.";

test("English Quick Start includes 'Integrate with AI Agents' section with prompt and links", () => {
  assert.ok(fs.existsSync(enQuickStartPath), "English quick start.md must exist");
  const content = fs.readFileSync(enQuickStartPath, "utf8");

  // Section heading
  assert.match(
    content,
    /##.*Integrate with AI Agents/i,
    "English Quick Start must contain 'Integrate with AI Agents' section"
  );

  // 1-click copyable prompt
  assert.ok(
    content.includes(ONBOARD_PROMPT),
    "English Quick Start must include the standard onboarding prompt"
  );

  // Links to onboard.md and llms.txt
  assert.match(
    content,
    /onboard\.md/,
    "English Quick Start must link or reference onboard.md"
  );
  assert.match(
    content,
    /llms\.txt/,
    "English Quick Start must link or reference llms.txt"
  );

  // Top tip callout
  assert.match(
    content,
    /# Quick Start\s*:::tip/m,
    "English Quick Start must include :::tip callout right below # Quick Start heading"
  );
});

test("Persian Quick Start includes translated 'Integrate with AI Agents' section with prompt and links", () => {
  assert.ok(fs.existsSync(faQuickStartPath), "Persian quick start.md must exist");
  const content = fs.readFileSync(faQuickStartPath, "utf8");

  // Persian section heading (ادغام با ایجنت‌های هوش مصنوعی or یکپارچه‌سازی با ایجنت‌های هوش مصنوعی)
  assert.match(
    content,
    /##.*(ادغام|یکپارچه‌سازی).*ایجنت/i,
    "Persian Quick Start must contain translated AI Agents section"
  );

  // 1-click copyable prompt
  assert.ok(
    content.includes(ONBOARD_PROMPT),
    "Persian Quick Start must include the onboarding prompt"
  );

  // Links to onboard.md and llms.txt
  assert.match(
    content,
    /onboard\.md/,
    "Persian Quick Start must link or reference onboard.md"
  );
  assert.match(
    content,
    /llms\.txt/,
    "Persian Quick Start must link or reference llms.txt"
  );

  // Top tip callout
  assert.match(
    content,
    /# شروع سریع\s*:::tip/m,
    "Persian Quick Start must include :::tip callout right below # شروع سریع heading"
  );
});

test("English Agent page is updated for modern AI coding assistants with no legacy zip references", () => {
  assert.ok(fs.existsSync(enAgentPath), "English agent.md must exist");
  const content = fs.readFileSync(enAgentPath, "utf8");

  // No legacy zip downloads
  assert.ok(
    !content.includes(".zip"),
    "English agent.md must not reference legacy zip archives"
  );
  assert.ok(
    !content.includes("arcaptcha-skills.zip"),
    "English agent.md must not reference arcaptcha-skills.zip"
  );

  // Covers modern AI coding assistants
  assert.match(content, /Claude Code/i, "Must guide on Claude Code");
  assert.match(content, /Cursor/i, "Must guide on Cursor");
  assert.match(content, /ChatGPT/i, "Must guide on ChatGPT");
  assert.match(content, /OpenCode/i, "Must guide on OpenCode");

  // 1-click prompt
  assert.ok(
    content.includes(ONBOARD_PROMPT),
    "English agent.md must provide the standard onboarding prompt"
  );

  // References machine-readable specs
  assert.match(content, /onboard\.md/, "Must reference onboard.md");
  assert.match(content, /llms\.txt/, "Must reference llms.txt");

  // Security guidance
  assert.match(content, /site[ -]?key/i, "Must differentiate site key");
  assert.match(content, /secret[ -]?key/i, "Must differentiate secret key");
});

test("Persian Agent page is updated in full parity with English version", () => {
  assert.ok(fs.existsSync(faAgentPath), "Persian agent.md must exist");
  const content = fs.readFileSync(faAgentPath, "utf8");

  // No legacy zip downloads
  assert.ok(
    !content.includes(".zip"),
    "Persian agent.md must not reference legacy zip archives"
  );
  assert.ok(
    !content.includes("arcaptcha-skills.zip"),
    "Persian agent.md must not reference arcaptcha-skills.zip"
  );

  // Covers modern AI coding assistants
  assert.match(content, /Claude Code/i, "Must mention Claude Code");
  assert.match(content, /Cursor/i, "Must mention Cursor");
  assert.match(content, /ChatGPT/i, "Must mention ChatGPT");
  assert.match(content, /OpenCode/i, "Must mention OpenCode");

  // 1-click prompt
  assert.ok(
    content.includes(ONBOARD_PROMPT),
    "Persian agent.md must provide the standard onboarding prompt"
  );

  // References machine-readable specs
  assert.match(content, /onboard\.md/, "Must reference onboard.md");
  assert.match(content, /llms\.txt/, "Must reference llms.txt");

  // Security guidance
  assert.match(content, /(Site Key|کلید سایت)/i, "Must mention site key");
  assert.match(content, /(Secret Key|کلید مخفی|کلید محرمانه)/i, "Must mention secret key");
});
