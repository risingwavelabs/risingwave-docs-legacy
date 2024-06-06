---
id: risingwave-homebrew
title: Install RisingWave with Homebrew
description: Install and run RisingWave directly on your host machine with Homebrew.
slug: /risingwave-homebrew
---

<!-- This file is no longer maintained. Please update the content in risingwave-trial.md. -->

This article will help you start a RisingWave standalone instance in your environment with Homebrew.

:::caution
This method starts RisingWave in playground mode, where data is not persisted after the service is terminated.<br/>Start RisingWave in full-featured mode for data persistence and stable performance. <br/>[→ See the comparison](/get-started.md)
:::

## Install and start RisingWave

Install [Homebrew](https://brew.sh/) and run the following commands.

```shell
# Tap the repository
brew tap risingwavelabs/risingwave

# Install the latest release of RisingWave
brew install risingwave # Replace with `brew install risingwave --HEAD` if you want to install the latest development version of RisingWave.

# Start RisingWave in playground mode
risingwave playground
```

## Connect to RisingWave

After RisingWave is up and running, you need to connect to it via the Postgres interactive terminal `psql` so that you can issue queries to RisingWave and see the query results. If you don't have `psql` installed, [Install `psql`](/guides/install-psql-without-full-postgres.md) first.

Open a new terminal window and run:

```shell
psql -h localhost -p 4566 -d dev -U root
```

Now you can ingest and transform streaming data. See [Quick start](/get-started.md) for details.
