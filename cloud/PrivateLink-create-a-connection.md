---
id: PrivateLink-create-a-connection
title: Create a PrivateLink connection
description: Create a PrivateLink connection.
slug: /create-a-connection
---

Follow the steps below to create a PrivateLink connection between RisingWave Cloud and your VPC.

## Prerequisites

- You need to create a project with the Pro plan or Enterprise plan in RisingWave Cloud:
  
  - See [Choose a project plan](/project-choose-a-project-plan.md) for more information. Please note that Developer projects do not support PrivateLink connections.
  
  - The VPC you want to connect to and your project must be in the same region. If your preferred region is not available when creating a project, contact our [support team](mailto:cloud-support@risingwave-labs.com) or [sales team](mailto:sales@risingwave-labs.com).
  
- You need to set up a PrivateLink service in your VPC and make sure it runs properly. The following links might be helpful:
  
  - For AWS, see [Share your services through AWS PrivateLink](https://docs.aws.amazon.com/vpc/latest/privatelink/privatelink-share-your-services.html).
  - For GCP, see [GCP Published services](https://cloud.google.com/vpc/docs/about-vpc-hosted-services).
  - For Azure, see [Azure Private Link services](https://learn.microsoft.com/en-us/azure/private-link/private-link-service-overview).

  :::note
   Azure Private Link integration is currently in development and will be available soon.
  :::

## Steps

1. Go to the [**PrivateLink**](https://cloud.risingwave.com/connection/) page and click **Create PrivateLink**.

2. For **Platform**, select your cloud service provider. Currently, RisingWave Cloud supports **AWS** PrivateLink and **GCP** Private Service Connect.

3. For **project**, select the project you want to connect the VPC to. Ensure that the VPC and the project are in the same region.

4. For **Name name**, enter a descriptive name for the connection.
   
5. For **Endpoint service name** or **Service attachment**:

    <details><summary>If you choose AWS as the platform, enter the service name of the endpoint service.</summary>

    You can find it in the [Amazon VPC console](https://console.aws.amazon.com/vpc/) → **Endpoint services** → **Service name** section.

    <img
    src={require('./images/aws-endpoint-service-name.png').default}
    alt="AWS endpoint service name"
    />

    </details>

    <details><summary>If you choose GCP as the platform, enter the server target URL of the service attachment.</summary> 

    You can find it in the [Google Cloud Console](https://console.cloud.google.com/) → **Network services** → **Private Service Connect**.

    <img
    src={require('./images/gcp-service-attachment.png').default}
    alt="GCP Service attachment"
    />

    </details>

6. Click **Confirm** to create the connection.

## What's next

Now, you can create a source or sink with the PrivateLink connection using SQL.

For details on how to use the VPC endpoint to create a source with the PrivateLink connection, see [Create source with PrivateLink connection](/docs/current/ingest-from-kafka/#create-source-with-privatelink-connection); for creating a sink, see [Create sink with PrivateLink connection](/docs/current/create-sink-kafka/#create-sink-with-privatelink-connection).
