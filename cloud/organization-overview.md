---
id: organization-overview
title: Organization
description: Manage your organization. Share resources with others. Collaborate with your team.
slug: /organization-overview
---

## Concept

In RisingWave Cloud, an organization serves as the central entity that owns all resources, such as accounts, clusters, database objects, and VPC connections. Each organization provides all associated users with access to the same set of resources for seamless collaboration among them. When you sign up for RisingWave Cloud, an organization is automatically created for you. 

In an organization, you can:

- Share clusters, databases (and their tables, sources, sinks, and views), VPC connections, and other resources with all users.

- Allow users to manage the resources.

- Set up Single Sign-On (SSO).

- Set up service accounts for your applications that access RisingWave Cloud using API keys.


## Manage your organization

<grid
 container
 direction="row"
 spacing="15"
 justifyContent="space-between"
 justifyItems="stretch"
 alignItems="stretch">

<grid item xs={12} sm={6} md={6}>

<card
title="Invite and manage users"
content="Invite others to your organization and manage them. Share your clusters, databases, and other resources with your team."
cloud="manage-users"
style={{height: "87%"}}
/>

</grid>

<grid item xs={12} sm={6} md={6}>

<card
title="Set up Single Sign-On (SSO)"
content="Set up SSO for your organization so that users can log in to RisingWave Cloud using their SSO credentials."
cloud="sso"
style={{height: "87%"}}
/>
  
</grid>

</grid>

<grid
 container
 direction="row"
 spacing="15"
 justifyContent="space-between"
 justifyItems="stretch"
 alignItems="stretch">

<grid item xs={12} sm={6} md={6}>

<card
title="Set up service accounts"
content="Set up service accounts for your applications that access RisingWave Cloud using API keys."
cloud="organization-service-account"
style={{height: "87%"}}
/>
  
</grid>

<grid item xs={12} sm={6} md={6}>


  
</grid>

</grid>
