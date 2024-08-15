---
id: sql-drop-secret
title: DROP SECRET
description: Drop a secret.
slug: /sql-drop-secret
---
<head>
  <link rel="canonical" href="https://docs.risingwave.com/docs/current/sql-drop-secret/" />
</head>

Use the `DROP SECRET` command to drop the secrets that store sensitive credentials.

## Syntax

```sql
DROP SECRET secret_name;
```

## Parameters

| Parameter or Clause | Description |
|---------------------|-------------|
| *secret_name*     | The name of the secret to be dropped. |

## Examples

```sql
CREATE SECRET mysql_pwd WITH ( backend = 'meta' ) AS '123';
----RESULT
CREATE_SECRET

DROP SECRET mysql_pwd;
----RESULT
DROP_SECRET
```

## See also

- [Manage secrets](/deploy/manage-secrets.md): A comprehensive guide for secret management operations, including creation, usage, and deletion.

- [`CREATE SECRET`](/sql/commands/sql-create-secret.md): Create a secret.