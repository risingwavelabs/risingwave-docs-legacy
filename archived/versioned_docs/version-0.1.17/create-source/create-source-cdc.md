---
id: create-source-cdc
title: CDC via Kafka
description: Ingest CDC data via Kafka.
slug: /create-source-cdc
---
<head>
  <link rel="canonical" href="https://docs.risingwave.com/docs/current/create-source-cdc/" />
</head>

Change data capture (CDC) refers to the process of identifying and capturing data changes in a database, then delivering the changes to a downstream service in real time.

RisingWave provides native MySQL and PostgreSQL CDC connectors. With these CDC connectors, you can ingest CDC data from these databases directly, without setting up additional services like Kafka.

If Kafka is part of your technical stack, you can also use the Kafka connector in RisingWave to ingest CDC data in the form of Kafka topics from databases into RisingWave. You need to use a CDC tool such as [Debezium connector for MySQL](https://debezium.io/documentation/reference/stable/connectors/mysql.html), [Maxwell's daemon](https://maxwells-daemon.io/), or [TiCDC](https://docs.pingcap.com/tidb/dev/ticdc-overview) to convert CDC data into Kafka topics. Note that **CDC messages from different tables are expected to be ingested in different topics**.

This topic describes the configurations for using the Kafka connector in RisingWave to ingest CDC data. For complete step-to-step guides about using the native CDC connector to ingest MySQL and PostgreSQL data, see [Ingest data from MySQL](/guides/ingest-from-mysql-cdc.md) and [Ingest data from PostgreSQL](/guides/ingest-from-postgres-cdc.md). For completeness, instructions about using additional CDC tools and the Kafka connector to ingest CDC data are also included in these two topics.

For RisingWave to ingest CDC data, you must create a table (`CREATE TABLE`) with primary keys and connector settings. This is different from creating a standard source, as CDC data needs to be persisted in RisingWave to ensure correctness.

The Kafka connector in RisingWave accepts these data formats:

- Debezium JSON (for both MySQL and PostgreSQL)

   For Debezium JSON, you can use the [Debezium connector for MySQL](https://debezium.io/documentation/reference/stable/connectors/mysql.html) or [Debezium connector for PostgreSQL](https://debezium.io/documentation/reference/stable/connectors/postgresql.html) to convert CDC data to Kafka topics.

- Maxwell JSON (for MySQL only)

  For Maxwell JSON (`ROW FORMAT MAXWELL`), you need to use [Maxwell's daemon](https://maxwells-daemon.io/) to convert MySQL data changes to Kafka topics. To learn about how to configure MySQL and deploy Maxwell's daemon, see the [Quick Start](https://maxwells-daemon.io/quickstart/).

- The TiCDC dialect of Canal JSON (for TiDB only)

  For the TiCDC dialect of [Canal](https://github.com/alibaba/canal) JSON (`ROW FORMAT CANAL_JSON`), you can add TiCDC to an existing TiDB cluster to convert TiDB data changes to Kafka topics. For details, see [Deploy and Maintain TiCDC](https://docs.pingcap.com/tidb/dev/deploy-ticdc).

## Syntax

```sql
CREATE TABLE [ IF NOT EXISTS ] source_name (
   column_name data_type [ PRIMARY KEY ], ...
   PRIMARY KEY ( column_name, ... )
) 
WITH (
   connector='kafka',
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

|Field|Notes|
|---|---|
|topic| Required. Address of the Kafka topic. One source can only correspond to one topic.|
|properties.bootstrap.server| Required. Address of the Kafka broker. Format: `'ip:port,ip:port'`. |
|scan.startup.mode|Optional. The offset mode that RisingWave will use to consume data. The two supported modes are `earliest` (earliest offset) and `latest` (latest offset). If not specified, the default value `earliest` will be used.|
|scan.startup.timestamp_millis|Optional. RisingWave will start to consume data from the specified UNIX timestamp (milliseconds). If this field is specified, the value for `scan.startup.mode` will be ignored.|

## Example

Here is an example of creating a table using the Kafka connector to ingest CDC data from Kafka topics.

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
