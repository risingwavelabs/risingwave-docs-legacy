---
id: sql-alter-function
title: ALTER FUNCTION
description: Modify the properties of a function.
slug: /sql-alter-function
---
<head>
  <link rel="canonical" href="https://docs.risingwave.com/docs/current/sql-alter-function/" />
</head>

The `ALTER FUNCTION` command modifies the definition of a function. To use this command, you must own the function.

## Syntax

```sql
ALTER FUNCTION function( argument_type [, ...] )
    alter_option;
```

*`alter_option`* depends on the operation you want to perform on the function. For all supported clauses, see the sections below.

## Clause

### `SET SCHEMA`

```sql title=Syntax
ALTER FUNCTION function( argument_type [, ...] )
    SET SCHEMA schema_name;
```

| Parameter or clause | Description |
| ------------------- | ----------------------------------------------- |
|**SET SCHEMA**| This clause changes the schema of the function. To change a function's schema, you must also have `CREATE` privilege on the new schema.|
| *schema_name* | Specify the schema to which you want to change. |

```sql title=Example
-- Change the schema of the function named "test_func" to a schema named "test_schema"
ALTER FUNCTION test_func(INT) SET SCHEMA test_schema;
```
