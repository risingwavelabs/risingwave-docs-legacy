---
id: sql-drop-user
title: DROP USER
description: Remove a user.
slug: /sql-drop-user
---

Use the `DROP USER` command to remove a user from RisingWave.

## Syntax

```sql
DROP USER [ IF EXISTS ] user_name [ , ... ];
```


## Parameters

| Parameter                 | Description           |
| ------------------------- | --------------------- |
| **IF EXISTS**             | Do not return an error if the specified user does not exist. |
| *user_name* | The user you want to drop. <br /> - You cannot drop the current user; <br /> - To drop a superuser (user with the SUPERUSER privilege), you must be a superuser yourself; <br /> - To drop a non-superuser, you must have the CREATEUSER privilege. |



## Examples

The following statement removes the user with the name "user1".

```sql
DROP USER user1;
```

