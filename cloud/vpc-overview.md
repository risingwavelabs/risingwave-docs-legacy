---
id: vpc-overview
title: VPC connection
description: Manage VPC connections.
slug: /vpc-overview
---

## Concept

If you want to connect to a cloud-hosted source or sink, there might be connectivity issues when your service is located within a virtual private cloud (VPC) that is not publicly accessible. 

To establish a secure and direct connection between the VPC and your clusters in RisingWave Cloud and allow RisingWave to read consumer messages from the broker or send messages to the broker, you need to establish a VPC connection.

<img
src={require('./images/vpc-diagram.png').default}
alt="VPC connection diagram"
/>

## Connecting to VPCs

RisingWave Cloud supports VPC connections through AWS PrivateLink and GCP Private Service Connect.

You can go to the [**Connection**](https://cloud.risingwave.com/connection/) page to manage your VPC connections.

<img
  src={require('./images/connection-page.png').default}
  alt="Connection page"
/>

<grid
 container
 direction="row"
 spacing="15"
 justifyContent="space-between"
 justifyItems="stretch"
 alignItems="stretch">

<grid item xs={12} sm={6} md={6}>

<card
title="Create a connection"
content="Create a VPC connection through PrivateLink or Private Service Connect."
cloud="create-a-connection"
style={{height: "80%"}}
/>

</grid>

<grid item xs={12} sm={6} md={6}>

<card
title="Drop a connection"
content="If you no longer need to connect to a VPC, you can drop the connection."
cloud="drop-a-connection"
style={{height: "80%"}}
/>
  
</grid>

</grid>
