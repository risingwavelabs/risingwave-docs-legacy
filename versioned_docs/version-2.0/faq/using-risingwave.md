---
id: faq-using-risingwave
title: Using RisingWave
description: FAQ about how to use RisingWave.
slug: /faq-using-risingwave
---
<head>
  <link rel="canonical" href="https://docs.risingwave.com/docs/current/faq-using-risingwave/" />
</head>

## Why the memory usage is so high?

Don't worry, this is by design. RisingWave uses memory for in-memory cache of streaming queries, such as data structures like hash tables, etc., to optimize streaming computation performance. By default, RisingWave will utilize all available memory (unless specifically configured through `RW_TOTAL_MEMORY_BYTES`/`--total-memory-bytes`). This is why setting memory limits is required in Kubernetes/Docker deployments. 

During the instance running, RisingWave will keep memory usage below this limit. If you encounter unexpected issues like OOM (Out-of-memory), please refer to [Troubleshoot out-of-memory](/troubleshoot/troubleshoot-oom.md) for assistance.

## Why is the memory for compute nodes not fully utilized?

As part of its design, RisingWave allocates part of the total memory in the compute node as reserved memory. This reserved memory is specifically set aside for system usage, such as the stack and code segment of processes, allocation overhead, and network buffer.

As for the calculation method of reserved memory, starting from version 1.10, RisingWave calculates the reserved memory based on the following gradient:

- 30% of the first 16GB
- Plus 20% of the remaining memory

<details>
<summary>Read an example.</summary>
For example, let's consider a compute node with 32GB of memory. The reserved memory would be calculated as follows:

- 30% of the first 16GB is 4.8GB

- 20% of the remaining 16GB is 3.2GB

- The total reserved memory is 4.8GB + 3.2GB = 8GB

This calculation method ensures that in scenarios with less memory, the system reserves more memory for critical tasks. On the other hand, in scenarios with more memory, it reserves less memory, thus achieving a better balance between system performance and memory utilization.
</details>

However, this may not be suitable for all workloads and machine setups. To address this, we introduce a new option, which allows you to explicitly configure the amount of reserved memory for compute nodes. You can use the startup option `--reserved-memory-bytes` and the environment variable `RW_RESERVED_MEMORY_BYTES` to override the reserved memory configuration for compute nodes. **Note that the memory reserved should be at least 512MB.**

<details>
<summary>Read an example.</summary>
For instance, suppose you are deploying a compute node on a machine or pod with 64GB of memory. By default, the reserved memory would be calculated as follows:

- 30% of the first 16GB is 4.8GB

- 20% of the remaining 48GB (64GB - 16GB) is 9.6GB

- The total reserved memory would be 4.8GB + 9.6GB, which equals 14.4GB.

However, if you find this excessive for your specific use case, you have the option to specify a different value. You can set either `RW_RESERVED_MEMORY_BYTES=8589934592` or `--reserved-memory-bytes=8589934592` when starting up the compute node. This will allocate 8GB as the reserved memory instead.
</details>

<details>
<summary>Confused about the version difference of reserved memory setting?</summary>

Before version 1.9, RisingWave allocated 30% of the total memory as reserved memory by default. However, through practical application, we realized that this default setting may not be suitable for all scenarios. Therefore, in version 1.9, we introduced the ability to customize the reserved memory.

To further optimize this feature, we changed the calculation method for reserved memory in version 1.10 and introduced the current gradient calculation method. These changes improve memory utilization and provide enhanced performance for our users.

By continuously improving the reserved memory feature, we strive to offer a more flexible and efficient memory management solution to meet the diverse needs of our users.
</details>


## Why does the `CREATE MATERIALIZED VIEW` statement take a long time to execute?

The execution time for the `CREATE MATERIALIZED VIEW` statement can vary based on several factors. Here are two common reasons:

1. **Backfilling of historical data**: RisingWave ensures consistent snapshots across materialized views (MVs). So when a new MV is created, it backfills all historical data from the upstream MV or tables and calculate them, which takes some time. And the created DDL statement will only end when the backfill ends. You can run `SHOW JOBS;` in SQL to check the DDL progress. If you want the create statement to not wait for the process to finish and not block the session, you can execute `SET BACKGROUND_DDL=true;` before running the `CREATE MATERIALIZED VIEW` statement. See details in [`SET BACKGROUND_DDL`](/sql/commands/sql-set-background-ddl.md). But please notice that the newly created MV is still invisible in the catalog until the end of backfill when `BACKGROUND_DDL=true`.

2. **High cluster latency**: If the cluster experiences high latency, it may take longer to apply changes to the streaming graph. If the `Progress` in the `SHOW JOBS;` result stays at 0.0%, high latency could be the cause. See details in [Troubleshoot high latency](/troubleshoot/troubleshoot-high-latency.md) 


## What consists of the memory usage and disk usage？

Memory usage is divided into the following components:

- Total memory: The overall available memory for the compute node.

- Storage memory: Memory dedicated to storage-related tasks, which includes caching data and metadata to improve performance.

- Compute memory: Memory allocated for computational tasks.

- Reserved memory: Memory reserved for system usage, such as the stack and code segment of processes, allocation overhead, and network buffer.

Below is a specific example of memory usage composition on a compute node with 8G memory:

```sql
total_memory: 8.00 GiB
    storage_memory: 2.13 GiB
        block_cache_capacity: 688.00 MiB
        meta_cache_capacity: 802.00 MiB
        shared_buffer_capacity: 688.00 MiB
    compute_memory: 3.47 GiB
    reserved_memory: 2.40 GiB
```
