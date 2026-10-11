const fs = require('fs');
const path = require('path');
const { cleanMarkdown } = require('../src/utils/cleanMarkdown');

const repoRoot = path.resolve(__dirname, '..');
const staticMarkdownDir = path.join(repoRoot, 'static', 'markdown');
const staticCacheFile = path.join(repoRoot, 'static', 'markdown-cache.json');
const srcDataDir = path.join(repoRoot, 'src', 'data');
const srcCacheFile = path.join(srcDataDir, 'markdown-cache.json');

const searchDirs = [
  path.join(repoRoot, 'versioned_docs'),
  path.join(repoRoot, 'i18n', 'fa', 'docusaurus-plugin-content-docs'),
  path.join(repoRoot, 'docs'),
];

function findMarkdownFiles(dir) {
  if (!fs.existsSync(dir)) return [];
  const results = [];
  const list = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of list) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      results.push(...findMarkdownFiles(fullPath));
    } else if (entry.isFile() && (entry.name.endsWith('.md') || entry.name.endsWith('.mdx'))) {
      results.push(fullPath);
    }
  }
  return results;
}

function generateAll() {
  const allFiles = [];
  for (const sDir of searchDirs) {
    allFiles.push(...findMarkdownFiles(sDir));
  }

  // Ensure directories exist
  fs.mkdirSync(staticMarkdownDir, { recursive: true });
  fs.mkdirSync(srcDataDir, { recursive: true });

  const cache = {};

  for (const filePath of allFiles) {
    const relPath = path.relative(repoRoot, filePath);
    const rawContent = fs.readFileSync(filePath, 'utf8');
    const cleaned = cleanMarkdown(rawContent);

    // Save individual clean .md file under static/markdown/<relPath>
    const destPath = path.join(staticMarkdownDir, relPath);
    fs.mkdirSync(path.dirname(destPath), { recursive: true });
    fs.writeFileSync(destPath, cleaned, 'utf8');

    const sourceKey = `@site/${relPath}`;
    const encodedRelPath = encodeURI(relPath);
    const encodedSourceKey = `@site/${encodedRelPath}`;
    const staticUrl = `/markdown/${encodedRelPath}`;

    // Store in cache with multiple lookup keys
    cache[sourceKey] = cleaned;
    cache[relPath] = cleaned;
    cache[encodedSourceKey] = cleaned;
    cache[encodedRelPath] = cleaned;

    // Also index by slug/basename if available
    const baseName = path.basename(filePath, path.extname(filePath));
    const isFa = relPath.includes('i18n/fa');
    const langPrefix = isFa ? 'fa:' : 'en:';
    cache[`${langPrefix}${baseName}`] = cleaned;

    // Extract frontmatter slug or id if present
    const idMatch = rawContent.match(/^id:\s*(.+)$/m);
    if (idMatch) {
      const docId = idMatch[1].trim();
      cache[`${langPrefix}${docId}`] = cleaned;
    }
  }

  // Write compiled caches
  const cacheJson = JSON.stringify(cache, null, 2);
  fs.writeFileSync(srcCacheFile, cacheJson, 'utf8');
  fs.writeFileSync(staticCacheFile, cacheJson, 'utf8');

  console.log(`[clean-markdown] Successfully generated ${allFiles.length} clean markdown files and cache.`);
  return cache;
}

if (require.main === module) {
  generateAll();
}

module.exports = {
  generateAll,
};
