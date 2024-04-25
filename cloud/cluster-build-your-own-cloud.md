---
id: cluster-build-your-own-cloud
title: Build your own cloud
description: You can use the BYOC cluster types to create custom clouds.
slug: /build-your-own-cloud
---

The Build Your Own Cloud (BYOC) cluster allows you to design and customize your own cloud environment tailored to your specific requirements. This guide will outline the services deployed by RisingWave and the steps to enable BYOC cluster types.

## Getting started with BYOC

Before you start creating your own cloud, you need to understand the basic components and services that RisingWave provides:

- **Agent service**: This service is responsible for managing Kubernetes (K8s) and cloud resources. It handles RisingWave Pods, Google Cloud Storage (GCS) buckets, IAM roles/accounts associated with the RisingWave cluster, network endpoints, and more.

- **RWProxy**: This is a TCP proxy that routes SQL statements from the main system to the user-deployed RisingWave instances.

## Step-by-step guide

You can now proceed to create your own cloud environment using RisingWave's BYOC cluster types.

1. Navigate to the [**Clusters**](https://cloud.risingwave.com/clusters/) page and click **Create cluster**.

2. On the right-side panel, choose **Enterprise** and enter your invitation code. If you do not have an invitation code, please contact our [support team](mailto:cloud-support@risingwave-labs.com) or [sales team](mailto:sales@risingwave-labs.com) to obtain one.

3. Once you've redeemed the invitation code, select **BYOC** as the deployment type, and customize your cloud platform, region, and ID as necessary.

4. After making these configurations, an additional instruction will appear on the screen. Follow it to prepare your BYOC environment.

5. Click **Next** to continue the configuration of cluster size and nodes. To learn more about the nodes, see [Understanding nodes in RisingWave](#understanding-nodes-in-risingwave).

6. Click **Next**, name your cluster, and run the commands that appear to build a BYOC cluster in the created environment.


