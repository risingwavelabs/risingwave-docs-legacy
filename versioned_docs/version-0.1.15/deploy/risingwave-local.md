---
id: risingwave-local
title: Run RisingWave locally
description: Install and run RisingWave locally in your environment.
slug: /risingwave-local
---

This article will help you start a RisingWave standalone instance in your environment.

:::caution
This method starts RisingWave in playground mode, where data is not persisted after the service is terminated.<br/>Start RisingWave in full-featured mode for data persistence and stable performance. <br/>[→ See the comparison](/get-started.md#run-risingwave)
:::

## Install and start RisingWave

You can download the pre-built library or build from the latest source code:

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

<Tabs>
<TabItem value="library" label="Pre-built package (Linux)">

1. Download the pre-built binary.

    ```shell
    wget https://github.com/risingwavelabs/risingwave/releases/download/v0.1.15/risingwave-v0.1.15-x86_64-unknown-linux.tar.gz
    ```

    > You can find previous binary releases in [Release notes](/release-notes.md).

2. Unzip the binary.

    ```shell
    tar xvf risingwave-v0.1.15-x86_64-unknown-linux.tar.gz
    ```

3. Start RisingWave in playground mode.

    ```shell
    ./risingwave playground
    ```

</TabItem>
<TabItem value="source" label="Build from source (Linux & macOS)">

1. Clone the [risingwave](https://github.com/risingwavelabs/risingwave) repository and enter the directory.

    ```shell
    git clone https://github.com/risingwavelabs/risingwave.git && cd risingwave
    ```

2. Install dependencies.

    RisingWave has the following dependencies. Please ensure all the dependencies have been installed before running RisingWave.

    * Rust
    * CMake
    * Protocol Buffers
    * OpenSSL
    * psql (14.1 or higher)
    * Tmux

    Select your operating system and run the following commands to install the dependencies.

    <Tabs>
    <TabItem value="macos" label="macOS" default>

    ```shell
    brew update
    brew install libpq cmake protobuf openssl tmux cyrus-sasl
    brew link --force libpq
    curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
    ```

    :::note
    If you are using a Mac with Apple silicon (such as the M1 / M2 chip), you need to install `LLVM` by running `brew llvm`.
    :::

    </TabItem>
    <TabItem value="linux" label="Linux">

    ```shell
    sudo apt update
    sudo apt upgrade
    sudo apt install make build-essential cmake protobuf-compiler curl openssl libssl-dev libsasl2-dev libcurl4-openssl-dev pkg-config postgresql-client tmux lld
    curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
    ```

    </TabItem>
    </Tabs>

3. Start RisingWave.

    To compile and start RisingWave, you can use [RiseDev](https://github.com/risingwavelabs/risingwave/blob/main/docs/developer-guide.md#set-up-the-development-environment), the developer's tool for RisingWave.
  
    ```shell
    ./risedev playground    #Or ./risedev p
    ```


</TabItem>
</Tabs>

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;If you see the logs, you have successfully started RisingWave.

<img src={require('../images/risedev_playground_logs.png').default} alt="RisingWave Playground Logs"/>

## Connect to RisingWave

After RisingWave is up and running, you need to connect to it via the Postgres interactive terminal `psql` so that you can issue queries to RisingWave and see the query results.

Open a new terminal window and run:

```shell
psql -h localhost -p 4566 -d dev -U root
```
    
You can now [connect a streaming source to RisingWave](/sql/commands/sql-create-source.md) and [issue SQL queries to manage your data](risingwave-sql-101.md).
