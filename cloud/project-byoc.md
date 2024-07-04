---
id: project-byoc
title: Bring your own cloud
description: Use the BYOC plan to create custom clouds.
slug: /project-byoc
---

The Bring Your Own Cloud (BYOC) plan offers you the flexibility to tailor your cloud infrastructure instead of depending on a hosted service. It allows you to utilize the advantages of your chosen cloud provider, maintain full control over your environment, and adjust configurations to suit your specific needs. This guide outlines the services that RisingWave deploys in a BYOC environment and walks you through the process of enabling BYOC in a step-by-step manner.

:::note
We currently support AWS and GCS as the cloud platform. Azure integration is in development and will be available soon.
:::

## Architecture overview

Before creating a BYOC deployment, familiarize yourself with the following architecture. In the BYOC environment, the entire data plane is deployed in the user's space. To manage the RisingWave clusters within this environment, we deploy two key services for operation delegation:

- **Agent Service**: This service manages Kubernetes (K8s) and cloud resources. It handles tasks such as managing RisingWave Pods, storage services (including AWS S3, GCS, and Azure Blob Storage), IAM roles/accounts associated with the RisingWave cluster, network endpoints, etc.

- **RWProxy**: This is a TCP proxy that routes SQL statements from the control plane to the appropriate RisingWave instances.

## Create a BYOC environment

Follow the steps below to create your own cloud environment.

