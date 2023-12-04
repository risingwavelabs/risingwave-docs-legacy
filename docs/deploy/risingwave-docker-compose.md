---
id: risingwave-docker-compose
title: Start RisingWave in standalone mode using Docker Compose
description: Start a RisingWave cluster in standalone mode using Docker Compose.
slug: /risingwave-docker-compose
---
<head>
  <link rel="canonical" href="https://docs.risingwave.com/docs/current/risingwave-docker-compose/" />
</head>

This topic describes how to start RisingWave in standalone mode using Docker Compose. With this option, data is persisted in storage, and observability is enabled for enhanced monitoring and analysis.

In standalone mode, RisingWave functions as an all-in-one service. All components of RisingWave, including the compute node, frontend node, meta node, and compactor node, are put into a single process. They are executed in different threads, eliminating the need to start each component as a separate process. You can also start a multi-node RisingWave cluster with your own storage service using Docker Compose for more flexibility. See details in [Start RisingWave in distributed mode using Docker Compose](/deploy/risingwave-docker-compose-distributed.md).

However, please be aware that certain critical features, such as failover and resource management, are not implemented in this mode. Therefore, this option is not recommended for production deployments. For production deployments, please consider [RisingWave Cloud](/deploy/risingwave-cloud.md), [Kubernetes with Helm](/deploy/deploy-k8s-helm.md), or [Kubernetes with Operator](/deploy/risingwave-kubernetes.md).

This option uses a pre-defined Docker Compose configuration file to set up a single-node RisingWave cluster.

The cluster also incorporates these third-party components:

- Grafana
- Etcd
- MinIO
- Prometheus

## Download the source file

As a prerequisite, you need to install [Docker Desktop](https://docs.docker.com/get-docker/) in your environment. Ensure that it is running before launching the cluster.

  Then, clone the [risingwave](https://github.com/risingwavelabs/risingwave) repository.

  ```shell
  git clone https://github.com/risingwavelabs/risingwave.git
  ```

  Open the repository in a terminal and run the following command to navigate to the `docker` directory.
  
  ```shell
  cd docker
  ```

## Start a RisingWave cluster

You can now start a RisingWave cluster. By default, the configuration file uses MinIO as the storage backend of RisingWave.

```shell
docker compose up -d
```

:::tip Command not found?
The default command-line syntax in Compose V2 starts with `docker compose`. See details in the [Docker docs](https://docs.docker.com/compose/migrate/#what-are-the-differences-between-compose-v1-and-compose-v2). 

If you're using Compose V1, use `docker-compose` instead.
:::

## Connect to RisingWave

  After RisingWave is up and running, you need to connect to it via the Postgres interactive terminal `psql` so that you can issue queries to RisingWave and see the query results. If you don't have `psql` installed, [install `psql`](/guides/install-psql-without-full-postgres.md) first.

  ```shell
  psql -h localhost -p 4566 -d dev -U root
  ```

  Notes about the `psql` options:

- The `-h` option is used to specify the hostname or IP address of the PostgreSQL server to connect to.
- The `-p` option is used to specify the port number that the server is listening on.
- The `-d` option is used to specify the name of the database to connect to.
- The `-U` option is used to specify the name of the database user to connect as.
- By default, the PostgreSQL server uses the `root` user account to authenticate connections to the `dev` database. Note that this user account does not require a password to connect.

## Manage your RisingWave cluster

  When the cluster is running, you can monitor the status of RisingWave and the additional components and make adjustments when necessary.

- **RisingWave Dashboard**

 Access the RisingWave Dashboard at [http://127.0.0.1:5691/](http://127.0.0.1:5691/). RisingWave Dashboard displays an overview of the cluster, as well as sources, sinks, tables, materialized views, and indexes available on the cluster.

- **Grafana**

 Access Grafana at [http://127.0.0.1:3001/](http://127.0.0.1:3001/) and search for `risingwave_dashboard`. In this dashboard, you can view the internal metrics such as node count, memory consumption, throughput, and latencies. You can use these metrics to troubleshoot and optimize the cluster performance.

- **MinIO**

 Access the MinIO instance at [http://127.0.0.1:9400/](http://127.0.0.1:9400/). Use the following credentials to log in.

  - User name: `hummockadmin`

  - Password: `hummockadmin`

- **Prometheus**

 Access Prometheus at [http://127.0.0.1:9500/](http://127.0.0.1:9500/). No credentials are needed. You can use Prometheus for real-time alerting.

## Common Issues
One of the common issues you may encounter is insufficient storage space. For example:

```
Error { code: "XMinioStorageFull", message: "Storage backend has reached its minimum free drive threshold. Please delete a few objects to proceed."
```

This issue typically occurs on macOS when using Docker Desktop. Docker Desktop runs within the macOS Hypervisor, where all the data, including logs, images, and volumes, is stored. The macOS Hypervisor has a default limit on disk capacity. If you encounter this error, you can resolve it by cleaning up unused containers or images. Another option is to increase the disk image size limit by following these steps: Click on the Docker Desktop icon in the menu bar, then go to **Preferences** > **Resources** > **Advanced**, and adjust the slider for disk image size to allocate more space for Docker images. If you are using a different platform, please ensure sufficient space is available on the local disk.
