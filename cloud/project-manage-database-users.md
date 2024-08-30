---
id: project-manage-database-users
title: Manage database users
description: A database user allows a person or application to access a specific database or set of databases within a project.
slug: /manage-database-users
---

<!-- MDX imports -->
import OutlinedCard from "@site/src/components/OutlinedCard";
import ResponsiveGrid from "@site/src/components/ResponsiveGrid";

In RisingWave, a database user is similar to a database user or role in Postgres, allowing a person or application to access a specific database or set of databases within a project. Also, you [connect and log in to a project](project-connect-to-a-project.md) as one of its database users. Database users can be assigned specific permissions to control their database privileges. Currently, all database users have the superuser privilege. Future releases will introduce more granular permissions.

<ResponsiveGrid
 container
 direction="row"
 spacing="15"
 justifyContent="space-between"
 justifyItems="stretch"
 alignItems="stretch">

<ResponsiveGrid item xs={12} sm={6} md={4}>

<OutlinedCard
style={{height: "87%"}}
title="Create a user"
content="You can create a database user in several ways."
cloud="create-a-database-user"
/>

</ResponsiveGrid>

<ResponsiveGrid item xs={12} sm={6} md={4}>

<OutlinedCard
style={{height: "87%"}}
title="Change user password"
content="You can change the password of any database users in your project."
cloud="change-database-user-password"
/>

</ResponsiveGrid>

<ResponsiveGrid item xs={12} sm={6} md={4}>

<OutlinedCard
style={{height: "87%"}}
title="Delete a user"
content="If you no longer need a database user, you can delete it."
cloud="delete-a-database-user"
/>

</ResponsiveGrid>

</ResponsiveGrid>

