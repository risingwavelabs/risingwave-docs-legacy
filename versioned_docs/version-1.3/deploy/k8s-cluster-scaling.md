---
id: k8s-cluster-scaling
title: Cluster scaling
description: Cluster scaling in RisingWave.
slug: /k8s-cluster-scaling
---
<head>
  <link rel="canonical" href="https://docs.risingwave.com/docs/current/k8s-cluster-scaling/" />
</head>
This article describes how to increase or reduce nodes and customize resources for existing nodes in a RisingWave cluster that is deployed on Kubernetes.

You can adjust the computational resources of RisingWave as your workload changes. By default, RisingWave uses all the CPU cores on each node. If you add new nodes or CPUs to the cluster, you can configure RisingWave to take advantage of the additional computing power. Similarly, if the available compute resources are reduced, you can adjust the parallelism in RisingWave to optimize resource utilization.

Currently, scaling needs to be done manually. However, we are developing an automatic scaling feature to simplify the process.

## Configuring session parallelisms

RisingWave distributes its computation across lightweight threads called "streaming actors," which run simultaneously on CPU cores.

By spreading these streaming actors across cores, RisingWave achieves parallel computation, resulting in improved performance, scalability, and throughput.

You can configure the parallelism of streaming actors for the current session of a materialized view, index, sink, or table by adjusting the session variable using the following command:

```sql
SET STREAMING_PARALLELISM={num}
```

By default, the streaming parallelism is set to 0, which means that RisingWave utilizes all available CPU cores.

To get the currently configured parallelism, run the following command:

```sql
dev=> SHOW STREAMING_PARALLELISM;
 streaming_parallelism
-----------------------
 0
(1 row)
```

The value of `STREAMING_PARALLELISM` only applies to the streams created in the current session.

Please note that setting `STREAMING_PARALLELISM` to a value, for example, 4, does not parallel all fragments in 4 threads. This is because not all SQL operators can be distributed across CPU cores.

## Scaling

For the instructions below, we assume that you have deployed RisingWave on Kubernetes with [Helm](/deploy/deploy-k8s-helm.md).

The scaling commands will be issued through `risingwave ctl`, which is a command-line tool that is included in the latest version of RisingWave.

Please run this command in the meta node Pod to avoid potential connectivity issue.

```bash
kubectl exec -it my-risingwave-meta-0 -- bash -c 'cd /risingwave/bin && bash'
```

Please also remember to set the environment variable `RW_META_ADDR` to the meta node's address. As you have logged into the meta node Pod, the address is `http://127.0.0.1:5690`.

```bash
export RW_META_ADDR=http://127.0.0.1:5690
```

## Add or remove nodes

To scale out the cluster (adding nodes) to the maximum parallelism, please run:

```bash
/risingwave/bin/risingwave ctl scale horizon --include-workers all
```

You may need to update the configuration file of your Kubernetes cluster (for example, `values.yml` for deployments with Helm chart) before running the above command to scale out.

To remove a particular compute node, please run:

```bash
/risingwave/bin/risingwave ctl scale horizon --exclude-workers {hostname of the compute node}
```

You can find worker node IDs with this command:

```bash
dev=> select * from rw_worker_nodes;
 id |                                host                                | port |     type     |  state  | parallelism | is_streaming | is_serving | is_unschedulable
----+--------------------------------------------------------------------+------+--------------+---------+-------------+--------------+------------+------------------
  1 | my-risingwave-compute-0.my-risingwave-compute-headless.default.svc | 5688 | COMPUTE_NODE | RUNNING |           8 | t            | t          | f
(1 row)
```

## Adjust the parallelism of a worker node (vertical scaling)

To adjust the parallelism of a specific worker node, use the `vertical` command. Increasing the parallelism of a worker node means allocating more computing resources to it.

For example, to reduce the parallelism of `my-risingwave-compute-0` to 1, you can run:

```bash
/risingwave/bin/risingwave ctl scale vertical --workers http://my-risingwave-compute-0 \
--target-parallelism-per-worker 1
```

## Check the parallelism of a materialized view

To see if scaling operations work as expected, you can check the running parallelism for each materialized view fragment using this query:

```sql
WITH all_objects AS (
    SELECT id, name FROM rw_tables
    UNION ALL
    SELECT id, name FROM rw_materialized_views
    UNION ALL
    SELECT id, name FROM rw_sinks
    UNION ALL
    SELECT id, name FROM rw_indexes
),
fragment_parallelism AS (
    SELECT
    f.fragment_id,
    COUNT(a.actor_id) AS parallelism
    FROM rw_actors a
    INNER JOIN rw_fragments f ON a.fragment_id = f.fragment_id
    GROUP BY f.fragment_id
)
SELECT
    f.*,
    fp.parallelism
FROM all_objects ao
INNER JOIN rw_fragments f ON ao.id = f.table_id
INNER JOIN fragment_parallelism fp ON f.fragment_id = fp.fragment_id
ORDER BY ao.name;
```

To understand the output of the query, you may need to know about these two concepts: [streaming actors](/concepts/key-concepts.md#streaming-actors) and [fragments](/concepts/key-concepts.md#fragments)
