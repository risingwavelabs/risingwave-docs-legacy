---
id: sql-create-user
title: CREATE USER
description: Create a new user account.
slug: /sql-create-user
---

Use the `CREATE USER` command to create a new user account in RisingWave.

## Syntax

```sql
CREATE USER user_name 
    [ WITH option [ ... ] ]
```
<!-- 'WITH' will be optional in v0.1.12. (Now 'WITH' is required if you want to specify options.) Track: https://github.com/singularity-data/risingwave/pull/4414 -->

## Parameters
| Parameter or clause | Description           |
| ------------------- | --------------------- |
| *user_name* | The name of the user account to be created. |
| **WITH** *option* | See the table below. |

#### `WITH` options
| Parameter | Description           |
| --------- | --------------------- |
| SUPERUSER <br/><br/> NOSUPERUSER | Grants/denies the user superuser permission. A superuser can override all access restrictions. <br/> If not specified, NOSUPERUSER is the default. |
| CREATEDB <br/><br/> NOCREATEDB | Grants/denies the user the ability to create databases. <br/> If not specified, NOCREATEDB is the default. |
| LOGIN <br/><br/> NOLOGIN | Grants/denies the user the ability to log in when [establishing connection with RisingWave](../Get-Started.md/#connect-to-risingwave). <br/> If not specified, LOGIN is the default. |
| [ ENCRYPTED ] PASSWORD ' password ' <br/><br/> PASSWORD NULL | Sets the password for the user account. You need to provide the password for authentication when during login. <br/> If you do not want password authentication for the user, omit the PASSWORD option. <br/> Currently, a null password or empty string password means password authentication is not needed. | <!-- Behavior for a null/empty password might change in the future. Track: https://github.com/singularity-data/risingwave/issues/4428 -->
<!-- New options will be added in the future. Track: https://github.com/singularity-data/risingwave/issues/4440 -->


## Example

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
