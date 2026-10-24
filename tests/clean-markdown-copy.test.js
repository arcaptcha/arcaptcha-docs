const test = require('node:test');
const assert = require('node:assert');
const fs = require('node:fs');
const path = require('node:path');

const repoRoot = path.resolve(__dirname, '..');
const { cleanMarkdown } = require(path.join(repoRoot, 'src/utils/cleanMarkdown.js'));
const { getLocalMarkdownUrl } = require(path.join(repoRoot, 'src/components/AgentBox/urls.js'));
const cachePath = path.join(repoRoot, 'src/data/markdown-cache.json');
const staticCachePath = path.join(repoRoot, 'static/markdown-cache.json');

test('cleanMarkdown strips frontmatter, JSX styles, and converts admonitions to standard markdown', () => {
  const sampleInput = `---
sidebar_position: 1
id: test-doc
title: Test Document
---

# Test Title

:::tip AI Integration
Prompt here.
:::

<iframe
  src="https://player.arvancloud.ir/index.html?config=test.json"
  width="100%"
  height="400"
  style={{border: 0}}
  allow="accelerometer"
></iframe>

First line<br/>Second line

<details>
<summary>Details Title</summary>
Inner details content
</details>

<p style="color: red;" className="custom-class">Styled paragraph</p>
`;

  const cleaned = cleanMarkdown(sampleInput);

  // No frontmatter
  assert.doesNotMatch(cleaned, /^---/);
  assert.doesNotMatch(cleaned, /sidebar_position/);

  // Admonitions converted
  assert.match(cleaned, /> \*\*Tip: AI Integration\*\*/);
  assert.match(cleaned, /> Prompt here\./);
  assert.doesNotMatch(cleaned, /:::tip/);

  // No style={{...}} or style="..."
  assert.doesNotMatch(cleaned, /style=\{\{/);
  assert.doesNotMatch(cleaned, /style="/);
  assert.doesNotMatch(cleaned, /className="/);

  // iframe converted to clean link
  assert.match(cleaned, /\[Video Tutorial\]\(https:\/\/player\.arvancloud\.ir\/index\.html\?config=test\.json\)/);

  // br converted to newline
  assert.doesNotMatch(cleaned, /<br\s*\/?>/i);
  assert.match(cleaned, /First line\nSecond line/);

  // details converted
  assert.match(cleaned, /\*\*Details Title\*\*/);
  assert.doesNotMatch(cleaned, /<\/details>/);
});

test('markdown-cache.json exists and contains clean markdown without style artifacts for all docs', () => {
  assert.ok(fs.existsSync(cachePath), 'src/data/markdown-cache.json must exist');
  assert.ok(fs.existsSync(staticCachePath), 'static/markdown-cache.json must exist');

  const cache = JSON.parse(fs.readFileSync(cachePath, 'utf8'));

  // Ensure key English and Persian pages are present
  const expectedKeys = [
    '@site/versioned_docs/version-4.0.0/quick start.md',
    '@site/versioned_docs/version-4.0.0/agent.md',
    '@site/i18n/fa/docusaurus-plugin-content-docs/version-4.0.0/quick start.md',
    '@site/i18n/fa/docusaurus-plugin-content-docs/version-4.0.0/agent.md',
  ];

  for (const key of expectedKeys) {
    assert.ok(cache[key], `Cache must contain key: ${key}`);
    const content = cache[key];

    // Verify it is clean plain markdown
    assert.doesNotMatch(content, /^---/, `Key ${key} should not have frontmatter`);
    assert.doesNotMatch(content, /style=\{\{/, `Key ${key} must not contain style={{...}}`);
    assert.doesNotMatch(content, /style="/, `Key ${key} must not contain style="..."`);
    assert.doesNotMatch(content, /:::tip|:::caution|:::info/, `Key ${key} must not contain raw Docusaurus admonitions`);
    assert.doesNotMatch(content, /<iframe[\s\S]*?style=/, `Key ${key} must not contain iframe with style`);
  }

  // Check that English quick start and Persian quick start have distinct contents
  const enQuickStart = cache['@site/versioned_docs/version-4.0.0/quick start.md'];
  const faQuickStart = cache['@site/i18n/fa/docusaurus-plugin-content-docs/version-4.0.0/quick start.md'];
  assert.notStrictEqual(enQuickStart, faQuickStart, 'English and Persian Quick Start must be distinct');
  assert.match(enQuickStart, /# Quick Start/);
  assert.match(faQuickStart, /# شروع سریع/);
});

test('getLocalMarkdownUrl returns clean same-origin markdown paths', () => {
  const enUrl = getLocalMarkdownUrl('@site/versioned_docs/version-4.0.0/quick start.md');
  assert.strictEqual(enUrl, '/markdown/versioned_docs/version-4.0.0/quick%20start.md');

  const faUrl = getLocalMarkdownUrl('@site/i18n/fa/docusaurus-plugin-content-docs/version-4.0.0/quick start.md');
  assert.strictEqual(faUrl, '/markdown/i18n/fa/docusaurus-plugin-content-docs/version-4.0.0/quick%20start.md');

  const fallback = getLocalMarkdownUrl(null);
  assert.strictEqual(fallback, '/onboard.md');
});

test('static/markdown directory contains individual pure .md files for both locales', () => {
  const enFile = path.join(repoRoot, 'static/markdown/versioned_docs/version-4.0.0/quick start.md');
  const faFile = path.join(repoRoot, 'static/markdown/i18n/fa/docusaurus-plugin-content-docs/version-4.0.0/quick start.md');

  assert.ok(fs.existsSync(enFile), 'Static English quick start markdown must exist');
  assert.ok(fs.existsSync(faFile), 'Static Persian quick start markdown must exist');

  const enContent = fs.readFileSync(enFile, 'utf8');
  assert.doesNotMatch(enContent, /style=\{\{/);
  assert.match(enContent, /# Quick Start/);

  const faContent = fs.readFileSync(faFile, 'utf8');
  assert.doesNotMatch(faContent, /style=\{\{/);
  assert.match(faContent, /# شروع سریع/);
});
