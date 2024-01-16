---
id: sql-alter-database
title: ALTER DATABASE
description: Modify the properties of a database.
slug: /sql-alter-database
---
<head>
  <link rel="canonical" href="https://docs.risingwave.com/docs/current/sql-alter-database/" />
</head>

The `ALTER DATABASE` command modifies the definition of a database.

## Syntax

```sql
ALTER DATABASE database_name 
    alter_option;
```

*`alter_option`* depends on the operation you want to perform on the database. For all supported clauses, see the sections below.

## Clause

### `OWNER TO`

```sql title=Syntax
ALTER DATABASE database_name
    OWNER TO new_user;
```

|Parameter or clause        | Description           |
|---------------------------|-----------------------|
|**OWNER TO**|This clause changes the owner of the database. To alter the owner, you must be able to `SET ROLE` to the new owning role, and you must have the `CREATEDB` privilege. Note that superusers have all these privileges automatically.|
|*new_user*|The new owner you want to assign to the database.|

```sql title=Example
-- Change the owner of the database named "database1" to user "user1"
ALTER DATABASE database1 OWNER TO user1;
```

### `RENAME TO`

```sql title=Syntax
ALTER DATABASE database_name
    RENAME TO new_name;
```

|Parameter or clause        | Description           |
|---------------------------|-----------------------|
|**RENAME TO**|This clause changes the name of the database. Only the database owner or a superuser can rename a database; non-superuser owners must also have the `CREATEDB` privilege. The current database cannot be renamed. (Connect to a different database if you need to do that.)|
|*new_name*|The new name of the database.|

```sql title=Example
-- Change the name of the database named "database" to "database1"
ALTER DATABASE database RENAME TO database1;
```
