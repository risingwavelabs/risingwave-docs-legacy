---
id: sql-create-user
title: CREATE USER
description: Create a new user account.
slug: /sql-create-user
---
<head>
  <link rel="canonical" href="https://docs.risingwave.com/docs/current/sql-create-user/" />
</head>

Use the `CREATE USER` command to create a new user account in RisingWave.

## Syntax

```sql
CREATE USER user_name [ [ WITH ] system_permission [ ... ]['PASSWORD' { password | NULL }] ];
```

If you do not want password authentication for the user, omit the PASSWORD option.

## System permissions

| Option | Description           |
| --------- | --------------------- |
| `SUPERUSER` | Grants the user superuser permission. A superuser can override all access restrictions. `NOSUPERUSER` is the default value. |
| `NOSUPERUSER`| Denies the user superuser permission. A superuser can override all access restrictions. `NOSUPERUSER` is the default value. |
| `CREATEDB`| Grants the user the permission to create databases. `NOCREATEDB` is the default value. |
| `NOCREATEDB`| Denies the user the permission to create databases. `NOCREATEDB` is the default value.|
| `CREATEUSER`| Grants the user the permission to create new users and/or alter and drop existing users. `NOCREATEUSER` is the default value. |
| `NOCREATEUSER` | Denies the user the ability to create new users and/or alter and drop existing users. `NOCREATEUSER` is the default value. |

## Examples

The following statement creates a user account with the name "user1" and password 'pAssword12345'.

```sql
CREATE USER user1 
    WITH PASSWORD 'pAssword12345';
```

:::tip
You can connect to RisingWave with the newly created user account.
:::

To switch to the new user account:

```sql title="Quit current connection."
\q
```

```shell title="Connect and log in with the new account."
psql -h localhost -p 4566 -d dev -U user1
```

Enter the password to log in.

:::note

Names and unquoted identifiers are case-insensitive. Therefore, you must double-quote any of these fields for them to be case-sensitive.

:::
