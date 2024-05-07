---
id: access-control
title: Access control
description: Manage users and privileges
slug: /access-control
---
<head>
  <link rel="canonical" href="https://docs.risingwave.com/docs/current/access-control/" />
</head>

RisingWave uses a user-based access control to handle authentication and authorization. Privileges can be granted to or revoked by users to control what actions can be performed on different object levels.

When creating a user, the administrator of an organization can determine the system-level permissions and set a password. The system permissions and the user names can be revised with the `ALTER USER` command. For details about the system permissions, see [System permissions](/sql/commands/sql-create-user.md#system-permissions).

Database privileges can be configured later by using `GRANT` and `REVOKE` commands. The privileges are managed at these object levels:

- Database
- Schema
- Table
- Source
- Materialized view

For database privileges that can be applied to each of the object levels, see [Privileges](#privileges).

## Users

### Create a user

Syntax:

```sql
CREATE USER user_name [ [ WITH ] system_permission [ ... ]['PASSWORD' { password | NULL }] ];
```

For details about system permissions, see [System permissions](/sql/commands/sql-create-user.md#system-permissions).

Create a user with default permissions:

```sql
CREATE USER user_name;
```

Create a user and permit it to create databases, and set a password for it:

```sql
CREATE USER user001 WITH CREATEDB PASSWORD '1234abcd';
```

### Alter user

You can alter the system permissions, password, or name of a user by using the `ALTER USER` command.

The following statement modifies the password and initial permissions of `user001`.

```sql
ALTER USER user001 WITH NOSUPERUSER CREATEDB PASSWORD '4d2Df1ee5';
```

The following statement renames `user1` to `user001`.

```sql
ALTER USER user1 RENAME TO user001;
```

## Privileges

See the table below for the privileges available in RisingWave and the corresponding object levels that they can apply to.

|Privilege |Description |Object Level|
|--------|---------|---------|
|`SELECT` |Permission to retrieve data from a relation object. |Table, Source, Materialized View|
|`INSERT` |Permission to add new rows to a table. |Table|
|`UPDATE` |Permission to modify existing data in a table. |Table|
|`DELETE` |Permission to remove rows from a table. |Table|
|`CREATE` |Permission to create new objects within the database. |Schema, Database, Table|
|`CONNECT`|Permission to connect to a database.| Database|

You use the `GRANT` command to grant privileges to a user, and the `REVOKE` command to revoke privileges from a user. For the syntaxes of these two commands, see [`GRANT`](/sql/commands/sql-grant.md) and [`REVOKE`](/sql/commands/sql-revoke.md).

This statement grants the `SELECT` privilege for materialized view `mv1`, which is in schema `schema1` of database `db1`, to user `user1`. `user1` is able to grant the `SELECT` privilege to other users.

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
