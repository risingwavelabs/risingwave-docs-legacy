---
id: k8s-cluster-scaling
title: Cluster scaling
description: Cluster scaling in RisingWave.
slug: /k8s-cluster-scaling
---
This article describes how to increase or reduce nodes and customize resources for existing nodes in a RisingWave cluster that is deployed on Kubernetes.

You can adjust the computational resources of RisingWave as your workload changes. By default, RisingWave uses all the CPU cores on each node. If you add new nodes or CPUs to the cluster, you can configure RisingWave to take advantage of the additional computing power. Similarly, if the available compute resources are reduced, you can adjust the parallelism in RisingWave to optimize resource utilization.

Currently, scaling needs to be done manually. However, we are developing an automatic scaling feature to simplify the process.

For the instructions below, we assume that you have deployed RisingWave on Kubernetes with the [RisingWave Operator](/deploy/risingwave-kubernetes.md) or [Helm](/deploy/deploy-k8s-helm.md).

## Preparations

The scaling commands will be issued through `risingwave ctl`, which is a command-line tool that is included in the latest version of RisingWave. To use this tool, you must set an environmental varaible and connect to the meta node in the cluster.

### Set environmental variable for the meta node address

Please set the environment variable `RW_META_ADDR` to the meta node's address. You can find the hostname of the meta node via `kubectl get svc`. The hostname is the service name.

```bash
# Suppose the helm release name is my-risingwave. The hostname is typically
# 'my-risingwave-meta-headless'
export RW_META_ADDR=http://{hostname}:5690
```

### Connect to the meta node

To connect to the meta node, please run this command in a pod within the same cluster:

```bash
kubectl apply -f risingwave-ctl.yaml
kubectl exec -it risingwave-ctl -- bash -c 'cd /risingwave/bin && bash'
```

After you are connected to the meta node, you can perform scaling operations on the cluster.

## Add or remove nodes

To scale out the cluster (adding nodes) to the maximum parallelism, please run:

```bash
./risingwave ctl scale horizon --include-workers all
```

You may need to update the configuration file of your Kubernetes cluster (for example, `values.yml` for deployments with Helm chart) before running the above command to scale out.

To remove a particular compute node, please run:

```bash
./risingwave ctl scale horizon --exclude-workers {hostname of the compute node}
```

## Increase or reduce computing resources of existing nodes

To adjust the parallelism of a specific worker node, use the `vertical` command. Increasing the parallelism of a worker node means allocating more computing resources to it.

For example, to reduce the parallelism of `my-risingwave-compute-0` to 1, you can run:

```bash
./risingwave ctl scale vertical --workers http://my-risingwave-compute-0 \
--target-parallelism-per-worker 1
```

## Concept: Streaming actors and parallelism

RisingWave distributes its computation across lightweight threads called "streaming actors," which run simultaneously on CPU cores.

By spreading these streaming actors across cores, RisingWave achieves parallel computation, resulting in improved performance, scalability, and throughput.

You can configure the parallelism of streaming actors for the current session of a materialized view, index, sink, or table by adjusting the session variable using the following SQL command:

```sql
SET STREAMING_PARALLELISM={num}
```

By default, the streaming parallelism is set to 0, which means that RisingWave utilizes all available CPU cores.

To check the currently configured parallelism, run the following SQL command:

```sql
dev=> SHOW STREAMING_PARALLELISM;
 streaming_parallelism
-----------------------
 0
(1 row)
```

Please note that setting `STREAMING_PARALLELISM` to 4 does not necessarily mean that all streaming actors will be parallelized across 4 threads. Not all SQL operators can be distributed across CPU cores.
