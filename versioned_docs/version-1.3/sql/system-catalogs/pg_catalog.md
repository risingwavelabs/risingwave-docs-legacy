---
id: pg-catalogs
slug: /pg-catalogs
title: PostgreSQL catalogs
---
<head>
  <link rel="canonical" href="https://docs.risingwave.com/docs/current/pg-catalogs/" />
</head>

RisingWave supports these system catalogs and views of PostgreSQL.

For information about RisingWave and PostgreSQL system functions, see [System administration functions](/sql/functions-operators/sql-function-sys-admin.md) and [System information functions](/sql/functions-operators/sql-function-sys-info.md).

:::note
RisingWave does not fully support all PostgreSQL system catalog columns.
:::

| Catalog/View Name | Description |
| --- | --- |
| [`pg_am`](https://www.postgresql.org/docs/current/catalog-pg-am.html) | Contains information about relation access methods. |
| [`pg_attrdef`](https://www.postgresql.org/docs/current/catalog-pg-attrdef.html) | Contains default values for table columns. |
| [`pg_attribute`](https://www.postgresql.org/docs/current/catalog-pg-attribute.html) | Contains information about table columns.|
| [`pg_cast`](https://www.postgresql.org/docs/current/catalog-pg-cast.html) | Contains information about type casts. |
| [`pg_constraint`](https://www.postgresql.org/docs/current/catalog-pg-constraint.html) | Contains information about constraints defined for database tables. Constraints are used to enforce rules and restrictions on the data that can be stored in a table.|
| [`pg_inherits`](https://www.postgresql.org/docs/current/catalog-pg-inherits.html)|
| [`pg_conversion`](https://www.postgresql.org/docs/current/catalog-pg-conversion.html) | Contains information about encoding conversion functions. |
| [`pg_class`](https://www.postgresql.org/docs/current/catalog-pg-class.html) | Contains information about tables, indexes, sequences, and views. |
| [`pg_collation`](https://www.postgresql.org/docs/current/catalog-pg-collation.html) | Contains information about collations. |
| [`pg_database`](https://www.postgresql.org/docs/current/catalog-pg-database.html) | Contains information about the available databases. |
| [`pg_description`](https://www.postgresql.org/docs/current/catalog-pg-description.html) | Contains descriptive information about database objects. |
| [`pg_enum`](https://www.postgresql.org/docs/current/catalog-pg-enum.html) | Contains entries showing the values and labels for each enum type.|
| [`pg_index`](https://www.postgresql.org/docs/current/catalog-pg-index.html) | Contains part of the information about indexes. The rest is mostly in `pg_class`. |
| [`pg_indexes`](https://www.postgresql.org/docs/current/view-pg-indexes.html) | Contains information about each index in the database.|
| [`pg_inherits`](https://www.postgresql.org/docs/current/catalog-pg-inherits.html)|Contains information about table inheritance relationships. In PostgreSQL, table inheritance is a feature that allows you to create a new table that inherits all the columns and constraints of an existing table. |
| [`pg_matviews`](https://www.postgresql.org/docs/current/view-pg-matviews.html) | Contains information about about each materialized view in the database. |
| [`pg_namespace`](https://www.postgresql.org/docs/current/catalog-pg-namespace.html) | Contains information about namespaces.|
| [`pg_opclass`](https://www.postgresql.org/docs/current/catalog-pg-opclass.html) | Contains information about index access method operator classes. |
| [`pg_operator`](https://www.postgresql.org/docs/current/catalog-pg-operator.html) | Contains information about operators. |
| [`pg_proc`](https://www.postgresql.org/docs/current/catalog-pg-proc.html)|Contains information about functions, aggregate functions, and window functions. |
| [`pg_roles`](https://www.postgresql.org/docs/current/view-pg-roles.html) | Contains information about database roles. |
| [`pg_settings`](https://www.postgresql.org/docs/current/view-pg-settings.html) | Contains information about run-time parameters of the server.|
|[`pg_shadow`](https://www.postgresql.org/docs/current/view-pg-shadow.html) |Contains information about database users. Specifically, it contains information about the login roles that have been created in the database, including their usernames, password hashes, and other authentication-related information. |
| [`pg_shdescription`](https://www.postgresql.org/docs/current/catalog-pg-shdescription.html) | Contains descriptive information about shared database objects. |
| [`pg_stat_activity`](https://www.postgresql.org/docs/current/monitoring-stats.html#MONITORING-PG-STAT-ACTIVITY-VIEW) | Contains information about the current activity of server processes. |
| [`pg_tables`](https://www.postgresql.org/docs/current/view-pg-tables.html) |Contains information about the name, schema, and type of each table in the database. Example: `SELECT tablename FROM pg_tables WHERE schemaname = 'public';` -> `t1`.  |
| [`pg_tablespace`](https://www.postgresql.org/docs/current/catalog-pg-tablespace.html) | Contains information about the available tablespaces.|
| [`pg_type`](https://www.postgresql.org/docs/current/catalog-pg-type.html) | Contains information about data types. |
| [`pg_user`](https://www.postgresql.org/docs/current/view-pg-user.html) | Contains information about database users. |
| [`pg_views`](https://www.postgresql.org/docs/current/view-pg-views.html) | Contains information about each view in the database. |
