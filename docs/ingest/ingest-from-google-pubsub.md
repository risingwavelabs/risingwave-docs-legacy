---
id: ingest-from-google-pubsub
title: Ingest data from Google Pub/Sub
slug: /ingest-from-google-pubsub
---
<head>
  <link rel="canonical" href="https://docs.risingwave.com/docs/current/ingest-from-google-pubsub/" />
</head>

Use the SQL statement below to connect RisingWave to Google Pub/Sub source.

## Syntax

```sql
CREATE {TABLE | SOURCE} [ IF NOT EXISTS ] source_name 
[ schema_definition ]
WITH (
   connector='google_pubsub',
   connector_parameter='value', ...
)
FORMAT data_format ENCODE data_encode (
   message = 'message',
   schema.location = 'location' | schema.registry = 'schema_registry_url'
);
```

## Parameters

| Field | Note |
| --- | --- |
| pubsub.subscription | Required. Specifies the Pub/Sub subscription to consume messages from. Ensure the subscription is configured with the `retain-on-ack` property to enable message replay. |
| pubsub.credentials | Required. a JSON string containing the service account credentials for authorization, see the [service-account credentials guide](https://developers.google.com/workspace/guides/create-credentials#create_credentials_for_a_service_account). The provided account credential must have the `pubsub.subscriber` [role](https://cloud.google.com/pubsub/docs/access-control#roles). |
| pubsub.start_offset.nanos | Optional. Cannot be set together with pubsub.start_snapshot. Specifies a numeric timestamp in nanoseconds, ideally the publish timestamp of a message in the subscription. If present, the connector seeks the subscription to the timestamp and starts consuming from there. Note that the seek operation is subject to limitations based on the message retention policy of the subscription.|
| pubsub.start_snapshot | Optional. Cannot be set together with `pubsub.start_offset.nanos`. If present, the connector first seeks to the specified snapshot before starting consumption. |

:::note
The Pub/Sub topic provided must have `retain_acked_messages` enabled and must define a retention policy. For details, see [Configure subscription message retention](https://cloud.google.com/pubsub/docs/replay-overview#subscription_message_retention).
:::

:::info
We can only achieve at-least-once semantic for the Pub/Sub source rather than exactly once because the SDK cannot seek back to a specific message offset.
:::

Here's how the recovery process works:

1. Record the timestamp for each message as an offset.

2. During recovery, seek back to the specific timestamp and consume messages again from the topic.

If two messages are produced almost at the same time, it is possible to receive each message more than once.

## Example

```sql
CREATE TABLE s1 (v1 int, v2 varchar) WITH (
    connector = 'google_pubsub',
    pubsub.subscription = 'test-subscription-1',
) FORMAT PLAIN ENCODE JSON;
```
