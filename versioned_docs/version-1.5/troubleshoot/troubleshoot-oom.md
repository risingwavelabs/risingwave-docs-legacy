---
id: troubleshoot-oom
title: Troubleshoot out-of-memory issues
slug: /troubleshoot-oom
---

Out-of-Memory (OOM) is a common issue in data processing systems that can have multiple causes. This guide aims to help you identify the root causes of OOM errors and efficiently resolve the issues.

RisingWave uses shared storage like AWS S3 and uses the compute node's memory as a cache to enhance streaming jobs. The cache operates in a Least Recently Used (LRU) manner. That means the least-used entries will be removed when memory becomes insufficient.

For optimal performance, the recommended minimum memory for a compute node is 8 GB, but we suggest using 16 GB or more for production usage.

This guide focuses on addressing OOM issues on the compute node. If you encounter OOM on other nodes, we recommend upgrading to the latest version first. If the issue persists, please contact us.

## OOM symptoms

1. The Kubernetes shows the compute node pod suddenly restarts due to **OOM Killed (137)**.
2. The Grafana metrics show memory increases unbounded, beyond the limit of `total_memory` set for the compute node. Memory settings can be found in the booting logs of the compute node. Search for keyword “Memory outline" to locate the specific section.

<img
  src={require('../images/oom-symptom.png').default}
  alt="Out-of-memory symptom"
/>

## OOM when creating materialized views

If OOM happens during creating a new materialized view, it might be caused by the large amount of existing data in upstream systems like Kafka. In this case, before creating or recreating a materialized view, you can reduce the traffic by specifying the rate limit of each parallelism:

```sql
CREATE MATERIALIZED VIEW mv WITH ( streaming_rate_limit = 200 ) AS ...
```

The parameter `streaming_rate_limit` means the maximum number of records per second for each parallelism on each source, where the default parallelism for streaming jobs is the total number of CPU cores across the cluster. For example, assuming a materialized view has 4 parallelisms and 2 sources joining together, each source's throughput will be throttled to `4 * streaming_rate_limit` records/s.

Alternatively, you may use `risectl` to alter the streaming rate limit of an existent materialized view, where the `<id>` can be found either from the RisingWave Dashboard or `rw_catalog` schema.

```sh
risingwave ctl throttle source/mv <id> <streaming_rate_limit>
```

## OOM caused by barrier latency

Barriers play a vital role in our system, supporting the proper functioning of important components like memory management and LRU caches.

Barrier latency can be observed from Grafana dashboard - Barrier latency panel. For example, the latency curve in the following figure is abnormal, which indicates that the barrier is getting stuck.

<img
  src={require('../images/example_bad_barrier_latency.png').default}
  alt="Out-of-memory symptom"
/>

Instead of solely addressing the memory problem, we recommend investigating why the barrier is getting stuck. This issue could be caused by heavy streaming jobs, sudden impact of input traffic, or even some temporary issues.

Some tools will be helpful in troubleshooting this issue:

- Observe the backpressure between fragments (actors) in Grafana. A high backpressure between 2 fragments indicates that the downstream one is not able to process the data fast enough, therefore slowing down the whole streaming job. 
- Check the Await Tree Dump of all compute nodes in RisingWave Dashboard. If the barrier is stuck, the Await Tree Dump will show the barrier is waiting for a specific operation to finish. This fragment is likely to be the bottleneck of the streaming job.

In either case, you can try to increase the parallelism by adding more nodes into the cluster, or check the SQL query to see if there is any room for optimization.

## Troubleshoot using the memory profiling utility

If the barrier latency is normal, but the memory usage is still increasing, you may need to do memory profiling to identify the root cause.

We have added a heap profiling utility in the RisingWave Dashboard to help you analyze memory usage and identify memory-related issues.

:::info

To enable memory profiling, please set the environment variable `MALLOC_CONF=prof:true` for the compute nodes. 

:::

Go to the RisingWave Dashboard and select **Debug** > **Heap Profiling**. If RisingWave is running on your local machine, you can access the RisingWave Dashboard at `127.0.0.1:5691`.

By default, the heap profile data is automatically dumped when the memory usage reaches 90%. You also have the option to manually dump heap profile data. Once the data is dumped, you can click on **Analyze** within the dashboard to examine memory usage patterns and potential issues without leaving the dashboard.

## Ask in the community

To seek help from the community, you can join our [Slack workspace](https://www.risingwave.com/slack) and post your questions in the `#troubleshooting` channel. You may also [file an issue in GitHub](https://github.com/risingwavelabs/risingwave/issues/new/choose).

Please include the following details when you are reporting an issue:

- A summary of the issue.
- The steps to reproduce the issue.
- The related resources, such as logs, screenshots, metrics, stack dump, etc.
