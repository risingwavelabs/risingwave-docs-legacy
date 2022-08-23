---
id: sql-create-sink
title: CREATE SINK
description: Create a sink.
slug: /sql-create-sink

---

Use the `CREATE SINK` command to create a sink. A sink is a connection to a stream that RisingWave can send data to. You can create a sink from a materialized source, a materialized view, or a table.


## Syntax

```sql
CREATE SINK [ IF NOT EXISTS ] sink_name 
FROM sink_from
WITH (
   connector='kafka',
   kafka.brokers='broker_address',
   kafka.topic='topic_address',
   format='format'
);
```

## Parameters

All WITH options are required.

|Parameter | Description|
|---|---|
|sink_name| Name of the sink to be created|
|sink_from| The source from which data will be output. It can be a materialized source, a materialized view, or a table.|
|connector| Sink connector type. Currently, only `‘kafka’` is supported.|
|kafka.brokers|Address of the Kafka broker. Format: `‘ip:port’`. If there are multiple brokers, separate them with commas. |
|kafka.topic|Address of the Kafka topic. One sink can only correspond to one topic.|
|format	| Data format. Allowed formats: `‘append-only’`, `‘debezium’`.|

