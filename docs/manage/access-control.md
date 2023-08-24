---
id: access-control
title: Access control
description: Manage users and privileges
slug: /access-control
---
RisingWave uses a user-based access control to handle authentication and authorization. Users are individual database users or user groups. Privileges can be granted to or revoked from roles to control what actions can be performed on different object levels.

When creating a user, the administrator of an organization can determine the initial permissions and set a password. Additional permissions can be configured later by using `GRANT` and `REVOKE` commands.

In RisingWave, priviledges can be managed at these object levels:

- Database
- Schema
- Table
- Source
- Materialized View
- Sink
- Index

## Users

### Create a user

Syntax:

```sql
CREATE USER user_name [ [ WITH ] option [ ... ] ];
```

For details about WITH options, see [WITH options](/sql/commands/sql-create-user.md#with-options).

Create a user with default permissions:

```sql
CREATE USER user_name;
```

Create a user and grant it the permission to create databases, and set a password for it:

```sql
CREATE USER user001 WITH CREATEDB PASSWORD '1234abcd';
```

### Alter user

You can alter the initial permissions and the password of a user by using the `ALTER USER` command.

The following statement modifies the password and initial permissions of `user001`.

```sql
ALTER USER user001 NOSUPERUSER CREATEDB PASSWORD '4d2Df1ee5';
```

## Privileges

See the table below for the privileges available in RisingWave and the corresponding object levels that they can apply to.

|Privilege |Description |Object Level|
|--------|---------|---------|
|`SELECT` |Permission to retrieve data from a relation object. |Table, Source, Materialized View|
|`INSERT` |Permission to add new rows to a table. |Table|
|`UPDATE` |Permission to modify existing data in a table. |Table|
|`DELETE` |Permission to remove rows from a table. |Table|
|`CREATE` |Permission to create new objects within the database. |Database, Table, Source, Materialized View, Sink, Index|

You use the `GRANT` command to grant priviledges to a user, and the `REVOKE` command to revoke priviledges from a user. For the syntaxes of these two commands, see [`GRANT`](/sql/commands/sql-grant.md) and [`REVOKE`](/sql/commands/sql-revoke).

This statements grants the `SELECT` privilege for materialized view `mv1`, which is in schema `schema1` of database `db1`, to user `user1`. `user1` is able to grant the `SELECT` privilege other users.

```sql
GRANT SELECT
ON MATERIALIZED VIEW mv1 IN SCHEMA db1.schema1
TO user1 WITH GRANT OPTION GRANTED BY user;
```

This statement grants the `SELECT` and `UPDATE` privileges for source `s1` to user `user1`.

```sql
GRANT SELECT, UPDATE
ON SOURCE s1
TO user1;
```
