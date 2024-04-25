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

3. Once you've redeemed the invitation code, select **BYOC** as the deployment type, and customize your cloud platform ([AWS](#additional-notes-for-aws) or [GCP](#additional-notes-for-gcp)), region, and ID as necessary.

4. After making these configurations, an additional instruction will appear on the screen. Follow it to prepare your BYOC environment.

5. Click **Next** to continue the configuration of cluster size and nodes. To learn more about the nodes, see the [architecture of RisingWave](/docs/current/architecture).

6. Click **Next**, name your cluster, and run the commands that appear to build a BYOC cluster in the created environment.

## Additional notes for AWS

### Service-linked role

The role `AWSServiceRoleForAutoScaling` needs to be in place. If it hasn't been provisioned yet, you will need to create it manually. See [Create a service-linked role](https://docs.aws.amazon.com/autoscaling/ec2/userguide/autoscaling-service-linked-role.html#create-service-linked-role-manual) for detailed steps.

### Quota Increase
For optimal performance, the quota for managed node groups per cluster should be increased to 36 or more. See [Service quotas](https://docs.aws.amazon.com/eks/latest/userguide/service-quotas.html#sq-text) for more details.

## Additional notes for GCP


