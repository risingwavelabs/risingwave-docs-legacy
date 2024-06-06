---
id: get-started
title: Get started
description: Get started with RisingWave.
slug: /get-started
---

<head>
  <link rel="canonical" href="https://docs.risingwave.com/docs/current/get-started/" />
</head>

This guide will help you get started with RisingWave.

| Stages                                                                                                                                                                                                                                                                                                                                                                                                                                                                        |
| ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [**Run RisingWave**](#run-risingwave) — Install, start, and connect to RisingWave.                                                                                                                                                                                                                                                                                                                                                                                            |
| [**Ingest data**](/sql/commands/sql-create-source.md) — Connect a streaming data source to RisingWave.                                                                                                                                                                                                                                                                                                                                                                        |
| **Process data** <ul><li>[RisingWave SQL 101](risingwave-sql-101.md) — A simple yet typical data processing quickstart guide for RisingWave first-timers.</li><li>[Use cases](/tutorials/real-time-ad-performance-analysis.md) — A series of guided tours in solving real-world stream processing tasks with simulated data.</li><li>**SQL references** — Navigate to **SQL references** on the sidebar if you are familiar with PostgreSQL and materialized views.</li></ul> |
| [**Deliver data**](/sql/commands/sql-create-sink.md) — Send processed data to other destinations.                                                                                                                                                                                                                                                                                                                                                                             |

## Run RisingWave

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

<Tabs queryString="method">

<TabItem value="local" label="Run locally">

Set up a local cluster on your machine.

RisingWave offers two running modes and several running options. See the table below for comparisons.

If you intend to deploy RisingWave in production environments, please use Kubernetes for better resource management and stability.

| Comparison \ Mode                     | Playground mode                                                                                                                                           | Full-featured mode                                                                                                                                                |
| ------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Purpose**                           | Quick tests                                                                                                                                               | Advanced tests and light production                                                                                                                               |
| **Starts in**                         | A single-node instance                                                                                                                                    | A full-featured, multi-node cluster                                                                                                                               |
| **Data persistence**                  | Data is stored solely in memory and will not be persisted after the service is terminated.                                                                | Data is persisted in storage.                                                                                                                                     |
| **Choose a method to run RisingWave** | Run a single-node instance on/in<br /><LightButton text="Host machine" doc="risingwave-local"/><LightButton text="Docker" doc="risingwave-docker-image"/> | Set up a local cluster with<br /><LightButton text="Docker Compose" doc="risingwave-docker-compose"/><LightButton text="Kubernetes" doc="risingwave-kubernetes"/> |

> Currently, RisingWave does not support Windows. Use a macOS or Linux machine to run RisingWave.

</TabItem>

<TabItem value="cloud" label="Run in cloud">

Experience intuitive and effortless stream processing with RisingWave Cloud. Sign up now and get a free, fully managed cluster up and running with a few clicks.

<DefaultButton text="Sign up for RisingWave Cloud" url="https://cloud.risingwave.com/auth/signup/"/><LightButton text="Learn more" cloud="intro"/><LightButton text="FAQ" cloud="faq"/>

<br/>
<br/>

<img
src={require('./images/cloud-overview.png').default}
alt="RisingWave Cloud Overview"
/>

</TabItem>

<TabItem value="playground" label="Try from browser">

Try out RisingWave without the need for any installation or setup with RisingWave Playground, an interactive web application. You can access RisingWave Playground directly from your browser.

:::info
RisingWave Playground is intended for quick testing purposes only. Your data will not persist after a session expires. Some functionality may be limited.
:::

<DefaultButton text="RisingWave Playground" url="https://playground.risingwave.dev" block/>

<br/>

<img
src={require('./images/playground-overview.png').default}
alt="RisingWave Playground Overview"
width="800px"
/>

</TabItem>

</Tabs>
