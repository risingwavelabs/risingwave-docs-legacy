---
id: ingest-from-mongodb-cdc
title: Ingest data from MongoDB CDC
description: Ingest data from MongoDB CDC.
slug: /ingest-from-mongodb-cdc
keywords: [mongodb cdc, data source]
---
This topic walks you through the steps to ingest data from MongoDB to RisingWave.

## Overview of the steps

1. Set up MongoDB.
2. Set up the Debezium connector for MongoDB.
3. Start the Debezium connector to capture CDC events.
4. Create a table in RisingWave to ingest the events.

## Set up MongoDB

## Set up the Debezium connector for MongoDB

## Start the Debezium connector to capture CDC events

## Create a table using the native CDC connector in RisingWave

To ensure all data changes are captured, you must create a table and specify primary keys. See the [`CREATE TABLE`](/sql/commands/sql-create-table.md) command for more details. The data format must be Debezium JSON.

### Syntax

```sql
CREATE TABLE [IF NOT EXISTS] source_name (
   _id BIGINT PRIMARY KEY
   payload jsonb
)
WITH (
   connector='kafka',
   topic='debezium_mongo_json_customers',
   properties.bootstrap.server='172.10.1.1:9090,172.10.1.2:9090',
) FORMAT DEBEZIUM_MONGO ENCODE JSON;
```

Note that a primary key is required.
