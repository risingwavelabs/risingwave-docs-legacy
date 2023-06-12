---
id: pg-catalog-function
slug: /pg-catalog-function
title: PostgreSQL catalogs and functions
---
RisingWave supports these system catalogs, views, and functions of PostgreSQL.

:::note
RisingWave does not fully support all PostgreSQL system catalog columns.
:::

## Catalogs and views

| Catalog/View Name | Description |
| --- | --- |
| [`pg_am`](https://www.postgresql.org/docs/current/catalog-pg-am.html) | Contains information about relation access methods. |
| [`pg_attrdef`](https://www.postgresql.org/docs/current/catalog-pg-attrdef.html) | Contains default values for table columns. |
| [`pg_attribute`](https://www.postgresql.org/docs/current/catalog-pg-attribute.html) | Contains information about table columns.|
| [`pg_cast`](https://www.postgresql.org/docs/current/catalog-pg-cast.html) | Contains information about type casts. |
| [`pg_conversion`](https://www.postgresql.org/docs/current/catalog-pg-conversion.html) | Contains information about encoding conversion functions. |
| [`pg_class`](https://www.postgresql.org/docs/current/catalog-pg-class.html) | Contains information about tables, indexes, sequences, and views. |
| [`pg_collation`](https://www.postgresql.org/docs/current/catalog-pg-collation.html) | Contains information about collations. |
| [`pg_database`](https://www.postgresql.org/docs/current/catalog-pg-database.html) | Contains information about the available databases. |
| [`pg_description`](https://www.postgresql.org/docs/current/catalog-pg-description.html) | Contains descriptive information about database objects. |
| [`pg_enum`](https://www.postgresql.org/docs/current/catalog-pg-enum.html) | Contains entries showing the values and labels for each enum type.|
| [`pg_index`](https://www.postgresql.org/docs/current/catalog-pg-index.html) | Contains part of the information about indexes. The rest is mostly in `pg_class`. |
| [`pg_indexes`](https://www.postgresql.org/docs/current/view-pg-indexes.html) | Contains information about each index in the database.|
| [`pg_matviews`](https://www.postgresql.org/docs/current/view-pg-matviews.html) | Contains information about about each materialized view in the database. |
| [`pg_namespace`](https://www.postgresql.org/docs/current/catalog-pg-namespace.html) | Contains information about namespaces.|
| [`pg_opclass`](https://www.postgresql.org/docs/current/catalog-pg-opclass.html) | Contains information about index access method operator classes. |
| [`pg_operator`](https://www.postgresql.org/docs/current/catalog-pg-operator.html) | Contains information about operators. |
| [`pg_roles`](https://www.postgresql.org/docs/current/view-pg-roles.html) | Contains information about database roles. |
| [`pg_settings`](https://www.postgresql.org/docs/current/view-pg-settings.html) | Contains information about run-time parameters of the server.|
| [`pg_shdescription`](https://www.postgresql.org/docs/current/catalog-pg-shdescription.html) | Contains descriptive information about shared database objects. |
| [`pg_stat_activity`](https://www.postgresql.org/docs/current/monitoring-stats.html#MONITORING-PG-STAT-ACTIVITY-VIEW) | Contains information about the current activity of server processes. |
| [`pg_tablespace`](https://www.postgresql.org/docs/current/catalog-pg-tablespace.html) | Contains information about the available tablespaces.|
| [`pg_type`](https://www.postgresql.org/docs/current/catalog-pg-type.html) | Contains information about data types. |
| [`pg_user`](https://www.postgresql.org/docs/current/view-pg-user.html) | Contains information about database users. |
| [`pg_views`](https://www.postgresql.org/docs/current/view-pg-views.html) | Contains information about each view in the database. |

## Functions

|Function|Description|
|---|---|
|`pg_cancel_backend()`|Cancels a backend's current query. You can execute this against another backend that has exactly the same role as the user calling the function. In all other cases, you must be a superuser. For more details, see [System Administration Functions](https://www.postgresql.org/docs/current/functions-admin.html).|
|`pg_terminate_backend()`| Terminates a backend. You can execute this against another backend that has exactly the same role as the user calling the function. In all other cases, you must be a superuser. For more details, see [System Administration Functions](https://www.postgresql.org/docs/current/functions-admin.html).|
|`pg_backend_pid()`| Returns the ID of the server process attached to the current session. For more details, see [System Information Functions and Operators](https://www.postgresql.org/docs/current/functions-info.html).|
|`version()` | Displays the PostgreSQL version and the RisingWave version implemented in the current instance of RisingWave. Output example: `PostgreSQL 13.9-RW-0.2.0-alpha`.|
