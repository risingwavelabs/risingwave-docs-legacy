---
id: sql-alter-sink
title: ALTER SINK
description: Modify the properties of an existing sink.
slug: /sql-alter-sink
---
<head>
  <link rel="canonical" href="https://docs.risingwave.com/docs/current/sql-alter-sink/" />
</head>

Use the `ALTER SINK` command to do the following operations on a sink:

+ change the owner
+ change the schema

## Syntax

```sql
ALTER SINK current_sink_name 
    alter_option;
```

*`alter_option`* depends on the operation you want to perform on the sink.

```sql
ALTER SINK current_sink_name
    OWNER TO new_user
    SET SCHEMA schema_name
```

## Change the owner

```sql title=Syntax
ALTER SINK current_sink_name
    OWNER TO new_user;
```

:::note
This statement will cascadingly change all related internal-objects as well.
:::

|Parameter or clause        | Description           |
|---------------------------|-----------------------|
|**OWNER TO**|This clause changes the owner of the sink.|
|*new_user*|The new owner you want to assign to the sink.|

```sql title=Example
-- Change the owner of the sink named "sink1" to user "user1"
ALTER SINK sink1 OWNER TO user1;
```

## Change the schema

```sql title=Syntax
ALTER SINK current_sink_name
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
