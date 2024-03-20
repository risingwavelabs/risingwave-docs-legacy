---
id: sql-function-sys-admin
slug: /sql-function-sys-admin
title: System administration functions
---
<head>
  <link rel="canonical" href="https://docs.risingwave.com/docs/current/sql-function-sys-admin/" />
</head>

This page lists both RisingWave system administration functions and PostgreSQL system administration functions that are supported in RisingWave.

## `current_setting()`

Returns the current value of a specified runtime parameter. This function corresponds to the SQL command `SHOW`.

```sql title=Example
SELECT current_setting ('server_version');
---------RESULT
 current_setting 
-----------------
 8.3.0
(1 row)
```

You can use the `SHOW ALL` command to get the complete list of runtime parameters and corresponding descriptions.

## `set_config()`

```sql title="Syntax"
set_config ( setting_name text, new_value text, is_local boolean ) → text
```

Sets the parameter `setting_name` to `new_value`, and returns that value. If `is_local` is `true`, the new value will only apply during the current transaction. If you want the new value to apply for the rest of the current session, use `false` instead. This function corresponds to the SQL command [`SET`](/sql/commands/sql-set.md).

```sql title="Example"
SELECT set_config('rw_implicit_flush', 'true', false);
-------
true
```

<!--
## `pg_terminate_backend()`

Terminates a backend. You can execute this against another backend that has exactly the same role as the user calling the function. In all other cases, you must be a superuser. For more details, see [System Administration Functions](https://www.postgresql.org/docs/current/functions-admin.html).

## `pg_backend_pid()`

Returns the ID of the server process attached to the current session. For more details, see [System Information Functions and Operators](https://www.postgresql.org/docs/current/functions-info.html).

## `pg_cancel_backend()`

Cancels a backend's current query. You can execute this against another backend that has exactly the same role as the user calling the function. In all other cases, you must be a superuser. For more details, see [System Administration Functions](https://www.postgresql.org/docs/current/functions-admin.html). -->

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

## `pg_stat_get_numscans('table_name')`

Returns the total number of scans (sequential and index scans) performed on a specified table since the server was started.

```sql title=Example
SELECT pg_stat_get_numscans('my_table');
 pg_stat_get_numscans 
----------------------
                    0
(1 row)
```