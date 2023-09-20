---
id: sink-to-nats
title: Sink data to NATS
description: Sink data from RisingWave to NATS.
slug: /sink-to-nats
---
This guide describes how to sink data from RisingWave to NATS subjects using the NATS sink connector in RisingWave.

[NATS](https://nats.io/) is an open source messaging system for cloud native applications. It provides a lightweight publish-subscribe architecture for high performance messaging.

:::caution Experimental Feature
The NATS sink connector in RisingWave is currently an experimental feature, and its functionality is subject to change. We cannot guarantee its continued support in future releases, and it may be discontinued without notice. You may use this feature at your own risk.
:::

## Prerequisites

Before sinking data from RisingWave to NATS, please ensure the following:

- The RisingWave cluster is running.
- A NATS server is running and accessible from your RisingWave cluster.
- Create a NATS subject that you want to sink data to.
- You have the permission to publish data to the NATS subject.

## Syntax

To sink data from RisingWave to a NATS subject, create a sink using the syntax below:

```sql
CREATE SINK [ IF NOT EXISTS ] sink_name
[FROM sink_from | AS select_query]
WITH (
   connector='nats',
   nats.server_url='<your nats server>:<port>', [ <another_server_url_if_available>, ...]
   nats.subject='<your subject>',
   type='append_only',
   force_append_only='true', 
   
   -- Optional parameters
   nats.user='<your user name>',
   nats.password='<your password>'
);
```

After the sink is created, RisingWave will continuously sink data to the NATS subject in append-only mode.

:::note

The NATS sink connector in RisingWave provides at-least-once delivery semantics. Events may be redelivered in case of failures.

:::

### Parameters

|Field|Notes|
|---|---|
|`nats.server_url`| Required. URLs of the NATS server, in the format of *address*:*port*. If multiple addresses are specified, use commas to separate them.|
|`nats.subject`| Required. NATS subject that you want to sink data to.|
|`type`| Required. Sink data type. For the NATS sink connector, only `append-only` is supported.|
|`force_append_only`| Required. It needs to be set to `true` for the NATS sink connector. This field forces the sink to be `append-only`, even if it cannot be.|
|`nats.user`| Optional. If authentication is required, specify the client user name.|
|`nats.password`| Optinal. If authentication is required, specify the client password.|
