// @ts-check
// Note: type annotations allow type checking and IDEs autocompletion

const lightCodeTheme = require("prism-react-renderer/themes/github");
const darkCodeTheme = require("prism-react-renderer/themes/dracula");

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

  presets: [
    [
      "@docusaurus/preset-classic",
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        theme: {
          customCss: require.resolve("./src/css/custom.css"),
        },
        docs: {
          routeBasePath: '/',
          includeCurrentVersion: false,
          versions: {
            '1.0.0': {
              banner: 'none'
            },
            '3.0.0': {
              banner: 'none'
            }
          },
        },
        blog: {
          showReadingTime: true,
        }
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
