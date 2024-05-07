---
id: sql-alter-table
title: ALTER TABLE
description: Modify the structure of an existing table.
slug: /sql-alter-table
---
<head>
  <link rel="canonical" href="https://docs.risingwave.com/docs/current/sql-alter-table/" />
</head>

Use the `ALTER TABLE` command to modify the structure of an existing regular table by adding or deleting its columns. Tables defined with connector settings but without a schema registry can be altered. 


## Syntax

```sql
ALTER TABLE table_name alter_option;
```

*`alter_option`* depends on the operation you want to perform on a table.

## Adding a new column

```sql title=alter_option
ADD [ COLUMN ] column_name data_type [ PRIMARY KEY ] [ DEFAULT default_expr ]
```

:::note
Columns added by this command cannot be used by any existing materialized views or indexes. You must create new materialized views or indexes to reference it.
:::

| Parameter or clause | Description                                     |
| ------------------- | ----------------------------------------------- |
| **ADD [ COLUMN ]**  | `COLUMN` is optional.                           |
| *column_name*       | Specify the name of the column you want to add. |
| *data_type*         | The data type of the new column.                |
|**DEFAULT**|The `DEFAULT` clause allows you to assign a default value to a column. This default value is used when a new row is inserted, and no explicit value is provided for that column. `default_expr` is any constant value or variable-free expression that does not reference other columns in the current table or involve subqueries. The data type of `default_expr` must match the data type of the column.<br/>If `default_expr` is impure, such as using a function like `now()`, all historical data will be filled with the result of the expression evaluated at the time the statement was executed. For future insertions, the default expression will be evaluated at the time of each respective insertion.|

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
