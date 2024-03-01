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

This topic walks you through the steps to ingest change streams from MongoDB to RisingWave.

For ingesting CDC data from MongoDB to RisingWave, you'll need to use the Debezium connector for MongoDB to convert change streams from MongoDB to Kafka topics first, and then ingest these Kafka topics into RisingWave.

<img
  src={require('../images/mongodb_cdc_into_rw.png').default}
  alt="Ingest data from MongoDB CDC to RisingWave"
/>

## Overview of the steps

1. Configure MongoDB

2. Deploy the Debezium connector for MongoDB

3. Ingest data into RisingWave

## Configure MongoDB

First, you need to ensure MongoDB is installed and properly configured.

Note that the Debezium connector for MongoDB uses MongoDB’s change streams to capture the changes, so the connector works only with MongoDB replica sets or with sharded clusters where each shard is a separate replica set.

To learn about how to set up a replica set or sharded cluster, see the MongoDB documentation.

You must also have a MongoDB user with the appropriate permissions, and perform other configurations. Follow the instructions in the [Setting up MongoDB](https://debezium.io/documentation/reference/stable/connectors/mongodb.html#setting-up-mongodb) section to complete the configurations in MongoDB.

## Deploy the Debezium connector for MongoDB

To deploy a Debezium MongoDB connector, you install the Debezium MongoDB connector archive, configure the connector, and start the connector by adding its configuration to Kafka Connect.

When the connector is started, Debezium will create a CDC topic in Kafka and publish captured events to this topic.

For the complete deployment instructions, see [Deployment](https://debezium.io/documentation/reference/stable/connectors/mongodb.html#mongodb-deploying-a-connector).

### MongoDB connector configuration example

Here is a connector configuration example.

```json
{
  "name": "mongodb-connector",
  "config": {
    "connector.class": "io.debezium.connector.mongodb.MongoDbConnector",
    "tasks.max": "1",
    "mongodb.hosts": "<mongodb host>:27017",
    "mongodb.name": "dbserver1",
    "database.history.kafka.bootstrap.servers": "<message queue host>:29092"
  }
}
```

`<mongodb host>:27017` refers to a comma-separated list of hostname and port pairs (in the form 'host' or 'host:port') of the MongoDB servers in the replica set.

`<message queue host>:29092` refers to the bootstrap servers for the Kafka cluster that will store the database schema history topic.

## Ingest data into RisingWave

To ensure all data changes are captured, you must create a table and specify primary keys in RisingWave. When creating a table, specify the connector as `kafka`, and use `DEBEZIUM_MONGO` as the format and `JSON` as the encoding option.

For details about the syntax and the parameters, see [`CREATE TABLE`](/sql/commands/sql-create-table.md).

```sql title=Example
CREATE TABLE source_name (
   _id jsonb PRIMARY KEY
   payload jsonb
)
WITH (
   connector='kafka',
   topic='debezium_mongo_json_customers',
   properties.bootstrap.server='172.10.1.1:9090,172.10.1.2:9090',
   scan.startup.mode = 'earliest'
) FORMAT DEBEZIUM_MONGO ENCODE JSON;
```

After the table is created, you can view and transform the data based on your needs.
