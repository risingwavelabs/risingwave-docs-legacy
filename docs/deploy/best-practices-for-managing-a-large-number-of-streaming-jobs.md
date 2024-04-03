---
id: best-practices-for-managing-a-large-number-of-streaming-jobs
title: Best practices for managing a large number of streaming jobs
description: Do’s and don’ts when deploy cluster for many (more than 300) streaming jobs.
slug: /best-practices-for-managing-a-large-number-of-streaming-jobs
---
<head>
  <link rel="canonical" href="https://docs.risingwave.com/docs/current/k8s-cluster-scaling/" />
</head>

By default, RisingWave is configured to utilize the maximum available CPUs across compute nodes for streaming jobs. In RisingWave, a streaming job refers to the creation of a table, source, index, materialized view, or sink. This design aims to achieve high performance by fully utilizing compute resources.

However, this default configuration may not be optimal when the number of streaming jobs running in the cluster exceeds 300. In such cases, resource sharing and contention among multiple streaming jobs can arise. Also, due to the high number of tasks scheduled and communicating on the compute node, the default configuration can lead to poor performance and increased risks of Out of Memory (OOM) errors. This guide describes and explains some do’s and don’ts in this case.

Even with the correct cluster settings in place, RisingWave may still experience overload, leading to performance issues such as high latency and  OOM errors. In such cases, we recommend users to consider increasing resources to address these issues. RisingWave offers the flexibility to scale up, down, in, or out, making it easy and quick to adjust resources as needed. We advise users to adjust resources through a trial and error approach.

## Recommended cluster settings

For clusters that are expected to create more than 300 materialized views, these configurations can help optimize the performance and resource utilization of the cluster.

### Set the default parallelism

Add or update the parameter setting in `risingwave/src/config/<your-config>.yaml`.

```
[meta]
disable_automatic_parallelism_control=true
default_parallelism=8
```

