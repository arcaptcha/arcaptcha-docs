// @ts-check
// Note: type annotations allow type checking and IDEs autocompletion

const fs = require("fs");
const path = require("path");
const lightCodeTheme = require("prism-react-renderer/themes/github");
const darkCodeTheme = require("prism-react-renderer/themes/dracula");

function loadDotEnv(filePath) {
  /** @type {Record<string, string>} */
  const parsed = {};
  if (!fs.existsSync(filePath)) {
    return parsed;
  }
  for (const rawLine of fs.readFileSync(filePath, "utf8").split(/\r?\n/)) {
    const line = rawLine.trim();
    if (!line || line.startsWith("#")) {
      continue;
    }
    const eq = line.indexOf("=");
    if (eq === -1) {
      continue;
    }
    const key = line.slice(0, eq).trim();
    let value = line.slice(eq + 1).trim();
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }
    parsed[key] = value;
  }
  return parsed;
}

function readEnv(name, dotenvFile) {
  const fromProcess = process.env[name];
  if (fromProcess) {
    return fromProcess;
  }
  return dotenvFile[name] || "";
}

const dotenvFile = loadDotEnv(path.join(__dirname, ".env"));
const GOFTINO_WIDGET_ID = readEnv("GOFTINO_WIDGET_ID", dotenvFile);
const GOFTINO_ENABLED =
  readEnv("GOFTINO_ENABLED", dotenvFile) !== "false" &&
  Boolean(GOFTINO_WIDGET_ID);

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: "ARCaptcha",
  tagline: "ARCaptcha documentations",
  url: "https://docs.arcaptcha.co",
  baseUrl: "/",
  onBrokenLinks: "throw",
  onBrokenMarkdownLinks: "warn",
  favicon: "img/favicon.ico",
  organizationName: "ARCaptcha", // Usually your GitHub org/user name.
  projectName: "arcaptcha-docs", // Usually your repo name.
  headTags: GOFTINO_ENABLED
    ? [
        {
          tagName: "script",
          attributes: {
            type: "text/javascript",
          },
          innerHTML: `window.GOFTINO_WIDGET_ID=${JSON.stringify(
            GOFTINO_WIDGET_ID
          )};`,
        },
      ]
    : [],
  scripts: GOFTINO_ENABLED
    ? [
        {
          src: "/js/goftino.js",
          defer: true,
        },
      ]
    : [],

  presets: [
    [
      "@docusaurus/preset-classic",
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        theme: {
          customCss: require.resolve("./src/css/custom.css"),
        },
        docs: {
          routeBasePath: "/",
          includeCurrentVersion: false,
          versions: {
            "5.0.0": {
              banner: "none",
            },
            "4.0.0": {
              banner: "none",
            },
            "3.0.0": {
              banner: "none",
            },
            "fraud-1.0.0": {
              banner: "none",
            },
          },
        },
        blog: {
          showReadingTime: true,
        },
      }),
    ],
  ],
  i18n: {
    defaultLocale: "en",
    locales: ["en", "fa"],
    localeConfigs: {
      en: {
        label: "English",
        direction: "ltr",
      },
      fa: {
        label: "فارسی",
        direction: "rtl",
      },
    },
  },
  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      navbar: {
        title: "ARCaptcha",
        logo: {
          alt: "ARCaptcha Logo",
          src: "img/logo.svg",
        },
        items: [
          {
            type: "doc",
            docId: "installation",
            position: "left",
            label: "Installation",
          },
          {
            href: "https://github.com/arcaptcha",
            label: "GitHub",
            position: "right",
          },
          {
            type: "localeDropdown",
            position: "left",
          },
          {
            type: "docsVersionDropdown",
            position: "left",
          },
        ],
      },
      footer: {
        style: "dark",
        links: [
          {
            title: "Docs",
            items: [
              {
                label: "Installation",
                to: "/installation",
              },
              {
                label: "ARCaptcha v3",
                to: "/3.0.0/installation",
              },
            ],
          },
          {
            title: "Community",
          },
          {
            title: "More",
            items: [
              {
                label: "Blog",
                to: "https://arcaptcha.co/blog",
              },
              {
                label: "GitHub",
                href: "https://github.com/arcaptcha",
              },
            ],
          },
        ],
      },
      prism: {
        theme: lightCodeTheme,
        darkTheme: darkCodeTheme,
      },
    }),
};

module.exports = config;
