---
id: pg-catalog-function
slug: /pg-catalog-function
title: PostgreSQL catalogs and functions
---
RisingWave supports these system catalogs, views, and functions of PostgreSQL.

:::note
Currently, RisingWave does not fully support all columns in the system catalogs of PostgreSQL.
:::

## Catalogs and views

- [`pg_am`](https://www.postgresql.org/docs/current/catalog-pg-am.html)
- [`pg_attrdef`](https://www.postgresql.org/docs/current/catalog-pg-attrdef.html)
- [`pg_attribute`](https://www.postgresql.org/docs/current/catalog-pg-attribute.html)
- [`pg_cast`](https://www.postgresql.org/docs/current/catalog-pg-cast.html)
- [`pg_class`](https://www.postgresql.org/docs/current/catalog-pg-class.html)
- [`pg_collation`](https://www.postgresql.org/docs/current/catalog-pg-collation.html)
- [`pg_database`](https://www.postgresql.org/docs/current/catalog-pg-database.html)
- [`pg_description`](https://www.postgresql.org/docs/current/catalog-pg-description.html)
- [`pg_index`](https://www.postgresql.org/docs/current/catalog-pg-index.html)
- [`pg_matviews`](https://www.postgresql.org/docs/current/view-pg-matviews.html)
- [`pg_namespace`](https://www.postgresql.org/docs/current/catalog-pg-namespace.html)
- [`pg_opclass`](https://www.postgresql.org/docs/current/catalog-pg-opclass.html)
- [`pg_operator`](https://www.postgresql.org/docs/current/catalog-pg-operator.html)
- [`pg_roles`](https://www.postgresql.org/docs/current/view-pg-roles.html)
- [`pg_settings`](https://www.postgresql.org/docs/current/view-pg-settings.html)
- [`pg_shdescription`](https://www.postgresql.org/docs/current/catalog-pg-shdescription.html)
- [`pg_stat_activity`](https://www.postgresql.org/docs/current/monitoring-stats.html#MONITORING-PG-STAT-ACTIVITY-VIEW)
- [`pg_tablespace`](https://www.postgresql.org/docs/current/catalog-pg-tablespace.html)
- [`pg_type`](https://www.postgresql.org/docs/current/catalog-pg-type.html)
- [`pg_user`](https://www.postgresql.org/docs/current/view-pg-user.html)
- [`pg_views`](https://www.postgresql.org/docs/current/view-pg-views.html)


## Functions

|Function|Description|
|---|---|
|`pg_cancel_backend()`|Cancel a backend's current query. You can execute this against another backend that has exactly the same role as the user calling the function. In all other cases, you must be a superuser. For more details, see [System Administration Functions](https://www.postgresql.org/docs/current/functions-admin.html).|
|`pg_terminate_backend()`| Terminate a backend. You can execute this against another backend that has exactly the same role as the user calling the function. In all other cases, you must be a superuser. For more details, see [System Administration Functions](https://www.postgresql.org/docs/current/functions-admin.html).|
|`pg_backend_pid()`| Process ID of the server process attached to the current session. For more details, see [System Information Functions and Operators](https://www.postgresql.org/docs/current/functions-info.html).|
|`version()` | Display the PostgreSQL version and the RisingWave version implemented in the current instance of RisingWave. Output example: `PostgreSQL 13.9-RW-0.2.0-alpha`.|


