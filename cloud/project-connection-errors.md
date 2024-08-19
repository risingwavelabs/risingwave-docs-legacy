---
id: project-connection-errors
title: Connection errors
description: Troubleshoot connection errors in RisingWave Cloud.
slug: /connection-errors
---
This topic summarizes the connection errors that you may encounter when using RisingWave Cloud and their corresponding solutions.

## Failed to get tenant identifier

To connect to a project, you need to provide the tenant identifier. The tenant identifier is a global unique identifier for each project, and the format of the tenant identifier is `rwc-g1huxxxxxx-mycluster`. You can find the tenant identifier in the RisingWave Cloud console.

Below are 3 ways to put the tenant identifier in the connection string.

### Solution 1: Put the tenant identifier in the `options` field

```shell
psql "postgresql://<username>:@<hostname>:<port>/<database?options=--tenant%3D<tenant identifier>"
```

`%3D` is the URL encoded form of `=`. If the client does not require URL encoding, you can use `--tenant=<tenant identifier>` directly.

:::note
Not all clients support the `options` field. If your client does not support the `options` field, you can use solution 2 or 3.
:::

### Solution 2: Put the tenant identifier in the host

You can put the tenant identifier in the host in the format of `<tenant identifier>.<hostname>`.
This solution is only available when the client supports SNI routing and the connection is secured by TLS. 

```shell
psql "postgresql://<username>:@<tenant identifier>.<hostname>:<port>/<database?sslmode=verify-full"
```

:::note
Not all clients support SNI routing. If your client does not support SNI routing, you can use solution 1 or 3.
:::

### Solution 3: Put the tenant identifier in the username

You can also put the tenant identifier in the username in the format of `<tenant identifier>;<username>`. This solution is available for all clients. 

```shell
psql "postgresql://<tenant identifier>;<username>:@<hostname>:<port>/<database?sslmode=verify-full"
```

:::note
The server will use `AuthenticationCleartextPassword` response to authenticate the user. Learn more about the protocol in the [PostgreSQL documentation](https://www.postgresql.org/docs/current/protocol-flow.html).
:::

## The tenant identifier is not specified

This error occurs when your Postgres client doesn't support Server Name Indication (SNI), so it can't automatically send the tenant identifier needed to route your request correctly.

RisingWave Cloud has tested the following drivers for SNI support:

| Driver               | Language | SNI support | Note                                      |
|----------------------|----------|-------------|--------------------------------------------|
| psycopg2                |   Python     | ✓            |    Requires the `'sslmode': 'require'` option                                        |
| asyncpg             | Python   | ✓           | Requires the `'sslmode': 'verify-full'` option |
| SQLAlchemy    | Python       | ✓           | Requires the `'sslmode': 'require'` option |

## SSL error

When you see errors like `SSL error: certificate verify failed`, `root certificate file xxx does not exist`, or `no certificate or crl found`, it means the client cannot verify the certificate of the server. To fix this error, you need to download the root certificate of RisingWave Cloud and put it in the correct location.

### Mac/Linux

```shell
curl -L --create-dirs -o $HOME/.postgresql/root.crt 'https://risingwave.cloud/rootca/root.crt'
```

### Windows

```shell
mkdir -p $env:appdata\postgresql\; Invoke-WebRequest -Uri https://risingwave.cloud/rootca/root.crt
```

## Instance is currently unavailable

This error occurs when the project is not available. You can check the status of the project in the RisingWave Cloud console. If the project is running, you can try to reconnect to the project.
