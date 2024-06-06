---
id: sql-delete
title: DELETE
description: Remove rows from a table.
slug: /sql-delete
---

<head>
  <link rel="canonical" href="https://docs.risingwave.com/docs/current/sql-delete/" />
</head>

Use the `DELETE` command to permanently remove rows from a table.

## Syntax

```sql
DELETE FROM table_name
WHERE condition
[ RETURNING col_name ];
```

import rr from '@theme/RailroadDiagram'

export const svg = rr.Diagram(
rr.Sequence(
rr.Terminal('DELETE FROM'),
rr.NonTerminal('table_name', 'skip'),
rr.Terminal('WHERE'),
rr.NonTerminal('condition', 'skip'),
rr.Optional(
rr.Sequence(
rr.Terminal('RETURNING'),
rr.NonTerminal('col_name', 'skip')
)
),
rr.Terminal(';')
)
);

<Drawer SVG={svg} />

## Parameters

| Parameter or clause   | Description                                                                                                                                                                                                                                                                     |
| --------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| _table_name_          | The table where you want to remove records.                                                                                                                                                                                                                                     |
| **WHERE** _condition_ | Specify which rows you want to remove using an expression that returns a boolean value. Rows for which this expression returns true will be removed. <br/> If you omit the WHERE clause, all rows of records in the table will be deleted but the table structure will be kept. |
| **RETURNING**         | Returns the values of any column based on each deleted row.                                                                                                                                                                                                                     |

## Example

The `taxi_trips` table has three records:

```sql
SELECT * FROM taxi_trips;
```

```
 id | distance |    city
----+----------+-------------
  1 |       16 | Yerba Buena
  2 |       23 | New York
  3 |        6 | Chicago
(3 rows)
```

The following statement removes the record with id 3 from the table. Also, it returns the value of _id_ for the deleted row.

```sql
DELETE FROM taxi_trips
WHERE id = 3
RETURNING id;
```

The following statement removes all rows from the table.

```sql
DELETE FROM taxi_trips
```

Let's see the result.

```sql
SELECT * FROM taxi_trips;
```

```
 id | distance | city
----+----------+------
(0 rows)
```
