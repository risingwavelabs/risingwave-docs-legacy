---
id: privatelink-create-a-connection
title: Create a PrivateLink connection
description: Create a PrivateLink connection.
slug: /create-a-connection
---

Follow the steps below to create a PrivateLink connection between RisingWave Cloud and your VPC.

## Prerequisites

- You need to create a project with the Standard plan or Advanced plan in RisingWave Cloud:

  - See [Choose a project plan](/project-choose-a-project-plan.md) for more information. Please note that Trial projects do not support PrivateLink connections.

  - The VPC you want to connect to and your project must be in the same region. If your preferred region is not available when creating a project, contact our [support team](mailto:cloud-support@risingwave-labs.com) or [sales team](mailto:sales@risingwave-labs.com).

- You need to set up a PrivateLink service in your VPC and make sure it runs properly. The following links might be helpful:

  - For AWS, see [Share your services through AWS PrivateLink](https://docs.aws.amazon.com/vpc/latest/privatelink/privatelink-share-your-services.html).
  - For GCP, see [GCP Published services](https://cloud.google.com/vpc/docs/about-vpc-hosted-services).
  - For Azure, see [Azure Private Link services](https://learn.microsoft.com/en-us/azure/private-link/private-link-service-overview).

## Steps

1. Go to the [**Project**](https://cloud.risingwave.com/project/home/) page and select the project you want to connect the VPC to.

2. Select **PrivateLink** tab, and click **Create PrivateLink**.

3. For **Name**, enter a descriptive name for the connection.

4. For **Endpoint service name** or **Service attachment** or **Private link service resource ID:**

    <details>
    <summary>If you choose AWS as the platform, enter the service name of the endpoint service.</summary>

    You can find it in the [Amazon VPC Console](https://console.aws.amazon.com/vpc/) → **Endpoint services** → **Service name** section.

    ![AWS endpoint service name](./images/aws-endpoint-service-name.png)

    </details>

    <details>
    <summary>If you choose GCP as the platform, enter the server target URL of the service attachment.</summary>

    You can find it in the [Google Cloud Console](https://console.cloud.google.com/) → **Network services** → **Private Service Connect**.

    ![GCP Service attachment](./images/gcp-service-attachment.png)

    </details>

    <details>
    <summary>If you choose Azure as the platform, enter the Private link service resource ID.</summary>

    You can find it in the [Azure Portal](https://portal.azure.com/) → **Private link service** section.

    ![Azure Resource id](./images/azure-resource-id.png)

    </details>

5. Click **Confirm** to create the connection.

:::tip
Currently, PrivateLink for Confluent private Kafka clusters requires two manual steps:

- Before provisioning a RisingWave PrivateLink, ensure the cluster's Availability Zones (AZs) are a subset of the AZs offered by RisingWave.

- Manually add DNS records after provisioning the PrivateLink.

We plan to automate this process in the future. If you encounter any issues or have questions, please contact our [support team](mailto:cloud-support@risingwave-labs.com).
:::

## What's next

Now, you can create a source or sink with the PrivateLink connection using SQL.

For details on how to use the VPC endpoint to create a source with the PrivateLink connection, see [Create source with PrivateLink connection](/docs/current/ingest-from-kafka/#create-source-with-privatelink-connection); for creating a sink, see [Create sink with PrivateLink connection](/docs/current/create-sink-kafka/#create-sink-with-privatelink-connection).
