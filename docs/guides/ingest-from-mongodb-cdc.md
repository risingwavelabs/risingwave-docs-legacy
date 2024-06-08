---
id: ingest-from-mongodb-cdc
title: Ingest data from MongoDB CDC
description: Describes how to ingest MongoDB CDC data into RisingWave.
slug: /ingest-from-mongodb-cdc
keywords: [mongodb cdc, data source]
---
<head>
  <link rel="canonical" href="https://docs.risingwave.com/docs/current/ingest-from-mongodb-cdc/" />
</head>

For ingesting CDC data from MongoDB to RisingWave, you can use the built-in `mongodb-cdc` connector to easily ingest data from MongoDB into RisingWave. Alternatively, you can use the [Debezium connector for MongoDB](https://debezium.io/documentation/reference/stable/connectors/mongodb) to convert change streams from MongoDB to Kafka topics and ingest these topics into RisingWave.

This topic walks you through the steps to ingest change streams from MongoDB to RisingWave using the built-in connector.

## Notes about running RisingWave from binaries

If you are running RisingWave locally from binaries and intend to use the native CDC source connectors or the JDBC sink connector, make sure that you have [JDK 11](https://openjdk.org/projects/jdk/11/) or later versions installed in your environment.

## Create a table in RisingWave using the native CDC connector

### Syntax

```sql
CREATE TABLE [ IF NOT EXISTS ] source_name (
    _id data_type PRIMARY KEY , 
    payload jsonb
) 
WITH (
    connector='mongodb-cdc',
    connector_parameter='value', ...
);
```

### Connector parameters

Unless specified otherwise, the fields listed are required. Note that the value of these parameters should be enclosed in single quotation marks.

|Field|Notes|
|---|---|
|mongodb.url| The [connection string](https://www.mongodb.com/docs/manual/reference/connection-string/) of MongoDB. |
|collection.name| The collection or collections you want to ingest data from. Use the format `db_name.collection_name` to specify which database the collection is in. To ingest data from collections in different database, use a comma-separated list of regular expressions. |


### Examples

The following SQL query creates a table that ingests data from all collections in the `dev` database.

```sql title=Example
CREATE TABLE source_name (
   _id varchar PRIMARY KEY,
   payload jsonb
) WITH (
   connector='mongodb-cdc',
   mongodb.url='mongodb://localhost:27017/?replicaSet=rs0',
   collection.name='dev.*'
);
```

The following SQL query creates a table that ingests data from all collections in the databases `db1` and `db2`.

```sql title=Example
CREATE TABLE source_name (
   _id varchar PRIMARY KEY,
   payload jsonb
) WITH (
   connector='mongodb-cdc',
   mongodb.url='mongodb://localhost:27017/?replicaSet=rs0',
   collection.name='db1.*, db2.*'
);
```
