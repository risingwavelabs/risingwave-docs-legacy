---
id: sql-alter-source
title: ALTER SOURCE
description: Modify the properties of a source.
slug: /sql-alter-source
---
<head>
  <link rel="canonical" href="https://docs.risingwave.com/docs/current/sql-alter-source/" />
</head>

The `ALTER SOURCE` command modifies the definition of a source.

## Syntax

```sql
ALTER SOURCE current_source_name 
    alter_option;
```

*`alter_option`* depends on the operation you want to perform on the source. For all supported clauses, see the sections below.

## Clause

### `ADD COLUMN`

```sql title=Syntax
ALTER SOURCE source_name 
    ADD COLUMN col_name data_type;
```

|Parameter or clause        | Description           |
|---------------------------|-----------------------|
|**ADD COLUMN** |This clause adds a column to the specified source.|
|*col_name* | The name of the new column you want to add to the source.|
|*data_type* | The data type of the newly added column. With the struct data type, you can create a nested table. Elements in a nested table need to be enclosed with angle brackets ("<\>").|

```sql title=Example
-- Add a column named "v3" to a source named "src1" 
ALTER SOURCE src1 
    ADD COLUMN v3 int;
```

:::note

+ If your source is created with a schema registry, columns cannot be altered.

+ You cannot add a primary key column to a source or table in RisingWave. To modify the primary key of a source or table, you need to recreate the table.

+ You cannot remove a column from a source in RisingWave. If you intend to remove a column from a source, you'll need to drop the source and create the source again.
:::

### `RENAME TO`

```sql title=Syntax
ALTER SOURCE source_name 
    RENAME TO new_source_name;
```

|Parameter or clause        | Description           |
|---------------------------|-----------------------|
| **RENAME TO**| This clause changes the name of the source.|
|*new_source_name*|The new name of the source.|

```sql title=Example
-- Change the name of a source named "src" to "src1"
ALTER SOURCE src 
   RENAME TO src1;
```

### `OWNER TO`

```sql title=Syntax
ALTER SOURCE current_source_name 
    OWNER TO new_user;
```

|Parameter or clause        | Description           |
|---------------------------|-----------------------|
|**OWNER TO**|This clause changes the owner of the source.|
|*new_user*|The new owner you want to assign to the source.|

```sql title=Example
-- Change the owner of the source named "src" to user "user1"
ALTER SOURCE src OWNER TO user1;
```

### `SET SCHEMA`

```sql title=Syntax
ALTER SOURCE current_source_name
    SET SCHEMA schema_name;
```

|Parameter or clause        | Description           |
|---------------------------|-----------------------|
|**SET SCHEMA**|This clause moves the source to a different schema.|
|*schema_name*|The name of the schema to which the source will be moved.|

```sql title=Example
-- Move the source named "test_source" to the schema named "test_schema"
ALTER SOURCE test_source SET SCHEMA test_schema;
```

### `FORMAT and ENCODE options`

At present, combined with the `ALTER SOURCE` command, you can refresh the schema registry of a source by refilling the FORMAT and ENCODE options. For more details about these options, see [CREATE SOURCE](/sql/commands/sql-create-source.md).

```sql title=Syntax
ALTER SOURCE source_name FORMAT data_format ENCODE data_encode [ (
    message='message',
    schema.location='location', ...) ];
```

Here is an example. Let's assume the original FORMAT and ENCODE options are as follows:

```sql title=Example
-- Create a source.
CREATE SOURCE src_user WITH (
    connector = 'kafka',
    topic = 'sr_pb_test',
    properties.bootstrap.server = 'message_queue:29092',
    scan.startup.mode = 'earliest'
)
FORMAT PLAIN ENCODE PROTOBUF(
    schema.registry = 'http://message_queue:8081',
    message = 'test.User');
```

Then you can refresh the schema registry by the following command:

```sql title=Example
ALTER SOURCE src_user FORMAT PLAIN ENCODE PROTOBUF(
    schema.registry = 'http://message_queue:8081',
    message = 'test.UserWithMoreFields'
);
```


:::note
Currently, it is not supported to modify the `data_format` and `data_encode`. Furthermore, when refreshing the schema registry of a source, it is not allowed to drop columns or change types in the statement.
:::