---
id: risingwave-docker-compose
title: Start RisingWave using Docker Compose
description: Start RisingWave using Docker Compose
slug: /risingwave-docker-compose
---
<head>
  <link rel="canonical" href="https://docs.risingwave.com/docs/current/risingwave-docker-compose/" />
</head>

This topic describes how to start RisingWave as a multi-node cluster. With this option, data is persisted in storage. However, please be aware that certain critical features such as failover and resource management are not implemented in this mode. Therefore, this option is not recommended for production deployments.

For production deployments, please consider [RisingWave Cloud](/deploy/risingwave-cloud.md), [Kubernetes with Helm](/deploy/deploy-k8s-helm.md), or [Kubernetes with Operator](/deploy/risingwave-kubernetes.md).

This option uses a pre-defined Docker Compose configuration file to set up a multi-node RisingWave cluster.

The cluster is composed of multiple RisingWave components, including:

- A frontend node
- A compute node
- A meta node
- A compactor node

RisingWave also incorporates these third-party components:

- Grafana
- Etcd
- MinIO
- Prometheus

## Download the source file and start a cluster

  As prerequisites, you need to install [Docker Desktop](https://docs.docker.com/get-docker/) in your environment. Ensure that it is running before launching the cluster.

  Then, clone the [risingwave](https://github.com/risingwavelabs/risingwave) repository.

  ```shell
  git clone https://github.com/risingwavelabs/risingwave.git
  ```

  Now run the following commands to navigate to the `docker` directory.
  
  ```shell
  cd docker
  ```

## Start a RisingWave cluster

You can now start a RisingWave cluster. You can use the following storage options as the storage backend of RisingWave:

- MinIO
- S3 or S3-compatible storage
- Google Cloud Storage
- Alicloud OSS
- Azure Blob Storage
- HDFS

For each of the options, we have a Docker Compose configuration file that you can use after necessary configurations.

### MinIO

This is the default option. To start a RisingWave cluster with MinIO as the storage backend, run the following command:

```shell
docker compose up -d
```

### S3 or S3-compatible storage

To use S3 as the storage backend, configure your AWS credential information in `/docker/aws.env`.

To use S3-compatible storage options like Tencent Cloud COS, you need to configure the endpoint via the `RW_S3_ENDPOINT` parameter in `/docker/aws.env`. Don't include the bucket name in the endpoint.

In `docker-compose-with-s3.yml`, specify the bucket name via the `hummock+s3` parameter.

```bash
- "hummock+s3://<bucket-name>"
```

Run this command to start the RisingWave cluster:

```shell
docker-compose -f docker-compose-with-s3.yml up
```

### Google Cloud Storage, Alibaba Cloud OSS, or Azure Blob Storage

Configure the credentias for the cloud service you want to use in `/docker/multiple_object_storage.env`.

In the corresponding `docker-compose-with-xxx.yml` file (for example, `docker-compose-with-gcs.yml` for Google Cloud Storage), specify the bucket name via the `hummock+<xxx>` parameter.

```bash
 - "hummock+<xxx>://<bucket-name>"
```

Run the following command to start the RisingWave cluster with one of the cloud storage service that you choose.

```shell
docker-compose -f docker-compose-with-xxx.yml up
```

Remember to replace the `docker-compose-with-xxx.yml` with the full file name of the corresponding configuration file.

### HDFS

Mount your `HADOOP_HOME` in the volumns of the compactor node, the computer node, and the meta node.

In `/docker-compose-with-hdfs.yml`, specify the cluster name via the `hummock+hdfs` parameter.

```bash
- "hummock+hdfs://<cluster_name>"
```

Run the following command to start a RisingWave cluster:

```shell
docker-compose -f docker-compose-with-hdfs.yml up
```

## Connect to RisingWave

  After RisingWave is up and running, you need to connect to it via the Postgres interactive terminal `psql` so that you can issue queries to RisingWave and see the query results. If you don't have `psql` installed, [install `psql`](/guides/install-psql-without-full-postgres.md) first.

  ```shell
  psql -h localhost -p 4566 -d dev -U root
  ```

  Notes about the `psql` options:

- The `-h` option is used to specify the host name or IP address of the PostgreSQL server to connect to.
- The `-p` option is used to specify the port number that the server is listening on.
- The `-d` option is used to specify the name of the database to connect to.
- The `-U` option is used to specify the name of the database user to connect as.
- By default, the PostgreSQL server uses the `root` user account to authenticate connections to the `dev` database. Note that this user account does not require a password to connect.

## Manage your RisingWave cluster

  When the cluster is running, you can monitor the status of RisingWave and the additional components and make adjustments when necessary.

- **RisingWave Dashboard**

 Access the RisingWave Dashboard at [http://127.0.0.1:5691/](http://127.0.0.1:5691/). RisingWave Dashboard displays an overview of the cluster, as well as sources, sinks, tables, materialized views, and indexes available on the cluster.

- **Grafana**

 Access Grafana at [http://127.0.0.1:3001/](http://127.0.0.1:3001/), and search for `risingwave_dashboard`. In this dashboard, you can view the internal metrics such as node count, memory consumption, thoroughputs, and latencies. You can use these metrics to troubleshoot and optimize the cluster performance.

- **MinIO**

 Access the MinIO instance at [http://127.0.0.1:9400/](http://127.0.0.1:9400/). Use the following credentials to log in.

- User name: `hummockadmin`

- Password: `hummockadmin`

- **Prometheus**

 Access Prometheus at [http://127.0.0.1:9500/](http://127.0.0.1:9500/). No credentials are needed. You can use Prometheus for real-time alerting.

## Optional: Remove containers and data

If you don't need the RisingWave containers and the associated networks and persisted data, run the following command to delete them:

```shell
docker-compose down -v
```
