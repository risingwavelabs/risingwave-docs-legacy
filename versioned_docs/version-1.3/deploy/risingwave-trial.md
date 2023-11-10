---
id: risingwave-trial
title: Run RisingWave for testing purposes
description: Install, run, and connect to RisingWave for testing purposes
slug: /risingwave-trial
---
<head>
  <link rel="canonical" href="https://docs.risingwave.com/docs/current/risingwave-trial/" />
</head>

All of the options on this page are for testing purposes. For production deployments, please consider [RisingWave Cloud](/deploy/risingwave-cloud.md), [Kubernetes with Helm](/deploy/deploy-k8s-helm.md), or [Kubernetes with Operator](/deploy/risingwave-kubernetes.md).

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

<Tabs queryString="method">

<TabItem value="overview" label="Overview">

RisingWave offers several installation options. Choose the option that best fits your needs.

<br/>

## Quick tests

RisingWave will be started as a single-node instance. Data is stored solely in memory and will not be persisted after the service is terminated.

These options are available:

<lightButton text="Playground in a Web browser" doc="risingwave-trial?method=playground" />
<lightButton text="Homebrew" doc="risingwave-trial?method=homebrew" />
<lightButton text="Binaries" doc="risingwave-trial?method=binaries" />
<lightButton text="Docker image" doc="risingwave-trial?method=docker" />

<br/>
<br/>

## Advanced tests

For advanced tests, we recommend using Docker Compose to start RisingWave as a multi-node cluster. With this option, data is persisted in storage. However, please be aware that certain critical features such as failover and resource management are not implemented in this mode. Therefore, this option is not recommended for production deployments.

<lightButton text="Docker Compose" doc="risingwave-trial?method=docker-compose" />

</TabItem>

<TabItem value="playground" label="Playground">

### Try out RisingWave from browser

Try out RisingWave without the need for any installation or setup with RisingWave Playground, an interactive web application. You can access RisingWave Playground directly from your browser.

:::caution
RisingWave Playground is intended for quick tests only. Your data will not be persisted after a session expires. This mode has limited memory capacity to maintain overall stability, and resource-intensive operations may lead to out-of-memory (OOM) errors. Some functionality may be limited.
:::

<defaultButton text="RisingWave Playground" url="https://playground.risingwave.dev" block/>

<br/>

<img
  src={require('../images/playground-overview.png').default}
  alt="RisingWave Playground Overview"
  width="800px"
/>

</TabItem>

<TabItem value="homebrew" label="Homebrew">

### Install RisingWave with Homebrew

Start a RisingWave standalone instance in your local environment with Homebrew.

:::caution
This method launches RisingWave in playground mode, where data is stored solely in memory. The service is designed to automatically terminate after 30 minutes of inactivity, and any data stored will be deleted upon termination. This mode has limited memory capacity to maintain overall stability, and resource-intensive operations may result in out-of-memory (OOM) errors. Use this method for quick tests only.

To persist your data, use the [RisingWave Kubernetes Operator](/deploy/risingwave-kubernetes.md) or [RisingWave Cloud](/docs/deploy/risingwave-cloud.md).
:::

