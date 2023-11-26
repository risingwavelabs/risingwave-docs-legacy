---
id: sql-alter-database
title: ALTER DATABASE
description: Modify the properties of an existing database.
slug: /sql-alter-database
---
<head>
  <link rel="canonical" href="https://docs.risingwave.com/docs/current/sql-alter-database/" />
</head>

Use the `ALTER DATABASE` command to do the following operations on a database：

+ change the owner

## Syntax

```sql
ALTER DATABASE current_database_name 
    alter_option;
```

*`alter_option`* depends on the operation you want to perform on the database.

```sql
ALTER DATABASE current_database_name
    OWNER TO new_user
```

## Change the owner

```sql title=Syntax
ALTER DATABASE current_database_name
    OWNER TO new_user;
```

:::note
To alter the owner, you must be able to `SET ROLE` to the new owning role, and you must have the `CREATEDB` privilege. Note that superusers have all these privileges automatically.
:::

|Parameter or clause        | Description           |
|---------------------------|-----------------------|
|**OWNER TO**|This clause changes the owner of the database.|
|*new_user*|The new owner you want to assign to the database.|

```sql title=Example
-- Change the owner of the database named "database1" to user "user1"
ALTER DATABASE database1 OWNER TO user1;
```
