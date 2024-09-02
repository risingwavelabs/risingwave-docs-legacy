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

## `has_table_privilege()`

Checks if a user has access to a table in a specific way. You can identify the user by their name, their OID (pg_authid.oid), or by using `public` to refer to the PUBLIC pseudo-role. If no argument is provided, it assumes the current user.

To specify the table, you can use its name or OID. If needed, you can schema-qualify the table name.

The desired access privilege type is specified as a text string. It must be one of the following values: `SELECT`, `INSERT`, `UPDATE`, `DELETE`, `TRUNCATE`, `REFERENCES`, or `TRIGGER`. You can also add `WITH GRANT OPTION` to test if the privilege is held with the grant option. If you want to check for multiple privilege types, you can list them separated by commas. The result will be true if any of the listed privileges is held. The case of the privilege string is not important, and you can have extra whitespace between privilege names, but not within them.

```sql title="Syntax"
has_table_privilege([user,] table, privilege) -> boolean
```

```sql title="Example"
SELECT has_table_privilege('test_user', 'foo', 'SELECT');
----RESULT
t
```

## `has_schema_privilege()`

Checks if a user has access to a schema in a specific way. It has similar argument possibilities as the `has_table_privilege` function.

The desired access privilege type should be a combination of `CREATE` and/or `USAGE`, such as "CREATE, USAGE", or just a single privilege type like "CREATE" or "USAGE".

```sql title="Syntax"
has_schema_privilege([user,] schema, privilege) -> boolean
```

```sql title="Example"
SELECT has_schema_privilege('test_user', 'test_schema', 'CREATE');
----RESULT
t
```

## `has_any_column_privilege()`

Checks if a user has access to any column of a table in a specific way. Currently, this function is identical to the `has_table_privilege` function.

```sql title="Syntax"
has_any_column_privilege([user,] table, privilege) -> boolean
```

```sql title="Example"
SELECT has_any_column_privilege('test_user', 'foo_view'::regclass, 'INSERT');
----RESULT
f
```

## `rw_recovery_status()`

Retrieves the current recovery status of the meta node. The return values can be one of `STARTING`, `RECOVERING`, or `RUNNING`.

```sql title="Syntax"
rw_recovery_status() -> varchar
```

```sql title="Example"
SELECT rw_recovery_status();
-- RESULT
'RUNNING'
```

## `pg_is_in_recovery()`

Checks if the PostgreSQL instance is currently in recovery mode.

```sql title="Syntax"
pg_is_in_recovery() -> boolean
```

```sql title="Example"
SELECT pg_is_in_recovery();
----RESULT
t
```

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

:::note
This is a dummy function intended for compatibility with third-party tools. We keep it here only for reference and it will be eventually removed. Please do not use it in production environments or any important tasks.
:::
