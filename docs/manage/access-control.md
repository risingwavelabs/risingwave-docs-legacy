---
id: access-control
title: Access control
description: Manage users and privileges
slug: /access-control
---
RisingWave uses a user-based access control to handle authentication and authorization. For each user, you can manage the privileges and the scope of the privileges (which objects to apply to).

## Users

### Create a user

Syntax:

```sql
CREATE USER user_name [ [ WITH ] option [ ... ] ];
```

### Parameters

| `SUPERUSER` | Grants the user superuser permission. A superuser can override all access restrictions. `NOSUPERUSER` is the default value. |
| `NOSUPERUSER`| Denies the user superuser permission. A superuser can override all access restrictions. `NOSUPERUSER` is the default value. |
| `CREATEDB`| Grants the user the ability to create databases. `NOCREATEDB` is the default value. |
| `NOCREATEDB`| Denies the user the ability to create databases. `NOCREATEDB` is the default value.|
| `CREATEUSER`| Grants the user the ability to create new users and/or alter and drop existing users. `NOCREATEUSER` is the default value. |
| `NOCREATEUSER` | Denies the user the ability to create new users and/or alter and drop existing users. `NOCREATEUSER` is the default value. |
| `LOGIN` | Grants the user the ability to log in when establishing connection with RisingWave. `LOGIN` is the default value. |
| `NOLOGIN` | Denies the user the ability to log in when establishing connection with RisingWave. `LOGIN` is the default value. |
| `[ ENCRYPTED ] PASSWORD ' password '` | Sets the password for the user account. You need to provide the password for authentication when during login. If you do not want password authentication for the user, omit the PASSWORD option. |
| `PASSWORD NULL`| If you do not want password authentication for the user, omit the PASSWORD option. Currently, a null password or empty string password means password authentication is not needed. |

### Examples of creating users

Create a user with default permissions.

```sql
CREATE USER user_name;
```

Create a user and grant it the permission to create databases, and set a password for it.

```sql
CREATE USER user_name WITH CREATEDB PASSWORD '1234abcd';
```

## Privileges
