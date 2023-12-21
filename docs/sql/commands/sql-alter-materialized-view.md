---
id: sql-alter-materialized-view
title: ALTER MATERIALIZED VIEW
description: Modify the properties of a materialized view.
slug: /sql-alter-materialized-view
---
<head>
  <link rel="canonical" href="https://docs.risingwave.com/docs/current/sql-alter-materialized-view/" />
</head>

The `ALTER MATERIALIZED VIEW` command modifies the metadata of a materialized view. To use this command, you must own the materialized view.

:::info
To modify the SQL definition of a materialized view, please refer to [Alter a streaming job](/manage/alter-streaming.md).
:::

## Syntax

```sql
ALTER MATERIALIZED VIEW materialized_view_name 
    alter_option;
```

*`alter_option`* depends on the operation you want to perform on the materialized view. For all supported clauses, see the sections below.

## Clause

### `OWNER TO`

```sql title=Syntax
ALTER MATERIALIZED VIEW materialized_view_name
    OWNER TO new_user;
```

|Parameter or clause        | Description           |
|---------------------------|-----------------------|
|**OWNER TO**|This clause changes the owner of the materialized view. Note that this will cascadingly change all related internal objects as well.|
|*new_user*|The new owner you want to assign to the materialized view.|

```sql title=Example
-- Change the owner of the materialized view named "materialized_view1" to user "user1"
ALTER MATERIALIZED VIEW materialized_view1 OWNER TO user1;
```

### `SET SCHEMA`

```sql title=Syntax
ALTER MATERIALIZED VIEW materialized_view_name
    SET SCHEMA schema_name;
```

|Parameter or clause        | Description           |
|---------------------------|-----------------------|
|**SET SCHEMA**|This clause moves the materialized view to a different schema.|
|*schema_name*|The name of the schema to which the materialized view will be moved.|

```sql title=Example
-- Move the materialized view named "test_materialized_view" to the schema named "test_schema"
ALTER MATERIALIZED VIEW test_materialized_view SET SCHEMA test_schema;
```

### `RENAME TO`

```sql title=Syntax
ALTER MATERIALIZED VIEW materialized_view_name
    RENAME TO new_name;
```

|Parameter or clause        | Description           |
|---------------------------|-----------------------|
|**RENAME TO**|This clause changes the name of the materialized view.|
|*new_name*|The new name of the materialized view.|

```sql title=Example
-- Change the name of the materialized view named "mv_1" to "mv_2"
ALTER MATERIALIZED VIEW mv_1 RENAME TO mv_2;
```
