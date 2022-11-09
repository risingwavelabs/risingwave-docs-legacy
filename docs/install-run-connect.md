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
|**Data persistence**|Data is stored solely in memory and will not be persisted after the service is terminated.|Data is persisted in storage.|
|**Auto termination**|Service is automatically terminated after 30 minutes of inactivity.|No automatic termination.|

Select a mode that suits your need:

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

<Tabs>
<TabItem value="playground_mode" label="Playground mode" default>

Select one of the following ways to install and run RisingWave in playground mode:


<details>

<details>
  <summary>Run in Docker (Linux & macOS)</summary>
You can install and run RisingWave from a Docker image.

As prerequisites, you need to install and run [Docker Desktop](https://docs.docker.com/get-docker/) in your environment.

Start RisingWave in single-binary playground mode.

```shell
docker run -it --pull=always -p 4566:4566 -p 5691:5691 risingwavelabs/risingwave:latest playground
```

</details>
  <summary>Run locally with pre-built library (Linux)</summary>

  <Tabs>
  <TabItem value="library" label="Pre-built library (Linux)">

  1. Download the pre-built library.

    ```shell
    wget https://github.com/risingwavelabs/risingwave/releases/download/v0.1.13/risingwave-v0.1.13-x86_64-unknown-linux.tar.gz
    ```
  
  1. Unzip the library.

      ```shell
      tar xvf risingwave-v0.1.13-x86_64-unknown-linux.tar.gz
      ```
  
  1. Start RisingWave in playground mode.

      ```shell
      ./risingwave playground
      ```

  </TabItem>
  <TabItem value="source" label="Build from source (Linux & macOS)">

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

  3. Start RisingWave.

      To start RisingWave, in the terminal, navigate to the directory where RisingWave is downloaded, and run the following command.
    
      ```shell
      ./risedev playground
      ```


  </TabItem>
  </Tabs>
 
</details>

</TabItem>

<TabItem value="full_featured_mode" label="Full-featured mode">

Select one of the following ways to run RisingWave in a full-featured cluster:

<details>
  <summary>Run in Docker (Linux & macOS)</summary>

  You can set up a full-featured multi-node RisingWave cluster via Docker Desktop.

  See detailed instructions in [Set up a local RisingWave cluster in Docker](/deploy/risingwave-in-docker.md).

</details>

<details>
  <summary>Run in Kubernetes (Linux & macOS)</summary>

 You can deploy a local RisingWave cluster in Kubernetes with Kubernetes Operator for RisingWave.
 
 See detailed instructions in [Set up a local RisingWave cluster in Kubernetes](/deploy/risingwave-in-kubernetes.md).
    
</details>

</TabItem>
</Tabs>




## Step 2. Connect to RisingWave

After RisingWave is up and running, you can connect to it via the Postgres interactive terminal `psql`.

```sh
psql -h localhost -p 4566 -d dev -U root
```
    
You can now [connect a streaming source to RisingWave](sql/commands/sql-create-source.md) and [issue SQL queries to manage your data](query-manage-data.md).

