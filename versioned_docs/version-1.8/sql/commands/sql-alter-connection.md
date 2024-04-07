---
id: sql-alter-connection
title: ALTER CONNECTION
description: Modify the properties of a connection.
slug: /sql-alter-connection
---
<head>
  <link rel="canonical" href="https://docs.risingwave.com/docs/current/sql-alter-connection/" />
</head>

The `ALTER CONNECTION` command modifies the definition of a connection. To use this command, you must own the connection.

## Syntax

```sql
ALTER CONNECTION connection_name
    alter_option;
```

*`alter_option`* depends on the operation you want to perform on the connection. For all supported clauses, see the sections below.

## Clause

### `SET SCHEMA`

```sql title=Syntax
ALTER CONNECTION connection_name
    SET SCHEMA schema_name;
```

| Parameter or clause | Description |
| ------------------- | ----------------------------------------------- |
|**SET SCHEMA**| This clause changes the schema of the connection. To change a connection's schema, you must also have `CREATE` privilege on the new schema.|
| *schema_name* | Specify the schema to which you want to change. |

```sql title=Example
-- Change the schema of the connection named "test_conn" to a schema named "test_schema"
ALTER CONNECTION test_conn SET SCHEMA test_schema;
```
