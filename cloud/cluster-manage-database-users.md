---
id: cluster-manage-database-users
title: Manage database users
description: A database user allows a person or application to access a specific database or set of databases within a cluster.
slug: /manage-database-users
---

In RisingWave Database, a database user is similar to a database user/role in Postgres, allowing a person or application to access a specific database or set of databases within a cluster. Also, you [connect and log in to a cluster](cluster-connect-to-a-cluster.md) as one of the database users in it. Database users can be assigned specific permissions to control their database privileges.

:::info
In the Beta version, all users are superusers. More permission controls for creating new databases and users and login permissions will be available in future releases.
:::


<grid
 container
 direction="row"
 spacing="15"
 justifyContent="space-between"
 justifyItems="stretch"
 alignItems="stretch">

<grid item xs={12} sm={6} md={4}>

<card
style={{height: "87%"}}
title="Create a user"
content="You can create a database user in several ways."
cloud="create-a-database-user"
/>

</grid>

<grid item xs={12} sm={6} md={4}>

<card
style={{height: "87%"}}
title="Change user password"
content="You can change the password of any database users in your cluster."
cloud="change-database-user-password"
/>
  
</grid>

<grid item xs={12} sm={6} md={4}>

<card
style={{height: "87%"}}
title="Delete a user"
content="If you no longer need a database user, you can delete it."
cloud="delete-a-database-user"
/>
  
</grid>

</grid>

