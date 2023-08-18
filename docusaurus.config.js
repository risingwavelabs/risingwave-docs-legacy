// @ts-check
// Note: type annotations allow type checking and IDEs autocompletion

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: "RisingWave",
  tagline: "Get started with RisingWave",
  url: "https://www.risingwave-labs.com",
  baseUrl: "/",
  trailingSlash: true,
  onBrokenLinks: "warn",
  onBrokenMarkdownLinks: "warn",
  favicon: "img/favicon.ico",
  presets: [
    [
      "@docusaurus/preset-classic",
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        gtag: {
          trackingID: "G-VG98SVDEYE",
          anonymizeIP: true,
        },
        docs: {
          admonitions: {
            tag: ":::",
            keywords: ["note", "tip", "info", "caution", "danger"],
          },
          sidebarPath: require.resolve("./sidebars.js"),
          sidebarCollapsible: false,
          showLastUpdateAuthor: false,
          showLastUpdateTime: true,
          versions: {
            current: {
              label: "1.2 (dev)",
              path: "/upcoming",
              badge: false,
              banner: "unreleased",
            },
            "1.1": {
              label: "1.1 (current)",
              path: "/current",
              badge: false,
              banner: "none",
            },
            "1.0.0": {
              label: "1.0",
              path: "/1.0",
              badge: false,
              banner: "none",
            },
            "0.19.0": {
              label: "0.19.0",
              path: "/0.19.0",
              badge: false,
              banner: "none",
            },
            "0.18.0": {
              label: "0.18.0",
              path: "/0.18.0",
              badge: false,
              banner: "none",
            },
            "0.1.17": {
              label: "0.1.17",
              path: "/0.1.17",
              badge: false,
              banner: "none",
            },
            "0.1.16": {
              label: "0.1.16",
              path: "/0.1.16",
              badge: false,
              banner: "none",
            },
            "0.1.15": {
              label: "0.1.15",
              path: "/0.1.15",
              badge: false,
              banner: "none",
            },
            "0.1.14": {
              label: "0.1.14",
              path: "/0.1.14",
              badge: false,
              banner: "none",
            },
          },
          editUrl: "https://github.com/risingwavelabs/risingwave-docs/blob/main/",
        },
        blog: {
          showReadingTime: true,
          editUrl: "https://github.com/risingwavelabs/risingwave-docs/blob/main/",
        },
        theme: {
          customCss: [
            require.resolve("./src/css/fonts.css"),
            require.resolve("./src/css/custom.css"),
            require.resolve("./src/css/buttons.css"),
          ],
        },
      }),
    ],
  ],
  plugins: [
    [
      "@docusaurus/plugin-content-docs",
      /** @type {import('@docusaurus/plugin-content-docs').Options} */
      {
        id: "cloud",
        path: "cloud",
        routeBasePath: "cloud",
        sidebarPath: require.resolve("./sidebarCloud.js"),
      },
    ],
    require.resolve("docusaurus-plugin-image-zoom"),
  ],
  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      zoom: {
        selector: ".markdown img:not(.disabled-zoom)",
        background: {
          light: "#ffffff",
          dark: "#0a1721",
        },
        config: {
          // options you can specify via https://github.com/francoischalifour/medium-zoom#usage
        },
      },
      colorMode: {
        disableSwitch: false,
        respectPrefersColorScheme: true,
      },
      docs: {
        sidebar: {
          hideable: true,
          autoCollapseCategories: false,
        },
      },
      navbar: {
        title: "",
        logo: {
          alt: "RisingWave Logo",
          src: "img/logo-title.png",
        },
        items: [
          {
            type: "doc",
            docId: "intro",
            position: "left",
            label: "RisingWave",
          },
          {
            to: "/cloud/intro",
            label: "RisingWave Cloud",
            position: "left",
            activeBaseRegex: `/cloud/`,
          },
          {
            type: "docsVersionDropdown",
            docsPluginId: "default",
            position: "right",
          },
          {
            href: "https://github.com/risingwavelabs/risingwave",
            label: "GitHub",
            position: "right",
          },
        ],
      },
      footer: {
        copyright: `Copyright © ${new Date().getFullYear()} RisingWave Community`,
      },
      prism: {
        additionalLanguages: ["sql", "java"],
      },
      algolia: {
        appId: "AL59AMDUO6",
        apiKey: "d5690baa848d0d137a4084a46f757d8a",
        indexName: "risingwave",
        contextualSearch: true,
        externalUrlRegex: "external\\.com|domain\\.com",
        searchParameters: {},
        searchPagePath: "search",
        debug: false,
      },
      metadata: [
        {
          name: "keywords",
          content: "streaming database, documentation, risingwave",
        },
      ],
      items: [{ label: "Latest", to: "docs/latest/intro" }],
    }),
  customFields: {
    docsUrl: "https://www.risingwave.dev",
    requestUrl: "https://github.com/risingwavelabs/risingwave-docs/issues/new?body=",
    bugReportUrl:
      "https://github.com/risingwavelabs/risingwave-docs/issues/new?assignees=CharlieSYH%2C+hengm3467&labels=bug&template=bug_report.yml&title=Bug%3A+&link=",
  },
  scripts: [
    {
      src: "https://asvd.github.io/syncscroll/syncscroll.js",
      async: true,
    },
  ],
  webpack: {
    jsLoader: (isServer) => ({
      loader: require.resolve("swc-loader"),
      options: {
        jsc: {
          parser: {
            syntax: "typescript",
            tsx: true,
          },
          target: "es2017",
        },
        module: {
          type: isServer ? "commonjs" : "es6",
        },
      },
    }),
  },
};

async function createConfig() {
  const customLight = (await import("./src/utils/prismLight.mjs")).default;
  const customDark = (await import("./src/utils/prismDark.mjs")).default;
  // @ts-expect-error: we know it exists, right
  config.themeConfig.prism.theme = customLight;
  // @ts-expect-error: we know it exists, right
  config.themeConfig.prism.darkTheme = customDark;
  return config;
}

module.exports = createConfig;
