---
id: sql-alter-user
title: ALTER USER
description: Modify properties of a user.
slug: /sql-alter-user
---

Use the `ALTER USER` command to modify the name, password, privileges, and other properties of an existing user.

## Syntax

```sql title="Alter user name."
ALTER USER user_name 
    RENAME TO new_user_name
```


import rr from '@theme/RailroadDiagram'

export const svg = rr.Diagram(
rr.Stack(
   rr.Sequence(
      rr.Terminal("ALTER USER"),
      rr.NonTerminal("user_name", "skip"),
   ),
   rr.Sequence(
      rr.Terminal("RENAME TO"),
      rr.NonTerminal("new_user_name", "skip"),
   ),
)
);

<drawer SVG={svg} />



```sql title="Alter user properties."
ALTER USER user_name 
    [ [ WITH ] option [ ... ] ]
```

import rr from '@theme/RailroadDiagram'

export const svg = rr.Diagram(
rr.Stack(
   rr.Sequence(
      rr.Terminal('ALTER USER'),
      rr.NonTerminal('user_name', 'skip'),
   ),
   rr.Optional(
      rr.Stack(
         rr.Sequence(
            rr.Terminal('WITH'),
         ),
         rr.OneOrMore (
            rr.Sequence(
               rr.NonTerminal('option'),
            ),rr.Comment('Option can be a property of the user, such as password, role, etc.'),
         ),
      ),
   ),
)
);

<drawer SVG={svg} />


## Parameters
| Parameter or clause | Description           |
| ------------------- | --------------------- |
| *user_name* | The name of the user to be modified. |
| *new_user_name* | The new name of the user. |
| **WITH** *option* | See [WITH options](sql-create-user.md#with-options) in `CREATE USER`. |



## Example

The following statement rename the user `user1` to `user001`.

```sql
ALTER USER user1 RENAME TO user001;
```


The following statement modify the password and privileges of `user001`.

```sql
ALTER USER user001 NOSUPERUSER CREATEDB PASSWORD '4d2Df1ee5';
```
