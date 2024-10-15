---
 id: sink-to-pulsar
 title: Sink data from RisingWave to Apache Pulsar
 description: Sink data from RisingWave to Apache Pulsar.
 slug: /sink-to-pulsar
---

This guide describes how to sink data from RisingWave to Apache Pulsar.

[Apache Pulsar](https://pulsar.apache.org) is an open-source distributed pub-sub messaging system and event streaming platform that is scalable and designed to support geo-replication.

:::info Public Preview
This feature is in the public preview stage, meaning it's nearing the final product but is not yet fully stable. If you encounter any issues or have feedback, please contact us through our [Slack channel](https://www.risingwave.com/slack). Your input is valuable in helping us improve the feature. For more information, see our [Public preview feature list](/product-lifecycle/#features-in-the-public-preview-stage).
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
    key = 'value' ) ]
[KEY ENCODE key_encode [(...)]]
;
```

## Parameters

| Parameter Names | Description |
| --------------- | ---------------------------------------------------------------------- |
|topic |Required. The address of the Pulsar topic. One source can only correspond to one topic.|
|service.url |Required. The address of the Pulsar service.|
|auth.token |Optional. A token for auth. If both `auth.token` and `oauth` are set, only `oauth` authorization is considered.|
|oauth.issuer.url |Optional. The issuer URL for OAuth2. This field must be filled if other `oauth` fields are specified.|
|oauth.credentials.url |Optional. The path for credential files, which starts with `file://`. This field must be filled if other `oauth` fields are specified.|
|oauth.audience |Optional. The audience for OAuth2. This field must be filled if other `oauth` fields are specified.|
|oauth.scope |Optional. The scope for OAuth2.|
|aws.credentials.access_key_id |Optional. The AWS access key for loading from S3. This field does not need to be filled if `oauth.credentials.url` is specified to a local path.|
|aws.credentials.secret_access_key |Optional. The AWS secret access key for loading from S3. This field does not need to be filled if `oauth.credentials.url` is specified to a local path.|
|max_retry_num |Optional. The maximum number of times to retry sending a batch to Pulsar. This allows retrying in case of transient errors. The default value is 3. |
|retry_interval |Optional. The time in milliseconds to wait after a failure before retrying to send a batch. The default value is 100ms.|
|primary_key| Optional. The primary keys of the sink. Use ',' to delimit the primary key columns. Primary keys are optional when creating a `PLAIN` sink but required for `UPSERT` and `DEBEZIUM` sinks.|

## FORMAT and ENCODE options

:::note
These options should be set in `FORMAT data_format ENCODE data_encode (key = 'value')`, instead of the `WITH` clause
:::

| Field | Notes |
| --------------- | ---------------------------------------------------------------------- |
|data_format| Data format. Allowed formats:<ul><li> `PLAIN`: Output data with insert operations.</li><li> `DEBEZIUM`: Output change data capture (CDC) log in Debezium format.</li><li> `UPSERT`: Output data as a changelog stream. `primary_key` must be specified in this case. </li></ul> To learn about when to define the primary key if creating an `UPSERT` sink, see the [Overview](/data-delivery.md).|
|data_encode| Data encode. Supported encode: `JSON`. |
|force_append_only| If `true`, forces the sink to be `PLAIN` (also known as `append-only`), even if it cannot be.|
|timestamptz.handling.mode|Controls the timestamptz output format. This parameter specifically applies to append-only or upsert sinks using JSON encoding. <br/> - If omitted, the output format of timestamptz is `2023-11-11T18:30:09.453000Z` which includes the UTC suffix `Z`. <br/> - When `utc_without_suffix` is specified, the format is changed to `2023-11-11 18:30:09.453000`.|
|key_encode| Optional. When specified, the key encode can only be `TEXT`, and the primary key should be one and only one of the following types: `varchar`, `bool`, `smallint`, `int`, and `bigint`; When absent, both key and value will use the same setting of `ENCODE data_encode ( ... )`. |

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
  aws.credentials.access_key_id = 'xxx',
  aws.credentials.secret_access_key = 'xxx'
)
FORMAT DEBEZIUM ENCODE JSON;
```