1. Navigate to the [**Project**](https://cloud.risingwave.com/project/home/) page and click **Create a project**.

2. On the right-side panel, choose **Enterprise** and enter your invitation code. If you do not have an invitation code, please contact our [support team](mailto:cloud-support@risingwave-labs.com) or [sales team](mailto:sales@risingwave-labs.com) to obtain one.

3. Once you've redeemed the invitation code, select **BYOC** as the deployment type, and select your cloud platform as AWS or GCP (see [Resource and permission](#resource-and-permission) for more details), region, and ID as necessary.

4. After configuring these settings, you'll see additional instructions on your screen. Follow these steps to establish your BYOC environment. Please be aware that the final command `rwc byoc apply --name xxx` may take 30 to 40 minutes to complete, and a progress bar will be shown to keep you updated. During this time, it's crucial to ensure a stable internet connection. If the command is interrupted or fails due to network instability, you can safely retry it.

    :::tip
    When you run the command `rwc byoc apply --name xxx`, it will deploy some resources in your AWS/GCP/Azure environment, such as AWS S3/Google Cloud Storage/Azure Blob Storage and EKS/GKE/AKS clusters. Please do not modify the configuration of these resources. If you encounter any issues during this process, please contact our [support team](mailto:cloud-support@risingwave-labs.com).
    :::

5. Click **Next** to continue the configuration of cluster size and nodes. To learn more about the nodes, see the [architecture of RisingWave](/docs/current/architecture).

6. Click **Next**, name your cluster, and execute the command that pops up to establish a BYOC cluster in your environment.

Once the cluster is successfully created, you can manage it through the portal just like hosted clusters.

## Resource and permission

When you customize your cloud platform, refer to the following notes to see what we've set up for you and the permissions you need to enable.

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

<Tabs queryString="method">

<TabItem value="AWS" label="AWS">

- **Required service-linked role**

    The role `AWSServiceRoleForAutoScaling` needs to be in place. If it is not ready yet, you need to create it manually. See [Create a service-linked role](https://docs.aws.amazon.com/autoscaling/ec2/userguide/autoscaling-service-linked-role.html#create-service-linked-role-manual) for detailed steps.

- **Required quota increase**

    For optimal performance, the quota for managed node groups per cluster should be increased to 36 or more. See [Service quotas](https://docs.aws.amazon.com/eks/latest/userguide/service-quotas.html#sq-text) for more details.

- **Required permissions for BYOC environment creation/deletion**

    We recommend using an IAM role/user with Administrator permissions for the AWS account to deploy the infrastructure.

- **Resources provisioned in BYOC environment**

    We will set up the following resources in a BYOC environment:

    - 1 VPC: including VPC, its subnets, security, and IPs to host all BYOC resources.
    - 1 EKS cluster: to host all service and RisingWave clusters workloads.
    - 2 S3 buckets: for RisingWave cluster data and infra state data respectively.
    - 2 Internal network load balancer: to expose Agent Service and RWProxy.
    - 1 External network load balancer (optional): to expose RWProxy to the Internet.
    - A few IAM roles for EKS and K8s workloads, and Each role is granted the least privilege it requires.

- **Required permission for deployed services**

    - ec2:DescribeVpcEndpoints
    - ec2:DescribeVpcEndpointServices
    - ec2:DescribeSubnets
    - s3:*
    - aps:GetLabels
    - aps:GetMetricMetadata
    - aps:GetSeries
    - aps:QueryMetrics

</TabItem>

<TabItem value="GCP" label="GCP">

- **Required APIs for BYOC environment creation/deletion**
    
    You need to enable the following APIs to create or delete a BYOC environment:

    - **Compute Engine API** for VPC resources provision.
    - **Cloud DNS API** for VPC private service connect setup.
    - **Kubernetes Engine API** for provisioning the GKE cluster the data plane is hosted.
    - **Cloud Resource Manager API** for IAM provisioning.

- **Required permission for BYOC environment creation/deletion**

    Before running the command-line interface to create or delete a BYOC environment, you need to have a Google IAM (IAM user/Service account) with the following roles.

    - [Compute Network Admin](https://cloud.google.com/iam/docs/understanding-roles#compute.networkAdmin)
    - [Compute Security Admin](https://cloud.google.com/iam/docs/understanding-roles#compute.securityAdmin)
    - [DNS Administrator](https://cloud.google.com/iam/docs/understanding-roles#dns.admin)
    - [Kubernetes Engine Admin](https://cloud.google.com/iam/docs/understanding-roles#container.admin)
    - [Security Admin](https://cloud.google.com/iam/docs/understanding-roles#iam.securityAdmin)
    - [Service Account Admin](https://cloud.google.com/iam/docs/understanding-roles#iam.serviceAccountAdmin)
    - [Service Account User](https://cloud.google.com/iam/docs/understanding-roles#iam.serviceAccountUser)
    - [Storage Admin](https://cloud.google.com/iam/docs/understanding-roles#storage.admin)

    :::note
    These permissions are only required for creating or deleting a BYOC environment. Once the environment is up and running, limited permissions are needed to operate the services.
    :::

- **Resources provisioned in BYOC environment**

    We will set up the following resources in a BYOC environment:

    - 1 VPC: including VPC, its subnets, firewalls, IPs to host all BYOC resources.
    - 1 GKE cluster: to host all service and RisingWave clusters workloads.
    - 2 GCS buckets: for RisingWave cluster data and infra state data respectively.
    - 2 Internal network load balancer: to expose Agent Service and RWProxy.
    - 1 External network load balancer (optional): to expose RWProxy to the Internet.
    - A few IAM roles for EKS and K8s workloads, and each role is granted the least privilege it requires.

- **Required permission for deployed services**

    We will provision a Google Service Account for the deployed services. The services require the following permissions:

    - [Storage Admin](https://cloud.google.com/iam/docs/understanding-roles#storage.admin) to manage GCS objects and bucket access for RisingWave clusters.
    - [Compute Network Admin](https://cloud.google.com/iam/docs/understanding-roles#compute.networkAdmin) to manage private links for the source/sink of RisingWave clusters.
    - [Service Account Admin](https://cloud.google.com/iam/docs/understanding-roles#iam.serviceAccountAdmin) to manage the IAM service account RisingWave clusters.

</TabItem>

<TabItem value="Azure" label="Azure (coming soon)">

- **Required feature flags**

    You need to enable the feature flag `EnableAPIServerVnetIntegrationPreview` for the subscription to deploy a BYOC environment. See [Feature flag](https://learn.microsoft.com/en-us/azure/aks/api-server-vnet-integration#register-the-enableapiservervnetintegrationpreview-feature-flag) for more details.

- **Required permission for BYOC environment creation/deletion**

    We recommend utilizing a service principal or user with owner permissions of the Azure subscription to provision the infrastructure.

- **Resources provisioned in BYOC environment**

    We will set up the following resources in a BYOC environment:

    - 1 VPC: including VPC, its subnets, firewalls, IPs to host all BYOC resources.
    - 1 AKS cluster: to host all service and RisingWave clusters workloads.
    - 2 Azure storage account with on blob container in it: for RisingWave cluster data and infra state data respectively.
    - 2 Internal network load balancer: to expose Agent Service and RWProxy.
    - 1 External network load balancer (optional): to expose RWProxy to the Internet.
    - A few user-assigned identities for AKS workloads, and each identity is granted the least privilege it requires.

- **Required permission for deployed services**

    - Role [Storage Blob Data Contributor](https://learn.microsoft.com/en-us/azure/role-based-access-control/built-in-roles/storage#storage-blob-data-contributor)
    - Role [Network Contributor](https://learn.microsoft.com/en-us/azure/role-based-access-control/built-in-roles/networking#network-contributor)
    - Role [Managed Identity Contributor](https://learn.microsoft.com/en-us/azure/role-based-access-control/built-in-roles/identity#managed-identity-contributor)
    - Role [Role Based Access Control Administrator](https://learn.microsoft.com/en-us/azure/role-based-access-control/built-in-roles/general#role-based-access-control-administrator)
    - Role [Monitoring Reader](https://learn.microsoft.com/en-us/azure/role-based-access-control/built-in-roles/monitor#monitoring-reader)
    - A custom role with `Microsoft.Network/networkInterfaces/read` permission
    - A custom role with `Microsoft.ManagedIdentity/userAssignedIdentities/federatedIdentityCredentials/*` permission

</TabItem>

</Tabs>

## Delete a BYOC environment

Follow the steps below to delete a BYOC environment deployed in your cloud.

1. Delete all BYOC clusters running in the environment. Navigate to the [**Clusters**](https://cloud.risingwave.com/clusters/) page, click the delete icon to delete all of your BYOC clusters.

2. Delete resources you created that are not managed by RisingWave, such as VPC Peerings, GCP Firewalls, and other common resources you might have used.

3. Open the terminal and execute the following commands:

    ```shell
    $ rwc byoc terminate --name default-byoc-environment # This may take 2-3 minutes.
    $ rwc byoc delete --name default-byoc-environment # This may take 30-40 minutes.
    ```
