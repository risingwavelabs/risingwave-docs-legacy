---
id: create-source-nats
title: Ingest data from NATS JetStream
description: Ingest data from NATS JetStream into RisingWave.
slug: /create-source-nats
---
You can ingest data from NATS JetStream into RisingWave by using the NATS source connector in RisingWave.

[NATS](https://nats.io/) is an open source messaging system for cloud native applications. It provides a lightweight publish-subscribe architecture for high performance messaging.

[NATS JetStream](https://docs.nats.io/nats-concepts/jetstream) is a streaming data platform built on top of NATS. It enables real-time and historical access to streams of data via durable subscriptions and consumer groups.

:::caution Experimental Feature
The NATS source connector in RisingWave is currently an experimental feature, and its functionality is subject to change. We cannot guarantee its continued support in future releases, and it may be discontinued without notice. You may use this feature at your own risk.
:::

## Prerequisites

Before ingesting data from NATS JetStream into RisingWave, please ensure the following:

- The NATS JetStream server is running and accessible from your RisingWave cluster.
- If authentication is required for the NATS JetStream server, make sure you have the client username and password. The client user must have the `subscribe` permission for the subject.
- Create the NATS subject from which you want to ingest data.
- Ensure that your RisingWave cluster is running.

## Ingest data into RisingWave

When creating a source, you can choose to persist the data from the source in RisingWave by using `CREATE TABLE` instead of `CREATE SOURCE` and specifying the connection settings and data format.

### Syntax

```sql
CREATE {TABLE | SOURCE} [ IF NOT EXISTS ] source_name 
[ schema_definition ]
WITH (
   connector='nats',
   server_url='<your nats server>:<port>', [ <another_server_url_if_available>, ...]
   subject='<your subject>',

-- optional parameters
   connect_mode=<connect_mode>
   username='<your user name>',
   password='<your password>'
   jwt=`<your jwt>`,
   nkey=`<your nkey>`

-- delivery parameters
   scan.startup.mode=`startup_mode`
   scan.startup.timestamp_millis='xxxxx',
)
FORMAT PLAIN ENCODE JSON;
```

**schema_definition**:

```sql
(
   column_name data_type [ PRIMARY KEY ], ...
   [ PRIMARY KEY ( column_name, ... ) ]
)
```

:::note

RisingWave performs primary key constraint checks on tables with connector settings but not on regular sources. If you need the checks to be performed, please create a table with connector settings.

For a table with primary key constraints, if a new data record with an existing key comes in, the new record will overwrite the existing record.
:::

### Parameters

|Field|Notes|
|---|---|
|`server_url`| Required. URLs of the NATS JetStream server, in the format of *address*:*port*. If multiple addresses are specified, use commas to separate them.|
|`subject`| Required. NATS subject that you want to ingest from.|
|`connect_mode`|Required. Authentication mode for the connection. Allowed values: `plain`: No authentication; `user_and_password`: Use user name and password for authentication. For this option, `username` and `password` must be specified; `credential`: Use JSON Web Token (JWT) and NKeys for authentication. For this option, `jwt` and `nkey` must be specified.  |
|`jwt` and `nkey`|JWT and NKEY for authentication. For details, see [JWT](https://docs.nats.io/running-a-nats-service/configuration/securing_nats/auth_intro/jwt) and [NKeys](https://docs.nats.io/running-a-nats-service/configuration/securing_nats/auth_intro/nkey_auth).|
|`username` and `password`| Conditional. The client user name and pasword. Required when `connect_mode` is `user_and_password`.|
|`scan.startup.mode`|Optional. The offset mode that RisingWave will use to consume data. The supported modes are `earliest` (earliest offset),`latest` (latest offset), and `timestamp_millis` (from a particular UNIX timestamp, which is specified via `scan.startup.timestamp_millis`). If not specified, the default value `earliest` will be used.|
|`scan.startup.timestamp_millis`|Conditional. Required when `scan.startup.mode` is `timestamp_millis`. RisingWave will start to consume data from the specified UNIX timestamp (milliseconds).|

## What's next

After the source or table is created, you can create materialized views to transform or analyze your streaming data.
