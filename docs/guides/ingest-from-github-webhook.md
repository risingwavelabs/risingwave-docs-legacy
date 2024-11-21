---
 id: ingest-from-github-webhook
 title: RisingWave as GitHub Webhook Destination
 description: Describes how to use RisingWave as GitHub Webhook Destination.
 slug: /ingest-from-postgres-cdc
---
<head>
  <link rel="canonical" href="https://docs.risingwave.com/docs/current/ingest-from-github-webhook/" />
</head>


GitHub Webhooks allow you to build or set up integrations that subscribe to certain events on GitHub.com. When one of those events is triggered, GitHub sends an HTTP POST payload to the webhook's configured URL. Webhooks can be used to update an external issue tracker, trigger CI builds, update a backup mirror, or even deploy to your production server.

In this guide, we'll walk through the steps to set up RisingWave as a destination for GitHub Webhooks. This enables you to ingest GitHub events directly into your RisingWave database for real-time processing and analytics.

## Steps to Ingest Data from GitHub via Webhook

### 1. Create a Secret in RisingWave

First, create a secret in RisingWave to securely store a secret string. This secret will be used to validate incoming webhook requests from GitHub.

```sql
CREATE SECRET test_secret WITH (backend = 'meta') AS 'TEST_WEBHOOK';
```

Explanation:
- `test_secret`: The name of the secret.
- `'TEST_WEBHOOK'`: The secret string used for signing and verifying webhook payloads. Replace this with a secure, random string.

### 2. Create a Table in RisingWave to Receive Webhook Data

Next, create a table configured to accept webhook data from GitHub.

```sql
CREATE TABLE wbhtable (
  data JSONB
) WITH (
  connector = 'webhook'
) VALIDATE SECRET test_secret AS secure_compare(
  headers->>'x-hub-signature-256',
  'sha256=' || encode(hmac(test_secret, data, 'sha256'), 'hex')
);
```

Explanation:
- `data JSONB`: Defines the name of column to store the JSON payload from the webhook. Currently, only `JSONB` type is supported for webhook tables.
- `headers->>'x-hub-signature-256'`: Extracts the signature provided by GitHub in the x-hub-signature-256 HTTP header. An example of the value is `sha256=f37a93a68fef1505d75e920a15d0543199557be72d2182e5cf8c15d7f9a6260f`. Note that in `secure_compare()` function, the whole HTTP header is interpreted as a JSONB object, and you can access the header value using the `->>` operator. But please only use the lower-case header names in the `->>` operator. The verification will fail, otherwise.
- `'sha256=' || encode(hmac(test_secret, data, 'sha256'), 'hex')`: Computes the expected signature by generating an HMAC SHA-256 hash of the payload (`data`) using the secret (`test_secret`), encodes it in hexadecimal, and prefixes it with `sha256=`.

The `secure_compare()` function compares the signature from the request header with the computed signature. If they match, the request is accepted; otherwise, it is rejected. This ensures that only authentic requests from GitHub are processed.

In GitHub Webhook, you can choose between SHA-1 and SHA-256 HMAC algorithms for signing the payload. The example above uses SHA-256 for demonstration purposes. If you want to use SHA-1, replace `x-hub-signature-256` with `x-hub-signature` and `sha256` with `sha1` in the `VALIDATE` clause. An example is here:

```sql
CREATE SECRET test_secret WITH ( backend = 'meta') AS 'TEST_WEBHOOK';
-- webhook table example github
create table wbhtable (
  data JSONB
) WITH (
  connector = 'webhook',
) VALIDATE SECRET test_secret AS secure_compare(
  headers->>'x-hub-signature',
  'sha1=' || encode(hmac(test_secret, data, 'sha1'), 'hex')
);
```

### 3. Set Up the Webhook in GitHub

After configuring RisingWave to accept webhook data, set up GitHub to send events to your RisingWave instance.

#### RisingWave Webhook URL

The webhook URL should follow this format:
```
https://<HOST>/webhook/<database>/<schema_name>/<table_name>
```

Explanation:

- `<HOST>`: The hostname or IP address where your RisingWave instance is accessible. This could be a domain name or an IP address.
- `<database>`: The name of the RisingWave database where your table resides.
- `<schema_name>`: The schema name of your table, typically `public` unless specified otherwise.
- `<table_name>`: The name of the table you created to receive webhook data (e.g., `wbhtable` in the above example).

#### Configuring the Webhook in GitHub

1. Navigate to Your Repository Settings:

- Go to your GitHub repository.
- Click on the **Settings** tab.

2. Add a New Webhook:

- In the left sidebar, click on **Webhooks**.
- Click the **Add webhook** button.

3. Configure the Webhook Settings:

- **Payload URL**: Enter your RisingWave webhook URL.
- **Content type**: Select `application/json`.
- **Secret**: Enter the same secret string you used when creating the RisingWave secret (e.g., `'TEST_WEBHOOK'`). This ensures that GitHub signs the payloads using this secret, allowing RisingWave to validate them.
- **Which events would you like to trigger this webhook?**: Choose the events you want to subscribe to. For testing purposes, you might start with Just the push event.
- **Active**: Ensure the webhook is set to active.


4. Save the Webhook:
- Click the **Add webhook** button at the bottom of the page.

### 4. Push Data from GitHub via Webhook

With the webhook configured, GitHub will automatically send HTTP POST requests to your RisingWave webhook URL whenever the specified events occur (e.g., pushes to the repository). RisingWave will receive these requests, validate the signatures, and insert the payload data into the target table.

### 5. Further Event Processing
The data in the table is already ready for further processing. You can access the fields using `data->'field_name'` in SQL queries.
You can create a Materialized View to extract specific fields from the JSON payload.

```sql
CREATE MATERIALIZED VIEW github_events AS
SELECT
  data->>'action' AS action,
  data->'repository'->>'full_name' AS repository_name,
  data->'sender'->>'login' AS sender_login,
  data->>'created_at' AS event_time
FROM wbhtable;
```

You can now query `github_events` like a regular table to perform analytics, generate reports, or trigger further processing.
