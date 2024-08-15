---
id: sql-create-secret
title: CREATE SECRET
description: Create a secret to store crediencials.
slug: /sql-create-secret
---
<head>
  <link rel="canonical" href="https://docs.risingwave.com/docs/current/sql-create-secret/" />
</head>

Use the `CREATE SECRET` command to create secrets to store sensitive credentials securely.

## Syntax

```sql
CREATE SECRET secret_name WITH ( backend = 'meta') AS 'your_secret';
```

## Parameters

| Parameter or Clause | Description |
|---------------------|-------------|
| *secret_name*     | The name of the secret to be created. This should be a unique identifier within the system. |
| *backend*         | Specifies the backend where the secret will be stored. Currently, only the `meta` backend is supported. |
| *your_secret*     | The actual secret value that you wish to store. This is the sensitive information that will be securely stored. |

## Examples

Here is an example. We create a secret named `mysql_pwd`, and then use it in the `WITH` clause. After that, we use the `SHOW CREATE SOURCE` command to view the password. As shown in the result, the MySQL password is hidden, ensuring no secret leaks.

```sql
CREATE SECRET mysql_pwd WITH ( backend = 'meta' ) AS '123';
```

```sql
CREATE SOURCE mysql_source WITH (
 connector = 'mysql-cdc',
 hostname = 'localhost',
 port = '8306',
 username = 'rwcdc',
 password = secret mysql_pwd,
 database.name = 'test',
 server.id = '5601'
);
```

```sql
SHOW CREATE SOURCE mysql_source;

---RESULT
--- public.mysql_mydb | CREATE SOURCE mysql_mydb WITH (connector = 'mysql-cdc', hostname = 'mysql', port = '3306', username = 'root', password = secret mysql_pwd, database.name = 'mydb', server.id = '2') FORMAT PLAIN ENCODE JSON
```

## See also

- [Manage secrets](/deploy/manage-secrets.md): A comprehensive guide for secret management operations, including creation, usage, and deletion.

- [`DROP SECRET`](/sql/commands/sql-drop-secret.md): Dropping a secret.
