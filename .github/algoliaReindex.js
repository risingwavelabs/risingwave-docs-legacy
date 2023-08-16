const BASE64_BASIC_AUTH = `Basic ${Buffer.from(
  `${process.env.CRAWLER_USER_ID}:${process.env.CRAWLER_API_KEY}`
).toString("base64")}`;

async function reindex(crawlerId) {
  console.log(`Triggering reindex on ${crawlerId}`);
  const res = await fetch(`${process.env.CRAWLER_API_BASE_URL}/crawlers/${crawlerId}/reindex`, {
    method: "POST",
    headers: {
      Authorization: BASE64_BASIC_AUTH,
      "Content-Type": "application/json",
    },
  });
  const jsonResponse = await res.json();
  return jsonResponse;
}

const res = reindex(process.env.CRAWLER_ID);
console.log(res);
