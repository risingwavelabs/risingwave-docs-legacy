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
   connector='kinesis',
   connector_parameter = 'value', ...
);
```

## Basic parameters

|Field|Notes|
|-----|-----|
|stream |Required. Name of the stream.|
|aws.region |Required. AWS service region. For example, US East (N. Virginia).|
|endpoint |Optional. URL of the entry point for the AWS Kinesis service.|
|aws.credentials.access_key_id |Conditional. This field indicates the access key ID of AWS. It must appear in pairs with `aws.credentials.secret_access_key`. |
|aws.credentials.secret_access_key |Conditional. This field indicates the secret access key of AWS. It must appear in pairs with `aws.credentials.access_key_id`. |
|aws.credentials.session_token |Optional. The session token associated with the temporary security credentials. |
|aws.credentials.role.arn |Optional. The Amazon Resource Name (ARN) of the role to assume.|
|aws.credentials.role.external_id|Optional. The [external id](https://aws.amazon.com/blogs/security/how-to-use-external-id-when-granting-access-to-your-aws-resources/) used to authorize access to third-party resources. |

## Sink parameters

|Field|Notes|
|-----|-----|
|type|Data format. Allowed formats:<ul><li> `append-only`: Output data with insert operations.</li><li> `debezium`: Output change data capture (CDC) log in Debezium format.</li><li> `upsert`: Output data as a changelog stream. `primary_key` must be specified in this case. </li></ul> To learn about when to define the primary key if creating an `upsert` sink, see the [Overview](/data-delivery.md).|
|force_append_only| If `true`, forces the sink to be `append-only`, even if it cannot be.|
|primary_key| The primary keys of the sink. Use ',' to delimit the primary key columns. If the external sink has its own primary key, this field should not be specified.|

## Examples

```sql
CREATE SINK s1 FROM t WITH (
 connector = 'kinesis',
 stream = 'kinesis-sink-demo',
 aws.region = 'us-east-1',
 aws.credentials.access_key_id = 'your_access_key',
 aws.credentials.secret_access_key = 'your_secret_key',
 type = 'debezium');
```
