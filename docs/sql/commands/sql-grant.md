---
id: sql-grant
title: GRANT
description: Grant a user privileges.
slug: /sql-grant
---

Use the `GRANT` command to give a user specific privileges.

## Syntax

Grant a user database privileges.
```sql
GRANT {{CONNECT | CREATE}[, ...]| ALL [PRIVILEGES]} 
ON DATABASE database_name [, ...]
TO user_name [WITH GRANT OPTION] [GRANTED BY user_name];
```

Grant a user materialized view privileges.
```sql
GRANT {SELECT | ALL [PRIVILEGES]} 
ON {MATERIALIZED VIEW mv_name [, ...] 
    | ALL MATERIALIZED VIEWS IN SCHEMA schema_name [, ...] }
TO user_name [WITH GRANT OPTION] [GRANTED BY user_name];
```

Grant a user schema privileges.
```sql
GRANT {CREATE | ALL [PRIVILEGES]} 
ON SCHEMA schema_name [, ...]
TO user_name [WITH GRANT OPTION] [GRANTED BY user_name];
```

Grant a user source privileges.
```sql
GRANT {{SELECT | UPDATE | INSERT | DELETE} [, ...]| ALL [PRIVILEGES]} 
ON {SOURCE source_name [, ...]
    | ALL SOURCES IN SCHEMA schema_name [, ...] }
TO user_name [WITH GRANT OPTION] [GRANTED BY user_name];
```

## Parameters
|Parameter or clause    | Description|
|---------------|------------|
|*database_name* |The database the user will be granted privilege to. |
|*mv_name* |The materialized view the user will be granted privilege to. |
|*schema_name* |The schema the user will be granted privilege to. |
|*source_name* |The data source the user will be granted privilege to. |
|*user_name* |A Postgres user. |
|**WITH GRANT OPTION** clause |The WITH GRANT OPTION clause allows the grantee to grant the privilege to other users.    |
|**GRANTED BY** clause |The specified user after the GRANTED BY clause must be the current user. By default, the current user is `root`.   |

## Example

Grant all privileges for all sources in `schema1` to user `user1`.
```sql
GRANT ALL PRIVILEGES 
ON ALL SOURCES IN SCHEMA schema1 
TO user1 GRANTED BY user;
```

Grant the SELECT privilege for materialized view `mv1`, which is in schema `schema1` of database `db1`, to user `user1`. `user1` is able to grant the SELECT privilege other users.
```sql
GRANT SELECT
ON MATERIALIZED VIEW mv1 IN SCHEMA db1.schema1
TO user1 WITH GRANT OPTION GRANTED BY user;
```

Grant the SELECT and UPDATE privileges for source `s1` to user `user1`.
```sql
GRANT SELECT, UPDATE
ON SOURCE s1
TO user1;
```