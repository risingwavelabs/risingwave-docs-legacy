---
id: sql-function-sys-info
slug: /sql-function-sys-info
title: System information functions
---

|Function|Description|Example|
|---|---|---|
| current_database() → *current_database_name* |Returns the name of the current database. SQL commands, functions, and operators support the current_database() function.|`current_database()` → `db_name` <br /> `count(current_database())` → `1`|
| current_schema → *current_schema_name* <br /> current_schema() → *current_schema_name* |Returns the current schema. This is the schema that will be used for any tables or other named objects that are created without specifying a target schema.|`current_schema()` → `public`|
| pg_typeof() → regtype |Returns the standard name of the data type of the provided value. <br /> More specifically, it returns the OID of the data type of the provided value. It returns a regtype, which is an OID alias type. Therefore it’s the same as an OID for comparison purposes but displays as a type name.|`pg_typeof(round(null))` → `double precision` <br /> `pg_typeof(row(true, 1, 'hello'))` → `record` <br /> `pg_typeof(array[1, 2])` → `integer[]`|
| session_user → *session_user_name* <br /> session_user() → *session_user_name* |Returns the session user's name.|`session_user()` → `root`|