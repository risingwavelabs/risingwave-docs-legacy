---
id: sink-to-snowflake
title: Sink data from RisingWave to Snowflake
description: Sink data from RisingWave to Snowflake
slug: /sink-to-snowflake
---

This guide describes how to sink data from RisingWave to Snowflake using the Snowflake sink connector in RisingWave.

Snowflake is a cloud-based data warehousing platform that allows for scalable and efficient data storage and analysis. For more information about Snowflake, see [Snowflake official website](https://www.snowflake.com/en/).

## Prerequisites

- Ensure you already have a Snowflake table that you can sink data to. For additional guidance on creating a table and setting up Snowflake, refer to this [Getting start](https://docs.snowflake.com/en/user-guide-getting-started) guide.

- Ensure you have an upstream materialized view or source in RisingWave that you can sink data from.

## Required permissions

To successfully sink data into Snowflake, the user account must have the appropriate permissions. These include:

- For the Table: The user must have either `OWNERSHIP` permission, or at the very least `INSERT` permission.
- For the Database: The user must have `USAGE` permissions.
- For the Schema: The user must have `USAGE` permissions.

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

## Parameters

| Parameter Names | Description |
| --------------- | ---------------------------------------------------------------------- |
| snowflake.url       | Required. Snowflake URL. |
| snowflake.database       | Required. The name of the Snowflake database to which you are sinking data.|
| snowflake.user     | Required. The username of the Snowflake account. |
| snowflake.private.key   | Required. The private key used for authentication. |
| snowflake.private.key.passphrase   | Optional. The passphrase for the private key.|
| snowflake.role   | Required. The role of the Snowflake user.|

## Data type mapping

The following table shows the corresponding data types between RisingWave and Snowflake. For details on native RisingWave data types, see [Overview of data types](../sql/sql-data-types.md).

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
