---
id: sql-alter-schema
title: ALTER SCHEMA
description: Modify the properties of an existing schema.
slug: /sql-alter-schema
---
<head>
  <link rel="canonical" href="https://docs.risingwave.com/docs/current/sql-alter-schema/" />
</head>

Use the `ALTER SCHEMA` command to do the following operations on a schema:

+ change the owner

To use `ALTER SCHEMA`, you must own the schema.

## Syntax

```sql
ALTER SCHEMA current_schema_name 
    alter_option;
```

*`alter_option`* depends on the operation you want to perform on the schema.

```sql
ALTER SCHEMA current_schema_name
    OWNER TO new_user
```

## Change the owner

```sql title=Syntax
ALTER SCHEMA current_schema_name
    OWNER TO new_user;
```

:::note
 To alter the owner, you must be able to `SET ROLE` to the new owning role, and you must have the `CREATEDB` privilege. Note that superusers have all these privileges automatically.
:::

|Parameter or clause        | Description           |
|---------------------------|-----------------------|
|**OWNER TO**|This clause changes the owner of the schema.|
|*new_user*|The new owner you want to assign to the schema.|

```sql title=Example
-- Change the owner of the schema named "schema1" to user "user1"
ALTER SCHEMA schema1 OWNER TO user1;
```
