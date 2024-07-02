---
id: data-delivery
title: Overview of data delivery
slug: /data-delivery
---
<head>
  <link rel="canonical" href="https://docs.risingwave.com/docs/current/data-delivery/" />
</head>

RisingWave supports delivering data to downstream systems via its sink connectors.

To stream data out of RisingWave, you must create a sink. A sink is an external target that you can send data to. Use the [`CREATE SINK`](/sql/commands/sql-create-sink.md) statement to create a sink. You need to specify what data to be exported, the format, and the sink parameters.

Sinks become visible right after you create them, regardless of the backfilling status. Therefore, it's important to understand that the data in the sinks may not immediately reflect the latest state of their upstream sources due to the latency of the sink, connector, and backfilling process.
To determine whether the process is complete and the data in the sink is consistent, refer to [Monitor statement progress](/manage/view-statement-progress.md).

Currently, RisingWave supports the following sink connectors:

- Apache Doris sink connector (`connector = 'doris'`)
  
  With this connector, you can sink data from RisingWave to Apache Doris. For details about the syntax and parameters, see [Sink data to Apache Doris](/guides/sink-to-doris.md).

- Apache Iceberg sink connector (`connector = 'iceberg'`)
  
  With this connector, you can sink data from RisingWave to Apache Iceberg. For details about the syntax and parameters, see [Sink data to Apache Iceberg](/guides/sink-to-iceberg.md).

- AWS Kinesis sink connector (`connector = 'kinesis'`)

  With this connector, you can sink data from RisingWave to AWS Kinesis. For details about the syntax and parameters, see [Sink data to AWS Kinesis](/guides/sink-to-aws-kinesis.md).

- Cassandra and ScyllaDB sink connector (`connector = 'cassandra'`)

  With this connector, you can sink data from RisingWave to Cassandra or ScyllaDB. For details about the syntax and parameters, see [Sink data to Cassandra or ScyllaDB](/guides/sink-to-cassandra.md).

- ClickHouse sink connector (`connector = 'clickhouse'`)

  With this connector, you can sink data from RisingWave to ClickHouse. For details about the syntax and parameters, see [Sink data to ClickHouse](/guides/sink-to-clickhouse.md).

- CockroachDB sink connector (`connector = 'jdbc'`)

  With this connector, you can sink data from RisingWave to CockroachDB. For details about the syntax and parameters, see [Sink data to CockroachDB](/guides/sink-to-cockroach.md).

- Delta Lake sink connector (`connector = 'deltalake'`)

  With this connector, you can sink data from RisingWave to Delta Lake. For details about the syntax and parameters, see [Sink data to Delta Lake](/guides/sink-to-delta-lake.md).

- Elasticsearch sink connector (`connector = 'elasticsearch'`)

  With this connector, you can sink data from RisingWave to Elasticsearch. For details about the syntax and parameters, see [Sink data to Elasticsearch](/guides/sink-to-elasticsearch.md).

- Google BigQuery sink connector (`connector = 'bigquery'`)

  With this connector, you can sink data from RisingWave to Google BigQuery. For details about the syntax and parameters, see [Sink data to Google BigQuery](/guides/sink-to-bigquery.md).

- Google Pub/Sub sink connector (`connector = 'google_pubsub'`)

  With this connector, you can sink data from RisingWave to Google Pub/Sub. For details about the syntax and parameters, see [Sink data to Google Pub/Sub](/guides/sink-to-google-pubsub.md).

- JDBC sink connector for MySQL, PostgreSQL, or TiDB (`connector = 'jdbc'`)

  With this connector, you can sink data from RisingWave to JDBC-available databases, such as MySQL, PostgreSQL, or TiDB. When sinking to a database with a JDBC driver, ensure that the corresponding table created in RisingWave has the same schema as the table in the database you are sinking to. For details about the syntax and parameters, see [Sink to MySQL](/guides/sink-to-mysql.md), [Sink to PostgreSQL](/guides/sink-to-postgres.md), or [Sink to TiDB](/guides/sink-to-tidb.md).

- Kafka sink connector (`connector = 'kafka'`)
  
  With this connector, you can sink data from RisingWave to Kafka topics. For details about the syntax and parameters, see [Sink data to Kafka](/guides/create-sink-kafka.md).

- MQTT sink connector (`connector = 'mqtt'`)

  With this connector, you can sink data from RisingWave to MQTT topics. For details about the syntax and parameters, see [Sink data to MQTT](/guides/sink-to-mqtt.md).

