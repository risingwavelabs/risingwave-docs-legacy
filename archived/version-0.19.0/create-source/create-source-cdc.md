---
id: create-source-cdc
title: CDC via event streaming systems
description: Ingest CDC data via event streaming systems.
slug: /create-source-cdc
---

<head>
  <link rel="canonical" href="https://docs.risingwave.com/docs/current/create-source-cdc/" />
</head>

Change data capture (CDC) refers to the process of identifying and capturing data changes in a database, then delivering the changes to a downstream service in real time.

You can use event streaming systems like Kafka, Pulsar, or Kinesis to stream changes from MySQL, PostgreSQL, and TiDB to RisingWave. In this case, you will need an additional CDC tool to stream the changes from the database and specify the corresponding formats when ingesting the streams into RisingWave.

RisingWave also provides native MySQL and PostgreSQL CDC connectors. With these CDC connectors, you can ingest CDC data from these databases directly, without setting up additional services like Kafka. For complete step-to-step guides about using the native CDC connector to ingest MySQL and PostgreSQL data, see [Ingest data from MySQL](/guides/ingest-from-mysql-cdc.md) and [Ingest data from PostgreSQL](/guides/ingest-from-postgres-cdc.md). This topic only describes the configurations for using RisingWave to ingest CDC data from an event streaming system.

For RisingWave to ingest CDC data, you must create a table (`CREATE TABLE`) with primary keys and connector settings. This is different from creating a standard source, as CDC data needs to be persisted in RisingWave to ensure correctness.

RisingWave accepts these data formats:

