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

In addition, you can create a user with OAuth authentication. The syntax is as follows:

```sql
CREATE USER user_name WITH oauth (
  jwks_url = 'xxx.com',  
  issuer = 'risingwave',
  other_params_should_match = 'xxx', 
);
```

The `jwks_url` and `issuer` parameters are mandatory. On the other hand, `other_params_should_match` is an optional parameter that will be validated against `jwt.claims`. Please ensure that all keys in the options are in **lowercase**.


## Examples

### Create a user account and switch to it

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

### Create a user with OAuth authentication

Here is an example of creating a new user `test` with OAuth authentication.

```sql title="Log"
psql -h localhost -p 4566 -d dev -U root
```

```
# In psql
CREATE USER test WITH oauth (
  jwks_url = 'xxx.com',  // required
  issuer = 'risingwave',  // required
  other_params_should_match = 'xxx',  // optional, will be checked against jwt.claims
);

# Password here is actually OAuth token, and would be passed with plaintext
psql -h localhost -p 4566 -d dev -U test
```