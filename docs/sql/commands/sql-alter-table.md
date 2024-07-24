---
id: sql-alter-table
title: ALTER TABLE
description: Modify the properties of a table.
slug: /sql-alter-table
---
<head>
  <link rel="canonical" href="https://docs.risingwave.com/docs/current/sql-alter-table/" />
</head>

The `ALTER TABLE` command modifies the definition of a table.

## Syntax

```sql
ALTER TABLE table_name 
    alter_option;
```

*`alter_option`* depends on the operation you want to perform on the table. For all supported clauses, see the sections below.

## Clauses

### `ADD COLUMN`

```sql title=Syntax
ALTER TABLE table_name 
    ADD [ COLUMN ] column_name data_type [ PRIMARY KEY ] [ DEFAULT default_expr ];
```

| Parameter or clause | Description                                     |
| ------------------- | ----------------------------------------------- |
| **ADD [ COLUMN ]**  | This clause adds a new column to the table. `COLUMN` is optional.                           |
| *column_name*       | Specify the name of the column you want to add. |
| *data_type*         | The data type of the new column.                |
|**DEFAULT**|The `DEFAULT` clause allows you to assign a default value to a column. This default value is used when a new row is inserted, and no explicit value is provided for that column. |
| *default_expr* | `default_expr` is any constant value or variable-free expression that does not reference other columns in the current table or involve subqueries. The data type of `default_expr` must match the data type of the column.<br/>If `default_expr` is impure, such as using a function like `now()`, all historical data will be filled with the result of the expression evaluated at the time the statement was executed. For future insertions, the default expression will be evaluated at the time of each respective insertion.|

```sql title=Example
-- Add a column named "age" to a table named "employees" with a data type of integer
ALTER TABLE employees ADD age int;
```

:::note

+ If your table is defined with a schema registry, its columns can not be altered.  

+ Columns added by this command cannot be used by any existing materialized views or indexes. You must create new materialized views or indexes to reference it.  
:::

### `DROP COLUMN`

```sql title=Syntax
ALTER TABLE table_name 
    DROP [ COLUMN ] [ IF EXISTS ] column_name;
```

| Parameter or clause | Description                                                                                |
| ------------------- | ------------------------------------------------------------------------------------------ |
| **DROP [ COLUMN ]** | This clause drops an existing column from a table. `COLUMN` is optional.                                                                      |
| **IF EXISTS**       | Do not return an error if the specified column does not exist. A notice is issued instead. |
| *column_name*       | Specify the column you want to remove.                                                     |

```sql title=Example
-- Remove a column named "fax" from the "employees" table
ALTER TABLE employees DROP fax;
```

:::note

+ If your table is defined with a schema registry, its column can not be altered. However, if the table with schema registry has generated columns, you can drop the generated columns and note dropping the generated columns will trigger refreshing schema.

+ You cannot drop columns referenced by materialized views or indexes.

:::

### `OWNER TO`

```sql title=Syntax
ALTER TABLE table_name 
    OWNER TO new_user;
```

| Parameter or clause | Description |
| ------------------- | ----------------------------------------------- |
|**OWNER TO**| This clause changes the owner of the table to the specified user. It will cascadingly change all related internal objects as well, and the associated indexes will be changed too.|
| *new_user* | Specify the user you want to assign to the table. |

```sql title=Example
-- Change the owner of the table named "t" to the user "user1"
ALTER TABLE t OWNER TO user1;
```

After setting, you can observe the parallelism status within the internal `rw_table_fragments ` table.

### `SET SCHEMA`

```sql title=Syntax
ALTER TABLE table_name 
    SET SCHEMA schema_name;
```

| Parameter or clause | Description |
| ------------------- | ----------------------------------------------- |
|**SET SCHEMA**| This clause moves the table into another schema. Associated indexes, constraints, and sequences owned by table columns are moved as well.|
| *schema_name* | Specify the schema to which the table will be moved. |

```sql title=Example
-- Move a table named "test_table" into a schema named "test_schema"
ALTER TABLE test_table SET SCHEMA test_schema;
```

### `SET PARALLELISM`

```sql title=Syntax
ALTER TABLE table_name 
SET PARALLELISM = parallelism_number;
```

