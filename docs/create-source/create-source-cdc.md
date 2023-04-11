---
id: create-source-cdc
title: CDC via event streaming systems
description: Ingest CDC data via event streaming systems.
slug: /create-source-cdc
---

Change data capture (CDC) refers to the process of identifying and capturing data changes in a database, then delivering the changes to a downstream service in real time. 

RisingWave provides native MySQL and PostgreSQL CDC connectors. With these CDC connectors, you can ingest CDC data from these databases directly, without setting up additional services like Kafka.

If Kafka is part of your technical stack, you can connect Kafka to RisingWave to ingest CDC data in the form of Kafka topics from databases into RisingWave. You need to use a CDC tool such as [Debezium connector for MySQL](https://debezium.io/documentation/reference/stable/connectors/mysql.html), [Maxwell's daemon](https://maxwells-daemon.io/), or [TiCDC](https://docs.pingcap.com/tidb/dev/ticdc-overview) to produce CDC messages and send them to Kafka topics.

If Pulsar is part of your technical stack, you can connect Pulsar to RisingWave to ingest CDC data in the form of Pulsar topics from databases into RisingWave. You need to use a CDC tool such as the [Debezium connector for MySQL](https://debezium.io/documentation/reference/stable/connectors/mysql.html), or the [Canal source connector](https://pulsar.apache.org/docs/2.11.x/io-canal-source/) to produce CDC messages and send them to Pulsar topics.

If Kinesis is part of your technical stack, you can connect Kinesis to RisingWave to ingest CDC data in the form of Kinesis data streams from databases into RisingWave. You need to use a CDC tool such as [Maxwell's daemon](https://maxwells-daemon.io/), [AWS DMS](https://aws.amazon.com/blogs/big-data/stream-change-data-to-amazon-kinesis-data-streams-with-aws-dms/), or the [Debezium embedded engine](https://debezium.io/blog/2018/08/30/streaming-mysql-data-changes-into-kinesis/) to produce CDC messages and send them to Kinesis data streams.

This topic describes the configurations for using RisingWave to ingest CDC data from a message broker. For complete step-to-step guides about using the native CDC connector to ingest MySQL and PostgreSQL data, see [Ingest data from MySQL](../guides/ingest-from-mysql-cdc.md) and [Ingest data from PostgreSQL](../guides/ingest-from-postgres-cdc.md). For completeness, instructions about using additional CDC tools and a message broker to ingest CDC data are also included in these two topics.

For RisingWave to ingest CDC data, you must create a table (`CREATE TABLE`) with primary keys and connector settings. This is different from creating a standard source, as CDC data needs to be persisted in RisingWave to ensure correctness.

RisingWave accepts these data formats:

- Debezium JSON (for both MySQL and PostgreSQL)

   For Debezium JSON, you can use the [Debezium connector for MySQL](https://debezium.io/documentation/reference/stable/connectors/mysql.html) or [Debezium connector for PostgreSQL](https://debezium.io/documentation/reference/stable/connectors/postgresql.html) to convert CDC data to Kafka or Pulsar topics, or Kinesis data streams.

- Maxwell JSON (for MySQL only)

  For Maxwell JSON (`ROW FORMAT MAXWELL`), you need to use [Maxwell's daemon](https://maxwells-daemon.io/) to convert MySQL data changes to Kafka or Pulsar topics. To learn about how to configure MySQL and deploy Maxwell's daemon, see the [Quick Start](https://maxwells-daemon.io/quickstart/).

- The TiCDC dialect of Canal JSON (for TiDB only)

  For the TiCDC dialect of [Canal](https://github.com/alibaba/canal) JSON (`ROW FORMAT CANAL_JSON`), you can add TiCDC to an existing TiDB cluster to convert TiDB data changes to Kafka topics. For details, see [Deploy and Maintain TiCDC](https://docs.pingcap.com/tidb/dev/deploy-ticdc). 

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
ROW FORMAT { DEBEZIUM_JSON | MAXWELL | CANAL_JSON };
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
                ),
                rr.Terminal(';'),
            ),
     
    )
);


<drawer SVG={svg} />




### Connector Parameters

Please see the respective data ingestion pages for the connection parameters.

- [Kafka](create-source-kafka.md)

- [Pulsar](create-source-pulsar.md)

- [Kinesis](create-source-kinesis.md)


## Example

Here is an example of creating a table with the Kafka connector to ingest CDC data from Kafka topics.

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
   scan.startup.mode='earliest',
   properties.group.id='demo_consumer_name'
) 
ROW FORMAT DEBEZIUM_JSON;
```

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
