---
id: information-schema
slug: /information-schema
title: Information schema
---

The information schema consists of a set of views that contain information about the objects defined in the current database.

## Tables and views

The  `information_schema.tables` view contains all tables, views, and materialized views defined in the current database.

:::note

Materialized views are specific to the information schema of RisingWave. They are not included in the information schema of PostgreSQL.

:::

The `information_schema.tables` view contains the following columns.

|Column|Type|Description|
|---|---|---|
|`table_catalog`|varchar|Name of the current database |
|`table_schema` |varchar| Name of the schema that contains the table, view, or materialized view. The default schema for user-created objects is `public`.|
|`table_name` | varchar|Name of the table, view, or materialized view|
|`table_type` | varchar| Type of the table, view, or materialized view. `BASE TABLE` for a user-defined table, `VIEW` for a non-materialized view, `MATERIALIZED VIEW` for a materialized view, and `SYSTEM TABLE` for a system table.|
|`is_insertable_into`|varchar|`YES` if the table or view is insertable into, `NO` if not. User-defined tables are always insertable, while views and materialized views are not necessarily.|

## Columns

The `information_schema.columns` view contains information about columns of all tables, views, and materialized views in the database.

The `information_schema.tables` view contains the following columns.

|Column|Type|Description|
|---|---|---|
|`table_catalog`|varchar| Name of the current database|
|`table_schema` |varchar| Name of the schema that contains the table, view, or materialized view. The default schema for user-created objects is `public`.|
|`table_name` | varchar| Name of the table, view, or materialized view|
|`column_name` | varchar| Name of the column|
|`ordinal_position`|int32| Ordinal position of the column within the table (count starts at 1)|
|`is_nullable` | varchar| `YES` if the column is possibly nullable; `NO` if it is known not nullable.|
|`data_type` | varchar| Data type of the column|

## How to use the information schema views?

You can use various information schema views to determine the makeup of tables, views, and materialized views in a database. 

For example, you can query for names and types of all the tables, views, and materialized views in the current database:

```sql
SELECT table_name, table_type
FROM information_schema.tables;
```

To query for all of the columns in a table, view, or materialized view called `taxi_trip`:

```sql
SELECT column_name
FROM information_schema.columns
WHERE table_name='taxi_trip';
```

To find out tables, views, and materialized views that contain a column called `trip_id`:

```sql
SELECT table_name
FROM information_schema.columns
WHERE column_name='trip_id';
```


