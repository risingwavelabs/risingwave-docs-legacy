---
id: ingest-from-webhook
title: RisingWave as Webhook Destination
description: Push data to RisingWave via webhooks.
slug: /ingest-from-webhook
---
<head>
  <link rel="canonical" href="https://docs.risingwave.com/docs/current/ingest-from-webhook/" />
</head>

:::tip Premium Edition Feature
This feature is exclusive to RisingWave Premium Edition that offers advanced capabilities beyond the free versions. For a full list of premium features, see [RisingWave Premium Edition](/rw-premium-edition-intro.md). If you encounter any questions, please contact sales team at [sales@risingwave-labs.com](mailto:sales@risingwave-labs.com).
:::

:::info Public Preview
This feature is in the public preview stage, meaning it's nearing the final product but is not yet fully stable. If you encounter any issues or have feedback, please contact us through our [Slack channel](https://www.risingwave.com/slack). Your input is valuable in helping us improve the feature. For more information, see our [Public preview feature list](/product-lifecycle/#features-in-the-public-preview-stage).
:::

## What Is a Webhook?

A webhook is a mechanism that allows one application to send real-time data to another application whenever a specific event occurs. Instead of continuously polling for updates, webhooks enable applications to receive immediate notifications, making data transfer more efficient and timely. They are commonly used for integrating different services, such as receiving updates from third-party platforms or triggering actions in response to specific events.

With the addition of webhook source support, RisingWave can now act as a webhook destination. This means it can accept incoming HTTP requests from external services and store the data directly into its tables. When an event triggers a webhook from a source application, the data is sent to RisingWave, which then processes and ingests the information in real-time.

This capability eliminates the need for an intermediary message broker like Kafka. Instead of setting up and maintaining an extra Kafka cluster, you can directly send data to RisingWave, which is able to handle and process the data in real-time. This simplifies the architecture and reduces overhead, enabling efficient data ingestion and stream processing without additional infrastructure.

## Creating a Webhook Table in RisingWave

To utilize webhook sources in RisingWave, you need to create a table configured to accept webhook requests. Below is a basic example of how to set up such a table:

```sql
CREATE SECRET test_secret WITH (backend = 'meta') AS 'secret_value';

CREATE TABLE wbhtable (
  data JSONB
) WITH (
  connector = 'webhook'
) VALIDATE SECRET test_secret AS secure_compare(
  headers->>'{header of signature}',
  {signature generation expressions}
);
```

Explanation:

- `CREATE SECRET`: Securely stores a secret value (`'secret_value'`) in RisingWave, which can be used for validating incoming requests.
- `CREATE TABLE wbhtable`: Defines a new table named wbhtable with a single column data of type `JSONB` to store `JSON` payload from the webhook.
- `WITH (connector = 'webhook')`: Specifies that the table uses the webhook connector to accept incoming HTTP requests.
- `VALIDATE SECRET test_secret AS secure_compare(...)`: Uses the stored secret `test_secret` to authenticate incoming webhook requests by comparing the provided signature in the headers.
- - First Argument: `headers->>'signature header'` indicates the HTTP header key where the webhook sender places the generated signature. This retrieves the signature from the incoming request headers.
- - Second Argument: `signature_generation_expressions` should be an expression specified by the user to compute the expected signature based on the secret and payload data (and possibly other header values).

The `secure_compare(...)` function compares the signature provided in the request header with the computed signature. If they match, the request is considered authentic and is accepted; otherwise, it is rejected. This mechanism ensures that only verified requests from trusted sources are processed by RisingWave.

## Supported Webhook Sources and Authentication Methods
RisingWave has been verified to work with the following webhook sources and authentication methods:

|Webhook Source|Authentication Methods|
|---|---|
|GitHub| SHA-1 HMAC, SHA-256 HMAC |
|Rudderstack| Bearer Token |
|Segment| SHA-1 HMAC |
|AWS EventBridge| Bearer Token |
|HubSpot| API Key, Signature V2 |

Note: While only the above sources have been thoroughly tested, RisingWave's existing functions are capable of supporting additional webhook sources and authentication methods. You can integrate other services using similar configurations, although they may not have been officially verified yet.

## Further Guidance
Detailed instructions and guides are available for integrating RisingWave with the verified webhook sources mentioned above. These guides provide step-by-step processes to help you set up and configure your webhook sources effectively.