/**
 * Utility functions for resolving GitHub repository URLs and file paths
 * from Docusaurus documentation metadata.
 */

function getDocSourcePath(source) {
  if (!source || typeof source !== 'string') return null;
  return source.replace(/^@site\/?/, '');
}

function getDocGitHubUrls(source, options = {}) {
  const org = options.org || 'arcaptcha';
  const project = options.project || 'arcaptcha-docs';
  const branch = options.branch || 'main';
  const filePath = getDocSourcePath(source);

  if (!filePath) {
    const fallbackPath = 'static/onboard.md';
    return {
      rawUrl: `https://raw.githubusercontent.com/${org}/${project}/${branch}/${fallbackPath}`,
      githubUrl: `https://github.com/${org}/${project}/blob/${branch}/${fallbackPath}`,
    };
  }

  const encodedPath = encodeURI(filePath);
  return {
    rawUrl: `https://raw.githubusercontent.com/${org}/${project}/${branch}/${encodedPath}`,
    githubUrl: `https://github.com/${org}/${project}/blob/${branch}/${encodedPath}`,
  };
}

function getLocalMarkdownUrl(source) {
  const filePath = getDocSourcePath(source);
  if (!filePath) return '/onboard.md';
  return `/markdown/${encodeURI(filePath)}`;
}

const DEFAULT_ONBOARD_PROMPT =
  'Please read https://docs.arcaptcha.co/onboard.md and help me integrate ARCaptcha into this project.';

function getPagePrompt(doc) {
  if (!doc || !doc.metadata) {
    return DEFAULT_ONBOARD_PROMPT;
  }

  const { title, permalink, id } = doc.metadata;
  if (!title || id === 'agent' || permalink === '/' || permalink === '/fa/') {
    return DEFAULT_ONBOARD_PROMPT;
  }

  const pageUrl = `https://docs.arcaptcha.co${permalink || ''}`;
  return `Please read https://docs.arcaptcha.co/onboard.md and the "${title}" documentation at ${pageUrl} to help me integrate ARCaptcha into this project.`;
}

module.exports = {
  DEFAULT_ONBOARD_PROMPT,
  getPagePrompt,
  getDocSourcePath,
  getDocGitHubUrls,
  getLocalMarkdownUrl,
};

