---
id: hardware-requirements
title: Hardware requirements
description: Hardware requirements and recommendations for production deployments.
slug: /hardware-requirements
---
<head>
  <link rel="canonical" href="https://docs.risingwave.com/docs/current/resource-planning/" />
</head>

This topic describes hardware requirements and recommendations for production deployments. Actual resource requirements may vary based on your specific workload.

## Supported architectures

RisingWave can run on the following hardware architectures:

- x86_64 (64-bit Intel/AMD CPUs)
- ARM64
- Mac with Apple Silicon

## Compute nodes

Compute nodes handle query processing and state management. More resources enable higher query throughput. For cost efficiency, machines with high memory-to-CPU ratios (4:1 or higher) are recommended due to RisingWave's memory-intensive nature.

- Minimal:
  - 4 CPU cores
  - 4 GB memory
- Recommended:
  - ≥8 CPU cores
  - ≥8 GB memory

## Compactor nodes

Compactor nodes perform background compaction jobs to optimize state storage. Insufficient resources for compactors will result in slow state access and impact overall performance.

- Minimal:
  - 1 CPU core
  - 1 GB memory
- Recommended:
  - ≥2 CPU cores
  - ≥2 GB memory

## Frontend nodes

Frontend nodes parse queries and create execution plans. They can operate with minimal resources.

- Minimal: None, since Frontends are stateless
- Recommended:
  - ≥2 CPU cores
  - ≥1 GB memory

## Meta nodes

Meta nodes manage metadata and coordinate the cluster. It is advisable to deploy 2 meta nodes (primary and backup) to ensure faster recovery and avoid single points of failure (SPOF).

- Minimal:
  - 1 CPU core
  - 1 GB memory
- Recommended:
  - ≥2 CPU cores
  - ≥4 GB memory

## Etcd

RisingWave utilizes etcd for persisting data for meta nodes. It is crucial to note that etcd is highly sensitive to disk write latency. Slow disk performance can increase etcd request latency and potentially impact cluster stability.

To optimize performance and stability, please consider the following recommendations:

- For optimum disk performance, we recommend using local SSDs or high-performance virtualized block devices. If deploying etcd on Amazon EBS, we recommend gp3 or faster SSD volumes.
- If you have a single meta node, increase the value of `meta_leader_lease_secs` to optimize performance.
- If using MinIO, avoid deploying etcd and MinIO on the same disks to prevent conflicts or performance degradation.
- For detailed disk performance requirements and recommendations, refer to the [Disks](https://etcd.io/docs/v3.3/op-guide/hardware/#disks) section in the etcd documentation.
