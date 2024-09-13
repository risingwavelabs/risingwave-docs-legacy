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

Sinking from RisingWave to Snowflake utilizes [Snowpipe](https://docs.snowflake.com/en/user-guide/data-load-snowpipe-rest-apis) for data loading. Initially, data is staged in a user-managed S3 bucket in JSON format, and then loaded into the Snowflake table via Snowpipe. For more information, see [Overview of the Snowpipe REST endpoints to load data](https://docs.snowflake.com/user-guide/data-load-snowpipe-rest-overview).

:::tip Premium Edition Feature
This feature is only available in the premium edition of RisingWave. The premium edition offers additional advanced features and capabilities beyond the free and community editions. If you have any questions about upgrading to the premium edition, please contact our sales team at [sales@risingwave-labs.com](mailto:sales@risingwave-labs.com).
:::

:::info Public Preview
This feature is in the public preview stage, meaning it's nearing the final product but is not yet fully stable. If you encounter any issues or have feedback, please contact us through our [Slack channel](https://www.risingwave.com/slack). Your input is valuable in helping us improve the feature. For more information, see our [Public preview feature list](/product-lifecycle/#features-in-the-public-preview-stage).
:::

## Prerequisite

- Ensure you have an S3 bucket that RisingWave can connect to.

- Ensure you have an upstream materialized view or source in RisingWave that you can sink data from.

- Ensure the S3 user account has `WRITE` permission.

- Ensure that Snowflake and S3 are set up in the same manner as described in the [Automating Snowpipe for Amazon S3](https://docs.snowflake.com/en/user-guide/data-load-snowpipe-auto-s3), as RisingWave is only responsible for writing data to S3.

:::note
RisingWave will not be responsible for deleting data already imported by S3. You can manually set the lifecycle configuration of your S3 bucket to clear out unnecessary data. See [Lifecycle configuration](https://docs.aws.amazon.com/AmazonS3/latest/userguide/how-to-set-lifecycle-configuration-intro.html) and [Delete staged files](https://docs.snowflake.com/en/user-guide/data-load-snowpipe-manage#deleting-staged-files-after-snowpipe-loads-the-datafor) for more details.
:::

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

| Parameter              | Description                                                                                       |
|------------------------|---------------------------------------------------------------------------------------------------|
| s3.bucket_name         | The S3 bucket where intermediate sink files will be stored.                                      |
| s3.path                | Optional. The S3 path to be specified. If specified, the actual file location would be `<s3_bucket>://<s3_path>/<rw_auto_gen_file_name>`. Otherwise, it would be `<s3_bucket>://<rw_auto_gen_file_name>`. |
| s3.credentials.access  | S3 access credentials.                                                                                  |
| s3.credentials.secret  | S3 secret credentials.                                                                                  |
| s3.region_name         | The S3 region, e.g., `us-east-2`.                                                                   |
| force_append_only      | Optional. If true, forces the sink to be append-only, even if it cannot be.                      |

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

Here is an example on how you can sink data from RisingWave to Snowflake.

### Set up S3

Set up an external S3 bucket and ensure you have the corresponding credentials. Both Snowflake stage and RisingWave sink creation require these credentials:

   - `snowflake.s3_bucket`: URL in Snowflake stage.
   - `snowflake.aws_access_key_id`: AWS_KEY_ID in Snowflake stage.
   - `snowflake.aws_secret_access_key`: AWS_SECRET_KEY in Snowflake stage.

### Set up Snowflake

Next, you need to set up a table, a stage, and a pipe. Additionally, make sure to open the SQS queue in S3.

To complete the setup, follow the instructions in [Automating Snowpipe for Amazon S3](https://docs.snowflake.com/en/user-guide/data-load-snowpipe-auto-s3).

### Sink data with append-only

Now you can start sinking data. Launch your RisingWave cluster and execute the following SQL queries to create source and sink. See the examples below:

```sql title="Create source"
CREATE SOURCE s1_source (id int,name varchar)
WITH (
	connector ='datagen',
	fields.id.kind ='sequence',
	fields.id.start ='1',
	fields.id.end ='10000',
	fields.name.kind ='random',
	fields.name.length ='10',
	datagen.rows.per.second ='200'
 ) FORMAT PLAIN ENCODE JSON;
 ```

```sql title="Create sink"
CREATE SINK snowflake_sink FROM ss_mv WITH (
    connector = 'snowflake',
    type = 'append-only',
    s3.bucket_name = 'EXAMPLE_S3_BUCKET',
    s3.credentials.access = 'EXAMPLE_AWS_ACCESS',
    s3.credentials.secret = 'EXAMPLE_AWS_SECRET',
    s3.region_name = 'EXAMPLE_REGION',
    s3.path = 'EXAMPLE_S3_PATH',
    force_append_only = 'true'
);
 ```

### Sink data with upsert

Snowflake tables don't support direct updates. To handle this, RisingWave imports incremental logs and modification order for each data piece into Snowflake. You can then merge these as you read, or create dynamic tables to read the upsert results. See [How dynamic tables work](https://docs.snowflake.com/en/user-guide/dynamic-tables-about) for more details.

Below are some examples for your reference.

```sql title="Create source in RisingWave"
CREATE SOURCE s1_source (id int,name varchar)
WITH (
    connector ='datagen',
    fields.id.kind ='sequence',
    fields.id.start ='1',
    fields.id.end ='10000',
    fields.name.kind ='random',
    fields.name.length ='10',
    datagen.rows.per.second ='200'
 ) FORMAT PLAIN ENCODE JSON;
 ```

```sql title="Create materialized view in RisingWave"
CREATE MATERIALIZED VIEW ss_mv AS
WITH sub AS changelog FROM user_behaviors
SELECT
    user_id,
    target_id,
    event_timestamp AT TIME ZONE 'America/Indiana/Indianapolis' as event_timestamp,
    changelog_op AS __op,
    _changelog_row_id::bigint AS __row_id
FROM
    sub;
 ```
 
Note that RisingWave uses `changelog` to transform streaming data into incremental logs. In the example above, `changelog_op` represents the type of modification (Insert/Update/Delete), while `_changelog_row_id` indicates the order of the modification. For more information, see [AS CHANGELOG](/sql/commands/sql-as-changelog.md).

 ```sql title="Create sink in RisingWave"
CREATE SINK snowflake_sink FROM ss_mv WITH (
    connector = 'snowflake',
    type = 'append-only',
    s3.bucket_name = 'EXAMPLE_S3_BUCKET',
    s3.credentials.access = 'EXAMPLE_AWS_ACCESS',
    s3.credentials.secret = 'EXAMPLE_AWS_SECRET',
    s3.region_name = 'EXAMPLE_REGION',
    s3.path = 'EXAMPLE_S3_PATH',
);
 ```

 ```sql title="Create warehouse"
CREATE WAREHOUSE test_warehouse;
 ```

 ```sql title="Create dynamic table in Snowflake"
CREATE OR REPLACE DYNAMIC TABLE user_behaviors
TARGET_LAG = '1 minute'
WAREHOUSE = test_warehouse
AS SELECT *
    FROM (
        SELECT *, ROW_NUMBER() OVER (PARTITION BY {primary_key} ORDER BY __row_id DESC) AS dedupe_id
        FROM t3
    ) AS subquery
WHERE dedupe_id = 1 AND (__op = 1 or __op = 3);
 ```
