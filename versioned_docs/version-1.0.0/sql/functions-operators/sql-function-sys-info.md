---
id: sql-function-sys-info
slug: /sql-function-sys-info
title: System information functions
---
<head>
  <link rel="canonical" href="https://docs.risingwave.com/docs/current/sql-function-sys-info/" />
</head>

RisingWave provides functions to help you get system information, including databse, schema, user, role, session, and more.

## current_database()

Returns the name of the current database. You can use this function in SQL commands, functions, and operators.

```sql title=Syntax
current_database() → *current_database_name*
```

```sql title=Examples
SELECT current_database(); →  `db_name`
SELECT count(current_database()); → 1
```

## current_role

Returns the name of the role that the current user is acting as, if the current user is a member of one or more roles.

```sql title=Syntax
current_role → *current_role_name* 
current_role() → *current_role_name*
```

```sql title=Example
SELECT current_role(); → 'root'
```

## current_shema

Returns the current schema. This is the schema that will be used for creating tables or other named objects without specifying a target schema.

```sql title=Syntax
current_schema → *current_schema_name* 
current_schema() → *current_schema_name*
```

```sql title=Example
SELECT current_schema(); → 'public'
```

## current_user

Returns the name of the current effective user.

```sql title=Syntax
current_user → *user_name*
current_user() → *user_name* 
```

```sql title=Example
SELECT current_user(); → `root`
```

## pg_typeof

Returns the standard name of the data type of the provided value. More specifically, it returns the OID of the data type of the provided value. It returns a regtype, which is an OID alias type. Therefore it’s the same as an OID for comparison purposes but displays as a type name.

```sql title=Syntax
pg_typeof() → regtype

```

```sql title=Examples
SELECT pg_typeof(round(null));  → `double precision`
SELECT pg_typeof(row(true, 1, 'hello')); → `record`
SELECT pg_typeof(array[1, 2]); → `integer[]`
```

## session_user

Returns the name of the current session user.

```sql title=Syntax
session_user → *session_user_name*
session_user() → *session_user_name* 
```

```sql title=Example
SELECT session_user(); → `root`
```

## user

Returns the name of the current database user.

```sql title=Syntax
user → *user_name*
user() → *user_name* 
```

```sql title=Example
SELECT user(); → `root`
```
