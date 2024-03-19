---
id: guide-for-too-many-streaming-jobs
title: Guide for Too Many Streaming Jobs(Table/Index/MV/Sink)
description: Do’s and don’ts when deploy cluster for many(more than 300) streaming jobs.
slug: /guide-for-too-many-streaming-jobs
---
<head>
  <link rel="canonical" href="https://docs.risingwave.com/docs/current/k8s-cluster-scaling/" />
</head>

By default, RisingWave makes Table/Index/MV/Sink(hereinafter collectively referred to as "streaming jobs") access maximum of all CPUs among the compute nodes and pursues every streaming jobs can utilizing all compute resources, designed for high performance. But when there are too many streaming jobs(more than 300) running in the cluster, this scheme is no longer optimal, considering that resources can be shared and contended by multiple streaming jobs. And using the default configuration in this case can introduce issues due to the scheduling and communicating overhead of too many tasks on the compute node, bringing bad performance and OOM risks.
This guide describes and explains some do’s and don’ts in this case.

## Necessary Cluster Settings 

Add or update the parameter setting in `risingwave/src/config/<your-config>.yaml`.
```
[meta]
disable_automatic_parallelism_control=true
default_parallelism=8
```
Adaptive parallelism feature in 1.7 is to make sure every streaming job can fully utilize all the CPUs, so we need disable it. 
The `default_parallelism` determine the parallelism for the newly created streaming jobs. Change the `streaming_parallelism` before creating streaming jobs can achieve the same effect.
About how much to set it to, see [How to adjust the resources allocated to each streaming query?](/docs/current/performance-faq#how-to-adjust-the-resources-allocated-to-each-streaming-query) for more information.

If you are want to create multiple streaming jobs at once with script or tools such as DBT. The [system parameters](../manage/view-configure-system-parameters.md) `max_concurrent_creating_streaming_jobs` is helpful, which controls the maximum number of streaming jobs created concurrently. But please do not set it too high, otherwise it will introduce too much pressure on the cluster.

## scaling and adjust actors distribution

After adding a new compute node into the cluster that has had many existing streaming jobs. The actor's distribution might be unbalanced among the compute nodes, leading to low workload on some nodes. This SQL can show the distribution of the actors on each compute node.

```SQL
select parallelism, count(*) from rw_fragment_parallelism group by parallelism;
```

To rebalance the actor, after v1.7, you can alter the streaming jobs's parallelism, and the actors will be distributed to different compute nodes automatically. Refer to [Cluster scaling](/deploy/k8s-cluster-scaling.md) for more information.
```sql
ALTER TABLE t SET PARALLELISM = 16;
```

And this SQL can generate commands for all streaming jobs. 
```SQL
select distinct 'alter ' || fp.relation_type || ' ' || fp.name || ' set parallelism = 6;' from rw_fragment_parallelism fp where fp.parallelism = 8;
```

:::caution
In some references, `/risingwave/bin/risingwave ctl scale horizon --include-workers all` is used to scale out all streaming jobs to forbid the skew of the actor distribution. But it does not satisfy the too many streaming jobs case, because it does not respect the `default_parallelism` parameter. 
:::

## Other Notifications for too many actors

You can check the total actor number with the SQL, which means how many tasks running in your cluster.

```SQL
select count(*) from rw_actors;
```

If the number is greater than 50000, please pay close attention and check the following items.

- resources of metastore(etcd) and meta node: There might be resources spike on the nodes during recovering or scaling, please try to scale up the nodes if OOM happens or there are some error logs in the meta such as `{"level":"ERROR","fields":{"message":"lease keeper failed","error":"grpc request error: status: Unavailable, message: \"etcdserver: request timed out, waiting for the applied index took too long\",}`. 

- resources of the prometheus or other monitoring systems: The number of metrics' time series grows linearly with the number of actors. So please pay attention to the workload and resources of your monitoring service.