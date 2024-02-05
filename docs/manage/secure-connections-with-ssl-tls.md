---
id: secure-connections-with-ssl-tls
title: Set up secure connections to RisingWave with SSL/TLS
description: Describes how to set up secure connections to RisingWave with SSL/TLS
slug: /secure-connections-with-ssl-tls
---
RisingWave supports secure connections with TLS/SSL for enhanced client/server communication security.

The terms SSL and TLS are often used interchangeably to mean a secure encrypted connection using a TLS protocol. SSL protocols are the precursors to TLS protocols, and the term SSL is still used for encrypted connections even though SSL protocols are no longer supported. SSL is used interchangeably with TLS in RisingWave.

## Configure SSL in RisingWave

In the frontend node of RisingWavenode, set the environment variables `RW_SSL_CERT` and `RW_SSL_KEY` to specify the paths of the server-side SSL certificate (typically `server.crt`) and private key (typically `server.key`).

## Connect to RisingWave using SSL

To connect to RisingWave using SSL, clients can use the `psql` command with the following parameters:

```bash
psql -p 4566 -d dev -h localhost -U root --set=sslmode=verify-full
```

If the connection is successful, you will see information similar to the following:
```bash
SSL connection (protocol: TLSv1.3, cipher: TLS_AES_256_GCM_SHA384, bits: 256, compression: off)
```

## Optional: Create a self-signed certificate for testing purposes

:::note
While a self-signed certificate is suitable for testing, it is recommended to obtain a certificate from a Certificate Authority (CA) for production environments.
:::

To create a simple self-signed certificate for the server, valid for 365 days, for testing purposes, use the OpenSSL command below. Replace `localhost` with the desired Common Name (CN).

```bash
openssl req -x509 -sha256 -nodes -newkey rsa:2048 -days 365 -keyout localhost.key -out localhost.crt
```
After running the command, you will get two files, `localhost.crt` and `localhost.key`. You can then set the paths of these files as the values for `RW_SSL_CERT` and `RW_SSL_KEY` respectively.