---
id: risingwave-docker-compose
title: Start RisingWave using Docker Compose
description: Start a RisingWave cluster using Docker Compose.
slug: /risingwave-docker-compose
---
<head>
  <link rel="canonical" href="https://docs.risingwave.com/docs/current/risingwave-docker-compose/" />
</head>

This topic describes how to start RisingWave using Docker Compose on a single machine. With this option, data is persisted in your preferred storage service, and observability is enabled for enhanced monitoring and analysis.

In this option, RisingWave functions as an all-in-one service. All components of RisingWave, including the compute node, meta node, and compactor node, are put into a single process. They are executed in different threads, eliminating the need to start each component as a separate process.

However, please be aware that certain critical features, such as failover and resource management, are not implemented in this mode. Therefore, this option is not recommended for production deployments. For production deployments, please consider [RisingWave Cloud](/deploy/risingwave-cloud.md), [Kubernetes with Helm](/deploy/deploy-k8s-helm.md), or [Kubernetes with Operator](/deploy/risingwave-kubernetes.md).

This option uses a pre-defined Docker Compose configuration file to set up a RisingWave cluster.

The cluster also incorporates these third-party components:

- Grafana
- Etcd/PostgreSQL/MySQL
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

## Customize your cluster configuration

You can customize your RisingWave deployment configuration by changing the options for the state store and meta store.

### Customize state store

