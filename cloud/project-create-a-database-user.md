---
id: project-create-a-database-user
title: Create a database user
description: Create a database user in a project.
slug: /create-a-database-user
---


Choose one of the following to create a [database user](project-manage-database-users.md).

- You can create a database user when [connecting to a project](project-connect-to-a-project.md).

- You can click **Create user** in the **Users** tab on the [project details page](project-check-status-and-metrics.md#check-project-details) to create a new user.

- You can run the [CREATE USER](/docs/current/sql-create-user/) command to create a new user after [connecting to a project](project-connect-to-a-project.md) using the console or terminal.

    Ensure that you have logged in to the project with a user that has the `CREATEUSER` privilege. A super user has all privileges, including `CREATEUSER`.
