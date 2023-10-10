---
id: risingwave-k8s-helm
title: Deploy RisingWave on Kubernetes with Helm
description: Deploy RisingWave in a Kubernetes cluster with Helm.
slug: /risingwave-k8s-helm
---
<head>
  <link rel="canonical" href="https://docs.risingwave.com/docs/current/risingwave-k8s-helm/" />
</head>

This guide walks you through the process of deploying RisingWave in a single Kubernetes cluster with Helm.

## Prerequisites

- A running Kubernetes cluster (version 1.24 or higher). For details about starting a Kubernetes cluster, see Kubernetes' [Getting started guide](https://kubernetes.io/docs/setup/).

- Helm 3.0 or higher is installed in your environment and configured to work with your Kubernetes cluster. To learn about how to install Helm, see the [Helm documentation](https://helm.sh/docs/intro/install/).

- Ensure you allocate enough resources for the deployment. For details about minimal and recommended resources, see [Resource planning](/deploy/resource-planning.md).s
