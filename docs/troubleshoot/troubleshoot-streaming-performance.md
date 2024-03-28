---
id: troubleshoot-streaming-performance
title: Streaming performance
slug: /troubleshoot-streaming-performance
---
<head>
  <link rel="canonical" href="https://docs.risingwave.com/docs/current/troubleshoot-streaming-performance/" />
</head>

## Overview

Every streaming job (i.e. materialized view) consists of multiple fragments, forming a DAG, and each fragment consists of multiple parallel actors, while every actor contains one or more streaming operators connected together. RisingWave Dashboard visualizes the actor/fragment topology of running jobs in the Actor/Fragment panel.

Sometimes a streaming actor or fragments could become the bottleneck of the whole streaming job. This topic helps you to identify the bottleneck and solve the issue.

## Find out the back-pressured fragments

When an actor or fragment performs slower than others, it back-pressures its preceding actors/fragments. Thus, to find the root of backpressure, we need to find the frontmost actors/fragments in the DAG.

<img
  src={require('../images/Streaming-performance.png').default}
  alt="An example of extremely high latency"
/>

Check the Grafana - Streaming - Backpressure panel. Find the channels with high backpressure and find the frontmost one.

<img
  src={require('../images/Backpressure-panel.png').default}
  alt="An example of extremely high latency"
/>

For example, in the image above, both `15002→15001` and `15003→15002` are high. Considering backpressure can be passed to preceding fragments, the root cause is probably `15001`.

To find out the corresponding part in your SQL query, please check the RisingWave Dashboard -  Fragment panel. Additionally, run `EXPLAIN CREATE MATERIALIZED VIEW …` to see the query plan and find out the part corresponding to the problematic fragments.

## Improve the performance of streaming query

Some performance issues are caused by heavy SQL queries, such as:

- Heavy aggregations such as `array_agg`.
- Joins with unreasonable amplification.
- Union (which needs to deduplicate rows) instead of Union ALL.
- UDF performance issues.

For these cases, you might consider rewriting your queries to perform better.

If you have any difficulty with this, or if you encounter other issues that are listed here, please feel free to ask us for help in our Slack channel [**#toubleshooting**](https://www.risingwave.com/slack). 