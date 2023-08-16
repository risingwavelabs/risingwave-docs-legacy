const core = require("@actions/core");
const fetch = require("node-fetch");

const CRAWLER_ID = core.getInput("CRAWLER_ID");
const CRAWLER_USER_ID = core.getInput("CRAWLER_USER_ID");
const CRAWLER_API_KEY = core.getInput("CRAWLER_API_KEY");
const CRAWLER_API_BASE_URL = core.getInput("CRAWLER_API_BASE_URL");

const BASE64_BASIC_AUTH = `Basic ${Buffer.from(`${CRAWLER_USER_ID}:${CRAWLER_API_KEY}`).toString("base64")}`;

const nameToGreet = core.getInput("who-to-greet");
console.log(`Hello ${nameToGreet}!`);
const time = new Date().toTimeString();
core.setOutput("time", time);

fetch(`${CRAWLER_API_BASE_URL}/crawlers/${CRAWLER_ID}/reindex`, {
  method: "POST",
  headers: {
    Authorization: BASE64_BASIC_AUTH,
    "Content-Type": "application/json",
  },
})
  .then((res) => res.json())
  .then((res) => {
    console.log(res);
  })
  .catch((err) => core.setFailed(err));
