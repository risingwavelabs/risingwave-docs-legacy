---
id: troubleshoot-high-latency
title: Troubleshoot high latency
slug: /troubleshoot-high-latency
---

High latency is a common performance issue in streaming systems that may have multiple causes. Extremly high latency will not only affect data freshness, but also affect the stability of the whole system, such as causing OOM.

This guide aims to help you identify the root causes of high latency and efficiently resolve the issues.


## Symptoms

Barrier latency can be observed from **Grafana dashboard (dev) - Streaming - Barrier Latency** panel. For example, the latency curve in the following figure is extremely high, which indicates that the barrier is getting stuck.

<img
  src={require('../images/example_bad_barrier_latency.png').default}
  alt="An example of extremly high latency"
/>

## Diagnosis

Some tools will be helpful in troubleshooting this issue:

- **Observe the backpressure between fragments (actors)**, which can be found at **Grafana dashboard (dev) - Streaming Actors - Actor Output Blocking Time Ratio (Backpressure)** panel. A high backpressure between 2 fragments indicates that the downstream one is not able to process the data fast enough, therefore slowing down the whole streaming job.
- **Check the Await Tree Dump** of all compute nodes in **RisingWave Dashboard** hosted on `http://meta-node:5691`. If the barrier is stuck, the Await Tree Dump will show the barrier is waiting for a specific operation to finish. This fragment is likely to be the bottleneck of the streaming job.

With these tools, you can identify the bottleneck fragments (actors) and the materialized views they belong to. Additionally, refer to the RisingWave Dashboard to get the detailed information of the materialized views, such as the straeming execution graph or the SQL query.

## Solutions

After you have identified the bottleneck fragment, you can take the following actions to resolve the issue:

- Try to improve the streaming query performance by removing or rewriting the bottleneck part of the SQL query.
- Try to increase the parallelism by adding more nodes into the cluster, or check the SQL query to see if there is any room for optimization.


## Example: High latency caused by high join amplification

Joins with low-cardinality columns as equal conditions can cause high join amplification, which will lead to high latency.

For example, the following figure shows a materialized view with extremely high latency caused by high join amplification. The panel can be found at **Grafana dashboard (dev) - Streaming - Join Executor Matched Rows**, which indicates the number of matched rows from the opposite side in the streaming join executors.

<img
  src={require('../images/example_high_join_matched_rows.png').default}
  alt="An example of extremly high latency"
/>
