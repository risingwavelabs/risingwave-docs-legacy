---
id: sink-to-dynamodb
title: Sink data from RisingWave to Amazon DynamoDB
description: Sink data from RisingWave to Amazon DynamoDB.
slug: /sink-to-dynamodb
---

This guide describes how to sink data from RisingWave to DynamoDB using the DynamoDB sink connector in RisingWave.

[Amazon DynamoDB](https://aws.amazon.com/dynamodb/) is a fully managed, serverless, key-value NoSQL database designed to run high-performance applications at any scale. It provides consistent, single-digit millisecond response times and offers built-in security, backup and restore, and in-memory caching.

:::info Public Preview
This feature is in the public preview stage, meaning it's nearing the final product but is not yet fully stable. If you encounter any issues or have feedback, please contact us through our [Slack channel](https://www.risingwave.com/slack). Your input is valuable in helping us improve the feature. For more information, see our [Public preview feature list](/product-lifecycle/#features-in-the-public-preview-stage).
:::

## Syntax

```sql
CREATE SINK [ IF NOT EXISTS ] sink_name
[FROM sink_from | AS select_query]
WITH (
   connector = 'dynamodb',
   connector_parameter = 'value', ...
)
FORMAT data_format ENCODE data_encode [ (
    format_parameter = 'value'
) ];
```

## Parameters

| Field                               | Note                                                                                                                                                               |
| ----------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `table`                             | Required. Name of the DynamoDB table where you want to write the data.                                                                                             |
| `primary_key`                       | Required. A pair of columns representing the partition key and sort key of DynamoDB, e.g., `key1,key2`, separated by comma.                                        |
| `aws.region`                        | Required. AWS region where your DynamoDB table is hosted.                                                                                                          |
| `aws.endpoint_url`                  | Optional. Custom endpoint URL for connecting to DynamoDB. Useful for testing with DynamoDB Local.                                                                  |
| `aws.credentials.access_key_id`     | Conditional. AWS access key ID for accessing DynamoDB. Must be specified when using access key ID and secret key.                                                  |
| `aws.credentials.secret_access_key` | Conditional. AWS secret access key for accessing DynamoDB. Must be specified when using access key ID and secret key.                                              |
| `aws.credentials.role.arn`          | Conditional. ARN of the IAM role to assume for accessing DynamoDB. Must be specified when using AssumeRole.                                                        |
| `aws.credentials.role.external_id`  | Conditional. External ID for assuming the IAM role specified in `aws.credentials.role.arn`.                                                                        |
| `aws.profile`                       | Optional. The name of the AWS CLI profile to use for accessing DynamoDB. If specified, it overrides the default profile.                                           |
| `dynamodb.max_batch_rows`           | Optional. Maximum number of rows to write in a single batch operation to DynamoDB. This helps optimize throughput and manage rate limits. Default value is `1024`. |

## Partition key and sort key mapping

For the DynamoDB sink to function correctly, it is required that the source table in RisingWave has a composite primary key comprising two columns, corresponding to the partition key and sort key defined in the target DynamoDB table.

For example, if you are sinking data into a DynamoDB table named movies that is configured with a partition key title and a sort key year, you must ensure that the RisingWave table schema also defines a composite primary key with the same columns. Below is an example schema definition for the RisingWave table:

```sql
CREATE TABLE IF NOT EXISTS movies (
    year integer,
    title varchar,
    description varchar,
    primary key (year, title)
);
```

This makes sure that the data structure in RisingWave aligns with the key definition in DynamoDB, thus preventing any further misoperations.

## Data type mapping

| RisingWave Data Type        | DynamoDB Data Type |
| --------------------------- | ------------------ |
| boolean                     | Bool               |
| smallint                    | number (N)         |
| integer                     | number (N)         |
| bigint                      | number (N)         |
| numeric                     | number (N)         |
| real                        | number (N)         |
| double precision            | number (N)         |
| serial                      | number (N)         |
| character varying (varchar) | string (S)         |
| bytea                       | binary             |
| date                        | string (S)         |
| time without time zone      | string (S)         |
| timestamp without time zone | string (S)         |
| timestamp with time zone    | string (S)         |
| interval                    | string (S)         |
| struct                      | map (M)            |
| array                       | list (L)           |
| JSONB                       | string (S)         |

:::note
The `struct` datatype in RisingWave will map to `map (M)` in DynamoDB in a recursive way. Refer to [source code](https://github.com/risingwavelabs/risingwave/blob/88bb14aa6eb481f1dc0e92ee190bafad089d2afd/src/connector/src/sink/dynamodb.rs#L386) for details.
:::
