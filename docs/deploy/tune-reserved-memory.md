---
id: tune-reserved-memory
title: Tune reserved memory and cache eviction policy
description: Tune the reserved memory and cache eviction policy in RisingWave.
slug: /tune-reserved-memory
---
<head>
  <link rel="canonical" href="https://docs.risingwave.com/docs/current/tune-reserved-memory/" />
</head>

This topic introduces the concept and the tuning method of reserved memory and cache eviction policy.

## What is reserved memory and cache eviction policy?

A simplified description of our memory control mechanism will help you understand these two concepts more straightforward. In simple words, RisingWave manages memory usage through a three-step process:

1. Monitoring: The system calculates and monitors the memory usage of each component.

2. Reserving buffer: The system reserves 30% of the total memory as a buffer. This is the **reserved memory**. In case of a sudden spike in input data, RisingWave has enough time to adjust its memory usage.

3. Eviction checks: The system regularly compares current memory use against the remaining 70% (usable memory), and decides if it should evict data. This  **cache eviction policy** is based on usage levels:

- Above 70%: Begins gentle data eviction

- Above 80%: Increases eviction intensity

- Above 90%: Further intensifies eviction

We allow you to tune both reserved memory and cache eviction policy.

## How to tune reserved memory

Starting from version 1.10, RisingWave calculates the reserved memory based on the following gradient:

- 30% of the first 16GB
- Plus 20% of the remaining memory

<details>
<summary>Read an example.</summary>
For example, let's consider a compute node with 32GB of memory. The reserved memory would be calculated as follows:

- 30% of the first 16GB is 4.8GB

- 20% of the remaining 16GB is 3.2GB

- The total reserved memory is 4.8GB + 3.2GB = 8GB

</details>

This calculation method ensures that in scenarios with less memory, the system reserves more memory for critical tasks. On the other hand, in scenarios with more memory, it reserves less memory, thus achieving a better balance between system performance and memory utilization.

However, this may not be suitable for all workloads and machine setups. To address this, you can use the startup option `--reserved-memory-bytes` and the environment variable `RW_RESERVED_MEMORY_BYTES` to override the reserved memory configuration for compute nodes. **But note that the memory reserved should be at least 512MB.**

For instance, suppose you are deploying a compute node on a machine or pod with 64GB of memory. By default, the reserved memory would be calculated as follows:

- 30% of the first 16GB is 4.8GB

- 20% of the remaining 48GB (64GB - 16GB) is 9.6GB

- The total reserved memory would be 4.8GB + 9.6GB, which equals 14.4GB.

However, if you find this excessive for your specific use case, you have the option to specify a different value. You can set either `RW_RESERVED_MEMORY_BYTES=8589934592` or `--reserved-memory-bytes=8589934592` when starting up the compute node. This will allocate 8GB as the reserved memory instead.

<details>
<summary>Reserved memory setting before 1.10</summary>

Before version 1.9, RisingWave allocated 30% of the total memory as reserved memory by default. However, through practical application, we realized that this default setting may not be suitable for all scenarios. Therefore, in version 1.9, we introduced the ability to customize the reserved memory.

To further optimize this feature, we changed the calculation method for reserved memory in version 1.10 and introduced the current gradient calculation method. These changes improve memory utilization and provide enhanced performance for our users.

By continuously improving the reserved memory feature, we strive to offer a more flexible and efficient memory management solution to meet the diverse needs of our users.
</details>

## How to tune cache enviction policy

You can tune the cache enviction policy by configuring the `memory_controller_eviction_factor_XXX` varibles in the [configuration `toml` file](https://github.com/risingwavelabs/risingwave/tree/main/src/config).

```plain title="Varibles in the configuration toml file"
  #[serde(default = "default::developer::memory_controller_threshold_aggressive")]
  pub memory_controller_threshold_aggressive: f64,

  #[serde(default = "default::developer::memory_controller_threshold_graceful")]
  pub memory_controller_threshold_graceful: f64,

  #[serde(default = "default::developer::memory_controller_threshold_stable")]
  pub memory_controller_threshold_stable: f64,

  #[serde(default = "default::developer::memory_controller_eviction_factor_aggressive")]
  pub memory_controller_eviction_factor_aggressive: f64,

  #[serde(default = "default::developer::memory_controller_eviction_factor_graceful")]
  pub memory_controller_eviction_factor_graceful: f64,

  #[serde(default = "default::developer::memory_controller_eviction_factor_stable")]
  pub memory_controller_eviction_factor_stable: f64,
```

RisingWave uses a tiered eviction strategy to manage cache based on the current memory usage:

- **Stable threshold:** When memory usage exceeds `memory_controller_threshold_stable`, RisingWave begins to evict data from the operator cache with mild intensity.
- **Graceful threshold:** Exceeding the `memory_controller_threshold_graceful` triggers a more aggressive eviction strategy.
- **Aggressive threshold:** If memory usage surpasses `memory_controller_threshold_aggressive`, the eviction process becomes most aggressive to free up memory.

Each threshold corresponds to a specific configuration variable in the `toml` configuration file.

For more detailed information on how the policy adjusts the intensity of eviction, you can review the [source code directly](https://github.com/risingwavelabs/risingwave/blob/main/src/compute/src/memory/controller.rs).

### Examples of tune cache eviction policy

Suppose the reserved memory is set to 30%, and `memory_controller_threshold_stable` is 0.8. RisingWave will aim to use 56% of the total memory stably during normal operations, calculated as:

```plain
Memory usage = 1.0 * (1 - 0.30) * 0.8 = 0.56 = 56%
```

Typically, only during sudden spikes in throughput or when creating a new materialized view that backfills a large amount of historical data will the memory usage exceed 56%, triggering more aggressive eviction strategies.

## Tuning recommendations

The best configuration depends on your specific workload and data pattern. We recommend you tune the parameters based on the metrics on Grafana.

## See also

- [Memory usage](/performance/performance-metrics.md#memory-usage): The memory control mechanism of RisingWave.

- [What consists of the memory usage and disk usage?](/rw-faq.md#what-consists-of-the-memory-usage-and-disk-usage)