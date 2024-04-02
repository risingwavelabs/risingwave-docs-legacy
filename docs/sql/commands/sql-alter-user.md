---
id: sql-alter-user
title: ALTER USER
description: Modify the properties of a user.
slug: /sql-alter-user
---
<head>
  <link rel="canonical" href="https://docs.risingwave.com/docs/current/sql-alter-user/" />
</head>

Use the `ALTER USER` command to modify the name, password, system permissions, and other properties of an existing user.

## Syntax

```sql title="Alter user name"
ALTER USER user_name 
    RENAME TO new_user_name
```

```sql title="Alter user properties"
CREATE USER user_name [ [ WITH ] system_permission [ ... ]['PASSWORD' { password | NULL }] ];
```

```sql title="Alter user authentication method"
ALTER USER user_name WITH oauth (
  jwks_url = 'xxx.com',  
  issuer = 'risingwave',
  other_params_should_match = 'xxx', 
);
```

## Parameters

| Parameter or clause | Description           |
| ------------------- | --------------------- |
| *user_name* | The name of the user to be modified. |
| *new_user_name* | The new name of the user. |
| *system_permission* | See [the options for system permissions of the `CREATE USER` command](/sql/commands/sql-create-user.md#system-permissions).|

For the parameters of altering the user authentication method. The `jwks_url` and `issuer` parameters are mandatory. On the other hand, `other_params_should_match` is an optional parameter that will be validated against `jwt.claims`. Please ensure that all keys in the options are in **lowercase**.

:::note
`kid` and `alg` are required in the header of JWT, and `kid` is also required in the JWKs returned by the JWKS server. All parameters set in user creation (except `jwks_url`) will be checked in the claims of JWT. Any mismatch will deny the login process.
:::


## Examples

The following statement renames the user `user1` to `user001`.

```sql
ALTER USER user1 RENAME TO user001;
```

The following statement modifies the password and privileges of `user001`.

```sql
ALTER USER user001 NOSUPERUSER CREATEDB PASSWORD '4d2Df1ee5';
```
