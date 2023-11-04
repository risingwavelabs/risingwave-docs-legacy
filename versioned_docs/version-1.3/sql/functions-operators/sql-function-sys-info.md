---
id: sql-function-sys-info
slug: /sql-function-sys-info
title: System information functions
---
<head>
  <link rel="canonical" href="https://docs.risingwave.com/docs/current/sql-function-sys-info/" />
</head>

RisingWave provides functions to help you get system information, including databse, schema, user, role, session, and more.

## `current_database()`

Returns the name of the current database. You can use this function in SQL commands, functions, and operators.

```sql title=Syntax
current_database() → *current_database_name*
```

```sql title=Examples
SELECT current_database(); →  `db_name`
SELECT count(current_database()); → 1
```

## `current_role`

Returns the name of the role that the current user is acting as, if the current user is a member of one or more roles.

```sql title=Syntax
current_role → *current_role_name* 
current_role() → *current_role_name*
```

```sql title=Example
SELECT current_role(); → 'root'
```

## `current_shema`

Returns the current schema. This is the schema that will be used for creating tables or other named objects without specifying a target schema.

```sql title=Syntax
current_schema → *current_schema_name* 
current_schema() → *current_schema_name*
```

```sql title=Example
SELECT current_schema(); → 'public'
```

## `current_user`

Returns the name of the current effective user.

```sql title=Syntax
current_user → *user_name*
current_user() → *user_name* 
```

```sql title=Example
SELECT current_user(); → `root`
```

<!--## `pg_tablespace_location()`

Returns the file system location of a tablespace. To use this function, you need to provide the OID of the tablespace you want to get the location for as an argument.
-->

## `pg_typeof()`

Returns the standard name of the data type of the provided value. More specifically, it returns the OID of the data type of the provided value. It returns a regtype, which is an OID alias type. Therefore it’s the same as an OID for comparison purposes but displays as a type name.

```sql title=Syntax
pg_typeof() → regtype

```

```sql title=Examples
SELECT pg_typeof(round(null));  → `double precision`
SELECT pg_typeof(row(true, 1, 'hello')); → `record`
SELECT pg_typeof(array[1, 2]); → `integer[]`
```

## `pg_relation_size`

Computes the disk space used by one “fork” of the specified relation.

```sql title=Syntax
pg_relation_size ( relation regclass [, 'main' ] ) → bigint
```

Returns the size of the main data fork of the relation. This function can be used to determine if the main data fork of a relation exists. If its size is not 0, it means that the main data fork of the relation exists.

```sql title=Examples
SELECT pg_relation_size('t') != 0; → t
SELECT pg_relation_size('t', 'main') != 0; → t
```

## `session_user`

Returns the name of the current session user.

```sql title=Syntax
session_user → *session_user_name*
session_user() → *session_user_name* 
```

```sql title=Example
SELECT session_user(); → `root`
```

## `user`

Returns the name of the current database user.

```sql title=Syntax
user → *user_name*
user() → *user_name* 
```

```sql title=Example
SELECT user(); → `root`
```

## `version()`

Displays the PostgreSQL version and the RisingWave version implemented in the current instance of RisingWave.

```sql title=Example
SELECT version ();
---------RESULT
 version 
-----------------
 PostgreSQL 8.3-RisingWave-1.0.0-alpha (76672d87cf5c20aa8fbb6f11996ef15255443b51)
(1 row)
```
