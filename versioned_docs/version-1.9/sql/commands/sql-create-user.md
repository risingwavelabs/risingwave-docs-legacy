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

## Syntax for creating a new user

```sql
CREATE USER user_name [ [ WITH ] system_permission [ ... ]['PASSWORD' { password | NULL }] ];
```

If you do not want password authentication for the user, omit the PASSWORD option. 

Below are the options for system permissions.

| Option | Description           |
| --------- | --------------------- |
| `SUPERUSER` | Grants the user superuser permission. A superuser can override all access restrictions. `NOSUPERUSER` is the default value. |
| `NOSUPERUSER`| Denies the user superuser permission. A superuser can override all access restrictions. `NOSUPERUSER` is the default value. |
| `CREATEDB`| Grants the user the permission to create databases. `NOCREATEDB` is the default value. |
| `NOCREATEDB`| Denies the user the permission to create databases. `NOCREATEDB` is the default value.|
| `CREATEUSER`| Grants the user the permission to create new users and/or alter and drop existing users. `NOCREATEUSER` is the default value. |
| `NOCREATEUSER` | Denies the user the ability to create new users and/or alter and drop existing users. `NOCREATEUSER` is the default value. |

## Syntax for creating a user with OAuth authentication

In addition, you can create a user with OAuth authentication. The syntax is as follows:

```sql
CREATE USER user_name WITH oauth (
  jwks_url = 'xxx.com',  
  issuer = 'risingwave',
  other_params_should_match = 'xxx', 
);
```

The `jwks_url` and `issuer` parameters are mandatory. On the other hand, `other_params_should_match` is an optional parameter that will be validated against `jwt.claims`. Please ensure that all keys in the options are in **lowercase**.

:::note
`kid` and `alg` are required in the header of JWT, and `kid` is also required in the JWKs returned by the JWKS server. All parameters set in user creation (except `jwks_url`) will be checked in the claims of JWT. Any mismatch will deny the login process.
:::


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

Names and unquoted identifiers are case-insensitive. Therefore, you must double-quote any of these fields for them to be case-sensitive. See also [Identifiers](/sql/sql-identifiers.md).

:::

### Create a user with OAuth authentication

Here is an example of creating a new user `test` with OAuth authentication.

```shell title="Connect and log in with the root account."
psql -h localhost -p 4566 -d dev -U root
```

```sql title="Create a new user test with OAuth authentication in psql."
CREATE USER test WITH oauth (
  jwks_url = 'xxx.com',  // required
  issuer = 'risingwave',  // required
  other_params_should_match = 'xxx',  // optional, will be checked against jwt.claims
);
```

```sql title="Connect and log in with the new account."
-- The password here is actually OAuth token, and will be passed with plaintext.
psql -h localhost -p 4566 -d dev -U test
```