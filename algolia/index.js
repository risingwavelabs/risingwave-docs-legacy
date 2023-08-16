const core = require("@actions/core");
const fetch = require("node-fetch");

try {
  const CRAWLER_ID = core.getInput("CRAWLER_ID");
  const CRAWLER_USER_ID = core.getInput("CRAWLER_USER_ID");
  const CRAWLER_API_KEY = core.getInput("CRAWLER_API_KEY");
  const CRAWLER_API_BASE_URL = core.getInput("CRAWLER_API_BASE_URL");

  const BASE64_BASIC_AUTH = `Basic ${Buffer.from(`${CRAWLER_USER_ID}:${CRAWLER_API_KEY}`).toString("base64")}`;

  async function reindex(crawlerId) {
    console.log(`
    ${new Date().toTimeString()}:
    Triggering reindex on ${crawlerId}
    `);

    const res = await fetch(`${CRAWLER_API_BASE_URL}/crawlers/${crawlerId}/reindex`, {
      method: "POST",
      headers: {
        Authorization: BASE64_BASIC_AUTH,
        "Content-Type": "application/json",
      },
    });
    const jsonResponse = await res.json();
    return jsonResponse;
  }

  const res = await reindex(CRAWLER_ID);
  console.log(res);
} catch (error) {
  core.setFailed(error.message);
}
