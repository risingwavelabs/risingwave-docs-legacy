---
id: sql-alter-view
title: ALTER VIEW
description: Modify the properties of a view.
slug: /sql-alter-view
---
<head>
  <link rel="canonical" href="https://docs.risingwave.com/docs/current/sql-alter-view/" />
</head>

The `ALTER VIEW` command modifies the metadata of a view. To use this command, you must own the view.

## Syntax

```sql
ALTER VIEW view_name 
    alter_option;
```

*`alter_option`* depends on the operation you want to perform on the view. For all supported clauses, see the sections below.

## Clause

### `OWNER TO`

```sql title=Syntax
ALTER VIEW view_name
    OWNER TO new_user;
```

|Parameter or clause        | Description           |
|---------------------------|-----------------------|
|**OWNER TO**|This clause changes the owner of the view.|
|*new_user*|The new owner you want to assign to the view.|

```sql title=Example
-- Change the owner of the view named "view1" to user "user1"
ALTER VIEW view1 OWNER TO user1;
```

### `SET SCHEMA`

```sql title=Syntax
ALTER VIEW view_name
    SET SCHEMA schema_name;
```

|Parameter or clause        | Description           |
|---------------------------|-----------------------|
|**SET SCHEMA**|This clause moves the view to a different schema.|
|*schema_name*|The name of the schema to which the view will be moved.|

```sql title=Example
-- Move the view named "test_view" to the schema named "test_schema"
ALTER VIEW test_view SET SCHEMA test_schema;
```

### `RENAME TO`

```sql title=Syntax
ALTER VIEW view_name
    RENAME TO new_name;
```

|Parameter or clause        | Description           |
|---------------------------|-----------------------|
|**RENAME TO**|This clause changes the name of the view.|
|*new_name*|The new name of the view.|

```sql title=Example
-- Change the name of the view named "view1" to "view2"
ALTER VIEW view1 RENAME TO view2;
```
