---
id: troubleshoot-high-latency
title: Troubleshoot high latency
slug: /troubleshoot-high-latency
---

High latency is a common performance issue in streaming systems, with various potential causes. Extremely high latency not only impacts data freshness, but can also jeopardize the overall system stability, such as causing out-of-memory (OOM) errors.

This guide aims to help you identify the root causes of high latency and provide effective solutions to address these issues.

## Symptom

To detect barrier latency: go to **Grafana dashboard (dev)** > **Streaming** > **Barrier Latency** panel. For example, the latency curve in the following figure is extremely high, indicating that the barrier is getting stuck.

<img
  src={require('../images/example_bad_barrier_latency.png').default}
  alt="An example of extremely high latency"
/>

## Diagnosis —— find out the bottleneck streaming job 

Some tools can be helpful in troubleshooting this issue:

- Observe backpressure: Go to **Grafana dashboard (dev)** > **Streaming Actors** > **Actor Output Blocking Time Ratio (Backpressure)** panel, and analyze backpressure between fragments (actors). High backpressure between 2 fragments indicates that the downstream one is unable to process the data promptly, thereby slowing down the entire streaming job.
- Check Await Tree Dump: Check the Await Tree Dump of all compute nodes in **RisingWave Dashboard** hosted on `http://meta-node:5691`. If the barrier is stuck, the Await Tree Dump will reveal the barrier waiting for a specific operation to finish. This fragment is likely to be the bottleneck of the streaming job.

With these tools, you can identify the bottleneck fragments (actors) and the materialized views they belong to. Additionally, refer to the RisingWave Dashboard for the detailed information on materialized views, such as the streaming execution graph or the SQL query.

## Diagnosis —— find out the bottleneck resources 

Identifying the resource bottleneck of the streaming tasks is important, as it can help us to more precisely and economically increase nodes and optimize the SQL. The following document summarizes several different resource bottlenecks for reference. They are ranked from easy to difficult according to the difficulty of diagnosis. In troubleshooting, it can be used as a checklist for matching or excluding one by one.

### CPU bottleneck 

  **Grafana dashboard (dev)** > **Cluster Node** > **Node CPU** panel, and find the "cpu usage (avg per core) - compute" time series

### State bottleneck(write & compaction)

  **Grafana dashboard (dev)** > **Compaction** > **SSTable Count** panel

  **Grafana dashboard (dev)** > **Cluster Node** > **Node CPU** panel, and find the "cpu usage (avg per core) - compactor" time series

  **Grafana dashboard (dev)** > **Compaction** > **Compaction Failure Count** panel

  **Grafana dashboard (dev)** > **Object Storage** > **Operation Failure Rate** panel

  **Grafana dashboard (dev)** > **Object Storage** > **Operation Retry Rate** panel

### UDF bottleneck

 **Grafana dashboard (dev)** > **User Defined Function** section


### Sink bottleneck

<!--
https://github.com/risingwavelabs/risingwave/issues/15473

-->

### State bottleneck(read)

  **Grafana dashboard (dev)** > **Actor/Table Id Info** > **State Table Info** panel

  **Grafana dashboard (dev)** > **Streaming Actors** > **Executor Cache Miss Ratio** panel

  **Grafana dashboard (dev)** > **Hummock (Read)** > **Read Duration - Iter** panel
  **Grafana dashboard (dev)** > **Hummock (Read)** > **Read Duration - Get** panel




## Solution

Once you've pinpointed the bottleneck fragment, consider the following actions to resolve the issue:

- Enhance the streaming query performance by removing or rewriting the bottleneck part of the SQL query.
- Increase the parallelism by adding more nodes into the cluster, or check the SQL query to see if there is any room for optimization.

## Example: High latency caused by high join amplification

Joins with low-cardinality columns as equal conditions can cause high join amplification, which will lead to high latency.

:::info
The term "Cardinality" describes how many distinct values exist in a column. For example, "nation" often has a lower cardinality, while "user_id" often has a higher cardinality.

When using a low-cardinality column as the equal condition for a join, such as `A join B on A.nation = B.nation`, any operation on a row in A or B will be amplified by the join to potentially thousands or millions of rows, depending on how many rows share that nation. This could lead to extremely high latency.
:::

For example, the following figure shows a materialized view with extremely high latency caused by high join amplification. See the panel through **Grafana dashboard (dev)** > **Streaming** > **Join Executor Matched Rows**, which indicates the number of matched rows from the opposite side in the streaming join executors.

<img
  src={require('../images/example_high_join_matched_rows.png').default}
  alt="An example of extremely high latency"
/>

To solve the issue, consider rewriting the SQL query to reduce join amplification, such as using better equal conditions on the problematic join to reduce the number of matched rows.