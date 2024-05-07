---
id: sql-grant
title: GRANT
description: Grant a user privileges.
slug: /sql-grant
---
<head>
  <link rel="canonical" href="https://docs.risingwave.com/docs/current/sql-grant/" />
</head>

Use the `GRANT` command to grant specific privileges to a user.

## Syntax

Grant database privileges to a user.


```sql
GRANT {{CONNECT | CREATE}[, ...]| ALL [PRIVILEGES]} 
ON DATABASE database_name [, ...]
TO user_name [WITH GRANT OPTION] [GRANTED BY user_name];
```


Grant schema privileges to a user.

```sql
GRANT {CREATE | ALL [PRIVILEGES]} 
ON SCHEMA schema_name [, ...]
TO user_name [WITH GRANT OPTION] [GRANTED BY user_name];
```

Grant table privileges to a user.

```sql
GRANT {{CREATE | SELECT | UPDATE | INSERT | DELETE} [, ...]| ALL [PRIVILEGES]} 
ON { TABLE table_name [, ...]
    | ALL TABLES IN SCHEMA schema_name [, ...] }
TO user_name [WITH GRANT OPTION] [GRANTED BY user_name];
```

For sources and materialized views, only the `SELECT` privilege can be assigned and revoked.

Grant source privileges to a user.

```sql
GRANT { SELECT | ALL [PRIVILEGES]} 
ON {  source_or_table_name [, ...]
    | ALL SOURCES IN SCHEMA schema_name [, ...] }
TO user_name [WITH GRANT OPTION] [GRANTED BY user_name];
```

Grant materialized view privileges to a user.

```sql
GRANT {SELECT | ALL [PRIVILEGES]} 
ON {MATERIALIZED VIEW mv_name [, ...] 
    | ALL MATERIALIZED VIEWS IN SCHEMA schema_name [, ...] }
TO user_name [WITH GRANT OPTION] [GRANTED BY user_name];
```

## Parameters

|Parameter or clause    | Description|
|---------------|------------|
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

Grant the SELECT privileges for source `s1` to user `user1`.

```sql
GRANT SELECT
ON SOURCE s1
TO user1;
```
