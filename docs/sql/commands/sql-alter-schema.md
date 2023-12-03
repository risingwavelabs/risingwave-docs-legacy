---
id: sql-alter-schema
title: ALTER SCHEMA
description: Modify the properties of a schema.
slug: /sql-alter-schema
---
<head>
  <link rel="canonical" href="https://docs.risingwave.com/docs/current/sql-alter-schema/" />
</head>

The `ALTER SCHEMA` command modifies the definition of a schema. To use this command, you must own the schema.

## Syntax

```sql
ALTER SCHEMA current_schema_name 
    alter_option;
```

*`alter_option`* depends on the operation you want to perform on the schema. For all supported clauses, see the sections below.

## Clause

### `OWNER TO`

```sql title=Syntax
ALTER SCHEMA current_schema_name
    OWNER TO new_user;
```

|Parameter or clause        | Description           |
|---------------------------|-----------------------|
|**OWNER TO**|This clause changes the owner of the schema. To alter the owner, you must be able to `SET ROLE` to the new owning role, and you must have the `CREATEDB` privilege. Note that superusers have all these privileges automatically.|
|*new_user*|The new owner you want to assign to the schema.|

```sql title=Example
-- Change the owner of the schema named "schema1" to user "user1"
ALTER SCHEMA schema1 OWNER TO user1;
```

### `RENAME TO`

```sql title=Syntax
ALTER SCHEMA current_schema_name
    RENAME TO new_name;
```

|Parameter or clause        | Description           |
|---------------------------|-----------------------|
|**RENAME TO**|This clause changes the name of the schema. To rename a schema you must also have the `CREATE` privilege for the database. Note that superusers have the privilege automatically.|
|*new_name*|The new name of the schema.|

```sql title=Example
-- Rename the schema named "schema0" to "schema1".
ALTER SCHEMA schema0 RENAME TO schema1;
```
