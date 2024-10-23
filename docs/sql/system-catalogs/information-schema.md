---
id: information-schema
slug: /information-schema
title: Information schema
description: Information about objects in the current database.
---
<head>
  <link rel="canonical" href="https://docs.risingwave.com/docs/current/information-schema/" />
</head>

The information schema consists of a set of views that contain information about the objects defined in the current database.

## Tables

The  `information_schema.tables` view contains all tables, views, sinks, and materialized views defined in the current database.

:::note

Materialized views are specific to the information schema of RisingWave. They are not included in the information schema of PostgreSQL.

:::

The `information_schema.tables` view contains the following columns.

|Column|Type|Description|
|---|---|---|
|`table_catalog`|varchar|Name of the current database. |
|`table_schema` |varchar| Name of the schema that contains the table, view, or materialized view. The default schema for user-created objects is `public`.|
|`table_name` | varchar|Name of the table, view, or materialized view.|
|`table_type` | varchar| Type of the table, view, or materialized view. `BASE TABLE` for a user-defined table, `VIEW` for a non-materialized view, `MATERIALIZED VIEW` for a materialized view, and `SYSTEM TABLE` for a system table.|
|`is_insertable_into`|varchar|`YES` if the table or view is insertable into, `NO` if not. User-defined tables are always insertable, while views and materialized views are not necessarily.|

## `table_constraints`

The `table_constraints` view contains all constraints for tables that the current user owns or has privileges other than `SELECT` on.

The `table_constraints` view contains the following columns.

|Column|Type|Description|
|---|---|---|
| `constraint_catalog` | varchar | Name of the database that contains the constraint. |
| `constraint_schema` | varchar | Name of the schema that contains the constraint. |
| `constraint_name` | varchar | Name of the constraint. |
| `table_catalog` | varchar | Name of the database that contains the table. |
| `table_schema` | varchar | Name of the schema that contains the table. |
| `table_name` | varchar | Name of the table. |
| `constraint_type` | varchar | Type of the constraint: `PRIMARY KEY`(p), `UNIQUE`(u), `CHECK`(c), or `EXCLUDE`(x).  |
| `is_deferrable` | varchar | `YES` if the constraint is deferrable, `NO` if not. |
| `initially_deferred` | varchar | `YES` if the constraint is deferrable and initially deferred, `NO` if not. |
| `enforced` | varchar | `YES` if the constraint is validated and enforced, `NO` if not. |

:::note Temporary Limitation

This view assumes the constraint schema is the same as the table schema, since `pg_catalog.pg_constraint` only supports primary key.

:::

## `schemata`

The `schemata` view contains all accessible schemas in the current database for users, either by way of being the owner or having some privilege.

It contains the following columns.

|Column|Type|Description|
|---|---|---|
|`catalog_name`| varchar | Name of the database containing the schema.  |
|`schema_name`| varchar | Name of the schema. |
|`schema_owner` | varchar | Name of the schema owner.|
|`default_character_set_catalog` | varchar | Name of the database that contains the schema's default character set.|
|`default_character_set_schema`|varchar | Name of the schema containing the default character set. |
|`default_character_set_name`|varchar |Name of the schema's default character set.|
|`sql_path`|varchar | SQL path specification for the schema.|


## Views

The `information_schema.views` view contains information about the views in the database.

It contains the following columns.

|Column|Type|Description|
|---|---|---|
|`table_catalog`| varchar | Name of the current database. |
|`table_schema`| varchar | Name of the schema that contains the view. |
|`table_name` | varchar | Name of the view. |
|`view_definition` | varchar | SQL statement that defines the view. |

:::note Temporary Limitation

Users with access to `information_schema.views` can potentially access all views, which poses a security risk. We are working to resolve this limitation. Once the fix is implemented, this message will be removed.

:::

## Columns

The `information_schema.columns` view contains information about columns of all tables, views, and materialized views in the database.

|Column|Type|Description|
|---|---|---|
|`table_catalog`|varchar| Name of the current database.|
|`table_schema` |varchar| Name of the schema that contains the table, sink, view, or materialized view. The default schema for user-created objects is `public`.|
|`table_name` | varchar| Name of the table, sink, view, or materialized view|
|`column_name` | varchar| Name of the column|
|`ordinal_position`|int32| Ordinal position of the column within the table (count starts at 1)|
|`is_nullable` | varchar| `YES` if the column is possibly nullable; `NO` if it is known not nullable.|
|`data_type` | varchar| Data type of the column|
|`is_generated` | varchar| `ALWAYS` if the column has a generated value; `NEVER` if it doesn't.|
|`generation_expression` | varchar| Expression for generating values when `is_generated` is `ALWAYS`.|

## How to use the information schema views?

You can use various information schema views to determine the makeup of tables, sinks, views, and materialized views in a database.

For example, you can query for names and types of all the tables, views, and materialized views in the current database:

```sql
SELECT table_name, table_type
FROM information_schema.tables;
```

To query for all of the columns in a table, sink, view, or materialized view called `taxi_trip`:

```sql
SELECT column_name
FROM information_schema.columns
WHERE table_name='taxi_trip';
```

To find out tables, sinks, views, and materialized views that contain a column called `trip_id`:

```sql
SELECT table_name
FROM information_schema.columns
WHERE column_name='trip_id';
```
