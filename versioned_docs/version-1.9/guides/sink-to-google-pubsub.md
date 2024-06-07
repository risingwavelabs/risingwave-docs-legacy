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
)
FORMAT data_format ENCODE data_encode [ (
    key = 'value'
) ]
[KEY ENCODE key_encode [(...)]]
;
```

## Basic parameter

| Parameter           | Description                                                                                                                                                                             |
|---------------------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| pubsub.project_id   | Required. The Pub/Sub Project ID.                                                                                                                                                                 |
| pubsub.topic        | Required. The Pub/Sub topic to publish messages.                                                                                                                                                  |
| pubsub.endpoint     | Required. The Pub/Sub endpoint URL.                                                                                                                                                               |
| pubsub.emulator_host| Optional. The Pub/Sub emulator, see [Testing locally with Pub/Sub emulator](https://cloud.google.com/pubsub/docs/emulator).                                                                      |
| pubsub.credentials | Optional. A JSON string containing the service account credentials for authorization,see [Create credentials for a service account](https://developers.google.com/workspace/guides/create-credentials#create_credentials_for_a_service_account). The provided account credential must have the `pubsub.publisher` [role](https://cloud.google.com/pubsub/docs/access-control#roles). |

## FORMAT and ENCODE option

:::note
These options should be set in `FORMAT data_format ENCODE data_encode (key = 'value')`, instead of the `WITH` clause.
:::

|Field|Note|
|-----|-----|
|data_format| Data format. Allowed format: `PLAIN`.|
|data_encode| Data encode. Supported encode: `JSON`.|
|force_append_only| Required by default and must be `true`, which forces the sink to be `PLAIN` (also known as append-only).|
|key_encode| Optional. When specified, the key encode can only be `TEXT`, and the primary key should be one and only one of the following types: `varchar`, `bool`, `smallint`, `int`, and `bigint`; When absent, both key and value will use the same setting of `ENCODE data_encode ( ... )`. |

## Example

You can test the function locally before you deploying it. See guide on how to [Test locally with the Pub/Sub emulator](https://cloud.google.com/functions/docs/local-development).

Below is the example of how you can configure the `docker-compose.yaml` file:

```shell
services:
  pubsub-emulator:
    image: google/cloud-sdk:latest
    command: >
      gcloud beta emulators pubsub start --project=demo --host-port=0.0.0.0:8900
    ports:
      - "8900:8900"
```

Below is the example of how to create a sink:

```sql
CREATE TABLE IF NOT EXISTS personnel (id integer, name varchar);

CREATE SINK pubusb_sink
FROM
  personnel
WITH
(
    connector = 'google_pubsub',
    pubsub.endpoint = 'localhost:8900',
    pubsub.emulator_host = 'localhost:8900', -- local emulator
    pubsub.project_id = 'demo',
    pubsub.topic = 'test',
) FORMAT PLAIN ENCODE JSON (
    force_append_only='true',
);
```
