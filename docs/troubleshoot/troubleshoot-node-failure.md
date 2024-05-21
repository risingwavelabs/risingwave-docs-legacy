---
id: troubleshoot-node-failure
title: Node failure
slug: /troubleshoot-node-failure
---
<head>
  <link rel="canonical" href="https://docs.risingwave.com/docs/current/troubleshoot-node-failure/" />
</head>

When it comes to crafting downtime-sensitive applications, users often have some common questions:

1. What happens to the RisingWave cluster when certain nodes fail?

2. Is it feasible to deploy multiple replicas of the nodes to eliminate single points of failure?

3. How can we mitigate the impact of downtime?

In this topic, we will provide answers to these questions.  However, before you continue reading, we suggest that you first explore our [fault tolerance mechanism](/fault-tolerance.md) to gain a better understanding.

---

A RisingWave cluster consists of four internal components: compute node, frontend node, meta node, and compactor node. Additionally, there is one external component: the highly available storage backend for the meta node. We will explain the above questions by node type.


## Compute nodes

When a compute node fails, the meta node stops receiving its heartbeat message, signaling a crash. The meta node then instructs all components to pause operations and awaits the return of the compute node.

If RisingWave operates on Kubernetes (which we recommend for production), and a compute node pod terminates for any reason, RisingWave relies on Kubernetes to automatically initiate a new compute node pod. The total downtime comprises two phases:

1. The time taken by Kubernetes to terminate the old pod and launch the new one.

2. The time for the new compute node to reconnect to the meta node and resume paused jobs.

It's important to mention that the duration of phase one is not under RisingWave's control and may vary based on users' Kubernetes instances, including their configuration and resource allocation. These are areas that are optimized by our RisingWave Cloud service.

On the other hand, phase two is expected to be relatively short, typically lasting only a few seconds. This is due to RisingWave's storage-decoupled architecture, which eliminates the need for data movement between the old and new compute nodes. Only lightweight metadata-level operations take place during this phase.

Based on our experience, we expect the total downtime to generally be around 20 seconds. However, with the right configuration and optimizations, it is possible to further reduce phase one, resulting in single-digit seconds of total downtime.

## Meta nodes

If a meta node fails, the cluster stops all operations until the meta node is restored. The new meta node retrieves important metadata from the high-availability storage backend and reactivates the cluster.

Given the time taken for Kubernetes to create a new pod, the recommended practice for production is to have multiple replicas of the meta node. In the event of the current active leader's failure, one of the followers assumes leadership and restores the cluster. We expect this approach to keep the downtime at a relatively low-to-medium single-digit seconds.

## Frontend nodes

When a frontend node fails, it does not affect stream processing jobs. However, if the failed frontend node is the only one in the cluster, it becomes impossible to issue SQL statements.

To enhance high availability, it is recommended to provision multiple frontend nodes. This allows them to operate independently, ensuring that even if one frontend node goes down, the others can handle incoming SQL queries effectively.

## Compactor nodes

When a compactor node fails, it does not have an immediate impact on stream processing jobs or batch queries. However, as compute nodes keep writing new files into RisingWave's storage engine, the read/write performance gradually decreases. This can result in throttling of input sources.

Since compaction is an append-only operation and does not modify files in place, compactor node crashes are rare and relatively insignificant. As long as Kubernetes restores the compactor node within the expected timeframe of 1 minute, it is not a major cause for concern.

## Highly-available metadata storage backends

RisingWave supports two types of metadata storage backends: ETCD and relational databases (Postgres by default).

ETCD is designed to be a highly available and consistent key-value storage solution. However, after equipping ETCD in the production environment for a while, we learned that ETCD can be quite demanding for the quality of the disk it operates on. You can find more details about [ETCD's hardware requirements](/deploy/hardware-requirements.md#etcd) in our documentation.

Therefore, we have decided to make RDS the default metadata storage backend starting from version v1.9.0 of RisingWave. Over time, we will gradually deprecate the support for ETCD. This decision is based on the following factors:

- RDS (Postgres in particular) is more mature regarding its performance, reliability, and transaction support.

- Major cloud vendors offer highly available RDS offerings. RDS is a more widely accepted choice.

- There are years of best practices available for operating RDS, which can be beneficial for users deploying RisingWave in their on-prem cluster.

---

We understand that terms like "zero downtime" and "high availability" are commonly used by various cloud service vendors. However, their actual meanings can differ significantly based on different assumptions and approaches.

To ensure that your specific requirements for "zero downtime" and "high availability" are met, we encourage you to join our Slack channel and reach out to our support team. By discussing your needs in detail, we can customize the RisingWave Cloud service to suit your specific requirements.