---
id: troubleshoot-recovery-failure
title: Recovery failure
slug: /troubleshoot-recovery-failure
---

## Overview

When there are some problems in the RisingWave cluster, such as node restart and network abnormalities, the cluster will enter recovery processing to ensure data consistency. But some issues might also cause recovery failure, leading the cluster to be in a constant recovering state and unavailable. 

## Possible causes

It’s important to identify the root cause of the issue. Some common reasons for recovery failures include:

- Continuous OOM of compute nodes
- Unconventional compute node scaling down situation resulting in insufficient schedulable resources
- Network connectivity problems

### Continuous OOM of compute nodes

How to identify:

1. When the meta node continues to enter the recovery state or when the actor keeps exiting during the recovery process.
2. Check if the CN node is continuously restarting due to OOM, refer to: [Out-of-memory](troubleshoot-oom.md).

Two solutions:

1. Increase the allocated memory resources for compute nodes.
2. Decrease the parallelism of the running streaming jobs or drop problematic streaming jobs.
    1. `alter system set pause_on_next_bootstrap to true;`
    2. Reboot the meta service, then the cluster will enter safe mode after recovery.
    3. Drop the problematic streaming jobs or scale in them using `risectl` , refer to: [scaling risingwave](/deploy/k8s-cluster-scaling.md).
    4. Restart the meta node, or resume the cluster by: `risectl meta resume`.

### Unconventional CN scaling down

How to identify:

1. When the cluster is waiting for new nodes to join during the recovery process, such as when there are these logs: `waiting for new workers to join, elapsed xxxs`
2. Check if the available parallel units of the compute nodes in the cluster have decreased.
    1. Check if the cluster has actively offline some compute nodes.
    2. Check if reduced CPU resource allocation for some compute nodes and they have been offline for over 5 mins.

Solution:

1. Manually specify the parallelism of the compute nodes and restart, parameter: `-parallelism`, or temporarily launch some compute nodes to meet the requirements of parallelism.
2. After that to avoid some OOM issues, we’d better do some scaling: decrease the parallelism of all running streaming jobs or scale out from the temporary nodes.
3. Change back to the new parallelism.
    1. If you specified the parallelism of the compute nodes and don't want to specify the parallelism manually to create streaming jobs every time, you can:
        1. Stop the compute nodes.
        2. Unregister them in cluster: `risectl meta unregister-workers --workers <worker_id or worker_host, ...>`
        3. Remove the parameter `-parallelism` and start the compute nodes.
    2. Offline temporary nodes.

Other: all these kinds of cases will be covered by `auto scaling` feature that is on the way.

### Network connection issues

How to identify:

When there is a network connection problem between the meta and compute nodes, as well as between the meta and etcd nodes, the recovery of the cluster will also continue to fail. You may find some logs like `connection refused` or `error trying to connect: dns error: failed to lookup address information: Name or service not known`.

Solution:

Please check the network configuration of the deployment environment and whether the operators of k8s are working properly.