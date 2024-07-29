---
id: sink-to-snowflake
title: Sink data from RisingWave to Snowflake
description: Sink data from RisingWave to Snowflake.
slug: /sink-to-snowflake
---

<head>
  <link rel="canonical" href="https://docs.risingwave.com/docs/current/sink-to-snowflake/" />
</head>

This guide describes how to sink data from RisingWave to Snowflake using the Snowflake sink connector in RisingWave.

Snowflake is a cloud-based data warehousing platform that allows for scalable and efficient data storage and analysis. For more information about Snowflake, see [Snowflake official website](https://www.snowflake.com/en/).

## Prerequisite

- Ensure you already have a Snowflake table that you can sink data to. For additional guidance on creating a table and setting up Snowflake, refer to the [Getting started](https://docs.snowflake.com/en/user-guide-getting-started) guide of Snowflake documentation.

- Ensure you have an upstream materialized view or source in RisingWave that you can sink data from.

## Required permission

To successfully sink data into Snowflake, the Snowflake user account must have the appropriate permissions. These permissions include:

- For the table: The user must have either `OWNERSHIP` permission, or at the very least `INSERT` permission.
- For the database: The user must have `USAGE` permission.
- For the schema: The user must have `USAGE` permission.

## Syntax

Use the following syntax to create a sink in RisingWave:

```sql
CREATE SINK [ IF NOT EXISTS ] sink_name
[FROM sink_from | AS select_query]
WITH (
   connector='snowflake',
   connector_parameter = 'value', ...
);
```

## Parameter

All parameters are required unless specified otherwise.

| Parameter                      | Description                                                                                                                                      |
|--------------------------------|--------------------------------------------------------------------------------------------------------------------------------------------------|
| snowflake.database            | The Snowflake database used for sinking.                                                                                                          |
| snowflake.schema              | The name of the corresponding schema where sink table exists.                                                                                                  |
| snowflake.pipe                | The created pipe object, will be used as `insertFiles` target.                                                                                    |
| snowflake.account_identifier  | The unique `account_identifier` provided by Snowflake. Please use the form `<orgname>-<account_name>`. See [Account identifiers](https://docs.snowflake.com/en/user-guide/admin-account-identifier) for more details.|
| snowflake.user                | The user that owns the table to be sinked. The user should have been granted corresponding *role*. See [Grant role](https://docs.snowflake.com/en/sql-reference/sql/grant-role) for more details. |
| snowflake.rsa_public_key_fp   | The public key fingerprint used when generating custom `jwt_token`. See [Authenticating to the server](https://docs.snowflake.com/en/developer-guide/sql-api/authenticating) for more details. |
| snowflake.private_key         | The RSA Privacy Enhanced Mail (PEM) key **without** encryption. See [Key-pair authentication and key-pair rotation](https://docs.snowflake.com/en/user-guide/key-pair-auth) for more details.                                                                                                             |
| snowflake.s3_bucket           | The S3 bucket where intermediate sink files will be stored.                                                                                       |
| snowflake.s3_path             | Optional. The S3 path to be specified. If this field is specified, the actual file location would be `<s3_bucket>://<s3_path>/<rw_auto_gen_file_name>`. Otherwise, it would be `<s3_bucket>://<rw_auto_gen_file_name>`. |
| snowflake.aws_access_key_id   | S3 credentials.                                                                                                                                   |
| snowflake.aws_secret_access_key | S3 credentials.                                                                                                                                  |
| snowflake.aws_region          | The S3 region, e.g., `us-east-2`.                                                                                                                   |
| snowflake.max_batch_row_num   | The configurable max row(s) to batch, which should be **explicitly** specified.                                                                    |
| force_append_only             | Optional. If `true`, forces the sink to be append-only, even if it cannot be.                                                   |


## Data type mapping

The following table shows the corresponding data types between RisingWave and Snowflake. For details on native RisingWave data types, see [Overview of data types](/sql/sql-data-types.md).

| RisingWave type | Snowflake type |
|-----------------|---------------|
| SMALLINT | SMALLINT |
| INTEGER | INTEGER |
| BIGINT | BIGINT |
| REAL | FLOAT4 |
| DECIMAL | DECIMAL |
| DOUBLE | FLOAT8 |
| BYTEA | BINARY |
| VARCHAR | VARCHAR |
| BOOLEAN | BOOLEAN |
| DATE | DATE |
| TIME | TIME |
| TIMESTAMP | TIMESTAMP |
| TIMESTAMPTZ | TIMESTAMP_TZ |
| INTERVAL | Unsupported |
| ARRAY | ARRAY |
| JSONB | VARIANT (You need to convert `JSONB` to `VARIANT` using `parse_json`.) |

## Example

Here is an example on how you can sink data from RisingWave to Snowflake. For detailed data-pipelining and sinking logic, see [Overview of the Snowpipe REST endpoints to load data](https://docs.snowflake.com/user-guide/data-load-snowpipe-rest-overview).

### Set up S3

Set up an external S3 bucket and ensure you have the corresponding credentials. Both Snowflake stage and RisingWave sink creation require these credentials:

   - `snowflake.s3_bucket`: URL in Snowflake stage.
   - `snowflake.aws_access_key_id`: AWS_KEY_ID in Snowflake stage.
   - `snowflake.aws_secret_access_key`: AWS_SECRET_KEY in Snowflake stage.

### Set up Snowflake

   Next, you need to set up Snowflake, which involves the following steps:

   - Generate a key-value pair for authentication.
   - Create a `role` and grant the appropriate permissions.
   - Set up the credential for the user (e.g., `RSA_PUBLIC_KEY`) and retrieve `snowflake.rsa_public_key_fp` for later use in RisingWave.
   - Create a `table` to store the sink data from RisingWave.
   - Create a `stage` to reference the external S3 bucket, which Snowflake will use internally to load the data.
   - Create a `pipe` to receive the loaded data from the pre-defined stage and copy it to the Snowflake table.

This assumes that you have already created your accounts and corresponding databases in Snowflake. For detailed authentication processes, see [Authenticating to the server](https://docs.snowflake.com/en/developer-guide/sql-api/authenticating); for detailed commands, see [Reference](https://docs.snowflake.com/en/reference). You can find an example of Snowflake setup commands in `snowflake_prep.sql`.

### Sink data

Now you can start sinking data. Launch your RisingWave cluster and execute the following SQL queries to create source and sink. See the examples below:

```sql title="Create source"
CREATE SOURCE s1_source (id int, name varchar)
WITH (
     connector = 'datagen',
     fields.id.kind = 'sequence',
     fields.id.start = '1',
     fields.id.end = '10000',
     fields.name.kind = 'random',
     fields.name.length = '10',
     datagen.rows.per.second = '200'
 ) FORMAT PLAIN ENCODE JSON;
 ```

```sql title="Create sink"
CREATE SINK snowflake_sink FROM ss_mv WITH (
    connector = 'snowflake',
    type = 'append-only',
    snowflake.database = 'EXAMPLE_DB',
    snowflake.schema = 'EXAMPLE_SCHEMA',
    snowflake.pipe = 'EXAMPLE_SNOWFLAKE_PIPE',
    snowflake.account_identifier = '<ORG_NAME>-<ACCOUNT_NAME>',
    snowflake.user = 'EXAMPLE_USER',
    snowflake.rsa_public_key_fp = 'EXAMPLE_FP',
    snowflake.private_key = 'EXAMPLE_PK',
    snowflake.s3_bucket = 'EXAMPLE_S3_BUCKET',
    snowflake.aws_access_key_id = 'EXAMPLE_AWS_ID',
    snowflake.aws_secret_access_key = 'EXAMPLE_SECRET_KEY',
    snowflake.aws_region = 'EXAMPLE_REGION',
    snowflake.max_batch_row_num = '1030',
    snowflake.s3_path = 'EXAMPLE_S3_PATH',
);
 ```
