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
| pubsub.subscription | Required. Specifies where the Pub/Sub subscription to consume messages from. Pub/Sub is used to load-balance messages among all readers pulling from the same subscription, so one subscription (i.e., one source) can only be used for one materialized view (MV) that is shared between the actors of its fragment. Otherwise, different MVs on the same source will both receive part of the messages.|
| pubsub.credentials | Required. A JSON string containing the service account credentials for authorization, see the [service-account credentials guide](https://developers.google.com/workspace/guides/create-credentials#create_credentials_for_a_service_account). The provided account credential must have the `pubsub.subscriber` [role](https://cloud.google.com/pubsub/docs/access-control#pubsub.subscriber) and `pubsub.viewer` [role](https://cloud.google.com/pubsub/docs/access-control#pubsub.viewer).|
| pubsub.start_offset.nanos | Optional. Cannot be set together with pubsub.start_snapshot. Specifies a numeric timestamp in nanoseconds, ideally the publish timestamp of a message in the subscription. If present, the connector seeks the subscription to the timestamp and starts consuming from there. Note that the seek operation is subject to limitations based on the message retention policy of the subscription.|
| pubsub.start_snapshot | Optional. Cannot be set together with `pubsub.start_offset.nanos`. If present, the connector first seeks to the specified snapshot before starting consumption. |
| pubsub.parallelism | Optional. Specifies the number of parallel consumers to run for the subscription. If not specified, the default value is 1. |

:::info
We can only achieve at-least-once semantic for the Pub/Sub source rather than exactly once because the SDK cannot seek back to a specific message offset.
:::

Here's how the recovery process works:

1. Record the timestamp for each message as an offset.

2. During recovery, seek back to the specific timestamp and consume messages again from the topic.

If two messages are produced almost at the same time, it is possible to receive each message more than once.

## Examples

```sql
CREATE TABLE s1 (v1 int, v2 varchar) WITH (
    connector = 'google_pubsub',
    pubsub.subscription = 'test-subscription-1',
) FORMAT PLAIN ENCODE JSON;
```
