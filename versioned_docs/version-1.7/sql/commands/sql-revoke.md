---
id: sql-revoke
title: REVOKE
description: Revoke privileges from a user.
slug: /sql-revoke
---
<head>
  <link rel="canonical" href="https://docs.risingwave.com/docs/current/sql-revoke/" />
</head>

Use the `REVOKE` command to revoke privileges from a user.

## Syntax

Revoke database privileges from a user.

```sql
REVOKE {{CONNECT | CREATE}[, ...]| ALL [PRIVILEGES]} 
ON DATABASE database_name [, ...]
FROM user_name [GRANTED BY user_name];
```

Revoke schema privileges from a user.

```sql
REVOKE {CREATE | ALL [PRIVILEGES]} 
ON SCHEMA schema_name [, ...]
FROM user_name [GRANTED BY user_name];
```

Revoke table privileges from a user.

```sql
REVOKE {{SELECT | UPDATE | INSERT | DELETE} [, ...]| ALL [PRIVILEGES]} 
ON {  TABLE table_name [, ...]
    | ALL TABLES IN SCHEMA schema_name [, ...] }
FROM user_name [GRANTED BY user_name];
```

Revoke source privileges from a user.

```sql
REVOKE {SELECT | ALL [PRIVILEGES]} 
ON {  SOURCE source_name [, ...]
    | ALL SOURCES IN SCHEMA schema_name [, ...] }
FROM user_name [GRANTED BY user_name];
```

Revoke materialized view privileges from a user.

```sql
REVOKE {SELECT | ALL [PRIVILEGES]} 
ON {MATERIALIZED VIEW mv_name [, ...] 
    | ALL MATERIALIZED VIEWS IN SCHEMA schema_name [, ...] }
FROM user_name [GRANTED BY user_name];
```

## Parameters

|Parameter or clause    | Description|
|---------------|------------|
|**GRANTED BY** clause |The specified user after the GRANTED BY clause must be the current user. By default, the current user is `root`.   |

## Example

Revoke all privileges for all sources in `schema1` from user `user1`.

```sql
REVOKE ALL PRIVILEGES 
ON ALL SOURCES IN SCHEMA schema1 
FROM user1 GRANTED BY user;
```

REVOKE the SELECT privilege for materialized view `mv1`, which is in schema `schema1` of database `db1`, from user `user1`.

```sql
REVOKE SELECT
ON MATERIALIZED VIEW mv1 IN SCHEMA db1.schema1
FROM user1;
```

Revoke the SELECT privilege for source `s1` from user `user1`.

```sql
REVOKE SELECT
ON SOURCE s1
FROM user1;
```
