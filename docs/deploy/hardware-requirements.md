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

- Minimum:
  - 2 CPU cores
  - 8 GB memory
- Recommended:
  - ≥4 CPU cores
  - ≥16 GB memory

## Compactor nodes

Compactor nodes perform background compaction jobs to optimize state storage. Insufficient resources for compactors will result in slow state access and impact overall performance.

- Minimum:
  - 1 CPU core
  - 1 GB memory
- Recommended:
  - ≥2 CPU cores
  - ≥2 GB memory

## Meta nodes

Meta nodes manage metadata and coordinate the cluster. It is advisable to deploy 2 meta nodes (primary and backup) to ensure faster recovery and avoid single points of failure (SPOF).

- Minimum:
  - 1 CPU core
  - 1 GB memory
- Recommended:
  - ≥2 CPU cores
  - ≥4 GB memory

## Storage

RisingWave offers support for multiple storage systems as storage backends. For the complete list of supported storage systems for Kubernetes deployments, see [Set up a RisingWave cluster in Kubernetes](/deploy/risingwave-kubernetes.md#deploy-a-risingwave-instance).

Please notice that storage performance can **significantly** impact RisingWave's performance. We recommend using high-performance cloud storage systems such as AWS S3. For self-managed storage systems such as MinIO or local file system, please ensure to use high-performance SSD disks.