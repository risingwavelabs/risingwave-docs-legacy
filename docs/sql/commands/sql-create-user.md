---
id: sql-create-user
title: CREATE USER
description: Create a new user account.
slug: /sql-create-user
---

Use the `CREATE USER` command to create a new user account in RisingWave.

## Syntax

```sql
CREATE USER user_name [ [ WITH ] option [ ... ] ];
```

import rr from '@theme/RailroadDiagram'

export const svg = rr.Diagram(
    rr.Stack(
        rr.Sequence(
            rr.Terminal('CREATE USER'),
            rr.NonTerminal('user_name'),
            rr.Optional(
               rr.Sequence(
                  rr.Optional(rr.Terminal('WITH')),
                  rr.OneOrMore(
                     rr.NonTerminal('option'), rr.Comment('space as delimiter')
                    ),
               )
            )
        ),
        rr.Terminal(';')
    )
);

<drawer SVG={svg} />

## Parameters

| Parameter or clause | Description           |
| ------------------- | --------------------- |
| *user_name* | The name of the user account to be created. |
| **WITH** *option* | See the table below. |

### `WITH` options

| Option | Description           |
| --------- | --------------------- |
| `SUPERUSER` | Grants the user superuser permission. A superuser can override all access restrictions. `NOSUPERUSER` is the default value. |
| `NOSUPERUSER`| Denies the user superuser permission. A superuser can override all access restrictions. `NOSUPERUSER` is the default value. |
| `CREATEDB`| Grants the user the permission to create databases. `NOCREATEDB` is the default value. |
| `NOCREATEDB`| Denies the user the permission to create databases. `NOCREATEDB` is the default value.|
| `CREATEUSER`| Grants the user the permission to create new users and/or alter and drop existing users. `NOCREATEUSER` is the default value. |
| `NOCREATEUSER` | Denies the user the ability to create new users and/or alter and drop existing users. `NOCREATEUSER` is the default value. |
| `LOGIN` | Grants the user the ability to log in when establishing connection with RisingWave. `LOGIN` is the default value. |
| `NOLOGIN` | Denies the user the ability to log in when establishing connection with RisingWave. `LOGIN` is the default value. |
| `[ ENCRYPTED ] PASSWORD ' password '` | Sets the password for the user account. You need to provide the password for authentication when during login. If you do not want password authentication for the user, omit the PASSWORD option. |
| `PASSWORD NULL`| If you do not want password authentication for the user, omit the PASSWORD option. Currently, a null password or empty string password means password authentication is not needed. |

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