For state store, RisingWave supports using these systems or services, and for each of the options, we have a [Docker Compose configuration file](https://github.com/risingwavelabs/risingwave/tree/main/docker) that you can use after the necessary configurations.

- [MinIO](#minio)
- [S3 or S3-compatible storage](#s3-or-s3-compatible-storage)
- [Google Cloud Storage, Alibaba Cloud OSS, or Azure Blob Storage](#google-cloud-storage-alibaba-cloud-oss-or-azure-blob-storage)
- [HDFS](#hdfs)
- [Huawei Cloud OBS](#huawei-cloud-obs)

#### MinIO

This is the default option. To start a standalone RisingWave cluster with MinIO as the state store, run the following command:

```shell
docker compose up -d
```

:::tip Command not found?
The default command-line syntax in Compose V2 starts with `docker compose`. See details in the [Docker docs](https://docs.docker.com/compose/migrate/#what-are-the-differences-between-compose-v1-and-compose-v2). 

If you're using Compose V1, use `docker-compose` instead.
:::

<details>
<summary>I'd like to start RisingWave components separately in a multi-node cluster.</summary>

You can also start a multi-node cluster where all components of RisingWave, including the compute node, meta node, and compactor node, are started as separate processes.

By default, this mode uses MinIO as the state store of RisingWave.

To start a multi-node RisingWave cluster with MinIO as the state store, run the following command:

```shell
docker compose -f docker-compose-distributed.yml up
```
</details>

#### S3 or S3-compatible storage

To use S3 as the state store, configure your AWS credential information in `/docker/aws.env`.

To use S3-compatible storage options like Tencent Cloud COS, you need to configure the endpoint via the `RW_S3_ENDPOINT` parameter in `/docker/aws.env`. Don't include the bucket name in the endpoint.

In `docker-compose-with-s3.yml`, specify the bucket name via the `hummock+s3` parameter.

```bash
- "hummock+s3://<bucket-name>"
```

#### Google Cloud Storage, Alibaba Cloud OSS, or Azure Blob Storage

Configure the credentials for the cloud service you want to use in `/docker/multiple_object_storage.env`.

In the corresponding `docker-compose-with-service_name.yml` file (for example, `docker-compose-with-gcs.yml` for Google Cloud Storage), specify the bucket name via the `hummock+<service_name>` parameter.

```bash
 - "hummock+<service_name>://<bucket-name>"
```

#### HDFS

Mount your `HADOOP_HOME` in the compactor node, computer node, and meta node volumes.

In `/docker-compose-with-hdfs.yml`, specify the cluster name via the `hummock+hdfs` parameter.

```bash
- "hummock+hdfs://<cluster_name>"
```

#### Huawei Cloud OBS

To use Huawei Cloud OBS as the state store, you need to configure your OBS credential information in the `multiple_object_storage.env` file. Uncomment and set the following environment variables: `OBS_ENDPOINT`, `OBS_ACCESS_KEY_ID`, and `OBS_SECRET_ACCESS_KEY`. Don't include the bucket name in the endpoint.

In the `docker-compose-with-obs.yml` file, specify the bucket name via the `hummock+obs` parameter. Replace `<bucket-name>` with the name of your OBS bucket.

```bash
--state-store hummock+obs://<bucket-name>
```

### Customize meta store

For meta store, RisingWave uses [`postgresql`](#postgresql) as the default meta store backend and also supports the following meta store backends:

- [SQLite](#sqlite)
- [MySQL or MySQL-compatible storage](#mysql-or-mysql-compatible-storage)
- [etcd](#etcd)

To customize the meta store backend (except for `etcd`), you need to configure the following settings.

- `--backend`: The meta store backend you want to use.

- `--sql-endpoint`: The target SQL backend endpoint.

- Some parameters that required for specified backends.

You can read the specified guide for setting each backend below for more details.

:::note
In future releases, we may no longer support `etcd` as the meta store backend, so please consider using alternative options to ensure compatibility and continued support.
:::

#### PostgreSQL

For PostgreSQL, the specified setting is:

- `--backend` should be set to `postgres`. 
- `--sql-endpoint` should be configured in format `{host}:{port}`.
- Three additional parameters are required:
  - `--sql-username`: Username of SQL backend.
  - `--sql-password`: Password of SQL backend.
  - `--sql-database`: Database of SQL backend.

#### SQLite

For SQLite, the specified setting is:

- `--backend` should be set to `sqlite`. 
- `--sql-endpoint` should be the file path.

We have a Docker Compose configuration file that you can use after the necessary configurations: [`docker-compose-with-sqlite.yml`](https://github.com/risingwavelabs/risingwave/blob/main/docker/docker-compose-with-sqlite.yml). In this file, meta will mount a volume for SQLite db file, which means the SQLite meta storage backend requires singleton meta component.


#### MySQL or MySQL-compatible storage

For MySQL or MySQL-compatible storage, the specified setting is:

- `--backend` should be set to `mysql`. 
- `--sql-endpoint` should be configured in format `{host}:{port}`. In [`docker-compose-with-sqlite.yml`](https://github.com/risingwavelabs/risingwave/blob/main/docker/docker-compose-with-sqlite.yml), specify the storage backend via `mysql` parameter.

    ```bash
    --sql-endpoint mysql://<user>:<password>@<host>:<port>/<db>
    ```

- Three additional parameters are required:
  - `--sql-username`: Username of SQL backend.
  - `--sql-password`: Password of SQL backend.
  - `--sql-database`: Database of SQL backend.

#### etcd

In [`docker-compose-etcd.yml`](https://github.com/risingwavelabs/risingwave/blob/main/docker/docker-compose-etcd.yml), specify the storage backend via `etcd` parameter.

```bash
--etcd-endpoints etcd://<user>:<password>@<host>:<port>/<db>
```

## Start a RisingWave cluster

You can now run the following command to start a RisingWave cluster:

```shell
docker compose -f docker-compose-with-storage_backend_name.yml up
```

Remember to replace the `docker-compose-with-storage_backend_name.yml` with the full file name of the corresponding configuration file.

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

## Common issues
One of the common issues you may encounter is insufficient storage space. For example:

```
Error { code: "XMinioStorageFull", message: "Storage backend has reached its minimum free drive threshold. Please delete a few objects to proceed."
```

This issue typically occurs on macOS when using Docker Desktop. Docker Desktop runs within the macOS Hypervisor, where all the data, including logs, images, and volumes, is stored. The macOS Hypervisor has a default limit on disk capacity. If you encounter this error, you can resolve it by cleaning up unused containers or images. Another option is to increase the disk image size limit by following these steps: Click on the Docker Desktop icon in the menu bar, then go to **Preferences** > **Resources** > **Advanced**, and adjust the slider for disk image size to allocate more space for Docker images. If you are using a different platform, please ensure sufficient space is available on the local disk.
