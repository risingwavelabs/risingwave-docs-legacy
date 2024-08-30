---
id: PrivateLink-overview
title: PrivateLink connection
description: Manage PrivateLink connections.
slug: /PrivateLink-overview
---

<!-- MDX imports -->
import OutlinedCard from "@site/src/components/OutlinedCard";
import ResponsiveGrid from "@site/src/components/ResponsiveGrid";

## Concept

In RisingWave Cloud, if you want to connect RisingWave instances with your services inside your private Virtual Private Cloud (VPC) network, you can use the PrivateLink service to establish a private and secure connection between RisingWave Cloud and your private VPC in the same region.

RisingWave Cloud utilizes the the private connection capability of the underlying Cloud vendors to establish the PrivateLink connection. In particular, the PrivateLink service is built on top of the following services:

- [AWS PrivateLink](https://docs.aws.amazon.com/vpc/latest/privatelink/what-is-privatelink.html)
- [GCP Private Service Connect](https://cloud.google.com/vpc/docs/private-service-connect)
- [Azure Private Link](https://learn.microsoft.com/en-us/azure/private-link/)

:::note
Azure Private Link integration is currently in development and will be available soon.
:::

The diagram below depicts a high-level overview of how PrivateLink service works. Both all three platforms share the same pattern of network structure so that you can configure them in the same way automatically.

<img
src={require('./images/PrivateLink-diagram.png').default}
alt="VPC connection diagram"
/>

On the **RisingWave Cloud** side, RisingWave Cloud will create an endpoint (specifically an AWS VPC endpoint, GCP Private Service Connect endpoint, or Azure private endpoint) and bind it with one running RisingWave project.

On the **Customer** side, you need to set up a PrivateLink service (specifically an AWS endpoint service, GCP published service, or Azure Private Link service) in your VPC network first.

<ResponsiveGrid
 container
 direction="row"
 spacing="15"
 justifyContent="space-between"
 justifyItems="stretch"
 alignItems="stretch">

<ResponsiveGrid item xs={12} sm={6} md={6}>

<OutlinedCard
title="Create a connection"
content="Create a PrivateLink connection between RisingWave Cloud and your VPC."
cloud="create-a-connection"
style={{height: "80%"}}
/>

</ResponsiveGrid>

<ResponsiveGrid item xs={12} sm={6} md={6}>

<OutlinedCard
title="Drop a connection"
content="If you no longer need to connect to a VPC, you can drop the connection."
cloud="drop-a-connection"
style={{height: "80%"}}
/>

</ResponsiveGrid>

</ResponsiveGrid>
