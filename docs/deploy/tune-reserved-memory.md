---
id: tune-reserved-memory
title: Tune reserved memory
description: Tune the reserved memory and cache eviction policy in RisingWave.
slug: /tune-reserved-memory
---
<head>
  <link rel="canonical" href="https://docs.risingwave.com/docs/current/tune-reserved-memory/" />
</head>

This topic introduces the reserved memory and cache eviction policy in RisingWave.

## What is reserved memory?

As part of its design, RisingWave allocates part of the total memory in the compute node as reserved memory. This reserved memory is specifically set aside for system usage, such as the stack and code segment of processes, allocation overhead, and network buffer.

## Reserved memory and eviction policy

In simple words, RisingWave manages memory usage through a three-step process:

1. Monitoring: The system calculates and monitors the memory usage of each component.

2. Reserving buffer: The system reserves 30% of the total memory, the reserved memory, as a buffer. In case of a sudden spike in input data, RisingWave has enough time to adjust its memory usage.

3. Eviction checks: The system regularly compares current memory use against the remaining 70% (usable memory), and decides if it should evict data. The enviction policy is based on usage levels:

- Above 70%: Begins gentle data eviction

- Above 80%: Increases eviction intensity

- Above 90%: Further intensifies eviction

So the cache eviction policy decides how aggressively cached data is evicted when memory usage exceeds certain limits.

For more details about the memory control mechanism of RisingWave, you can refer to [Memory control](/performance/performance-metrics.md#memory-usage) and [What consists of the memory usage and disk usage?](/rw-faq.md#what-consists-of-the-memory-usage-and-disk-usage).

## Calculation method

As for the calculation method of reserved memory, starting from version 1.10, RisingWave calculates the reserved memory based on the following gradient:

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

However, this may not be suitable for all workloads and machine setups. To address this, we offer some ways for you to tune the reserved memory. For the detailed setting, see the section [How to tune reserved memory](#how-to-tune-reserved-memory) below.

<details>
<summary>Reserved memory setting before 1.10</summary>

Before version 1.9, RisingWave allocated 30% of the total memory as reserved memory by default. However, through practical application, we realized that this default setting may not be suitable for all scenarios. Therefore, in version 1.9, we introduced the ability to customize the reserved memory.

To further optimize this feature, we changed the calculation method for reserved memory in version 1.10 and introduced the current gradient calculation method. These changes improve memory utilization and provide enhanced performance for our users.

By continuously improving the reserved memory feature, we strive to offer a more flexible and efficient memory management solution to meet the diverse needs of our users.
</details>

## How to tune reserved memory and enviction policy

Tuning the reserved memory and cache eviction policy in RisingWave is an advanced topic that most users won't need to adjust. However, for users who need fine-grained control over memory usage, understanding and configuring these settings can optimize performance based on specific workloads and data patterns.

For RisingWave Cloud users, our team can assist with tuning these parameters, given our access to Grafana dashboards. For open-source users, this guide provides some foundational guidelines and references to help you manage these configurations effectively.

### Adjust reserved memory

You can use the startup option `--reserved-memory-bytes` and the environment variable `RW_RESERVED_MEMORY_BYTES` to override the reserved memory configuration for compute nodes. **Note that the memory reserved should be at least 512MB.**

For instance, suppose you are deploying a compute node on a machine or pod with 64GB of memory. By default, the reserved memory would be calculated as follows:

- 30% of the first 16GB is 4.8GB

- 20% of the remaining 48GB (64GB - 16GB) is 9.6GB

- The total reserved memory would be 4.8GB + 9.6GB, which equals 14.4GB.

However, if you find this excessive for your specific use case, you have the option to specify a different value. You can set either `RW_RESERVED_MEMORY_BYTES=8589934592` or `--reserved-memory-bytes=8589934592` when starting up the compute node. This will allocate 8GB as the reserved memory instead.

### Adjust cache eviction policy

RisingWave uses a tiered eviction strategy to manage cache based on the current memory usage:

- **Stable Threshold:** When memory usage exceeds `memory_controller_threshold_stable`, RisingWave begins to evict data from the operator cache with mild intensity.
- **Graceful Threshold:** Exceeding the `memory_controller_threshold_graceful` triggers a more aggressive eviction strategy.
- **Aggressive Threshold:** If memory usage surpasses `memory_controller_threshold_aggressive`, the eviction process becomes most aggressive to free up memory.

Each threshold corresponds to a specific configuration variable in the `toml` configuration file:

```toml
memory_controller_threshold_aggressive: f64,
memory_controller_threshold_graceful: f64,
memory_controller_threshold_stable: f64,
memory_controller_eviction_factor_aggressive: f64,
memory_controller_eviction_factor_graceful: f64,
memory_controller_eviction_factor_stable: f64,
```

- `memory_controller_eviction_factor_XXX`: These factors determine how aggressively data is evicted when the corresponding memory threshold is exceeded. Increasing these factors will increase the intensity of eviction.

### Example Calculation

Suppose the reserved memory is set to 30%, and `memory_controller_threshold_stable` is 0.8. RisingWave will aim to use 56% of the total memory stably during normal operations, calculated as:

```
Memory Usage = 1.0 * (1 - 0.30) * 0.8 = 0.56 = 56%
```

Typically, only during sudden spikes in throughput or when creating a new materialized view that backfills a large amount of historical data will the memory usage exceed 56%, triggering more aggressive eviction strategies.

## Tuning Recommendations

The best configuration depends on your specific workload and data pattern. We recommend monitoring the memory usage metrics available on Grafana and adjusting the parameters accordingly.

For more detailed information on how the policy adjusts the intensity of eviction, you can review the source code directly [here](https://github.com/risingwavelabs/risingwave/blob/main/src/compute/src/memory/controller.rs).

## Conclusion

Tuning the reserved memory and cache eviction policy in RisingWave can significantly impact performance. While this guide offers foundational knowledge, we encourage users to experiment with these settings in conjunction with real-time metrics from Grafana to achieve optimal results.
