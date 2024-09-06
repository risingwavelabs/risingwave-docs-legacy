---
id: risingwave-trial
title: Run RisingWave for testing purposes
description: Install, run, and connect to RisingWave for testing purposes
slug: /risingwave-trial
---
<head>
  <link rel="canonical" href="https://docs.risingwave.com/docs/current/risingwave-trial/" />
</head>

<!-- MDX imports -->
import DefaultButton from "@site/src/components/DefaultButton";
import LightButton from "@site/src/components/LightButton";
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

Select an installation or running method.

<Tabs queryString="method">

<TabItem value="overview" label="Overview">

RisingWave offers two running modes and several installation or running options. See the table below for comparisons.

|Comparison \ Mode|Playground mode|Full-featured mode|
|---|---|---|
|**Purpose**|Quick tests|Advanced tests|
|**Starts in**|A single-node instance|A full-featured, multi-node cluster|
|**Data persistence**|Data is stored solely in memory and will not be persisted after the service is terminated.|Data is persisted in storage.|
|**Choose a method to run RisingWave**|Try out from browser <br /><LightButton text="Playground" doc="risingwave-trial?method=playground" block />Install directly <LightButton text="Homebrew" doc="risingwave-trial?method=homebrew" block /><LightButton text="Binaries" doc="risingwave-trial?method=binaries" block />Run in container <LightButton text="Docker" doc="risingwave-trial?method=docker" block />|Set up a local cluster <LightButton text="Docker Compose" doc="risingwave-trial?method=docker-compose" block />|

</TabItem>

<TabItem value="playground" label="Playground">

### Try out RisingWave from browser

Try out RisingWave without the need for any installation or setup with RisingWave Playground, an interactive web application. You can access RisingWave Playground directly from your browser.

:::caution
RisingWave Playground is intended for quick testing purposes only. Your data will not persist after a session expires. Some functionality may be limited.
:::

<DefaultButton text="RisingWave Playground" url="https://playground.risingwave.dev" block/>

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
This method starts RisingWave in playground mode, where data is temporarily stored in memory. The service automatically terminates after 30 minutes of inactivity, causing all data to be lost.
To persist your data, start RisingWave with [Docker Compose](/deploy/risingwave-trial.md?method=docker-compose) or use [Kubernetes Operator](/deploy/risingwave-kubernetes.md) or [RisingWave Cloud](/docs/deploy/risingwave-cloud.md) for production.
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
This method starts RisingWave in playground mode, where data is temporarily stored in memory. The service automatically terminates after 30 minutes of inactivity, causing all data to be lost.
To persist your data, start RisingWave with [Docker Compose](/deploy/risingwave-trial.md?method=docker-compose) or use [Kubernetes Operator](/deploy/risingwave-kubernetes.md) or [RisingWave Cloud](/docs/deploy/risingwave-cloud.md) for production.
:::

1. ### Download the binaries

  ```shell
  wget https://github.com/risingwavelabs/risingwave/releases/download/v1.0.0/risingwave-v1.0.0-x86_64-unknown-linux.tar.gz
  ```

  > You can find previous binary releases in [Release notes](/release-notes.md).

1. ### Extract the tarball

  ```shell
  tar xvf risingwave-v1.0.0-x86_64-unknown-linux.tar.gz
  ```

1. ### Start RisingWave

  ```shell
  ./risingwave playground
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

    ![Edit risedev.yml file for connector node](../images/uncomment-connector-node.png)

  The connector node will now be enabled when you run RisingWave.

</TabItem>

<TabItem value="docker" label="Docker">

### Run RisingWave in Docker

Pull a RisingWave image and run it as a Docker container.

:::caution
This method starts RisingWave in playground mode, where data is temporarily stored in memory. The service automatically terminates after 30 minutes of inactivity, causing all data to be lost.
To persist your data, start RisingWave with [Docker Compose](/deploy/risingwave-trial.md?method=docker-compose) or use [Kubernetes Operator](/deploy/risingwave-kubernetes.md) or [RisingWave Cloud](/docs/deploy/risingwave-cloud.md) for production.
:::

1. ### Pull and run RisingWave

  As prerequisites, you need to install and run [Docker Desktop](https://docs.docker.com/get-docker/) in your environment.

  Run the following command to pull and start the latest release of RisingWave in single-binary playground mode.

  ```shell
  docker run -it --pull=always -p 4566:4566 -p 5691:5691 risingwavelabs/risingwave:latest playground
  ```

  :::tip
  You can find the previous releases and nightly builds on [Docker Hub](https://hub.docker.com/r/risingwavelabs/risingwave/tags).<br/>If you want to run a particular version, replace `latest` with the actual version name (for example, `v0.19.0`)
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

:::info

If you intend to deploy RisingWave in production environments, please use [RisingWave Cloud](/deploy/risingwave-cloud.md) or [the Kubernetes Operator for RisingWave](/deploy/risingwave-kubernetes.md). This is because it has better support for resource management and we conduct comprehensive tests for it.
:::

The cluster is composed of multiple RisingWave components, including:

- A frontend node
- A compute node
- A meta node
- A compactor node
- A connector node

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

  Now run the following commands to navigate to the `docker` directory and start the cluster from the pre-defined docker-compose file.

  ```shell
  cd docker
  docker compose up -d
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

</TabItem>

</Tabs>
