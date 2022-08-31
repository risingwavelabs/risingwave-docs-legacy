---
id: sql-create-source
title: CREATE SOURCE
description: Supported data sources and how to connect RisingWave to the sources.
slug: /sql-create-source
---

Sources are resources that RisingWave can read data from. Use `CREATE SOURCE` to establish the connection to a source. After a connection is established, RisingWave will be able to read data from the source.


## Supported sources

Click the source name to see the SQL syntax, options, and sample statement of connecting RisingWave to the source.

| Source | Version | Data format | Materialized? | Limitations |
|---------|---------|---------|---------|---------|
|[Kafka](../create-source/create-source-kafka-redpanda.md)|3.1.0 or later versions	|JSON, protobuf|	Materialized & non-materialized|-
|[Redpanda](../create-source/create-source-kafka-redpanda.md)|Latest|JSON, protobuf	|Materialized & non-materialized|	-
|[Pulsar](../create-source/create-source-pulsar.md)|	2.8.0 or later versions|	JSON, protobuf|	Materialized & non-materialized|	-
|[Kinesis](../create-source/create-source-kinesis.md)|	Latest|	JSON, protobuf|	Materialized & non-materialized|	-
|[PostgreSQL CDC](../create-source/create-source-cdc.md)|	10, 11, 12, 13, 14|Debezium JSON|	Materialized only|	Must have primary key|
|[MySQL CDC](../create-source/create-source-cdc.md)|	5.7, 8.0|Debezium JSON|	Materialized only|	Must have primary key|

:::note
After connecting to a streaming source, RisingWave will not ingest data until a materialized view is created. After a materialized view is created, RisingWave will start to consume and analyze the data.
:::