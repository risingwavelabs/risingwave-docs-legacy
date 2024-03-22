---
id: guide-for-many-streaming-jobs
title: Guide for Many Streaming Jobs
description: Do’s and don’ts when deploy cluster for many (more than 300) streaming jobs.
slug: /guide-for-many-streaming-jobs
---
<head>
  <link rel="canonical" href="https://docs.risingwave.com/docs/current/k8s-cluster-scaling/" />
</head>

By default, RisingWave makes Table/Index/MV/Sink (hereinafter collectively referred to as "streaming jobs") access maximum of all CPUs among the compute nodes and pursues every streaming jobs can utilizing all compute resources, designed for high performance. But when there are too many streaming jobs (more than 300) running in the cluster, this scheme is no longer optimal, considering that resources can be shared and contended by multiple streaming jobs. And using the default configuration in this case can introduce issues due to the scheduling and communicating overhead of too many tasks on the compute node, bringing bad performance and OOM risks.
This guide describes and explains some do’s and don’ts in this case.

Even with the correct cluster settings in place, RisingWave may still become overloaded, potentially causing performance issues such as high latency and even out-of-memory errors due to excessive workload. We recommend users increase resources if the issues still exist after all the optimizations below. We remark that scaling up/down/in/out in RW is easy and super quick. We advise users to adjust resources by trial and error.

## Recommended cluster settings 

For clusters that are predicted to create more than 300 materialized views, the following configurations are worth noting.

### Set the default parallelism

Add or update the parameter setting in `risingwave/src/config/<your-config>.yaml`.
```
[meta]
disable_automatic_parallelism_control=true
default_parallelism=8
```
Adaptive parallelism feature in 1.7 is to make sure every streaming job can fully utilize all the CPUs, so we need disable it. 
The `default_parallelism` determine the parallelism for the newly created streaming jobs. Change the `streaming_parallelism` before creating streaming jobs can achieve the same effect.
About how much to set it to, see [How to adjust the resources allocated to each streaming query?](/docs/current/performance-faq#how-to-adjust-the-resources-allocated-to-each-streaming-query) for more information.

### Limit the concurrency of creating stream jobs

If you are want to create multiple streaming jobs at once with script or tools such as DBT. The [system parameters](../manage/view-configure-system-parameters.md) `max_concurrent_creating_streaming_jobs` is helpful, which controls the maximum number of streaming jobs created concurrently. 
But please do not set it too high, otherwise it will introduce too much pressure on the cluster.

## Tuning an exists cluster

You can check the total actor number with the SQL, which means how many actors running in your cluster.

```SQL
select count(*) from rw_actors;
```

If the number is greater than 50000, please pay close attention and check the following items.

### decrease the parallelism

As mentioned at the beginning of the article, too much parallelism can be counterproductive when the total number of actors in the cluster is large.
After v1.7, you can check the parallelism number of the running streaming jobs in the system table `rw_fragment_parallelism`, and you can alter the streaming jobs's parallelism with the `ALTER` statement. Refer to [Cluster scaling](/deploy/k8s-cluster-scaling.md) for more information.

Here is an example to adjust the parallelism.


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

### adjust actors distribution

After adding a new compute node into the cluster that has had many existing streaming jobs. The actor's distribution might be unbalanced among the compute nodes, leading to low workload on some nodes. This SQL can show the distribution of the actors on each compute node.

```SQL
select worker_id, count(*) from rw_actors a, rw_parallel_units p where a.parallel_unit_id = p.id group by p.worker_id;
```
Here is an example of an unbalanced result. The number of actors on worker node 12001 is much lower than on the other two worker nodes.
```
worker_id|count|
---------+-----+
    12001|  720|
    12002|23455|
    12003|23300|
```

To rebalance the actor, after v1.7, you can use the alter parallelism statement above, and the actors will be distributed to different compute nodes automatically.
```

:::caution
In some references, `/risingwave/bin/risingwave ctl scale horizon --include-workers all` is used to scale out all streaming jobs to forbid the skew of the actor distribution. But it does not satisfy the too many streaming jobs case, because it does not respect the `default_parallelism` parameter. 
:::

## Other precautions for too many actors

- resources of metastore (etcd) and meta node: There might be resources spike on the nodes during recovering or scaling, please try to scale up the nodes if OOM happens or there are some error logs in the meta such as `{"level":"ERROR","fields":{"message":"lease keeper failed","error":"grpc request error: status: Unavailable, message: \"etcdserver: request timed out, waiting for the applied index took too long\",}`. 

- resources of the prometheus or other monitoring systems: The number of metrics' time series grows linearly with the number of actors. So please pay attention to the workload and resources of your monitoring service.