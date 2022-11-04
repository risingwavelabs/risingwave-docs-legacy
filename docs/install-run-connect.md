---
id: install-run-connect
title: Install, run, and connect to RisingWave
description: Install, run, and connect to RisingWave.
slug: /install-run-connect
---

## Step 1. Install and run RisingWave

RisingWave offers two modes for different testing purposes:

|Comparison \ Mode|Playground mode|Full-featured mode|
|---|---|---|
|**Purpose**|Temporary tests|Advanced tests and demos|
|**Starts in**|A single-node instance|A full-featured, multi-node cluster|
|**Persistence**|Data is stored solely in memory and will not be persisted after the service is terminated.|Data is persisted in storage.|
|**Auto Termination**|Service is automatically terminated after 30 minutes of inactivity.|No automatic termination.|

Select a mode that suits your need:

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

<Tabs>
<TabItem value="playground_mode" label="Playground mode" default>

Select one of the following ways to install and run RisingWave in playground mode:


<details>
  <summary>Use the pre-built library (Linux)</summary>

1. Download the pre-built library.

    ```shell
    wget https://github.com/risingwavelabs/risingwave/releases/download/v0.1.13/risingwave-v0.1.13-x86_64-unknown-linux.tar.gz
    ```
        

2. Unzip the library.

    ```shell
    tar xvf risingwave-v0.1.13-x86_64-unknown-linux.tar.gz
    ```
  
3. Run RisingWave in playground mode.

    ```shell
    ./risingwave playground
    ```
 
</details>

<details>
  <summary>Install and run from a Docker image (Linux & macOS)</summary>
  
  As prerequisites, you need to install and run [Docker Desktop](https://docs.docker.com/get-docker/) in your environment.
  
  Start RisingWave in single-binary playground mode:
    
```shell
docker run -it --pull=always -p 4566:4566 -p 5691:5691 risingwavelabs/risingwave:latest playground
```
    
</details>

<details>
  <summary>Build from source (Linux & macOS)</summary>

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
    
</details>

</TabItem>

<TabItem value="full_featured_mode" label="Full-featured mode">

<details>
  <summary>Set up a multi-node cluster via Docker (Linux & macOS)</summary>

You can set up a full-featured RisingWave cluster via Docker Desktop. The cluster is composed of multiple RisingWave components, including:

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


As prerequisites, you need to install [Docker Desktop](https://docs.docker.com/get-docker/) in your environment. Ensure that it is running before launching the cluster.

Then, clone the [risingwave-demo](https://github.com/risingwavelabs/risingwave-demo) repository.

```shell
git clone https://github.com/risingwavelabs/risingwave-demo.git
```

Now navigate to the `docker` directory and start the cluster from the docker-compose file.

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
    
</details>

</TabItem>
</Tabs>




## Step 2. Connect to RisingWave

After RisingWave is up and running, you can connect to it via the Postgres interactive terminal `psql`.

```sh
psql -h localhost -p 4566 -d dev -U root
```
    
You can now [connect a streaming source to RisingWave](sql/commands/sql-create-source.md) and [issue SQL queries to manage your data](query-manage-data.md).

