---
 id: sink-to-pulsar
 title: Sink data from RisingWave to Apache Pulsar
 description: Sink data from RisingWave to Apache Pulsar.
 slug: /sink-to-pulsar
---

This guide describes how to sink data from RisingWave to Apache Pulsar.

[Apache Pulsar](https://pulsar.apache.org) is an open-source distributed pub-sub messaging system and event streaming platform that is scaleable and designed to support geo-replication.

:::caution Beta feature
The Pulsar sink connector in RisingWave is currently in Beta. Please use this with caution as stability issues may still occur. Its functionality may evolve based on feedback. Please report any issues encountered to our team.
:::

## Prerequisites

Before sinking data from RisingWave to Pulsar, please ensure the following:

- A Pulsar cluster is running and accessible from RisingWave.
- You have the permission to access the Pulsar topics you want to sink data to.

## Syntax

```sql
CREATE SINK [ IF NOT EXISTS ] sink_name
[FROM sink_from | AS select_query]
WITH (
   connector='pulsar',
   connector_parameter = 'value', ...
)
FORMAT data_format ENCODE data_encode [ (
    format_parameter = 'value' ) ]
;
```

## Parameters

| Parameter Names | Description |
| --------------- | ---------------------------------------------------------------------- |
|topic	|Required. The address of the Pulsar topic. One source can only correspond to one topic.|
|service.url	|Required. The address of the Pulsar service.|
|auth.token	|Optional. A token for auth. If both `auth.token` and `oauth` are set, only `oauth` authorization is considered.|
|oauth.issuer.url	|Conditional. The issuer URL for OAuth2. This field must be filled if other `oauth` fields are specified.|
|oauth.credentials.url	|Conditional. The path for credential files, which starts with `file://`. This field must be filled if other `oauth` fields are specified.|
|oauth.audience	|Conditional. The audience for OAuth2. This field must be filled if other `oauth` fields are specified.|
|oauth.scope	|Optional. The scope for OAuth2.|
|access_key	|Optional. The AWS access key for loading from S3. This field does not need to be filled if `oauth.credentials.url` is specified to a local path.|
|secret_access	|Optional. The AWS secret access key for loading from S3. This field does not need to be filled if `oauth.credentials.url` is specified to a local path.|
|max_retry_num	|Optional. The maximum number of times to retry sending a batch to Pulsar. This allows retrying in case of transient errors. The default value is 3. |
|retry_interval	|Optional. The time in milliseconds to wait after a failure before retrying to send a batch. The default value is 100ms.|
|primary_key| Conditional. The primary keys of the sink. Use ',' to delimit the primary key columns. Primary keys are optional when creating a `PLAIN` sink but required for `UPSERT` and `DEBEZIUM` sinks.|

## Sink parameters 

| Field | Notes |
| --------------- | ---------------------------------------------------------------------- |
|data_format| Data format. Allowed formats:<ul><li> `PLAIN`: Output data with insert operations.</li><li> `DEBEZIUM`: Output change data capture (CDC) log in Debezium format.</li><li> `UPSERT`: Output data as a changelog stream. `primary_key` must be specified in this case. </li></ul> To learn about when to define the primary key if creating an `UPSERT` sink, see the [Overview](/data-delivery.md).|
|data_encode| Data encode. Supported encode: `JSON`. |
|force_append_only| If `true`, forces the sink to be `PLAIN` (also known as `append-only`), even if it cannot be.|

## Example

The following SQL query in RisingWave creates a Pulsar sink.

```sql
CREATE SINK IF NOT EXISTS pulsar_sink
FROM mv_name
WITH (
  connector = 'pulsar',
  topic = 'test-topic',
  service.url = 'pulsar://broker:6650',

  -- OAuth 
  oauth.issuer.url = 'https://issuer.com',
  oauth.credentials.url = 'https://provider.com',
  oauth.audience = 'test-aud',
  oauth.scope = 'consume',
  
  -- S3 credential for oauth file 
  access_key = 'xxx',
  secret_access = 'xxx' 
)
FORMAT DEBEZIUM ENCODE JSON;
```