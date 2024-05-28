---
id: sql-drop-table
title: DROP TABLE
description: Remove a table.
slug: /sql-drop-table
---

<head>
  <link rel="canonical" href="https://docs.risingwave.com/docs/current/sql-drop-table/" />
</head>

Use the `DROP TABLE` command to remove a table from the database.

Before you can remove a table, you must remove all its dependent objects (indexes, materialized views, etc.).

## Syntax

```sql
DROP TABLE [ IF EXISTS ] [schema_name.]table_name;
```

import rr from '@theme/RailroadDiagram'

export const svg = rr.Diagram(
rr.Sequence(
rr.Terminal('DROP TABLE'),
rr.Optional(
rr.Terminal('IF EXISTS')
),
rr.Optional(
rr.Sequence(
rr.NonTerminal('schema_name'),
rr.Terminal('.')
),
),
rr.NonTerminal('table_name'),
rr.Terminal(';'),
)
);

<Drawer SVG={svg} />

## Parameters

| Parameter | Description                                                                                                                                                                                                                                                    |
| --------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| _schema_  | Specify the name of a schema to remove the table in that schema. You can use [`SHOW SCHEMAS`](sql-show-schemas.md) to get a list of all available schemas. If you don't specify a schema, the specified source in the default schema `public` will be removed. |
| _table_   | The name of the table to remove. You can use [`SHOW TABLES`](sql-show-tables.md) to get a list of all available tables.                                                                                                                                        |

## Examples

This statement removes the `taxi_trips` table in the default schema (`public`) from the database:

```sql
DROP TABLE taxi_trips;
```

This statement removes the `taxi_trips` table in the `rw_schema` schema from the database:

```sql
DROP TABLE IF EXISTS rw_schema.taxi_trips;
```
