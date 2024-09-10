---
id: risingwave-binaries
title: Install RisingWave from the binaries
description: Install RisingWave from the binaries
slug: /risingwave-binaries
---

<!-- This file is no longer maintained. Please update the content in risingwave-trial.md. -->

This topic describes how to install RisingWave from the binaries.

## Download the binaries

```shell
wget https://github.com/risingwavelabs/risingwave/releases/download/v0.1.19/risingwave-v0.1.19-x86_64-unknown-linux.tar.gz
```

> You can find previous binary releases in [Release notes](/release-notes.md).

## Extract the tarball

```shell
tar xvf risingwave-v0.1.19-x86_64-unknown-linux.tar.gz
```

## Start RisingWave

```shell
./risingwave playground
```

:::caution
This method starts RisingWave in playground mode. In this mode, RisingWave stores data in memory, and automatically terminates after 30 minutes of inactivity. When it terminates, all data will be lost.
If you want your data to be persisted in your local drive or object storage, consider starting RisingWave in Docker Compose or K8S, or using the RisingWave Cloud.
:::

If you see the logs, you have successfully started RisingWave.

![RisingWave Playground Logs](../images/risedev_playground_logs.png)

## Connect to RisingWave

After RisingWave is up and running, you need to connect to it via the Postgres interactive terminal `psql` so that you can issue queries to RisingWave and see the query results.

Open a new terminal window and run:

```shell
psql -h localhost -p 4566 -d dev -U root
```

Now you can ingest and transform streaming data. See [Quick start](/get-started.md) for details.

## Optional: Enable the connector node

The RisingWave connector node is a separate Java component that allows RisingWave to be integrated with external systems. It can be used to consume CDC events and sink data to downstream databases.

To enable the connector node:

1. Navigate to where your `risingwave` directory is located and run `./risedev configure`.

2. Enable the **[Build] Build RisingWave Connector (Java)** option.

3. Uncomment `use connector-node` in the risedev.yml file like below.

    ![Edit risedev.yml file for connector node](../images/uncomment-connector-node.png)

The connector node will now be enabled when you run RisingWave.
