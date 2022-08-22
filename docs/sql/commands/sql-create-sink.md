---
id: create-sink
title: CREATE SINK
description: Creates a sink.
slug: /create-sink
---

Use the `CREATE SINK` command to create a sink. A sink is a connection to a stream that RisingWave can send data to.


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

### Parameters

|Parameter|	Default|Type|Description|Required?|
|---|---|---|---|---|
|sink_name| None|String|Name of the sink to be created| Yes|
|sink_from| None|String|The source from which data will be output. It can be a materialized source, a materialized view, or a table.|Yes|
|connector| None|String|Sink connector type. Currently, only 'kafka' is supported.| Yes|
|kafka.brokers|None|String|Address of the Kafka broker. Format: `'ip:port,ip:port'`.	|Yes|
|kafka.topic|None|String|Address of the Kafka topic. One sink can only correspond to one topic.|Yes|
|format	| None|String|Data format. Allowed formats: `append-only`, `debezium`.|Yes|
