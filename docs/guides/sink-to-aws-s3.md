---
 id: sink-to-aws-s3
 title: Sink data to AWS S3
 description: Describes how to sink data to AWS S3.
 slug: /sink-to-aws-s3
---
<head>
  <link rel="canonical" href="https://docs.risingwave.com/docs/current/sink-to-aws-s3/" />
</head>

This guide describes how to sink data from RisingWave to Amazon S3 sink using S3 connector in RisingWave.

[Amazon S3](https://docs.aws.amazon.com/AmazonS3/latest/userguide/Welcome.html) is an object storage service that offers industry-leading scalability, data availability, security, and performance.

## Syntax

```sql
CREATE SINK [ IF NOT EXISTS ] sink_name
[FROM sink_from | AS select_query]
WITH (
   connector='s3',
   connector_parameter = 'value', ...
);
```

## Parameters

| Parameter names | Description |
|-|-|
| connector             | Required. Support the S3 connector only.|
| s3.region_name        | Required. The service region. |
| s3.bucket_name        | Required. The name of the bucket where the sink data is stored in. |
| s3.path               | Required. The directory where the sink file is located.|
| s3.credentials.access | Optional. The access key ID of AWS. |
| s3.credentials.secret | Optional. The secret access key of AWS. |
| s3.endpoint_url       | Optional. The host URL for an S3-compatible object storage server. This allows users to use a different server instead of the standard S3 server.|
| s3.assume_role        | Optional. Specifies the ARN of an IAM role to assume when accessing S3. It allows temporary, secure access to S3 resources without sharing long-term credentials. |
| type                  | Required. Defines the type of the sink. Options include `append-only` or `upsert`.|

## Example

```sql
CREATE SINK s3_sink AS SELECT v1
FROM t 
WITH (
    connector='s3',
    s3.path = '<test_path>',
    s3.region_name = '<region_name>',
    s3.bucket_name = '<bucket_name>',
    s3.credentials.account_name = '<account_name>',
    s3.credentials.account_key = '<account_key>',
    s3.endpoint_url = '<endpoint_url>',
    type = 'append-only',
)FORMAT PLAIN ENCODE PARQUET(force_append_only=true);
```

For more information about encode `Parquet` or `JSON`, see [Sink data in parquet or json encode](/data-delivery.md#sink-data-in-parquet-or-json-encode).