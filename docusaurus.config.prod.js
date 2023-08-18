const config = require("./docusaurus.config");

/** @type {import('@docusaurus/types').Config} */
const newConfig = {
  baseUrl: "/",
};

module.exports = { ...config, ...newConfig };
