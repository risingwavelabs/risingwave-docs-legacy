---
id: manage-secrets
title: Manage secrets
description: Use the secret management feature to store credentials securely.
slug: /manage-secrets
---
<head>
  <link rel="canonical" href="https://docs.risingwave.com/docs/current/manage-secrets/" />
</head>

By default, credentials for connecting to external services (like MySQL) are specified in plain text within the `WITH` clause of `CREATE SOURCE / SINK` statements. This practice poses security risks, particularly for large organizations where multiple teams manage connected services.

To address the issue, we recommend using the `CREATE SECRET` command to store credentials securely. Admins can create secrets in advance, allowing other team members to reference them using secret identifiers when creating source/sink connections. This ensures that secrets remain protected throughout all phases of access.


RisingWave provides four key secret management operations:

- Creating secrets.

- Using secrets.

- Using secrets as a file.

- Dropping secrets.

In addition, you can use the [`rw_secrets`](/sql/system-catalogs/rw_catalog.md) catalog to view the ID, name, owner, and access control of secret objects.

:::tip Premium Edition Feature
This feature is only available in the premium edition of RisingWave. The premium edition offers additional advanced features and capabilities beyond the free and community editions. If you have any questions about upgrading to the premium edition, please contact our sales team at [sales@risingwave-labs.com](mailto:sales@risingwave-labs.com).
:::

:::info Public Preview
This feature is in the public preview stage. This means it's nearing the final product, but not fully stable. If you encounter any issues or have feedback, please contact us through our [Slack channel](https://www.risingwave.com/slack). Your input is valuable in helping us improve the feature. For more information, see our [Public preview feature list](/product-lifecycle/#features-in-the-public-preview-stage).
:::

## Create secrets

You can use the following statement to create secrets:

```sql title="Syntax for creating secrets"
CREATE SECRET secret_name WITH ( backend = 'meta') AS 'your_secret';
```

```sql title="Examples"
CREATE SECRET mysql_pwd WITH (
  backend = 'meta'
) AS '123';
```

:::note
Currently only the meta backend is supported.
:::

## Use secrets

After creating secrets, you can use `SECRET your_secret_name` as the option value in the `WITH` clause. For example:

```sql title="Use a secret in the WITH clause"
CREATE SECRET mysql_pwd WITH (
  backend = 'meta'
) AS '123';

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

## Use secrets as a file

Some connectors need credentials stored as file paths (e.g., `ssl.ca.location`), where the file contains the secret. RisingWave allows you to reference a secret as a file path.

```sql title="Reference a secret as a file path"
CREATE TABLE district (
    d_id INTEGER,
    PRIMARY KEY (d_id)
) with (
    connector = 'kafka',
    topic = 'your-topic',
    properties.bootstrap.server = 'your-broker-address:29092',
    ssl.ca.location = SECRET kafka_ca AS FILE,
    ssl.certificate.location = SECRET kafka_cert AS FILE,
    ssl.key.location = SECRET kafka_key AS FILE,
    ssl.key.password = SECRET kafka_password,
) FORMAT DEBEZIUM ENCODE JSON;
```

## Drop secrets

You can use the following statement to drop secrets:

```sql title="Syntax for dropping secrets"
DROP SECRET secret_name;
```

## Examples

Here is an example. We create a secret named `mysql_pwd`, and then use it in the `WITH` clause. After that, we use the `SHOW CREATE SOURCE` command to view the password.

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

As shown in the result, the MySQL password is hidden, ensuring no secret leaks.

## Notes for open-source deployment

To use secret management, you need to set the environment variable `RW_SECRET_STORE_PRIVATE_KEY_HEX` to a hex representation of a 128-bit key (e.g. `0123456789abcdef`). This key is used to encrypt secrets in RisingWave. You **MUST NOT** lose this key, as it is required to decrypt secrets.

To specify the temporary secret file directory, set `RW_TEMP_SECRET_FILE_DIR`. This is only used with the `as file` option.

## See also

- [`CREATE SECRET`](/sql/commands/sql-create-secret.md): Creating a secret.

- [`DROP SECRET`](/sql/commands/sql-drop-secret.md): Dropping a secret.
