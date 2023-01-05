---
id: risingwave-docker-image
title: Run RisingWave in Docker
description: Pull a RisingWave image from Docker Hub and run it as a Docker container.
slug: /risingwave-docker-image
---

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
> You can find the previous releases and nightly builds on [Docker Hub](https://hub.docker.com/r/risingwavelabs/risingwave/tags).<br/>For example, if you would like to use RisingWave v0.1.13, run:
```shell
docker run -it --pull=always -p 4566:4566 -p 5691:5691 risingwavelabs/risingwave:v0.1.13 playground
```

&nbsp;&nbsp;&nbsp;&nbsp;If you see the logs, you have successfully started RisingWave.

<img src={require('../images/risedev_docker_image_logs.png').default} alt="RisingWave Playground Logs"/>


## Connect to RisingWave

After RisingWave is up and running, you need to connect to it via the Postgres interactive terminal `psql` so that you can issue queries to RisingWave and see the query results.

Open a new terminal window and run:

```shell
psql -h localhost -p 4566 -d dev -U root
```
    
You can now [connect a streaming source to RisingWave](sql/commands/sql-create-source.md) and [issue SQL queries to manage your data](risingwave-sql-101.md).
