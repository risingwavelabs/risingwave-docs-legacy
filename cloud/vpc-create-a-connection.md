---
id: vpc-create-a-connection
title: Create a VPC connection
description: Create a VPC connection through PrivateLink or Private Service Connect.
slug: /create-a-connection
---

Follow the steps below to establish a secure connection with your VPC through AWS PrivateLink or GCP Private Service Connect.

## Prerequisites

- You have created a cluster in RisingWave Cloud and:
  
  - It is created with the [customized plan](/cloud/choose-a-cluster-plan/?plan=customized). Free clusters do not support VPC connections.
  
  - The VPC you want to connect to and your cluster must be in the same region. If your preferred region is not available when creating a cluster, contact our support team.
  
- The VPC, source/sink service, and endpoint service or service attachment are set up and running properly. If you are setting up new services, the following links might be helpful:
  
  - For AWS, see [Share your services through AWS PrivateLink](https://docs.aws.amazon.com/vpc/latest/privatelink/privatelink-share-your-services.html).
  - For GCP, see [Private Service Connect](https://cloud.google.com/vpc/docs/private-service-connect).

## Steps

1. Go to the [**Connection**](https://cloud.risingwave.com/connection/) page and click **Create connection**.

    <img
    src={require('./images/create-connection-page.png').default}
    alt="Create connection page"
    />

2. For **Connection type**, select your cloud service provider. 
   
   Currently, RisingWave Cloud supports **AWS** PrivateLink and **GCP** Private Service Connect.

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

