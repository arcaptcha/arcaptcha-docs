// @ts-check
// Note: type annotations allow type checking and IDEs autocompletion

const lightCodeTheme = require("prism-react-renderer/themes/github");
const darkCodeTheme = require("prism-react-renderer/themes/dracula");

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: "ARCaptcha",
  tagline: "ARCaptcha documentations",
  url: "https://arcaptcha.ir",
  baseUrl: "/",
  onBrokenLinks: "throw",
  onBrokenMarkdownLinks: "warn",
  favicon: "img/favicon.ico",
  organizationName: "ARCaptcha", // Usually your GitHub org/user name.
  projectName: "arcaptcha-docs", // Usually your repo name.

  presets: [
    [
      "@docusaurus/preset-classic",
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        docs: {
          sidebarPath: require.resolve("./sidebars.js"),
          // Please change this to your repo.
          // editUrl: "https://github.com/facebook/docusaurus/edit/main/website/",
        },
        blog: {
          showReadingTime: true,
          // Please change this to your repo.
          // editUrl:
          //   "https://github.com/facebook/docusaurus/edit/main/website/blog/",
        },
        theme: {
          customCss: require.resolve("./src/css/custom.css"),
        },
      }),
    ],
  ],
  i18n: {
    defaultLocale: 'en',
    locales: ['en', 'fa'],
    localeConfigs: {
      en: {
        label: 'English',
        direction: 'ltr'
      },
      fa: {
        label: 'فارسی',
        direction: 'rtl'
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
                to: "/docs/installation",
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
                to: "https://arcaptcha.ir/blog",
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
