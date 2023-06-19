---
id: risingwave-docker-image
title: Run RisingWave in Docker
description: Pull a RisingWave image from Docker Hub and run it as a Docker container.
slug: /risingwave-docker-image
---

<!-- This file is no longer maintained. Please update the content in risingwave-trial.md. -->

This article will help you pull a RisingWave image and run it as a Docker container.

:::caution
This method starts RisingWave in playground mode, where data is not persisted after the service is terminated.<br/>Start RisingWave in full-featured mode for data persistence and stable performance. <br/>[→ See the comparison](/get-started.md#run-risingwave)
:::

## Pull and run RisingWave

As prerequisites, you need to install and run [Docker Desktop](https://docs.docker.com/get-docker/) in your environment.

Run the following command to pull and start the latest release of RisingWave in single-binary playground mode.

```shell
docker run -it --pull=always -p 4566:4566 -p 5691:5691 risingwavelabs/risingwave:latest playground
```

:::tip
You can find the previous releases and nightly builds on [Docker Hub](https://hub.docker.com/r/risingwavelabs/risingwave/tags).<br/>If you want to run a particular version, replace `latest` with the actual version number (for example, `v0.18.0`)
:::

If you see the logs, you have successfully started RisingWave.

<img src={require('../images/risedev_docker_image_logs.png').default} alt="RisingWave Playground Logs"/>

## Connect to RisingWave

After RisingWave is up and running, you need to connect to it via the Postgres interactive terminal `psql` so that you can issue queries to RisingWave and see the query results.

Open a new terminal window and run:

```shell
psql -h localhost -p 4566 -d dev -U root
```

Now you can ingest and transform streaming data. See [Quick start](/get-started.md) for details.
