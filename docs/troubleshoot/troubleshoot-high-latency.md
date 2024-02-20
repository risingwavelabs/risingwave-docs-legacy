---
id: troubleshoot-high-latency
title: Troubleshoot high latency
slug: /troubleshoot-high-latency
---

High latency is a common performance issue in streaming systems, with various potential causes. Extremely high latency not only impacts data freshness, but can also jeopardize the overall system stability, such as causing out-of-memory (OOM) errors.

This guide aims to help you identify the root causes of high latency and provide effective solutions to address these issues.

## Symptoms

To detect barrier latency: go to **Grafana dashboard (dev)** > **Streaming** > **Barrier Latency** panel. For example, the latency curve in the following figure is extremely high, indicating that the barrier is getting stuck.

<img
  src={require('../images/example_bad_barrier_latency.png').default}
  alt="An example of extremely high latency"
/>

## Diagnosis

Some tools can be helpful in troubleshooting this issue:

- Backpressure Observation

  Go to **Grafana dashboard (dev)** > **Streaming Actors** > **Actor Output Blocking Time Ratio (Backpressure)** panel, and analyze backpressure between fragments (actors). High backpressure between 2 fragments indicates that the downstream one is unable to process the data promptly, thereby slowing down the entire streaming job.
- Await Tree Dump Examination

  Check the Await Tree Dump of all compute nodes in **RisingWave Dashboard** hosted on `http://meta-node:5691`. If the barrier is stuck, the Await Tree Dump will reveal the barrier waiting for a specific operation to finish. This fragment is likely to be the bottleneck of the streaming job.

With these tools, you can identify the bottleneck fragments (actors) and the materialized views they belong to. Additionally, refer to the RisingWave Dashboard for the detailed information on materialized views, such as the streaming execution graph or the SQL query.

## Solutions

Once you've pinpointed the bottleneck fragment, consider the following actions to resolve the issue:

- Enhance the streaming query performance by removing or rewriting the bottleneck part of the SQL query.
- Increase the parallelism by adding more nodes into the cluster, or check the SQL query to see if there is any room for optimization.

## Example: High latency caused by high join amplification

Joins with low-cardinality columns as equal conditions can cause high join amplification, which will lead to high latency.

For example, the following figure shows a materialized view with extremely high latency caused by high join amplification. The panel can be found at **Grafana dashboard (dev)** > **Streaming** > **Join Executor Matched Rows**, which indicates the number of matched rows from the opposite side in the streaming join executors.

<img
  src={require('../images/example_high_join_matched_rows.png').default}
  alt="An example of extremely high latency"
/>

To solve the issue, consider rewriting the SQL query to reduce join amplification, such as adding more equal conditions to the problematic join to reduce the number of matched rows.
