/**
 * Utility function to convert raw documentation markdown (with Docusaurus frontmatter,
 * admonitions, JSX components, and inline styles) into clean, pure standard Markdown.
 */

function cleanMarkdown(raw) {
  if (!raw || typeof raw !== 'string') return '';
  let text = raw;

  // 1. Strip YAML frontmatter (--- ... ---)
  text = text.replace(/^---[\r\n]+[\s\S]*?[\r\n]+---[\r\n]*/, '');

  // 2. Convert Docusaurus admonitions (:::tip [title] ... :::) to standard Markdown blockquotes
  text = text.replace(/:::(\w+)(?:[ \t]+([^\r\n]+))?([\s\S]*?):::/g, (match, type, title, body) => {
    const label = type.charAt(0).toUpperCase() + type.slice(1);
    const header = title ? `**${label}: ${title.trim()}**` : `**${label}**`;
    const cleanBody = body
      .trim()
      .split('\n')
      .map((l) => (l ? `> ${l}` : '>'))
      .join('\n');
    return `> ${header}\n>\n${cleanBody}\n\n`;
  });

  // 3. Convert iframes to clean Markdown links
  text = text.replace(/<iframe[\s\S]*?src=["']([^"']+)["'][\s\S]*?>[\s\S]*?<\/iframe>/gi, (match, src) => {
    return `\n[Video Tutorial](${src})\n\n`;
  });

  // 4. Convert <details><summary>...</summary> to standard markdown bold section
  text = text.replace(/<details>\s*<summary>(.*?)<\/summary>/gi, '\n**$1**\n\n');
  text = text.replace(/<\/details>/gi, '\n');

  // 5. Replace <br\s*\/?> with newlines
  text = text.replace(/<br\s*\/?>/gi, '\n');

  // 6. Strip any inline JSX/HTML style attributes: style={{...}} or style="..."
  text = text.replace(/\s*style=\{\{[^}]*\}\}/gi, '');
  text = text.replace(/\s*style="[^"]*"/gi, '');
  text = text.replace(/\s*className="[^"]*"/gi, '');

  // 7. Remove MDX imports/exports and custom React component tags
  text = text.replace(/^import\s+.*?from\s+['"].*?['"];?\r?$/gm, '');
  text = text.replace(/^export\s+.*?;?\r?$/gm, '');
  text = text.replace(/<[A-Z][A-Za-z0-9]*(?:\s+[^>]*?)?\/>/g, '');
  text = text.replace(/<[A-Z][A-Za-z0-9]*(?:\s+[^>]*?)?>[\s\S]*?<\/[A-Z][A-Za-z0-9]*>/g, '');

  // 8. Clean trailing whitespace and multiple blank lines
  text = text
    .split('\n')
    .map((line) => line.trimEnd())
    .join('\n')
    .replace(/\n{3,}/g, '\n\n')
    .trim() + '\n';

  return text;
}

module.exports = {
  cleanMarkdown,
};
