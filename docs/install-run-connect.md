---
id: install-run-connect
title: Install, run, and connect to RisingWave
description: Install, run, and connect to RisingWave.
slug: /install-run-connect
---

## Step 1. Install and run RisingWave

You can install and run RisingWave in one of these ways:


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
  
3. Run RisingWave.

    ```shell
    ./risingwave playground
    ```

    RisingWave is now started.
 
</details>

<details>
  <summary>Install and run from a Docker image (Linux & macOS)</summary>

  You can install and run RisingWave from a Docker image on x86_64 systems. Images for ARM64 systems (including macOS devices with an Apple M1 chip) might be available for testing purpose, but it is not guaranteed.
  
  As prerequisites, you need to install [Docker Desktop](https://docs.docker.com/get-docker/) in your environment.
  
  Start RisingWave in single-binary playground mode:
    
```shell
docker run -it --pull=always -p 4566:4566 -p 5691:5691 ghcr.io/risingwavelabs/risingwave:v0.1.13 playground
```
    
</details>

<details>
  <summary>Set up a multi-node cluster via Docker (Linux & macOS)</summary>

You can set up a full-featured RisingWave cluster via Docker Desktop. The cluster is composed of multiple RisingWave components, including:

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

<details>
  <summary>Build from source (Linux & macOS)</summary>

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
    
</details>


## Step 2. Connect to RisingWave

After RisingWave is up and running, you can connect to it via the Postgres interactive terminal `psql`.

```sh
psql -h localhost -p 4566 -d dev -U root
```
    
You can now [connect a streaming source to RisingWave](sql/commands/sql-create-source.md) and [issue SQL queries to manage your data](query-manage-data.md).


