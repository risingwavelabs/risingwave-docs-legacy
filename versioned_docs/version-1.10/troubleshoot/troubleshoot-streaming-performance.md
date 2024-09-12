---
id: troubleshoot-streaming-performance
title: Streaming performance
slug: /troubleshoot-streaming-performance
---
<head>
  <link rel="canonical" href="https://docs.risingwave.com/docs/current/troubleshoot-streaming-performance/" />
</head>

## Overview

Each streaming job, for example, a materialized view, is composed of multiple fragments that form a Directed Acyclic Graph (DAG). Each fragment consists of multiple parallel actors, and each actor is comprised of one or more streaming operators interconnected. The RisingWave Dashboard provides a visualization of the actor/fragment topology for active jobs in the Actor/Fragment panel.

Occasionally, a streaming actor or fragment can become a bottleneck within the overall streaming job. This guide aims to assist you in identifying the bottleneck and providing solutions to address this issue.

## Find out the back-pressured fragments

When an actor or fragment performs slower than others, it back-pressures its preceding actors/fragments. Thus, to find the root of backpressure, we need to find the frontmost actors/fragments in the DAG.

![An example of extremely high latency](../images/Streaming-performance.png)

To accomplish this, refer to the Grafana dashboard and navigate to the "Streaming - Backpressure" panel. In the panel, find the channels with high backpressure and identify the frontmost one.

![An example of extremely high latency](../images/Backpressure-panel.png)

For example, in the image above, both `15002→15001` and `15003→15002` are high. Considering backpressure can be passed to preceding fragments, the root cause is probably `15001`.

To find out the corresponding part in your SQL query, refer to the RisingWave Dashboard and access the "Fragment" panel. Additionally, run `EXPLAIN CREATE MATERIALIZED VIEW …` to see the query plan and find out the part corresponding to the problematic fragments.

## Improve the performance of streaming query

Some performance issues are caused by heavy SQL queries, such as:

- Heavy aggregations such as `array_agg`.
- Joins with unreasonable amplification.
- Union (which needs to deduplicate rows) instead of Union ALL.
- UDF performance issues.

For these scenarios, it would be beneficial to consider rewriting your queries to optimize their performance.

If you encounter any difficulties or need assistance with the provided content, please don't hesitate to reach out to us for help. You can join our [Slack channel #troubleshooting](https://www.risingwave.com/slack) and ask your questions there. We are here to support you and address any issues you may have.