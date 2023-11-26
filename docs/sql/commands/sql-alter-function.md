---
id: sql-alter-function
title: ALTER FUNCTION
description: Modify the properties of an existing function.
slug: /sql-alter-function
---
<head>
  <link rel="canonical" href="https://docs.risingwave.com/docs/current/sql-alter-function/" />
</head>

Use the `ALTER FUNCTION` command to do the following operations on a function:

+ change the schema

To use `ALTER FUNCTION`, you must own the function.

## Syntax

```sql
ALTER FUNCTION function( argument_type [, ...] )
    alter_option;
```

*`alter_option`* depends on the operation you want to perform on the function.

```sql
ALTER FUNCTION function( argument_type [, ...] )
    SET SCHEMA schema_name
```

## Change the schema

```sql title=Syntax
ALTER FUNCTION function( argument_type [, ...] )
    SET SCHEMA schema_name;
```

:::note

To change a function's schema, you must also have `CREATE` privilege on the new schema.

:::

| Parameter or clause | Description |
| ------------------- | ----------------------------------------------- |
|**SET SCHEMA**| This clause changes the schema of the function.|
| *schema_name* | Specify the schema to which you want to change. |

```sql title=Example
-- Change the schema of the function named "test_func" to a schema named "test_schema"

ALTER FUNCTION test_func SET SCHEMA test_schema;
```
