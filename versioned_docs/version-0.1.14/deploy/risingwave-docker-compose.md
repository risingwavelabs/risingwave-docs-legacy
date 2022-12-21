---
id: risingwave-docker-compose
title: Set up a local RisingWave cluster in Docker
description: Start a multi-node local RisingWave cluster with Docker Compose.
slug: /risingwave-docker-compose
---

This article will help you use the pre-defined Docker Compose configuration file to set up a full-featured multi-node RisingWave cluster.

The cluster is composed of multiple RisingWave components, including:

* A frontend node
* A compute node
* A meta node
* A compactor node
* A datagen source connector
* A message queue

RisingWave also incorporates these third-party components:

* Grafana
* Etcd
* MinIO
* Prometheus

## Download the source file and start a cluster

As prerequisites, you need to install [Docker Desktop](https://docs.docker.com/get-docker/) in your environment. Ensure that it is running before launching the cluster.

Then, clone the [risingwave-demo](https://github.com/risingwavelabs/risingwave-demo) repository.

```shell
git clone https://github.com/risingwavelabs/risingwave-demo.git
```

Now run the following commands to navigate to the `docker` directory and start the cluster from the pre-defined docker-compose file.

```shell
cd risingwave-demo/docker
docker-compose up -d
```

:::note

If the following error occurs:
```shell
ERROR: The Compose file './docker-compose.yml' is invalid because:
'name' does not match any of the regexes: '^x-'
```
Use `docker compose` instead of `docker-compose`, or enable **Use Docker Compose V2** on the Settings page of Docker Desktop.

For more information, see [Docker Documentation](https://docs.docker.com/compose/#compose-v2-and-the-new-docker-compose-command).

:::

## Connect to RisingWave

After RisingWave is up and running, you need to connect to it via the Postgres interactive terminal `psql` so that you can issue queries to RisingWave and see the query results.


```shell
psql -h localhost -p 4566 -d dev -U root
```
    
You can now [connect a streaming source to RisingWave](sql/commands/sql-create-source.md) and [issue SQL queries to manage your data](risingwave-sql-101.md).
