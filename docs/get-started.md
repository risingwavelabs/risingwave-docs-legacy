---
id: get-started
title: Quickstart
description: Get started with RisingWave.
slug: /get-started
toc_max_heading_level: 2
---

This guide will help you get started with RisingWave.

1. [**Run RisingWave**](#run-risingwave) — Install, start, and connect to RisingWave.

1. [**Ingest data**](#ingest-data) — Connect a streaming data source to RisingWave.

2. [**Process data**](#process-data) — Use Postgres-compatible SQL to process data.

3. [**Deliver data**](#deliver-data) — Send processed data to external data destinations.

## Run RisingWave

Select whether you would like to use RisingWave for trial or production purposes.

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

<Tabs queryString="method">

<TabItem value="trial" label="Trial">

Select an installation or running method.

<Tabs queryString="method">

<TabItem value="overview" label="Overview">

RisingWave offers two running modes and several installation or running options. See the table below for comparisons.

|Comparison \ Mode|Playground mode|Full-featured mode|
|---|---|---|
|**Purpose**|Quick tests|Advanced tests|
|**Starts in**|A single-node instance|A full-featured, multi-node cluster|
|**Data persistence**|Data is stored solely in memory and will not be persisted after the service is terminated.|Data is persisted in storage.|
|**Choose a method to run RisingWave**|Try out from browser <br /><lightButton text="Playground" doc="get-started?method=playground#run-risingwave" block />Install directly <lightButton text="Homebrew" doc="get-started?method=homebrew#run-risingwave" block /><lightButton text="Binaries" doc="get-started?method=binaries#run-risingwave" block />Run in container <lightButton text="Docker" doc="get-started?method=docker#run-risingwave" block />|Set up a local cluster <lightButton text="Docker Compose" doc="get-started?method=docker-compose#run-risingwave" block />|

</TabItem>

<TabItem value="playground" label="Playground">

### Try out RisingWave from browser

Try out RisingWave without the need for any installation or setup with RisingWave Playground, an interactive web application. You can access RisingWave Playground directly from your browser.

:::caution
RisingWave Playground is intended for quick testing purposes only. Your data will not persist after a session expires. Some functionality may be limited.
:::

<defaultButton text="RisingWave Playground" url="https://playground.risingwave.dev" block/>

<br/>

<img
  src={require('./images/playground-overview.png').default}
  alt="RisingWave Playground Overview"
  width="800px"
/>

</TabItem>

<TabItem value="homebrew" label="Homebrew">

### Install RisingWave with Homebrew

Start a RisingWave standalone instance in your local environment with Homebrew.

:::caution
This method starts RisingWave in playground mode, where data is temporarily stored in memory. The service automatically terminates after 30 minutes of inactivity, causing all data to be lost.
To persist your data, start RisingWave with [Docker Compose](get-started.md?method=docker-compose#run-risingwave) or use Kubernetes or RisingWave Cloud for [production](get-started.md?method=production#run-risingwave).
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

</TabItem>

<TabItem value="binaries" label="Binaries">

### Install RisingWave from the binaries

Start a RisingWave standalone instance in your local environment with the pre-built binary.

:::caution
This method starts RisingWave in playground mode, where data is temporarily stored in memory. The service automatically terminates after 30 minutes of inactivity, causing all data to be lost.
To persist your data, start RisingWave with [Docker Compose](get-started.md?method=docker-compose#run-risingwave) or use Kubernetes or RisingWave Cloud for [production](get-started.md?method=production#run-risingwave).
:::

1. ### Download the binaries

  Replace `<version>` with actual version name. For example, `v0.19.0`.

  ```shell
  wget https://github.com/risingwavelabs/risingwave/releases/download/<version>/risingwave-<version>-x86_64-unknown-linux.tar.gz
  ```

  > You can find previous binary releases in [Release notes](/release-notes.md).

1. ### Extract the tarball

  Replace `<version>` with actual version name.

  ```shell
  tar xvf risingwave-<version>-x86_64-unknown-linux.tar.gz
  ```

1. ### Start RisingWave

  ```shell
  ./risingwave playground
  ```

  If you see the logs, you have successfully started RisingWave.

  <img
    src={require('./images/risedev_playground_logs.png').default}
    alt="RisingWave Playground Logs"
    width="800px"
  />

1. ### Connect to RisingWave

  After RisingWave is up and running, you need to connect to it via the Postgres interactive terminal `psql` so that you can issue queries to RisingWave and see the query results. If you don't have `psql` installed, [Install `psql`](/guides/install-psql-without-full-postgres.md) first.

  Open a new terminal window and run:

  ```shell
  psql -h localhost -p 4566 -d dev -U root
  ```

1. ### Optional: Enable the connector node

  The RisingWave connector node is a separate Java component that allows RisingWave to be integrated with external systems. It can be used to consume CDC events and sink data to downstream databases.

  To enable the connector node:

    1. Navigate to where your `risingwave` directory is located and run `./risedev configure`.

    1. Enable the **[Build] Build RisingWave Connector (Java)** option.

    1. Uncomment `use connector-node` in the risedev.yml file like below.

    <img
    src={require('./images/uncomment-connector-node.png').default}
    alt="Edit risedev.yml file for connector node"
    />

  The connector node will now be enabled when you run RisingWave.

</TabItem>

<TabItem value="docker" label="Docker">

### Run RisingWave in Docker

Pull a RisingWave image and run it as a Docker container.

:::caution
This method starts RisingWave in playground mode, where data is temporarily stored in memory. The service automatically terminates after 30 minutes of inactivity, causing all data to be lost.
To persist your data, start RisingWave with [Docker Compose](get-started.md?method=docker-compose#run-risingwave) or use Kubernetes or RisingWave Cloud for [production](get-started.md?method=production#run-risingwave).
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
    src={require('./images/risedev_docker_image_logs.png').default}
    alt="RisingWave Docker Logs"
    width="800px"
  />

1. ### Connect to RisingWave

  After RisingWave is up and running, you need to connect to it via the Postgres interactive terminal `psql` so that you can issue queries to RisingWave and see the query results. If you don't have `psql` installed, [Install `psql`](/guides/install-psql-without-full-postgres.md) first.

  Open a new terminal window and run:

  ```shell
  psql -h localhost -p 4566 -d dev -U root
  ```

</TabItem>

<TabItem value="docker-compose" label="Docker Compose">

### Set up a local RisingWave cluster with Docker Compose

Use the pre-defined Docker Compose configuration file to set up a multi-node RisingWave cluster.

:::info

If you intend to deploy RisingWave in production environments, please use RisingWave Cloud or the Kubernetes Operator for RisingWave. This is because it has better support for resource management and we conduct comprehensive tests for it. See details in [Production](get-started.md/?method=production#run-risingwave).
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
* MinIO
* Prometheus

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

1. ### Manage your RisingWave cluster

  When the cluster is running, you can monitor the status of RisingWave and the additional components and make adjustments when necessary.

* **RisingWave Dashboard**

 Access the RisingWave Dashboard at [http://127.0.0.1:5691/](http://127.0.0.1:5691/). RisingWave Dashboard displays an overview of the cluster, as well as sources, sinks, tables, materialized views, and indexes available on the cluster.

* **Grafana**

 Access Grafana at [http://127.0.0.1:3001/](http://127.0.0.1:3001/), and search for `risingwave_dashboard`. In this dashboard, you can view the internal metrics such as node count, memory consumption, thoroughputs, and latencies. You can use these metrics to troubleshoot and optimize the cluster performance.

* **MinIO**

 Access the MinIO instance at [http://127.0.0.1:9400/](http://127.0.0.1:9400/). Use the following credentials to log in.

   * User name: `hummockadmin`

   * Password: `hummockadmin`

* **Prometheus**

 Access Prometheus at [http://127.0.0.1:9500/](http://127.0.0.1:9500/). No credentials are needed. You can use Prometheus for real-time alerting.

</TabItem>

</Tabs>

</TabItem>

<TabItem value="production" label="Production">

Select between using RisingWave Cloud for fully-managed clusters or self-hosting with Kubernetes.

<Tabs queryString="method">

<TabItem value="cloud" label="RisingWave Cloud">

Experience intuitive and effortless stream processing with RisingWave Cloud. Sign up now and get a free, fully managed cluster up and running with a few clicks.

<defaultButton text="Sign up for RisingWave Cloud" url="https://risingwave.cloud/auth/signup/"/><lightButton text="Quickstart" cloud="quickstart"/><lightButton text="FAQ" cloud="faq"/><lightButton text="Learn more" cloud="intro"/>

<br/>
<br/>

<img
  src={require('./images/cloud-overview.png').default}
  alt="RisingWave Cloud Overview"
/>

</TabItem>

<TabItem value="kubernetes" label="Kubernetes">

Refer the article below to use the [Kubernetes Operator for RisingWave](https://github.com/risingwavelabs/risingwave-operator) to deploy a RisingWave cluster in Kubernetes.

<card
 maxWidth="300px"
 title="Set up a RisingWave cluster in Kubernetes"
 content="Deploy RisingWave in a Kubernetes cluster with the Kubernetes Operator for RisingWave."
 doc="risingwave-kubernetes"
/>

</TabItem>

</Tabs>

</TabItem>

</Tabs>

## Ingest data

RisingWave is now ready to ingest and process your data from streaming sources. You can connect RisingWave to databases, message brokers, and other data sources to ingest data in various formats. See [Supported sources and formats](/sql/commands/sql-create-source.md#supported-sources) for a complete list of supported sources and formats.

For example, here is an example `CREATE SOURCE` SQL statement to connect RisingWave to a Kafka topic:

```sql
-- Create a source that reads JSON data from the user_behaviors topic of a Kafka broker, starting from the earliest available offset.
CREATE SOURCE user_behaviors (  
    -- Define source columns     
    user_id VARCHAR,          
    target_id VARCHAR,        
    target_type VARCHAR,      
    event_timestamp TIMESTAMPTZ,   
    behavior_type VARCHAR,      
    parent_target_type VARCHAR,   
    parent_target_id VARCHAR  
) WITH (            
    connector = 'kafka', -- Connect to Kafka
    topic = 'user_behaviors', -- Specify the topic name
    properties.bootstrap.server = 'message_queue:29092', -- Specify Kafka broker address     
    scan.startup.mode = 'earliest' -- Configure the offset mode for consuming data
)  
ROW FORMAT JSON; -- Define data format
```

<card
 maxWidth="300px"
 title="Sources — Data ingestion"
 content="Learn more about source creation, data ingestion, data persistence for sources, supported external sources, and SQL syntax and connector settings for each source."
 doc="data-ingestion"
/>

## Process data

Creating a source in RisingWave does not immediately trigger data ingestion. Data ingestion and processing begins when a materialized view is created based on the source. In RisingWave, the result of a materialized view is updated when a relevant event arrives in the system. When you query the result, it is returned instantly as the computation has already been completed when the data comes in.

Let's create a materialized view that counts the number of targets for each distinct `target_id` present in the `user_behaviors` source using the [`CREATE MATERIALIZED VIEW`](/sql/commands/sql-create-mv.md) command.

```sql
CREATE MATERIALIZED VIEW target_count AS
SELECT
    target_id,
    COUNT(*) AS target_count
FROM
    user_behaviors
GROUP BY
    target_id;
```

Now, RisingWave will:

* Compute the results of the materialized view based on the data flowing into the `user_behaviors` source.
* Store the results in the materialized view.
* Refresh the materialized view with up-to-date count of targets for each `target_id` as new data arrives, and thus can instantly provide the latest result when you query the materialized view.

The following content covers what you can do with RisingWave to process your data, along with its unique features for stream processing.

<grid
 container
 direction="row"
 spacing="15"
 justifyContent="space-between"
 justifyItems="stretch"
 alignItems="stretch">

<grid item xs={12} sm={6} md={4}>

 <card
 style={{height: "87%"}}
 title="RisingWave SQL 101"
 content="A simple yet typical data processing guide for RisingWave first-timers."
 doc="risingwave-sql-101"
 />

</grid>

<grid item xs={12} sm={6} md={4}>

 <card
 style={{height: "87%"}}
 title="Demos"
 content="A series of guided tours in solving real-world stream processing tasks with simulated data."
 doc="demos"
 />
  
</grid>

<grid item xs={12} sm={6} md={4}>

<card
 style={{height: "87%"}}
 title="SQL references"
 content="RisingWave SQL functionality and syntax. Commands, functions, operators, patterns, and more."
 doc="sql-references"
 />
  
</grid>

</grid>

## Deliver data

Finally, you can output the processed data to an external data destination acting as a data sink using the [CREATE SINK](sql/commands/sql-create-sink.md) command.

Let's sink data from the `target_count` materialized view to the target table in PostgreSQL using the JDBC connector.

```sql
-- Create an upsert sink to a PostgreSQL table from the materialized view.
CREATE SINK target_count_postgres_sink  
FROM target_count 
WITH (           
   connector = 'jdbc', -- Use the JDBC connector
   jdbc.url = 'jdbc:postgresql://postgres:5432/mydb?user=myuser&password=123456', -- The JDBC URL of the PostgreSQL database  
   table.name = 'target_count', -- The target table name
   type = 'upsert' -- Sink data as a changelog stream 
);
```

<card
 maxWidth="300px"
 title="Sinks — Data delivery"
 content="Learn more about sink creation, data delivery, available sink connectors, and SQL syntax and connector settings for each sink connector."
 doc="data-delivery"
/>
