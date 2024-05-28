import type { Config } from "@docusaurus/types";
import type * as Preset from "@docusaurus/preset-classic";

import PrismLight from './src/utils/prismLight';
import PrismDark from './src/utils/prismDark';

const config: Config = {
  title: "RisingWave",
  tagline: "Get started with RisingWave",
  url: "https://docs.risingwave.com",
  baseUrl: "/",
  trailingSlash: true,
  onBrokenLinks: "throw",
  onBrokenMarkdownLinks: "throw",
  onBrokenAnchors: "throw",
  favicon: "img/favicon.ico",
  presets: [
    [
      "classic",
      {
        gtag: {
          trackingID: "G-VG98SVDEYE",
          anonymizeIP: true,
        },
        googleTagManager: {
          containerId: "GTM-KJRVWHT7",
        },
        docs: {
          admonitions: {
            // tag: ":::",
            keywords: ["note", "tip", "info", "caution", "danger"],
          },
          sidebarPath: "./sidebars.js",
          sidebarCollapsible: false,
          showLastUpdateAuthor: false,
          showLastUpdateTime: true,
          versions: {
            current: {
              label: "1.9 (dev)",
              path: "/dev",
              badge: false,
              banner: "unreleased",
            },
            1.8: {
              label: "1.8 (current)",
              path: "/current",
              badge: false,
              banner: "none",
            },
            1.7: {
              label: "1.7",
              path: "/1.7",
              badge: false,
              banner: "none",
            },
            1.6: {
              label: "1.6",
              path: "/1.6",
              badge: false,
              banner: "none",
            },
            1.5: {
              label: "1.5",
              path: "/1.5",
              badge: false,
              banner: "none",
            },
            1.4: {
              label: "1.4",
              path: "/1.4",
              badge: false,
              banner: "none",
            },
            1.3: {
              label: "1.3",
              path: "/1.3",
              badge: false,
              banner: "none",
            },
            1.2: {
              label: "1.2",
              path: "/1.2",
              badge: false,
              banner: "none",
            },
            1.1: {
              label: "1.1",
              path: "/1.1",
              badge: false,
              banner: "none",
            },
            "1.0.0": {
              label: "1.0",
              path: "/1.0",
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
          customCss: ["./src/css/fonts.css", "./src/css/custom.css", "./src/css/buttons.css"],
        },
      } satisfies Preset.Options,
    ],
  ],
  plugins: [
    [
      '@docusaurus/plugin-content-docs',
      {
        id: "cloud",
        path: "cloud",
        routeBasePath: "cloud",
        sidebarPath: "./sidebarCloud.js",
      },
    ],
    require.resolve("docusaurus-plugin-image-zoom"),
  ],
  themeConfig: {
    prism: {
      additionalLanguages: [
        'java',
        'latex',
        'haskell',
        'matlab',
        'PHp',
        'powershell',
        'bash',
        'diff',
        'json',
        'scss',
      ],
      theme: PrismLight,
      darkTheme: PrismDark,
    },
    zoom: {
      selector: ".markdown img:not(.disabled-zoom, .icon)",
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
        href: "https://www.risingwave.com/",
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
        },
        {
          to: "https://tutorials.risingwave.com/",
          position: "right",
          html: `
            <img
  src="/img/tutorial/entrance.svg"
  alt="RisingWave Tutorials"
  style="height:30px;margin-top:7px;"
/>
          `,
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
    algolia: {
      appId: "AL59AMDUO6",
      apiKey: "d5690baa848d0d137a4084a46f757d8a",
      indexName: "risingwave",
      contextualSearch: true,
      externalUrlRegex: "external\\.com|domain\\.com",
      searchParameters: {},
      searchPagePath: "search",
    },
    metadata: [
      {
        name: "keywords",
        content: "streaming database, documentation, risingwave",
      },
    ],
    items: [{ label: "Latest", to: "docs/latest/intro" }],
  } satisfies Preset.ThemeConfig,
  customFields: {
    docsUrl: "https://docs.risingwave.com",
    requestUrl: "https://github.com/risingwavelabs/risingwave-docs/issues/new?body=",
    bugReportUrl:
      "https://github.com/risingwavelabs/risingwave-docs/issues/new?assignees=CharlieSYH%2C+hengm3467&labels=bug&template=bug_report.yml&title=Bug%3A+&link=",
  },
  scripts: [
    {
      src: "https://asvd.github.io/syncscroll/syncscroll.js",
      async: true,
    },
    {
      src: "https://cdn.jsdelivr.net/npm/@runllm/search-widget@0.0.4-image-demo/dist/run-llm-search-widget.es.js",
      id: "runllm-widget-script",
      type: "module",
      "runllm-server-address": "https://api.runllm.com",
      "runllm-assistant-id": "29",
      version: "0.0.4-image-demo",
      "runllm-position": "TOP_RIGHT",
      "runllm-keyboard-shortcut": "Mod+l",
      "runllm-theme-color": "#005EEC",
      "runllm-slack-community-url":
        "https://risingwave-community.slack.com/join/shared_invite/zt-2abrj3cbo-xnT_xn3_jd9piiM3vNPVdw",
      "runllm-name": "RisingWave",
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
  return config;
}

module.exports = createConfig;
