---
id: sink-to-nats
title: Sink data to NATS
description: Sink data from RisingWave to NATS.
slug: /sink-to-nats
---
This guide describes how to sink data from RisingWave to NATS subjects using the NATS sink connector in RisingWave.

[NATS](https://nats.io/) is an open source messaging system for cloud native applications. It provides a lightweight publish-subscribe architecture for high performance messaging.

:::note Beta Feature
The NATS sink connector in RisingWave is currently in Beta. Please contact us if you encounter any issues or have feedback.
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
   server_url='<your nats server>:<port>', [ <another_server_url_if_available>, ...]
   subject='<your subject>',

 -- optional parameters
   connect_mode=<connect_mode>
   username='<your user name>',
   password='<your password>'
   jwt='<your jwt>',
   nkey='<your nkey>',
   type='<sink data type>'
)
FORMAT PLAIN ENCODE JSON;
```

After the sink is created, RisingWave will continuously sink data to the NATS subject in append-only mode.

:::note

The NATS sink connector in RisingWave provides at-least-once delivery semantics. Events may be redelivered in case of failures.

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
|`server_url`| Required. URLs of the NATS server, in the format of *address*:*port*. If multiple addresses are specified, use commas to separate them.|
|`subject`| Required. NATS subject that you want to sink data to.|
|`connect_mode`|Required. Authentication mode for the connection. Allowed values: `plain`: No authentication; `user_and_password`: Use user name and password for authentication. For this option, `username` and `password` must be specified; `credential`: Use JSON Web Token (JWT) and NKeys for authentication. For this option, `jwt` and `nkey` must be specified.  |
|`jwt` and `nkey`|JWT and NKEY for authentication. For details, see [JWT](https://docs.nats.io/running-a-nats-service/configuration/securing_nats/auth_intro/jwt) and [NKeys](https://docs.nats.io/running-a-nats-service/configuration/securing_nats/auth_intro/nkey_auth).|
|`username` and `password`| Conditional. The client user name and pasword. Required when `connect_mode` is `user_and_password`.|
|`type`|Required. Sink data type. Its value should be append-only.|
