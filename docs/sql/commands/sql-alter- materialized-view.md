---
id: sql-alter-materialized-view
title: ALTER MATERIALIZED VIEW
description: Modify the properties of an existing materialized view.
slug: /sql-alter-materialized-view
---
<head>
  <link rel="canonical" href="https://docs.risingwave.com/docs/current/sql-alter-materialized-view/" />
</head>

Use the `ALTER MATERIALIZED VIEW` command to do the following operations on a materialized view：

+ change the owner
+ change the schema

## Syntax

```sql
ALTER MATERIALIZED VIEW current_materialized_view_name 
    alter_option;
```

*`alter_option`* depends on the operation you want to perform on the materialized view.

```sql
ALTER MATERIALIZED VIEW current_materialized_view_name
    OWNER TO new_user
    SET SCHEMA schema_name
```

## Change the owner

```sql title=Syntax
ALTER MATERIALIZED VIEW current_materialized_view_name
    OWNER TO new_user;
```

:::note
This statement will cascadingly change all related internal-objects as well.
:::

|Parameter or clause        | Description           |
|---------------------------|-----------------------|
|**OWNER TO**|This clause changes the owner of the materialized view.|
|*new_user*|The new owner you want to assign to the materialized view.|

```sql title=Example
-- Change the owner of the materialized view named "materialized_view1" to user "user1"
ALTER MATERIALIZED VIEW materialized_view1 OWNER TO user1;
```

## Change the schema

```sql title=Syntax
ALTER MATERIALIZED VIEW current_materialized_view_name
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
