---
id: sql-create-table
title: CREATE TABLE
description: Create a table.
slug: /sql-create-table
---

import rr from '@theme/RailroadDiagram'

export const svg = rr.Diagram(
rr.Stack(
rr.Sequence(
rr.Terminal('CREATE TABLE'),
rr.Optional('IF NOT EXIST', 'skip'),
rr.Optional(
rr.Sequence(
rr.Terminal('schema-name'),
rr.Terminal('.')
),
'skip'),
rr.Terminal('table-name'),
),
rr.Sequence(
rr.Choice(0,
rr.Sequence(
rr.Terminal('('),
rr.Terminal ('column_name'),
rr.Terminal ('data_type'),
rr.ZeroOrMore (rr.Sequence ( rr.Terminal ('column_name'), rr.Terminal ('data_type')), ',')
),
rr.Sequence(
rr.Terminal('AS'),
rr.Terminal('select-query')))))
);

<drawer SVG={svg} />

```js
export const svg = rr.Diagram(
  rr.Stack(
    rr.Sequence(
      rr.Terminal("CREATE TABLE"),
      rr.Optional("IF NOT EXIST", "skip"),
      rr.Optional(rr.Sequence(rr.Terminal("schema-name"), rr.Terminal(".")), "skip"),
      rr.Terminal("table-name")
    ),
    rr.Sequence(
      rr.Choice(
        0,
        rr.Sequence(
          rr.Terminal("("),
          rr.Terminal("column_name"),
          rr.Terminal("data_type"),
          rr.ZeroOrMore(rr.Sequence(rr.Terminal("column_name"), rr.Terminal("data_type")), ",")
        ),
        rr.Sequence(rr.Terminal("AS"), rr.Terminal("select-query"))
      )
    )
  )
);
```

Use the `CREATE TABLE` command to create a new table. Tables consist of fixed columns and insertable rows. Rows can be added using the [`INSERT`](sql-insert.md) command.

:::info
To ingest data streams, you should [create sources](sql-create-source.md) instead.
:::

## Syntax

```sql
CREATE TABLE [ IF NOT EXISTS ] table_name (
    col_name data_type [ PRIMARY KEY ], 
    ...
    [ PRIMARY KEY (col_name, ... ) ]
);
```

:::note
For tables with primary key constraints, if you insert a new data record with an existing key, the new record will overwrite the existing record.
:::

## Parameters

| Parameter    | Description                                                                                                                                                                                            |
| ------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| _table_name_ | The name of the table. If a schema name is given (for example, `CREATE TABLE <schema>.<table> ...`), then the table is created in the specified schema. Otherwise it is created in the current schema. |
| _col_name_   | The name of a column.                                                                                                                                                                                  |
| _data_type_  | The data type of a column. With the `struct` data type, you can create a nested table. Elements in a nested table need to be enclosed with angle brackets ("<\>").                                     |

## Examples

The statement below creates a table that has three columns.

```sql
CREATE TABLE taxi_trips(
    id VARCHAR,
    distance DOUBLE PRECISION,
    city VARCHAR
);
```

The statement below creates a table that includes nested tables.

```sql
CREATE TABLE IF NOT EXISTS taxi_trips(
    id VARCHAR,
    distance DOUBLE PRECISION,
    duration DOUBLE PRECISION,
    fare STRUCT<initial_charge DOUBLE PRECISION, subsequent_charge DOUBLE PRECISION, surcharge DOUBLE PRECISION, tolls DOUBLE PRECISION>
);
```
