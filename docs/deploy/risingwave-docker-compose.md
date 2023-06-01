---
id: risingwave-docker-compose
title: Set up a local RisingWave cluster with Docker Compose
description: Describes how to start a multi-node cluster with Docker Compose, and monitor RisingWave and additional components.
slug: /risingwave-docker-compose
---

This article will help you use the pre-defined Docker Compose configuration file to set up a full-featured multi-node RisingWave cluster.

:::note

If you intend to deploy RisingWave in production environments, please use the Kubernetes Operator for RisingWave. This is because it has better support for resource management, and we do comprehensive tests for it. To learn about how to deploy RisingWave using the Kubernetes Operator, see [Kubernetes](risingwave-kubernetes.md).

:::

The cluster is composed of multiple RisingWave components, including:

* A frontend node
* A compute node
* A meta node
* A compactor node
* A connector node

RisingWave also incorporates these third-party components:

* Grafana
* Etcd
* MinIO or other s3 compatible object storage
* Prometheus

## Download the source file and start a cluster

As prerequisites, you need to install [Docker Desktop](https://docs.docker.com/get-docker/) in your environment. Ensure that it is running before launching the cluster.

Then, clone the [risingwave](https://github.com/risingwavelabs/risingwave) repository.

```shell
git clone https://github.com/risingwavelabs/risingwave.git
```

Now run the following commands to navigate to the `docker` directory and start the cluster from the pre-defined docker-compose file.

### Start a cluster on minio
The default storage backend is minio, to start the cluster, 

```shell
cd docker
docker compose up -d
```
### Start a cluster on other s3 compatible object storage

If you want to deploy RisingWave on other s3 compatible storage, fill in your `bucket_name` [here](https://github.com/risingwavelabs/risingwave/blob/c75ad9f5991e6ecaaccde007ad0e68aef8700ef9/docker/docker-compose-s3-compatible.yml#L201), and config the `region`, `endpoint`, `access key` and `secret key` in [risingwave/docker/s3-compatible.env](https://github.com/risingwavelabs/risingwave/blob/main/docker/s3-compatible.env) (note that the `endpoint` cannot contain bucket-name). Then

```shell
cd docker
docker compose -f docker-compose-s3-compatible.yml up -d
```

## Connect to RisingWave

After RisingWave is up and running, you need to connect to it via the Postgres interactive terminal `psql` so that you can issue queries to RisingWave and see the query results.


```shell
psql -h localhost -p 4566 -d dev -U root
```
    
You can now [connect a streaming source to RisingWave](sql/commands/sql-create-source.md) and [issue SQL queries to manage your data](risingwave-sql-101.md).


## Manage your RisingWave cluster

When the cluster is running, you can monitor the status of RisingWave and the additional components and make adjustments when necessary.

### RisingWave Dashboard

Access the RisingWave Dashboard at [http://127.0.0.1:5691/](http://127.0.0.1:5691/). RisingWave Dashboard displays an overview of the cluster, as well as sources, sinks, tables, materialized views, and indexes available on the cluster.

### Grafana

Access Grafana at [http://127.0.0.1:3001/](http://127.0.0.1:3001/), and search for `risingwave_dashboard`. In this dashboard, you can view the internal metrics such as node count, memory consumption, thoroughputs, and latencies. You can use these metrics to troubleshoot and optimize the cluster performance.

### MinIO

Access the MinIO instance at [http://127.0.0.1:9400/](http://127.0.0.1:9400/). Use the following credentials to log in.

- User name: `hummockadmin`
- Password: `hummockadmin`

### Prometheus

Access Prometheus at [http://127.0.0.1:9500/](http://127.0.0.1:9500/). No credentials are needed. You can use Prometheus for real-time alerting.
