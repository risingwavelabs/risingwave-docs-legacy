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
2. The Grafana metrics shows memory increases unbounded, beyond the limit of `total_memory` set for the compute node. Memory setting can be found in the booting logs of the compute node. Search for keyword “Memory outline" to locate the specific section.

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

## OOM caused by extremely high barrier latency

Barriers play a vital role in our system, supporting the proper functioning of important components like memory management and LRU caches.

Barrier latency can be observed from Grafana dashboard - Barrier latency panel. For example, the latency curve in the following figure is abnormal, which indicates that the barrier is getting stuck.

<img
  src={require('../images/example_bad_barrier_latency.png').default}
  alt="An example of extremely high latency"
/>

Instead of solely addressing the memory problem, we recommend investigating why the barrier is getting stuck. This issue could be caused by heavy streaming jobs, sudden impact of input traffic, or even some temporary issues.

Please refer to [Troubleshoot high latency](/troubleshoot/troubleshoot-high-latency.md) for more details.

## OOM during prefetching

If OOM occurs during long batch queries, it might result from excessive memory usage on compute nodes. In such case, consider reducing the memory usage of prefetching by adjusting the value of the `storage.prefetch_buffer_capacity_mb` parameter in the TOML file.

The `storage.prefetch_buffer_capacity_mb` configuration defines the maximum memory allowed for prefetching. It aims to optimize streaming executor and batch query performance through pre-reading. This feature allows hummock to read larger chunks of data in a single I/O operation, but at a higher memory cost. When the memory usage during prefetch operations reaches this limit, hummock will revert to the original read method, processing data in 64 KB blocks. If you set the parameter to 0, this feature will be disabled. By default, it is set to 7% of the total machine memory.

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
