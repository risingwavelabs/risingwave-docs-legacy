---
id: get-started
title: Get started
description: Install and run RisingWave.
slug: /get-started
sidebar_position: 2
---


This guide will help you get started with RisingWave. We will cover: 

- [Install and run RisingWave](#install-and-run-risingwave)
- [Connect to RisingWave](#connect-to-risingwave)
- [Connect to a streaming source](#connect-to-a-streaming-source)
- [Query and manage data](#query-and-manage-data)

## Install and run RisingWave

You can run RisingWave in these ways:

- [Use the pre-built library (Linux)](#use-the-pre-built-library-linux)
- [Install and run from a Docker image (Linux & macOS)](#install-and-run-from-a-docker-image-linux--macos)
- [Set up a multi-node cluster via Docker (Linux & macOS)](#set-up-a-multi-node-cluster-via-docker-linux--macos)
- [Build from the source code (Linux & macOS)](#build-from-source-linux--macos)

### Use the pre-built library (Linux)

1. Download the pre-built library.
 
    ```shell
    wget https://github.com/risingwavelabs/risingwave/releases/download/v0.1.11/risingwave-v0.1.11-x86_64-unknown-linux.tar.gz
    ```

2. Unzip the library.

    ```shell
    tar xvf risingwave-v0.1.11-x86_64-unknown-linux.tar.gz
    ```

3. Run RisingWave.

    ```shell
    ./risingwave playground
    ```
    RisingWave is now started.




### Install and run from a Docker image (Linux & macOS)

You can install and run RisingWave from a Docker image on x86_64 systems. Images for ARM64 systems (including macOS devices with an Apple M1 chip) might be available for testing purpose, but it is not guaranteed.

As prerequisites, you need to install [Docker Desktop](https://docs.docker.com/get-docker/) in your environment.

Start RisingWave in single-binary playground mode:
    
```sh
docker run -it --pull=always -p 4566:4566 -p 5691:5691 ghcr.io/risingwavelabs/risingwave:v0.1.11 playground
```

### Set up a multi-node cluster via Docker (Linux & macOS)

You can set up a full-featured RisingWave cluster via Docker  Desktop. The cluster is composed of multiple RisingWave components, including:

* A frontend node
* A compute node
* A meta node
* A compactor node

RisingWave also incorporates these third-party components:

* Grafana
* Etcd
* MinIO
* Prometheus

Therefore, it will start 8 processes.

As prerequisites, you need to install [Docker Desktop](https://docs.docker.com/get-docker/) in your environment. Ensure that it is running before launching the cluster.

Then, clone the [risingwave-demo](https://github.com/risingwavelabs/risingwave-demo) repository.

```shell
git clone https://github.com/risingwavelabs/risingwave-demo.git
```

Now navigate to the `docker` directory and start the cluster from the docker-compose file.

```shell
cd docker
docker-compose up -d
```

### Build from source (Linux & macOS)

You can build from source on both x86_64 and ARM64 systems (including macOS devices with an Apple M1 chip).

1. Clone the [risingwave](https://github.com/risingwavelabs/risingwave) repository.

    ```shell
    git clone https://github.com/risingwavelabs/risingwave.git
    ```

2. Install dependencies.

    RisingWave has the following dependencies. Please ensure all the dependencies have been installed before running RisingWave.

    * Rust
    * CMake
    * Protocol Buffers
    * OpenSSL
    * PostgreSQL terminal (14.1 or higher)
    * Tmux

    Select your operating system and run the following commands to install the dependencies.

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

<div style={{marginLeft:"2rem"}}>
<Tabs>
<TabItem value="macos" label="macOS" default>


```shell
brew install postgresql cmake protobuf openssl tmux
```
Run one of the following cammands to install [rustup](https://rustup.rs):
```shell
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
```
or
```shell
brew install rustup-init && rustup-init
```
</TabItem>
<TabItem value="linux" label="Linux">

```shell
sudo apt update
sudo apt upgrade
sudo apt install make build-essential cmake protobuf-compiler curl openssl libssl-dev libcurl4-openssl-dev pkg-config postgresql-client tmux lld
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
```

</TabItem>
</Tabs>
</div>

3. Run RisingWave.

    To run RisingWave, in the terminal, navigate to the directory where RisingWave is downloaded, and run the following command.
  
    ```shell
    ./risedev playground
    ```

    All services in RisingWave will be started.



## Connect to RisingWave

After RisingWave is started, you can connect to it via the Postgres interactive terminal `psql`.

```sh
psql -h localhost -p 4566 -d dev -U root
```
    
You can now issue SQL queries to manage your streams and data.



## Connect to a streaming source

For supported streaming sources and sample SQL statements, see [CREATE SOURCE](/sql/commands/sql-create-source.md).

## Query and manage data

RisingWave uses Postgres-compatible SQL as the interface to manage and query data.

Before we start, ensure that you have [connected to RisingWave via `psql`](#connect-to-risingwave). 

Now let us create a table to store data about taxi trips.

```sql
CREATE TABLE taxi_trips(
    id VARCHAR,
    distance DOUBLE PRECISION,
    duration DOUBLE PRECISION
);
```

We want to create a materialized view to dynamically calculate the average speed of all trips.

```sql
CREATE MATERIALIZED VIEW mv_avg_speed
AS
    SELECT COUNT(id) as no_of_trips,
    SUM(distance) as total_distance,
    SUM(duration) as total_duration,
    SUM(distance) / SUM(duration) as avg_speed
    FROM taxi_trips;
```

Now let us add some data to the table.

```sql
INSERT INTO taxi_trips
VALUES
    ('1', 4, 10);
```

We can now query the average speed.

```sql
SELECT * FROM mv_avg_speed;
```

Here is the result we get. 

```sql
 no_of_trips | total_distance | total_duration | avg_speed      
-------------+----------------+----------------+------------
           1 |              4 |             10 | 0.4
```

Now let us add a new record.

```sql
INSERT INTO taxi_trips
VALUES
    ('2', 6, 10);
```

As soon as we insert the new record, the materialized view `mv_avg_speed` will be refreshed to re-calculate the results. Let us see if the results are updated.

```sql
SELECT * FROM mv_avg_speed;
```
Here is the result we get. 
```sql
 no_of_trips | total_distance | total_duration | avg_speed      
-------------+----------------+----------------+------------
           2 |             10 |             20 | 0.5

```

You can see that the results are based on the two rows of data. The calculation is performed automatically behind the scene. No matter how many more rows of data we insert, we can always get the latest results by querying the values of the materialized view.

Creating a materialized view from a source is similar. 

```sql title="To create a materialized view from a source:"
CREATE MATERIALIZED VIEW debezium_json_mysql_mv 
AS 
    SELECT COLUMN1, COLUMN2, COLUMN3 FROM debezium_json_mysql_source;
```

With RisingWave, you can also create a materialized view from an existing materialized view. 

```sql title="To create a materialized view from existing materialized views:"
CREATE MATERIALIZED VIEW m3
AS 
    SELECT m1.v1 as m1v1, m1.v2 as m1v2, m2.v1, m2.v2 
    FROM m1 
    INNER JOIN m2 ON m1.v1 = m2.v1;
```

For the complete list of supported SQL commands, please navigate to SQL reference → Commands. 






