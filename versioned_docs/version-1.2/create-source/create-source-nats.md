---
id: create-source-nats
title: Ingest data from NATS JetStream
description: Ingest data from NATS JetStream into RisingWave.
slug: /create-source-nats
---
<head>
  <link rel="canonical" href="https://docs.risingwave.com/docs/current/create-source-nats/" />
</head>

You can ingest data from NATS JetStream into RisingWave by using the NATS source connector in RisingWave.

[NATS](https://nats.io/) is an open source messaging system for cloud native applications. It provides a lightweight publish-subscribe architecture for high performance messaging.

[NATS JetStream](https://docs.nats.io/nats-concepts/jetstream) is a streaming data platform built on top of NATS. It enables real-time and historical access to streams of data via durable subscriptions and consumer groups.

:::note Beta Feature
The NATS source connector in RisingWave is currently in Beta. Please contact us if you encounter any issues or have feedback.
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
   nats.server_url='<your nats server>:<port>', [ <another_server_url_if_available>, ...]
   nats.subject='<your subject>',

   -- Optional parameters
   nats.user='<your user name>',
   nats.password='<your password>'
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

:::note

According to the [NATS documentation](https://docs.nats.io/running-a-nats-service/nats_admin/jetstream_admin/naming), stream names must adhere to subject naming rules as well as being friendly to the file system. Here are the recommended guidelines for stream names:

- Use alphanumeric values.
- Avoid spaces, tabs, periods (`.`), greater than (`>`) or asterisks (`*`).
- Do not include path separators (forward slash or backward slash).
- Keep the name length limited to 32 characters as the JetStream storage directories include the account, stream name, and consumer name.
- Avoid using reserved file names like `NUL` or `LPT1`.
- Be cautious of case sensitivity in file systems. To prevent collisions, ensure that stream or account names do not clash due to case differences. For example, `Foo` and `foo` would collide on Windows or macOS systems.

:::

### Parameters

|Field|Notes|
|---|---|
|nats.server_url| Required. URLs of the NATS JetStream server, in the format of *address*:*port*. If multiple addresses are specified, use commas to separate them.|
|nats.subject| Required. NATS subject that you want to ingest from.|
|nats.user| Optional. If authentication is required, specify the client user name.|
|nats.password| Optinal. If authentication is required, specify the client password.|

## What's next

After the source or table is created, you can create materialized views to transform or analyze your streaming data.
