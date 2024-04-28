---
id: cluster-bring-your-own-cloud
title: Bring your own cloud
description: You can use the BYOC cluster types to create custom clouds.
slug: /bring-your-own-cloud
---

The Bring Your Own Cloud (BYOC) plan offers you the flexibility to tailor your cloud infrastructure instead of depending on a hosted service. It allows you to utilize the advantages of your chosen cloud provider, maintain full control over your environment, and adjust configurations to suit your specific needs. This guide outlines the services that RisingWave deploys in a BYOC environment and walks you through the process of enabling BYOC in a step-by-step manner.

## Getting started

Before creating a BYOC deployment, familiarize yourself with the following architecture. In the BYOC environment, the entire data plane is deployed in the user's space. To manage the RisingWave clusters within this environment, we deploy two key services for operation delegation:

- **Agent Service**: This service manages Kubernetes (K8s) and cloud resources. It handles tasks such as managing RisingWave Pods, Google Cloud Storage (GCS) buckets, IAM roles/accounts associated with the RisingWave cluster, network endpoints, etc.

- **RWProxy**: This is a TCP proxy that routes SQL statements from the control plane to the appropriate RisingWave instances.

## Enable BYOC

Follow the steps below to create your own cloud environment using RisingWave's BYOC plan.

1. Navigate to the [**Clusters**](https://cloud.risingwave.com/clusters/) page and click **Create cluster**.

2. On the right-side panel, choose **Enterprise** and enter your invitation code. If you do not have an invitation code, please contact our [support team](mailto:cloud-support@risingwave-labs.com) or [sales team](mailto:sales@risingwave-labs.com) to obtain one.

3. Once you've redeemed the invitation code, select **BYOC** as the deployment type, and select your cloud platform as AWS or GCP (see [Resources and permissions](#resources-and-permissions) for more details), region, and ID as necessary.

   :::note
   Azure integration is currently in development and will be available soon.
   :::

4. After making these configurations, an additional instruction will appear on the screen. Follow it to prepare your BYOC environment.

5. Click **Next** to continue the configuration of cluster size and nodes. To learn more about the nodes, see the [architecture of RisingWave](/docs/current/architecture).

6. Click **Next**, name your cluster, and run the commands that appear to create a BYOC cluster in the created environment.

## Resources and permissions

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

    - [Kubernetes Engine Admin](https://cloud.google.com/iam/docs/understanding-roles#container.admin)
    - [Compute Network Admin](https://cloud.google.com/iam/docs/understanding-roles#compute.networkAdmin)
    - [Compute Security Admin](https://cloud.google.com/iam/docs/understanding-roles#compute.securityAdmin)
    - [Storage Admin](https://cloud.google.com/iam/docs/understanding-roles#storage.admin)
    - [Security Admin](https://cloud.google.com/iam/docs/understanding-roles#iam.securityAdmin)
    - [Service Account Admin](https://cloud.google.com/iam/docs/understanding-roles#iam.serviceAccountAdmin)

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

- **Required Permission for deployed services**

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

## Security enhancement

To ensure secure communication between the control plane and the data plane within RisingWave's infrastructure, we have implemented [VPC endpoints](https://docs.aws.amazon.com/whitepapers/latest/aws-privatelink/what-are-vpc-endpoints.html) in AWS, [private service connect](https://cloud.google.com/vpc/docs/private-service-connect) in GCP, and [private endpoints](https://learn.microsoft.com/en-us/azure/private-link/private-endpoint-overview) in Azure. These configurations restrict the access to Agent service and RWProxy exclusively to the RisingWave control plane VPC.

To further enhance security, mutual Transport Layer Security (mTLS) is used for the connection between the control plane and the Agent service, and DB credentials are used for the connection between the control plane and RWProxy.

Moreover, to extend accessibility, RWProxy is configured to interface with the public network. This allows external access to the frontend of RisingWave clusters, enabling users to seamlessly transmit SQL statements to RW clusters from external environments.