- NATS sink connector (`connector = 'nats'`)

  With this connector, you can sink data from RisingWave to NATS. For details about the syntax and parameters, see [Sink data to NATS](/guides/sink-to-nats.md).

- Pulsar sink connector (`connector = 'pulsar'`)

  With this connector, you can sink data from RisingWave to Pulsar. For details about the syntax and parameters, see [Sink data to Pulsar](/guides/sink-to-pulsar.md).

- Redis sink connector (`connector = 'redis'`)

  With this connector, you can sink data from RisingWave to Redis. For details about the syntax and parameters, see [Sink data to Redis](/guides/sink-to-redis.md).

- Snowflake sink connector (`connector = 'snowflake'`)

  With this connector, you can sink data from RisingWave to Snowflake. For details about the syntax and parameters, see [Sink data to Snowflake](/guides/sink-to-snowflake.md).

- StarRocks sink connector (`connector = 'starrocks'`)

  With this connector, you can sink data from RisingWave to StarRocks. For details about the syntax and parameters, see [Sink data to StarRocks](/guides/sink-to-starrocks.md).

- Microsoft SQL Server sink connector(`connector = 'sqlserver'`)
  
  With this connector, you can sink data from RisingWave to Microsoft SQL Server. For details about the syntax and parameters, see [Sink data to SQL Server](/guides/sink-to-sqlserver.md).

## Sink decoupling

Typically, sinks in RisingWave operates in a blocking manner. This means that if the downstream target system experiences performance fluctuations or becomes unavailable, it can potentially impact the stability of the RisingWave instance. However, sink decoupling can be implemented to address this issue.

Sink decoupling introduces a buffering queue between a RisingWave sink and the downstream system. This buffering mechanism helps maintain the stability and performance of the RisingWave instance, even when the downstream system is temporarily slow or unavailable.

The `sink_decouple` session variable can be specified to enable or disable sink decoupling. The default value for the session variable is `default`. 

To enable sink decoupling for all sinks created in the sessions, set `sink_decouple` as `true` or `enable`.

```sql
SET sink_decouple = true;
```

To disable sink decoupling, set `sink_decouple` as `false` or `disable`, regardless of the default setting. 

```sql
SET sink_decouple = false;
```

Sink decoupling is enabled by default for the following sinks:

- [Kafka](/guides/create-sink-kafka.md)
- [Pulsar](/guides/sink-to-pulsar.md)
- [Kinesis](/guides/sink-to-iceberg.md)
- [Clickhouse](/guides/sink-to-clickhouse.md)
- [Nats](/guides/sink-to-nats.md)
- [StarRocks with `commit_checkpoint_interval` > 1](/guides/sink-to-starrocks.md)
- [Delta Lake with `commit_checkpoint_interval` > 1](/guides/sink-to-delta-lake.md)
- [Apache Iceberg with `commit_checkpoint_interval` > 1](/guides/sink-to-iceberg.md)

Sink decoupling is enabled by default for the following sinks if the sink is append-only:

- JDBC
  - [MySQL](/guides/sink-to-mysql.md)
  - [PostgreSQL](/guides/sink-to-postgres.md)
  - [TiDB](/guides/sink-to-tidb.md)
  - [CockroachDB](/guides/sink-to-cockroach.md)

An internal system table `rw_sink_decouple` is provided to query whether a created sink has enabled sink decoupling or not.

```sql
dev=> select sink_id, is_decouple from rw_sink_decouple;
 sink_id | is_decouple 
---------+-------------
       2 | f
       5 | t
(2 rows)

```

## Upsert sinks and primary keys

For each sink, you can specify the data format. The available data formats are `upsert`, `append-only`, and `debezium`. To determine which data format is supported by each sink connector, please refer to the detailed guide listed above.

In the `upsert` sink, a non-null value updates the last value for the same key or inserts a new value if the key doesn't exist. A NULL value indicates the deletion of the corresponding key.

When creating an `upsert` sink, note whether or not you need to specify the primary key in the following situations.

- If the downstream system supports primary keys and the table in the downstream system has a primary key, you must specify the primary key with the `primary_key` field when creating an upsert JDBC sink.

- If the downstream system supports primary keys but the table in the downstream system has no primary key, then RisingWave does not allow users to create an upsert sink. A primary key must be defined in the table in the downstream system.

- If the downstream system does not support primary keys, then users must define the primary key when creating an upsert sink.
