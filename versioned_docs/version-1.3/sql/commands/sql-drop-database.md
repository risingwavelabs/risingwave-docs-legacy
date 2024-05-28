---
id: sql-drop-database
title: DROP DATABASE
description: Remove a database.
slug: /sql-drop-database
---

<head>
  <link rel="canonical" href="https://docs.risingwave.com/docs/current/sql-drop-database/" />
</head>

Use the `DROP DATABASE` command to remove a database from your RisingWave instance.

Before you can remove a database, you must use [DROP SCHEMA](sql-drop-schema.md) to remove all its dependent schemas.

:::caution
`DROP DATABASE` removes all data in a database and cannot be undone.
:::

## Syntax

```sql
DROP DATABASE [ IF EXISTS ] database_name;
```

import rr from '@theme/RailroadDiagram'

export const svgtwo = rr.Diagram(
rr.Sequence(
rr.Terminal('DROP DATABASE'),
rr.Optional(rr.Terminal('IF EXISTS')),
rr.NonTerminal('database_name', 'skip'),
rr.Terminal(';'),
)
);

<Drawer SVG={svgtwo} />

## Parameters

| Parameter or clause  | Description                                                                                                                                  |
| -------------------- | -------------------------------------------------------------------------------------------------------------------------------------------- |
| **IF EXISTS** clause | Do not return an error if the specified database does not exist.                                                                             |
| _database_name_      | The name of the database you want to remove. You can use [`SHOW DATABASES`](sql-show-databases.md) to get a list of all available databases. |

## Examples

This statement removes the `rw_db` database which contains two schemas, `rw_schema` and `public` (default schema):

```sql
DROP SCHEMA rw_db.rw_schema;
DROP SCHEMA rw_db.public;
DROP DATABASE rw_db;
```

Use this statement if you don't want RisingWave to return an error if the database you want to remove does not exist:

```sql
DROP DATABASE IF EXISTS rw_db;
```
