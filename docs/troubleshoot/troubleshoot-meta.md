---
id: troubleshoot-meta
title: Meta failure
slug: /troubleshoot-meta
---

## Overview

If the meta fails to start or abruptly exits during operation, there is currently only one known issue that can cause this problem: the meta node fails to remain active while participating in the campaign.

## Symptoms

If you come across the following logs in the meta node, it is likely that you are encountering this particular issue.

1. `lease timeout`

2. `ERROR risingwave_meta::rpc::election_client: keep alive failed, stopping main loop`

## Possible causes

The observed issue is most likely a result of ETCD experiencing fluctuations, which can be attributed to either using a low-quality disk for ETCD or sending excessively large requests to it.

## Solutions

1. Check the [notes about disks for etcd in our documentation](/deploy/hardware-requirements.md#etcd).

1. Check etcd configures, whether `-auto-compaction-mode`, `-max-request-bytes` are set properly.

1. If only one meta node is deployed, you can set the parameter `meta_leader_lease_secs` to `86400` to avoid impact on leader election by the disk performance. For multi-node deployment, you can also increase the value of this parameter.

1. For better performance and stability of the cluster, it is recommended to use higher-performance disks and configure etcd correctly.

## Further explanation

Our meta is designed for a multi-node solution. The election at the underlying level depends on etcd’s fair election algorithm. Therefore, each meta needs to maintain a connection to etcd for keep-alive purposes, which specifically involves continuously updating the etcd key’s lease.

Moreover, we currently only support the behavior of upgrading from follower to leader. Our meta does not support downgrading from leader to follower. If our leader loses leadership, we’re helpless and must actively exit as quickly as possible to prevent inconsistencies brought by two leaders (such as in the case of barrier manager).

Therefore, this behavior heavily relies on the performance of etcd. When etcd is deployed in environments such as mechanical disks, virtual disks, or network disks, if there’s a massive amount of traffic in risingwave leading to high-load writes by meta on etcd, this will cause a large number of timeouts in etcd. This can lead to consecutive failures of election keep alive, thereby leading to our active exit.

Therefore, when we only have one meta node, this election behavior is actually unnecessary. We can set the election lease to an infinitely large value, even to one whole day as 86400 seconds.