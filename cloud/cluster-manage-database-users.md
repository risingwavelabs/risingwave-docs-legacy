---
id: cluster-manage-database-users
title: Manage database users
description: A database user allows a person or application to access a specific database or set of databases within a cluster.
slug: /cluster-manage-database-users
---

In RisingWave Database, a database user is similar to a database user/role in Postgres, allowing a person or application to access a specific database or set of databases within a cluster. Also, you [connect and log in to a cluster](cluster-connect-to-a-cluster.md) as one of the database users in it. Database users can be assigned specific permissions to control their database privileges.

:::info
In the Beta version, all users are superusers. More permission controls for creating new databases and users and login permissions will be available in future releases.
:::

<grid
 nums={2}
 cols={2}
 children={[

 <div>

 <card
 title="Create a user"
 content="You can create a database user in several ways."
 cloud="cluster-create-a-database-user"
 />
 <card
 title="Change user password"
 content="You can change the password of any database users in your cluster."
 cloud="cluster-change-database-user-password"
 />
 <card
 title="Delete a user"
 content="If you no longer need a database user, you can delete it."
 cloud="cluster-delete-a-database-user"
 />

 </div>,

 <div>


 </div>
 ]}
 />
