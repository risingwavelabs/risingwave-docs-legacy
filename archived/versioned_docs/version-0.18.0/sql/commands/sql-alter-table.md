---
id: sql-alter-table
title: ALTER TABLE
description: Modify the structure of an existing table.
slug: /sql-alter-table
---
<head>
  <link rel="canonical" href="https://docs.risingwave.com/docs/current/sql-alter-table/" />
</head>

Use the `ALTER TABLE` command to modify the structure of an existing regular table by adding or deleting its columns.

:::note
Currently, `ALTER TABLE` does not support tables with connector settings (i.e. materialized sources created with [`CREATE TABLE`](sql-create-table.md)). This functionality will be available in future releases.
:::

## Syntax

```sql
ALTER TABLE table_name alter_option;
```

*`alter_option`* depends on the operation you want to perform on a table.

## Adding a new column

```sql title=alter_option
ADD [ COLUMN ] column_name data_type [ PRIMARY KEY ]
```

:::note
Columns added by this command cannot be used by any existing materialized views or indexes. You must create new materialized views or indexes to reference it.
:::

| Parameter or clause | Description                                     |
| ------------------- | ----------------------------------------------- |
| **ADD [ COLUMN ]**  | `COLUMN` is optional.                           |
| *column_name*       | Specify the name of the column you want to add. |
| *data_type*         | The data type of the new column.                |

```sql title=Example
-- Add a column named "age" to a table named "employees" with a data type of integer
ALTER TABLE employees ADD age int;
```

## Dropping an existing column

```sql title=alter_option
DROP [ COLUMN ] [ IF EXISTS ] column_name
```

:::note
You cannot drop columns referenced by materialized views or indexes.
:::

| Parameter or clause | Description                                                                                |
| ------------------- | ------------------------------------------------------------------------------------------ |
| **DROP [ COLUMN ]** | `COLUMN` is optional.                                                                      |
| *column_name*       | Specify the column you want to remove.                                                     |
| **IF EXISTS**       | Do not return an error if the specified column does not exist. A notice is issued instead. |

```sql title=Example
-- Remove a column named "fax" from the "employees" table
ALTER TABLE employees DROP fax;
```