The adaptive parallelism feature in version 1.7.0 ensures that every streaming job can fully utilize all available CPUs. Therefore, we need to disable it. The `default_parallelism` setting determines the parallelism for newly created streaming jobs. Change the `streaming_parallelism` before creating streaming jobs can achieve the same effect. For guidance on how to set this value, refer to [How to adjust the resources allocated to each streaming query?](/docs/current/performance-faq#how-to-adjust-the-resources-allocated-to-each-streaming-query).

### Limit the concurrency of creating stream jobs

If you want to create multiple streaming jobs at once using scripts or tools such as DBT, the [system parameters](../manage/view-configure-system-parameters.md) `max_concurrent_creating_streaming_jobs` is helpful. It controls the maximum number of streaming jobs created concurrently. However, please do not set it too high, as it may introduce excessive pressure on the cluster.

## Tuning an existing cluster

You can check the total number of actors using the following SQL command. It indicates how many actors are running in your cluster.

```sql
select count(*) from rw_actors;
```

If the number exceeds 50000, please pay close attention and check the following items.

### Decrease the parallelism

When the total number of actors in the cluster is large, excessive parallelism can be counterproductive. After v1.7.0, you can check the parallelism number of the running streaming jobs in the system table `rw_fragment_parallelism`, and you can alter the streaming jobs's parallelism with the `ALTER` statement. For more information, refer to [Cluster scaling](/deploy/k8s-cluster-scaling.md).

Here is an example of how to adjust the parallelism.

```sql
/* get the current parallelism of the running streaming jobs*/
dev=> select * from rw_fragment_parallelism;
  id  |    name     |   relation_type   | fragment_id | distribution_type | state_table_ids | upstream_fragment_ids |        flags        | parallelism 
------+-------------+-------------------+-------------+-------------------+-----------------+-----------------------+---------------------+-------------
 1003 | table_xxx_1 | table             |           6 | HASH              | {}              | {}                    | {SOURCE,DML}        |           4
 1003 | table_xxx_1 | table             |           5 | HASH              | {1003}          | {6}                   | {MVIEW}             |           4
 1006 | table_xxx_4 | table             |          12 | HASH              | {}              | {}                    | {SOURCE,DML}        |           16
 1006 | table_xxx_4 | table             |          11 | HASH              | {1006}          | {12}                  | {MVIEW}             |           16
 1005 | table_xxx_3 | table             |          10 | HASH              | {}              | {}                    | {SOURCE,DML}        |           32
 1005 | table_xxx_3 | table             |           9 | HASH              | {1005}          | {10}                  | {MVIEW}             |           32
 1004 | table_xxx_2 | table             |           8 | HASH              | {}              | {}                    | {SOURCE,DML}        |           32
 1004 | table_xxx_2 | table             |           7 | HASH              | {1004}          | {8}                   | {MVIEW}             |           32
 1013 | other_mv    | materialized view |          16 | HASH              | {1014,1013}     | {5}                   | {MVIEW,STREAM_SCAN} |           32
 1009 | mv_xxx_2    | materialized view |          14 | HASH              | {1010,1009}     | {7}                   | {MVIEW,STREAM_SCAN} |           32
 1011 | mv_xxx_3    | materialized view |          15 | HASH              | {1012,1011}     | {9}                   | {MVIEW,STREAM_SCAN} |           32
 1007 | mv_xxx_1    | materialized view |          13 | HASH              | {1008,1007}     | {5}                   | {MVIEW,STREAM_SCAN} |           4
(12 rows)

/* generate the alter statement sql to decrease parallelism for some jobs with some condition*/
dev=> select distinct 'alter ' || fp.relation_type || ' ' || fp.name || ' set parallelism = 4;' as sql 
from rw_fragment_parallelism fp 
where fp.parallelism > 4 and fp.name like '%_xxx_%';
                       sql                        
-------------------------------------------------------
 alter table table_xxx_4 set parallelism = 4;
 alter materialized view mv_xxx_2 set parallelism = 4;
 alter materialized view mv_xxx_3 set parallelism = 4;
 alter table table_xxx_2 set parallelism = 4;
 alter table table_xxx_3 set parallelism = 4;
(5 rows)

/* alter them one by one*/
dev=>  alter table table_xxx_4 set parallelism = 4;
ALTER_TABLE
dev=>  alter materialized view mv_xxx_2 set parallelism = 4;
ALTER_MATERIALIZED_VIEW
dev=>  alter materialized view mv_xxx_3 set parallelism = 4;
ALTER_MATERIALIZED_VIEW
dev=>  alter table table_xxx_2 set parallelism = 4;
ALTER_TABLE
dev=>  alter table table_xxx_3 set parallelism = 4;
ALTER_TABLE
```

### Adjust actors distribution

After adding a new compute node to a cluster with many existing streaming jobs, the distribution of actors among the compute nodes might become unbalanced, resulting in low workload on some nodes. This SQL query can display the distribution of actors on each compute node.

```sql
select worker_id, count(*) from rw_actors a, rw_parallel_units p where a.parallel_unit_id = p.id group by p.worker_id;
```

Here is an example of an unbalanced result. The number of actors on worker node 12001 is much lower than the other two worker nodes.

```
worker_id|count|
---------+-----+
    12001|  720|
    12002|23455|
    12003|23300|
```

To rebalance the actor, you can use the alter parallelism statement mentioned above after v1.7.0, and the actors will be distributed to different compute nodes automatically.

:::caution
In some references, `/risingwave/bin/risingwave ctl scale horizon --include-workers all` is used to scale out all streaming jobs to avoid the skewed actor distribution. However, this approach may not be sufficient when dealing with a large number of streaming jobs, as it does not consider the `default_parallelism` parameter.
:::

## Other precautions for too many actors

- Resources of meta store (etcd) and meta node: During recovering or scaling processes,there might be spikes in resource usage on the nodes. If you encounter OOM errors or observe some error logs in the meta such as `{"level":"ERROR","fields":{"message":"lease keeper failed","error":"grpc request error: status: Unavailable, message: \"etcdserver: request timed out, waiting for the applied index took too long\",}`, please try to scale up the nodes.

- Resources of the prometheus or other monitoring systems: The number of metrics' time series grows linearly with the number of actors, so please pay attention to the resource requirements of your monitoring system and ensure that it can handle the growing number of metrics efficiently.
