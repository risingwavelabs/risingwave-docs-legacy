---
id: PrivateLink-create-a-connection
title: Create a PrivateLink connection
description: Create a PrivateLink connection.
slug: /create-a-connection
---

Follow the steps below to establish a secure connection with your private VPC through AWS PrivateLink, GCP Private Service Connect, or Azure Private Link.

## Prerequisites

- You have created a cluster in RisingWave Cloud and:
  
  - It is created with the Standard plan or Invited plan. Developer clusters do not support VPC connections. See [Choose a cluster plan](/cluster-choose-a-cluster-plan.md) for more information.
  
  - The VPC you want to connect to and your cluster must be in the same region. If your preferred region is not available when creating a cluster, contact our support team.
  
- The VPC, source/sink service, and endpoint service or service attachment are set up and running properly. If you are setting up new services, the following links might be helpful:
  
  - For AWS, see [Share your services through AWS PrivateLink](https://docs.aws.amazon.com/vpc/latest/privatelink/privatelink-share-your-services.html).
  - For GCP, see [Private Service Connect](https://cloud.google.com/vpc/docs/private-service-connect).
  - For Azure, see [Private Link documentation](https://learn.microsoft.com/en-us/azure/private-link/).

## Steps

1. Go to the [**PrivateLink**](https://cloud.risingwave.com/connection/) page and click **Create PrivateLink**.

2. For **Connection type**, select your cloud service provider. 
   
   Currently, RisingWave Cloud supports **AWS** PrivateLink, **GCP** Private Service Connect and **Azure** Private Link.

3. For **Cluster**, select the cluster you want to connect the VPC to.
   
   Ensure that the VPC and the cluster are in the same region.

4. For **Connection name**, enter a descriptive name for the connection.
   
5. Enter the service identifier.

    <details><summary>For AWS, enter the service name of the endpoint service.</summary> 

    You can find it in the [Amazon VPC console](https://console.aws.amazon.com/vpc/) → **Endpoint services** → **Service name** section.

    <img
    src={require('./images/aws-endpoint-service-name.png').default}
    alt="AWS endpoint service name"
    />

    </details>

    <details><summary>For GCP, enter the server target URL of the service attachment.</summary> 

    You can find it in the [Google Cloud Console](https://console.cloud.google.com/) → **Network services** → **Private Service Connect**.

    <img
    src={require('./images/gcp-service-attachment.png').default}
    alt="GCP Service attachment"
    />

    </details>

6. Click **Confirm** to create the connection.

## What's next

Now, you can create a source or sink with the VPC connection using SQL.

:::note
Guided setup for creating a source or sink with a VPC connection is coming soon.
:::

After you created the connection, a VPC connection endpoint is generated for your cluster. You can find it in [**Connection**](https://cloud.risingwave.com/connection/).

<img
src={require('./images/vpc-connection-endpoint.png').default}
alt="VPC connection endpoint "
/>

For details on how to use the VPC endpoint to create a source with the VPC connection, see [Create source with VPC connection](/docs/current/ingest-from-kafka/#create-source-with-vpc-connection). For creating a sink, see [Create sink with VPC connection](/docs/current/create-sink-kafka/#create-sink-with-vpc-connection).
