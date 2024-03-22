---
id: sql-alter-sink
title: ALTER SINK
description: Modify the properties of a sink.
slug: /sql-alter-sink
---
<head>
  <link rel="canonical" href="https://docs.risingwave.com/docs/current/sql-alter-sink/" />
</head>

The `ALTER SINK` command modifies the definition of a sink.

## Syntax

```sql
ALTER SINK sink_name 
    alter_option;
```

*`alter_option`* depends on the operation you want to perform on the sink. For all supported clauses, see the sections below.

## Clause

### `OWNER TO`

```sql title=Syntax
ALTER SINK sink_name
    OWNER TO new_user;
```

|Parameter or clause        | Description           |
|---------------------------|-----------------------|
|**OWNER TO**|This clause changes the owner of the sink. This will cascadingly change all related internal-objects as well.|
|*new_user*|The new owner you want to assign to the sink.|

```sql title=Example
-- Change the owner of the sink named "sink1" to user "user1"
ALTER SINK sink1 OWNER TO user1;
```

### `SET SCHEMA`

```sql title=Syntax
ALTER SINK sink_name
    SET SCHEMA schema_name;
```

|Parameter or clause        | Description           |
|---------------------------|-----------------------|
|**SET SCHEMA**|This clause moves the sink to a different schema.|
|*schema_name*|The name of the schema to which the sink will be moved.|

```sql title=Example
-- Move the sink named "test_sink" to the schema named "test_schema"
ALTER SINK test_sink SET SCHEMA test_schema;
```

### `RENAME TO`

```sql title=Syntax
ALTER SINK sink_name
    RENAME TO new_name;
```

|Parameter or clause        | Description           |
|---------------------------|-----------------------|
|**RENAME TO**|This clause changes the name of the sink.|
|*new_name*|The new name of the sink.|

```sql title=Example
-- Change the name of the sink named "sink0" to "sink1"
ALTER SINK sink0 RENAME TO sink1;
```
