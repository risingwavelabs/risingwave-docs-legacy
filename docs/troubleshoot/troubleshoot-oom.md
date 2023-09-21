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

1. The Kubernetes shows the CN Pod suddenly restarts due to **OOM Killed (137)**. But for some unknown reason, this is not always the case.
2. The Grafana metrics shows memory increases unbounded, beyond the limit of `total_memory` set for CN. (Memory setting can be found in CN’s booting logs. Search for keyword “Memory outline”)

## OOM when creating materialized views

If the OOM happens during creating a new materialized view, it might be caused by the large amount of existing data in upstream system like Kafka. In this case, before creating or recreating a materialize view, you can reduce the traffic by reducing the rate limit:

```sql
SET RW_STREAMING_RATE_LIMIT = <rate_limit_per_actor> 
```

Note that the limit value must be larger than the value for `stream_chunk_size` (usually 256). Otherwise the flow control executor can’t throttle the chunk.

If the query of the materialized view is complex, consider improving the query performance. For details, see [Troubleshoot Streaming Performance](https://www.notion.so/Troubleshoot-Streaming-Performance-e60dad4c420c4e5ea320252069ed3670?pvs=21).

## OOM caused by barrier latency

Barrier is a fundamental mechanism in our system and many components rely on it to work correctly, including memory management and LRU caches.

Instead of looking into the memory problem, we recommend you to investigate the reason of barrier stuck. This might be caused by temporary network jitter or some internal performance issues. Please dump the Async Stack Trace of all compute nodes on RisingWave Dashboard and ask us in our Slack channel #troubleshooting.

## OOM caused by other issues

We added a built-in memory profiling utility since version 1.3 (<https://github.com/risingwavelabs/risingwave/pull/12052>). Under the hood, it automatically dumps heap profiling results and provide an UI to analyze them in one click.

- **Auto Dump** is triggered automatically when memory usage hit the threshold (90%)
- **Manual Dump** is trigger by user manually.

The analyzing result is in `collapsed` format and can be visualized by flamegraph tools such as <https://github.com/brendangregg/FlameGraph> or online tools such as [Speedscope](https://www.speedscope.app/), [flamegraph.com](https://flamegraph.com/).

Please feel free to ask us in our Slack channel **#troubleshooting** attaching the analyzing result.
