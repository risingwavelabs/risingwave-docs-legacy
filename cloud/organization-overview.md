---
id: organization-overview
title: Organization
description: Manage your organization. Share resources with others. Collaborate with your team.
slug: /organization-overview
---

<!-- MDX imports -->
import OutlinedCard from "@site/src/components/OutlinedCard";
import Grid2 from "@mui/material/Grid2";

## Concept

In RisingWave Cloud, an organization serves as the central entity that owns all resources, such as accounts, projects, database objects, and VPC connections. Each organization provides all associated users with access to the same set of resources for seamless collaboration among them. When you sign up for RisingWave Cloud, an organization is automatically created for you.

In an organization, you can:

- Share projects, databases (and their tables, sources, sinks, and views), VPC connections, and other resources with all users.

- Allow users to manage the resources.

- Set up Single Sign-On (SSO).

- Set up service accounts for your applications that access RisingWave Cloud using API keys.


## Manage your organization

<Grid2 container spacing={1}>

<Grid2 size={{ xs: 12, sm: 6, md: 6 }}>

<OutlinedCard
title="Invite and manage users"
content="Invite others to your organization and manage them. Share your projects, databases, and other resources with your team."
cloud="manage-users"
style={{height: "87%"}}
/>

</Grid2>

<Grid2 size={{ xs: 12, sm: 6, md: 6 }}>

<OutlinedCard
title="Set up Single Sign-On (SSO)"
content="Set up SSO for your organization so that users can log in to RisingWave Cloud using their SSO credentials."
cloud="sso"
style={{height: "87%"}}
/>

</Grid2>

</Grid2>

<!--
<Grid2 container spacing={1}>

<Grid2 size={{ xs: 12, sm: 6, md: 6 }}>

<OutlinedCard
title="Set up service accounts"
content="Set up service accounts for your applications that access RisingWave Cloud using API keys."
cloud="organization-service-account"
style={{height: "87%"}}
/>

</Grid2>

<Grid2 size={{ xs: 12, sm: 6, md: 6 }}>



</Grid2>

</Grid2> -->
