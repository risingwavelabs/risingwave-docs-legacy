---
id: sql-alter-connection
title: ALTER CONNECTION
description: Modify the properties of an existing connection.
slug: /sql-alter-connection
---
<head>
  <link rel="canonical" href="https://docs.risingwave.com/docs/current/sql-alter-connection/" />
</head>

Use the `ALTER CONNECTION` command to do the following operations on a connection:

+ change the schema

To use `ALTER CONNECTION`, you must own the connection.

## Syntax

```sql
ALTER CONNECTION connection_name
    alter_option;
```

*`alter_option`* depends on the operation you want to perform on the connection.

```sql
ALTER CONNECTION connection_name
    SET SCHEMA schema_name
```

## Change the schema

```sql title=Syntax
ALTER CONNECTION connection_name
    SET SCHEMA schema_name;
```

:::note

To change a connection's schema, you must also have `CREATE` privilege on the new schema.

:::

| Parameter or clause | Description |
| ------------------- | ----------------------------------------------- |
|**SET SCHEMA**| This clause changes the schema of the connection.|
| *schema_name* | Specify the schema to which you want to change. |

```sql title=Example
-- Change the schema of the connection named "test_conn" to a schema named "test_schema"
ALTER CONNECTION test_conn SET SCHEMA test_schema;
```
