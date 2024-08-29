---
id: sink-to-aws-kinesis
title: Sink to AWS Kinesis
description: Sink data from RisingWave to AWS Kinesis.
slug: /sink-to-aws-kinesis
---
<head>
  <link rel="canonical" href="https://docs.risingwave.com/docs/current/sink-to-aws-kinesis/" />
</head>

This topic described how to sink data from RisingWave to AWS Kinesis Data Streams.

:::note Beta Feature
The AWS Kinesis sink connector in RisingWave is currently in Beta. Please contact us if you encounter any issues or have feedback.
:::

## Syntax

```sql
CREATE SINK [ IF NOT EXISTS ] sink_name
[FROM sink_from | AS select_query]
WITH (
   connector = 'kinesis',
   connector_parameter = 'value', ...
)
FORMAT data_format ENCODE data_encode [ (
    key = 'value'
) ]
[KEY ENCODE key_encode [(...)]]
;
```

## Basic parameters

|Field|Notes|
|-----|-----|
|stream |Required. Name of the stream.|
|aws.region |Required. AWS service region. For example, US East (N. Virginia).|
|endpoint |Optional. URL of the entry point for the AWS Kinesis service.|
|aws.credentials.access_key_id |Required. This field indicates the access key ID of AWS.|
|aws.credentials.secret_access_key |Required. This field indicates the secret access key of AWS. |
|aws.credentials.session_token |Optional. The session token associated with the temporary security credentials. |
|aws.credentials.role.arn |Optional. The Amazon Resource Name (ARN) of the role to assume.|
|aws.credentials.role.external_id|Optional. The [external id](https://aws.amazon.com/blogs/security/how-to-use-external-id-when-granting-access-to-your-aws-resources/) used to authorize access to third-party resources. |
|primary_key| Required. The primary keys of the sink. Use ',' to delimit the primary key columns. |

:::note
In the Kinesis sink, we use the [PutRecords](https://docs.aws.amazon.com/kinesis/latest/APIReference/API_PutRecords.html) API to send multiple records in batches, which helps achieve higher throughput. However, due to Kinesis limitations, the records might be delivered out of order when using this API. Despite this, the current implementation of the Kinesis sink guarantees at-least-once delivery and eventual consistency.
:::

## FORMAT and ENCODE options

:::note
These options should be set in `FORMAT data_format ENCODE data_encode (key = 'value')`, instead of the `WITH` clause
:::

|Field|Notes|
|-----|-----|
|data_format| Data format. Allowed formats:<ul><li> `PLAIN`: Output data with insert operations.</li><li> `DEBEZIUM`: Output change data capture (CDC) log in Debezium format.</li><li> `UPSERT`: Output data as a changelog stream. `primary_key` must be specified in this case. </li></ul> To learn about when to define the primary key if creating an `UPSERT` sink, see the [Overview](/data-delivery.md).|
|data_encode| Data encode. Supported encode: `JSON`. |
|force_append_only| If `true`, forces the sink to be `PLAIN` (also known as `append-only`), even if it cannot be.|
|timestamptz.handling.mode|Controls the timestamptz output format. This parameter specifically applies to append-only or upsert sinks using JSON encoding. <br/> - If omitted, the output format of timestamptz is `2023-11-11T18:30:09.453000Z` which includes the UTC suffix `Z`. <br/> - When `utc_without_suffix` is specified, the format is changed to `2023-11-11 18:30:09.453000`.|
|key_encode| Optional. When specified, the key encode can only be `TEXT`, and the primary key should be one and only one of the following types: `varchar`, `bool`, `smallint`, `int`, and `bigint`; When absent, both key and value will use the same setting of `ENCODE data_encode ( ... )`. |

## Examples

```sql
CREATE SINK s1 FROM t WITH (
 connector = 'kinesis',
 stream = 'kinesis-sink-demo',
 aws.region = 'us-east-1',
 aws.credentials.access_key_id = 'your_access_key',
 aws.credentials.secret_access_key = 'your_secret_key'
)
FORMAT DEBEZIUM ENCODE JSON;
```
