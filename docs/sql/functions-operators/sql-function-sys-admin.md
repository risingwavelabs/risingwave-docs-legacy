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

## `has_table_privilege`

Checks whether a user can access a table in a particular way. The user can be specified by name, by OID (pg_authid.oid), public to indicate the PUBLIC pseudo-role, or if the argument is omitted current_user is assumed. The table can be specified by name or by OID. (Thus, there are actually six variants of has_table_privilege, which can be distinguished by the number and types of their arguments.) When specifying by name, the name can be schema-qualified if necessary. The desired access privilege type is specified by a text string, which must evaluate to one of the values SELECT, INSERT, UPDATE, DELETE, TRUNCATE, REFERENCES, or TRIGGER. Optionally, WITH GRANT OPTION can be added to a privilege type to test whether the privilege is held with grant option. Also, multiple privilege types can be listed separated by commas, in which case the result will be true if any of the listed privileges is held. (Case of the privilege string is not significant, and extra whitespace is allowed between but not within privilege names.) Some examples:

SELECT has_table_privilege('myschema.mytable', 'select');
SELECT has_table_privilege('joe', 'mytable', 'INSERT, SELECT WITH GRANT OPTION');

```sql title="Syntax"
has_table_privilege(user, table, privilege)	boolean	does user have privilege for table
has_table_privilege(table, privilege)	boolean	does current user have privilege for table
```

```sql title="Example"
SELECT has_table_privilege('test_user', 'foo', 'SELECT');
----
t
```

## `has_schema_privilege`

has_schema_privilege checks whether a user can access a schema in a particular way. Its argument possibilities are analogous to has_table_privilege. The desired access privilege type must evaluate to some combination of CREATE or USAGE.

```sql title="Syntax"
has_schema_privilege(user, schema, privilege)	boolean	does user have privilege for schema
has_schema_privilege(schema, privilege)	boolean	does current user have privilege for schema
```

```sql title="Example"
SELECT has_schema_privilege('test_user', 'test_schema', 'CREATE');
----
t
```

## `has_any_column_privilege`

has_any_column_privilege checks whether a user can access any column of a table in a particular way. Its argument possibilities are analogous to has_table_privilege, except that the desired access privilege type must evaluate to some combination of SELECT, INSERT, UPDATE, or REFERENCES. Note that having any of these privileges at the table level implicitly grants it for each column of the table, so has_any_column_privilege will always return true if has_table_privilege does for the same arguments. But has_any_column_privilege also succeeds if there is a column-level grant of the privilege for at least one column.

```sql title="Syntax"
has_any_column_privilege(user, table, privilege)	boolean	does user have privilege for any column of table
has_any_column_privilege(table, privilege)	boolean	does current user have privilege for any column of table
```

```sql title="Example"
SELECT has_any_column_privilege('test_user', 'foo_view'::regclass, 'INSERT');
----
f
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