- Debezium JSON (for MySQL and PostgreSQL)

  For Debezium JSON, you can use the [Debezium connector for MySQL](https://debezium.io/documentation/reference/stable/connectors/mysql.html) or [Debezium connector for PostgreSQL](https://debezium.io/documentation/reference/stable/connectors/postgresql.html) to convert CDC data to Kafka or Pulsar topics, or Kinesis data streams.

- Debezium Mongo JSON (for MongoDB)

  For Debezium Mongo JSON, you can use the [Debezium connector for MongoDB](https://debezium.io/documentation/reference/stable/connectors/mongodb.html) to convert CDC data to Kafka topics.

- Debezium AVRO (for MySQL and PostgreSQL)

  For Debezium AVRO, you can use the [Debezium connector for MySQL](https://debezium.io/documentation/reference/stable/connectors/mysql.html) or [Debezium connector for PostgreSQL](https://debezium.io/documentation/reference/stable/connectors/postgresql.html) to convert CDC data to Kafka topics.

- Maxwell JSON (for MySQL only)

  For Maxwell JSON (`ROW FORMAT MAXWELL`), you need to use [Maxwell's daemon](https://maxwells-daemon.io/) to convert MySQL data changes to Kafka topics or Kinesis data streams. To learn about how to configure MySQL and deploy Maxwell's daemon, see the [Quick Start](https://maxwells-daemon.io/quickstart/).

- The TiCDC dialect of Canal JSON (for TiDB only)

  For the TiCDC dialect of [Canal](https://github.com/alibaba/canal) JSON (`ROW FORMAT CANAL_JSON`), you can add TiCDC to an existing TiDB cluster to convert TiDB data changes to Kafka topics. You might need to define the topic name in a TiCDC configuration file. Note that only new changes will be captured from TiDB. Data that already exists within the target table will not be captured by TiCDC. For details, see [Deploy and Maintain TiCDC](https://docs.pingcap.com/tidb/dev/deploy-ticdc).

- Canal JSON (for MySQL only)

  For Canal JSON (`ROW FORMAT CANAL_JSON`), you need to use the [Canal source connector](https://pulsar.apache.org/docs/2.11.x/io-canal-source/) to convert MySQL change data to Pulsar topics.

## Syntax

```sql
CREATE TABLE [ IF NOT EXISTS ] source_name (
   column_name data_type [ PRIMARY KEY ], ...
   PRIMARY KEY ( column_name, ... )
)
WITH (
   connector='connector',
   connector_parameter='value', ...
)
ROW FORMAT { DEBEZIUM_JSON | DEBEZIUM_MONGO_JSON | MAXWELL | CANAL_JSON  | DEBEZIUM_AVRO };
```

import rr from '@theme/RailroadDiagram'

export const svg = rr.Diagram(
rr.Stack(
rr.Sequence(
rr.Terminal('CREATE TABLE'),
rr.Optional(rr.Terminal('IF NOT EXISTS')),
rr.NonTerminal('table_name', 'wrap')
),
rr.Sequence(
rr.Terminal('('),
rr.ZeroOrMore(
rr.Sequence(
rr.NonTerminal('column_name', 'skip'),
rr.NonTerminal('data_type', 'skip'),
rr.Optional(rr.Terminal('column_constraint')),
),
','
),
rr.Terminal(')'),
),
rr.Sequence(
rr.Terminal('WITH'),
rr.Terminal('('),
rr.Stack(
rr.Stack(
rr.Sequence(
rr.Terminal('connector'),
rr.Terminal('='),
rr.NonTerminal('kafka', 'skip'),
rr.Terminal(','),
),
rr.Sequence(
rr.OneOrMore(
rr.Sequence(
rr.NonTerminal('connector_parameter', 'skip'),
rr.Terminal('='),
rr.NonTerminal('value', 'skip'),
),
',',
),
rr.Terminal(')'),
),
),
),
),
rr.Sequence(
rr.Terminal('ROW FORMAT'),
rr.Choice(1,
rr.Terminal('DEBEZIUM_JSON'),
rr.Terminal('MAXWELL'),
rr.Terminal('CANAL_JSON'),
rr.Terminal('DEBEZIUM_AVRO'),
),
rr.Terminal(';'),
),
)
);

<Drawer SVG={svg} />

### Connector Parameters

Please see the respective data ingestion pages for the connection parameters.

- [Kafka](create-source-kafka.md)

- [Pulsar](create-source-pulsar.md)

- [Kinesis](create-source-kinesis.md)

## Examples

### Kafka

Here are examples of creating a table with the Kafka connector to ingest CDC data from Kafka topics.

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

<Tabs groupID = "data-formats">
<TabItem value="Debezium JSON" label="Debezium JSON">

```sql
CREATE TABLE [IF NOT EXISTS] source_name (
   column1 varchar,
   column2 integer,
   PRIMARY KEY (column1)
)
WITH (
   connector='kafka',
   topic='user_test_topic',
   properties.bootstrap.server='172.10.1.1:9090,172.10.1.2:9090',
   scan.startup.mode='earliest'
)
ROW FORMAT DEBEZIUM_JSON;
```

</TabItem>
<TabItem value="Debezium Mongo JSON" label="Debezium Mongo JSON">

For more details on this row format, see [Debezium Mongo JSON](../sql/commands/sql-create-source.md#debezium-mongo-json)

```sql
CREATE TABLE [IF NOT EXISTS] source_name (
   _id BIGINT PRIMARY KEY
   payload jsonb
)
WITH (
   connector='kafka',
   topic='debezium_mongo_json_customers',
   properties.bootstrap.server='172.10.1.1:9090,172.10.1.2:9090',
)
ROW FORMAT DEBEZIUM_MONGO_JSON;
```

</TabItem>
<TabItem value="Debezium AVRO" label="Debezium AVRO">

```sql
CREATE TABLE orders (
    order_id INT PRIMARY KEY
)
WITH (
    connector = 'kafka',
    topic = 'mysql.mydb.orders',
    properties.bootstrap.server = 'message_queue:29092',
    scan.startup.mode = 'earliest'
)
ROW FORMAT DEBEZIUM_AVRO ROW SCHEMA LOCATION CONFLUENT SCHEMA REGISTRY 'http://message_queue:8081';
```

Although the `CREATE TABLE` command only specifies one column, the other columns in the upstream MySQL table will still be derived and included.

</TabItem>
</Tabs>

### Pulsar

Here is an example of creating a table with Pulsar to ingest CDC data from Pulsar topics.

```sql
CREATE TABLE source_name (
   column1 varchar,
   column2 integer,
   PRIMARY KEY (column1)
)
WITH (
   connector='pulsar',
   topic='demo_topic',
   service.url='pulsar://localhost:6650/',
   admin.url='http://localhost:8080',
   scan.startup.mode='latest',
   scan.startup.timestamp_millis='140000000'
)
ROW FORMAT DEBEZIUM_JSON;
```

### Kinesis

Here is an example of creating a table with Kinesis to ingest CDC data from Kinesis data streams.

```sql
CREATE TABLE source_name (
    column1 varchar,
    column2 integer,
    PRIMARY KEY (column1)
)
WITH (
    connector='kinesis',
    stream='kafka',
    aws.region='user_test_topic',
    endpoint='172.10.1.1:9090,172.10.1.2:9090',
    aws.credentials.session_token='AQoEXAMPLEH4aoAH0gNCAPyJxz4BlCFFxWNE1OPTgk5TthT+FvwqnKwRcOIfrRh3c/L To6UDdyJwOOvEVPvLXCrrrUtdnniCEXAMPLE/IvU1dYUg2RVAJBanLiHb4IgRmpRV3z rkuWJOgQs8IZZaIv2BXIa2R4OlgkBN9bkUDNCJiBeb/AXlzBBko7b15fjrBs2+cTQtp Z3CYWFXG8C5zqx37wnOE49mRl/+OtkIKGO7fAE',
    aws.credentials.role.arn='arn:aws-cn:iam::602389639824:role/demo_role',
    aws.credentials.role.external_id='demo_external_id'
)
ROW FORMAT DEBEZIUM_JSON;
```