| Parameter or clause | Description |
| ------------------- | ----------------------------------------------- |
|**SET PARALLELISM**| This clause controls the degree of [parallelism](/concepts/key-concepts.md#parallelism) for the targeted [streaming job](/concepts/key-concepts.md#streaming-jobs).|
| *parallelism_number* | This parameter can be `ADAPTIVE` or a fixed number, like 1, 2, 3, etc. Altering the parameter to `ADAPTIVE` will expand the streaming job's degree of parallelism to encompass all available units, whereas setting it to a fixed number will lock the job's parallelism at that specific figure. Setting it to `0` is equivalent to `ADAPTIVE`. <br/><br/>After setting the parallelism, the parallelism status of a table can be observed within the internal [`rw_table_fragments`](/manage/view-configure-runtime-parameters.md) table or the [`rw_fragments`](/manage/view-configure-runtime-parameters.md)table.|

```sql title=Example
ALTER TABLE test_table SET PARALLELISM = 8;
```

Here is a more detailed example for you to practise this clause:

First, let's set the parallelism to `3` by the [`SET` command](/manage/view-configure-runtime-parameters.md#how-to-configure-runtime-parameters).

```sql title=Example
SET streaming_parallelism = 3;
```

Then let's create a table to view the parallelism we set. As mentioned, the parallelism status of a table can be observed within the [`rw_fragments`](/manage/view-configure-runtime-parameters.md) table.

```sql title=Example
-- Create a table.
CREATE TABLE t(v int);
-- View parrellelism by rw_fragments table.
SELECT fragment_id, parallelism FROM rw_fragments;

------RESULTS
 fragment_id | parallelism
-------------+-------------
           1 |           3
           2 |           3
(2 rows)
```

Now we can use `SET PARALLELISM` to change the parallelism and view the change:

```sql title=Example
-- Set to a fixed number.
ALTER TABLE t SET PARALLELISM = 8;
SELECT fragment_id, parallelism FROM rw_fragments;

------RESULTS
 fragment_id | parallelism
-------------+-------------
           1 |           8
           2 |           8
(2 rows)
```

```sql title=Example
-- Set to ADAPTIVE
ALTER TABLE t SET PARALLELISM = adaptive;
SELECT fragment_id, parallelism FROM rw_fragments;

------RESULTS
 fragment_id | parallelism
-------------+-------------
           1 |          12
           2 |          12
(2 rows)
```

### `RENAME TO`

```sql title=Syntax
ALTER TABLE table_name
    RENAME TO new_name;
```

|Parameter or clause        | Description           |
|---------------------------|-----------------------|
|**RENAME TO**|This clause changes the name of the table.|
|*new_name*|The new name of the table.|

```sql title=Example
-- Change the name of the table named "table0" to "table1"
ALTER TABLE table0 RENAME TO table1;
```

### `REFRESH SCHEMA`

```sql title=Syntax
ALTER TABLE table_name
    REFRESH SCHEMA;
```

This command alters the schema registry of a table created with connectors.

```sql title=Examples
-- Refresh the schema of the table named "t_user".
ALTER TABLE t_user REFRESH SCHEMA;
```

:::note
If a downstream fragment references a column that is either missing or has undergone a type change in the updated schema, the command will be declined.
:::

### `SET STREAMING_RATE_LIMIT`

```sql title=Syntax
ALTER TABLE table_name
    SET STREAMING_RATE_LIMIT { TO | = } { default | rate_limit_number };
```

Use this statement to modify the rate limit of tables that have a source. For the specific value of `STREAMING_RATE_LIMIT`, refer to [How to view runtime parameters](/manage/view-configure-runtime-parameters.md#how-to-view-runtime-parameters).

```sql title="Example"
-- Create a table with source
CREATE TABLE kafka_source (v1 int) WITH (
  connector = 'kafka',
  topic = 'kafka_source',
  properties.bootstrap.server = 'localhost:29092',
  scan.startup.mode = 'earliest',
  streaming_rate_limit = 0
) FORMAT PLAIN ENCODE JSON
```

```sql title="Example"
-- Pause the source
ALTER TABLE kafka_source SET streaming_rate_limit TO default;
```

```sql title="Example"
-- Alter the rate limit of this table
ALTER TABLE kafka_source SET streaming_rate_limit TO 1000;
```
