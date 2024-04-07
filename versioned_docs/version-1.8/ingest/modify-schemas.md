---
id: modify-schemas
title: Modify source or table schemas
slug: /modify-schemas
---
This topic describes how to modify the schema of a RisingWave source or table.

When the schema of your upstream source changes (i.e. adding or removing columns), you need to modify the schema of the corresponding source or table in RisingWave to ensure they are aligned.

If the schema registry is used to create a source or table, you cannot modify the schema of the source or table.

## Add a column

To add a column to a source, use this command:

```sql
ALTER SOURCE <source_name> ADD COLUMN <column_name> <column_type>;
```

Similarly, to add a column to a table, use this command:

```sql
ALTER TABLE <table_name> ADD COLUMN <column_name> <column_type>;
```

For details about these two commands, see [`ALTER SOURCE`](/sql/commands/sql-alter-source.md) and [`ALTER TABLE`](/sql/commands/sql-alter-table.md).

:::note

Note that you cannot add a primary key column to a source or table in RisingWave. To modify the primary key of a source or table, you need to recreate the table.

:::

When you add a column to a source or table, the new column is not automatically picked up in a downstream materialized view.

For example, if you have a materialized view `mv1` that is created with this statement:

```sql
CREATE MATERIALIZED VIEW mv1 AS SELECT * FROM my_kafka_source;
```

When you add a column to `my_kafka_source`:

```sql
ALTER SOURCE my_kafka_source ADD COLUMN new_col INTEGER;
```

The materialized view `mv1` does not contain the new column `new_col`. If you want to pick up this new column, you'll need to create a new materialized view.

## Remove a column

You cannot remove a column from a source in RisingWave. If you intend to remove a column from a source, you'll need to drop the source and create the source again.

If a column of a table is referenced in a materialized view, you cannot remove the column. This is to ensure data consistency and prevent disruptions to downstream data processing.

To remove a column from a table, use this command:

```sql
ALTER TABLE table_name DROP COLUMN column_name;
```

## Refresh the schema registry

### Source

At present, combined with the [`ALTER SOURCE` command](/sql/commands/sql-alter-source.md#format-and-encode-options), you can refresh the schema registry of a source by refilling its [FORMAT and ENCODE options](formats-and-encode-parameters.md). The syntax is:

```sql title=Syntax
ALTER SOURCE source_name FORMAT data_format ENCODE data_encode [ (
    message='message',
    schema.location='location', ...) ];
```

Here is a simple example. Let's assume we have a source as follows:

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
Currently, it is not supported to modify the `data_format` and `data_encode`. Furthermore, when refreshing the schema registry of a source, it is not allowed to drop columns or change types.
:::

In addition, when the [FORMAT and ENCODE options](formats-and-encode-parameters.md) are not changed, the `REFRESH SCHEMA` clause of `ALTER SOURCE` can also be used to refresh the schema of a source.

```sql title=Syntax
ALTER SOURCE source_name REFRESH SCHEMA;
```

For example, assume we have a source as follows:

```sql title="Create a source"
CREATE SOURCE src_user WITH (
    connector = 'kafka',
    topic = 'sr_pb_test',
    properties.bootstrap.server = 'message_queue:29092',
    scan.startup.mode = 'earliest'
)
FORMAT PLAIN ENCODE PROTOBUF(
    schema.registry = 'http://message_queue:8081',
    message = 'test.User'
);
```

Then we can refresh its schema with the following statement:

```sql title="Refresh schema"
ALTER SOURCE src_user REFRESH SCHEMA;
```

For more details about this example, see our [test file](https://github.com/risingwavelabs/risingwave/blob/994a2831088c9befc71721ed6f2f2d2e35c4d0a9/e2e_test/schema_registry/alter_sr.slt).


### Table

Similarly, you can use the following statement to refresh the schema of a table with connectors. For more details, see [`ALTER TABLE`](/sql/commands/sql-alter-table.md#refresh-schema).

```sql title="Refresh schema of table"
ALTER TABLE src_user REFRESH SCHEMA;
```

:::note
If a downstream fragment references a column that is either missing or has undergone a type change in the updated schema, the command will be declined.
:::

## See also

- [`ALTER SOURCE` command](/sql/commands/sql-alter-source.md)
- [`ALTER TABLE` command](/sql/commands/sql-alter-table.md)
- [`ALTER SCHEMA` command](/sql/commands/sql-alter-schema.md)
