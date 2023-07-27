---
id: sql-function-sys-admin
slug: /sql-function-sys-admin
title: System administration functions
---

This page lists both RisingWave system administration functions and PostgreSQL system administration functions that are supported in RisingWave.

## `current_setting()`

Returns the current value of a specified system administration setting. This function corresponds to the SQL command `SHOW`.

```sql title=Example
SELECT current_setting ('server_version');
---------RESULT
 current_setting 
-----------------
 8.3.0
(1 row)
```

### Supported system administration settings

We are adding more settings to the list. Currently, the following settings are supported:

- `server_version`
- `server_version_num`
- `timezone`
- `query_mode`
- `streaming_parallelism`
- `batch_parallelism`

## `pg_terminate_backend()`

Terminates a backend. You can execute this against another backend that has exactly the same role as the user calling the function. In all other cases, you must be a superuser. For more details, see [System Administration Functions](https://www.postgresql.org/docs/current/functions-admin.html).

## `pg_backend_pid()`

Returns the ID of the server process attached to the current session. For more details, see [System Information Functions and Operators](https://www.postgresql.org/docs/current/functions-info.html).

## `pg_cancel_backend()`

Cancels a backend's current query. You can execute this against another backend that has exactly the same role as the user calling the function. In all other cases, you must be a superuser. For more details, see [System Administration Functions](https://www.postgresql.org/docs/current/functions-admin.html).

## `pg_indexes_size('table_name')`

Returns the total size of all indexes associated with a particular table in bytes.

```sql title=Example
SELECT pg_indexes_size('t1');
---------RESULT
 pg_indexes_size 
-----------------
               0
(1 row)
```

## `pg_table_size('table_name')`

Returns the size of a table in bytes.

```sql title=Example
SELECT pg_table_size('t1');
---------RESULT
 pg_table_size 
---------------
           240
(1 row)
```