1. ### Install and start RisingWave

  Install [Homebrew](https://brew.sh/) and run the following commands.

  ```shell
  brew tap risingwavelabs/risingwave # Tap the repository
  brew install risingwave # Install the latest release of RisingWave. Replace with `brew install risingwave --HEAD` if you want to install the latest development version of RisingWave.
  risingwave playground # Start RisingWave in playground mode
  ```

1. ### Connect to RisingWave

  After RisingWave is up and running, you need to connect to it via the Postgres interactive terminal `psql` so that you can issue queries to RisingWave and see the query results. If you don't have `psql` installed, [Install `psql`](/guides/install-psql-without-full-postgres.md) first.

  Open a new terminal window and run:

  ```shell
  psql -h localhost -p 4566 -d dev -U root
  ```

Notes about the `psql` options:

- The `-h` option is used to specify the host name or IP address of the PostgreSQL server to connect to.
- The `-p` option is used to specify the port number that the server is listening on.
- The `-d` option is used to specify the name of the database to connect to.
- The `-U` option is used to specify the name of the database user to connect as.
- By default, the PostgreSQL server uses the `root user` account to authenticate connections to the `dev` database. Note that this user account does not require a password to connect.

</TabItem>

<TabItem value="binaries" label="Binaries">

### Install RisingWave from the binaries

Start a RisingWave standalone instance in your local environment with the pre-built binary.

:::caution
This method launches RisingWave in playground mode, where data is stored solely in memory. The service is designed to automatically terminate after 30 minutes of inactivity, and any data stored will be deleted upon termination. This mode has limited memory capacity to maintain overall stability, and resource-intensive operations may lead to out-of-memory (OOM) errors. Use this method for quick tests only.

To persist your data, deploy RisingWave to K8s with [the RisingWave Operator](/deploy/risingwave-kubernetes.md) or [Helm](/deploy/deploy-k8s-helm.md), or [Deploy on RisingWave Cloud](/docs/deploy/risingwave-cloud.md).
:::

1. ### Download the binaries

  ```shell
  wget https://github.com/risingwavelabs/risingwave/releases/download/v1.3.0/risingwave-v1.3.0-x86_64-unknown-linux-all-in-one.tar.gz
  ```

  > You can find previous binary releases in [Release notes](/release-notes).

1. ### Extract the tarball

  ```shell
  tar xvf risingwave-v1.3.0-x86_64-unknown-linux-all-in-one.tar.gz
  ```

:::note

Do not move the extracted files or folders. This could cause issues when starting RisingWave.

:::

1. ### Start RisingWave

  ```shell
  CONNECTOR_LIBS_PATH=./libs ./risingwave playground
  ```

  If you see the logs, you have successfully started RisingWave.

  <img
    src={require('../images/risedev_playground_logs.png').default}
    alt="RisingWave Playground Logs"
    width="800px"
  />

1. ### Connect to RisingWave

  After RisingWave is up and running, you need to connect to it via the Postgres interactive terminal `psql` so that you can issue queries to RisingWave and see the query results. If you don't have `psql` installed, [Install `psql`](/guides/install-psql-without-full-postgres.md) first.

  Open a new terminal window and run:

  ```shell
  psql -h localhost -p 4566 -d dev -U root
  ```

  Notes about the `psql` options:

- The `-h` option is used to specify the host name or IP address of the PostgreSQL server to connect to.
- The `-p` option is used to specify the port number that the server is listening on.
- The `-d` option is used to specify the name of the database to connect to.
- The `-U` option is used to specify the name of the database user to connect as.
- By default, the PostgreSQL server uses the `root user` account to authenticate connections to the `dev` database. Note that this user account does not require a password to connect.

1. ### Optional: Enable the connector node

  The RisingWave connector node is a separate Java component that allows RisingWave to be integrated with external systems. It can be used to consume CDC events and sink data to downstream databases.

  To enable the connector node:

    1. Navigate to where your `risingwave` directory is located and run `./risedev configure`.

    1. Enable the **[Build] Build RisingWave Connector (Java)** option.

    1. Uncomment `use connector-node` in the risedev.yml file like below.

    <img
    src={require('../images/uncomment-connector-node.png').default}
    alt="Edit risedev.yml file for connector node"
    />

  The connector node will now be enabled when you run RisingWave.

</TabItem>

<TabItem value="docker" label="Docker">

### Run RisingWave in Docker

Pull a RisingWave image and run it as a Docker container.

:::caution
This method launches RisingWave in playground mode, where data is stored solely in memory. The service is designed to automatically terminate after 30 minutes of inactivity, and any data stored will be deleted upon termination. This mode has limited memory capacity to maintain overall stability, and resource-intensive operations may lead to out-of-memory (OOM) errors. Use this method for quick tests only.

To persist your data, use the [RisingWave Kubernetes Operator](/deploy/risingwave-kubernetes.md) or [RisingWave Cloud](/docs/deploy/risingwave-cloud.md).
:::

1. ### Pull and run RisingWave

  As prerequisites, you need to install and run [Docker Desktop](https://docs.docker.com/get-docker/) in your environment.

  Run the following command to pull and start the latest release of RisingWave in single-binary playground mode.

  ```shell
  docker run -it --pull=always -p 4566:4566 -p 5691:5691 risingwavelabs/risingwave:latest playground
  ```

  :::tip
  You can find the previous releases and nightly builds on [Docker Hub](https://hub.docker.com/r/risingwavelabs/risingwave/tags).<br/>If you want to run a particular version, replace `latest` with the actual version name (for example, `v1.3.0`)
  :::

  If you see the logs, you have successfully started RisingWave.

  <img
    src={require('../images/risedev_docker_image_logs.png').default}
    alt="RisingWave Docker Logs"
    width="800px"
  />

1. ### Connect to RisingWave

  After RisingWave is up and running, you need to connect to it via the Postgres interactive terminal `psql` so that you can issue queries to RisingWave and see the query results. If you don't have `psql` installed, [Install `psql`](/guides/install-psql-without-full-postgres.md) first.

  Open a new terminal window and run:

  ```shell
  psql -h localhost -p 4566 -d dev -U root
  ```

Notes about the `psql` options:

- The `-h` option is used to specify the host name or IP address of the PostgreSQL server to connect to.
- The `-p` option is used to specify the port number that the server is listening on.
- The `-d` option is used to specify the name of the database to connect to.
- The `-U` option is used to specify the name of the database user to connect as.
- By default, the PostgreSQL server uses the `root user` account to authenticate connections to the `dev` database. Note that this user account does not require a password to connect.

</TabItem>

<TabItem value="docker-compose" label="Docker Compose">

### Set up a local RisingWave cluster with Docker Compose

Use the pre-defined Docker Compose configuration file to set up a multi-node RisingWave cluster.

:::caution

Although this option is not in playground mode, it's important to note that certain essential features, such as failover and resource separation, are not implemented on the backend for this option. Additionally, this option relies on etcd, and its performance is highly dependent on disk performance. These factors can result in out-of-memory errors and potential data loss.

If you intend to deploy RisingWave in production environments, please [deploy on RisingWave Cloud](/deploy/risingwave-cloud.md) or deploy to a K8s cluster using [the RisingWave Operator](/deploy/risingwave-kubernetes.md) or [Helm](/deploy/deploy-k8s-helm.md). These options provide better support for resource management, and we have conducted comprehensive tests on them.

Meanwhile, we are developing a new standalone mode that resolves most of these issues. Stay tuned for updates on its availability and functionality.
:::

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

1. ### Download the source file and start a cluster

  As prerequisites, you need to install [Docker Desktop](https://docs.docker.com/get-docker/) in your environment. Ensure that it is running before launching the cluster.

  Then, clone the [risingwave](https://github.com/risingwavelabs/risingwave) repository.

  ```shell
  git clone https://github.com/risingwavelabs/risingwave.git
  ```

  Now run the following commands to navigate to the `docker` directory.
  
  ```shell
  cd docker
  ```

  You can now start a RisingWave cluster. You can use the following storage options as the storage backend of RisingWave:

- MinIO
- S3 or S3-compatible storage
- Google Cloud Storage
- Alicloud OSS
- Azure Blob Storage
- HDFS

For each of the options, we have a Docker Compose configuraion file that you can use after necessary configurations.

#### Start a RisingWave cluster with MinIO

This is the default option. To start a RisingWave cluster with MinIO as the storage backend, run the following command:

```shell
docker compose up -d
```

#### Start a RisingWave cluster with S3 or S3-compatible storage

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

#### Start a RisingWave cluster with Google Cloud Storage, Alibaba Cloud OSS, or Azure Blob Storage

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

#### Start a RisingWave cluster with HDFS

Mount your `HADOOP_HOME` in the volumns of the compactor node, the computer node, and the meta node.

In `/docker-compose-with-hdfs.yml`, specify the cluster name via the `hummock+hdfs` parameter.

```bash
- "hummock+hdfs://<cluster_name>"
```

Run the following command to start a RisingWave cluster:

```shell
docker-compose -f docker-compose-with-hdfs.yml up
```

1. ### Connect to RisingWave

  After RisingWave is up and running, you need to connect to it via the Postgres interactive terminal `psql` so that you can issue queries to RisingWave and see the query results. If you don't have `psql` installed, [Install `psql`](/guides/install-psql-without-full-postgres.md) first.

  ```shell
  psql -h localhost -p 4566 -d dev -U root
  ```

  Notes about the `psql` options:

- The `-h` option is used to specify the host name or IP address of the PostgreSQL server to connect to.
- The `-p` option is used to specify the port number that the server is listening on.
- The `-d` option is used to specify the name of the database to connect to.
- The `-U` option is used to specify the name of the database user to connect as.
- By default, the PostgreSQL server uses the `root user` account to authenticate connections to the `dev` database. Note that this user account does not require a password to connect.

1. ### Manage your RisingWave cluster

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

### Optional: Remove containers and data

If you don't need the RisingWave containers and the associated networks and persisted data, run the following command to delete them:

```shell
docker-compose down -v
```

</TabItem>

</Tabs>
