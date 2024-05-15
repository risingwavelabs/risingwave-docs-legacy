---
id: sink-to-google-pubsub
title: Sink data from RisingWave to Google Pub/Sub
description: Sink data from RisingWave to Google Pub/Sub.
slug: /sink-to-google-pubsub
---
<head>
  <link rel="canonical" href="https://docs.risingwave.com/docs/current/sink-to-google-pubsub/" />
</head>

This guide describes how to sink data from RisingWave to Google Pub/Sub using the Google Pub/Sub sink connector in RisingWave. Pub/Sub is used for streaming analytics and data integration pipelines to load and distribute data. For more information, see [Google Pub/Sub](https://cloud.google.com/pubsub/docs/overview).

## Syntax

```sql
CREATE SINK [ IF NOT EXISTS ] sink_name
[FROM sink_from | AS select_query]
WITH (
   connector='google_pubsub',
   connector_parameter = 'value', ...
);
```

## Parameter

| Parameter           | Description                                                                                                                                                                             |
|---------------------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| pubsub.project_id   | Required. The Pub/Sub Project ID.                                                                                                                                                                 |
| pubsub.topic        | Required. The Pub/Sub topic to publish messages.                                                                                                                                                  |
| pubsub.endpoint     | Required. The Pub/Sub endpoint URL.                                                                                                                                                               |
| pubsub.emulator_host| Optional. The Pub/Sub emulator, see [Testing locally with Pub/Sub emulator](https://cloud.google.com/pubsub/docs/emulator).                                                                      |
| pubsub.credentials | Optional. A JSON string containing the service account credentials for authorization,see [Create credentials for a service account](https://developers.google.com/workspace/guides/create-credentials#create_credentials_for_a_service_account). The provided account credential must have the `pubsub.publisher` [role](https://cloud.google.com/pubsub/docs/access-control#roles). |
| force_append_only  | Optional. If `true`, forces the sink to be append-only, even if it cannot be.                                                                                                                     |

