---
id: sql-drop-user
title: DROP USER
description: Remove a user.
slug: /sql-drop-user
---

Use the `DROP USER` command to remove a user from RisingWave.

## Syntax

```sql
DROP ROLE [ IF EXISTS ] user_name [ , ... ];
```


## Parameters

| Parameter                 | Description           |
| ------------------------- | --------------------- |
| **IF EXISTS**             | Do not return an error if the specified user does not exist. |
| *user_name* | The user you want to drop. You cannot remove the current user account. |



## Examples

The following statement removes the user with the name "user1".

```sql
DROP USER user1;
```

