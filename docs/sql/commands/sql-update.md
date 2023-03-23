---
id: sql-update
title: UPDATE
description: Modify existing rows in a table.
slug: /sql-update
---

Use the `UPDATE` command to modify values of existing rows in a table.

:::info
UPDATE cannot modify data in the primary key column of a table.
:::

## Syntax

```sql
UPDATE table_name
    SET { col_name = value, ... | ( col_name, ... ) = ( value, ... ) }
    [ WHERE condition ]
    [ RETURNING col_name ];
```


import rr from '@theme/RailroadDiagram'

export const svg = rr.Diagram(
  rr.Stack(
    rr.Sequence(
      rr.Terminal("UPDATE"),
      rr.NonTerminal("table_name")
    ),
    rr.Sequence(
      rr.Terminal("SET"),
      rr.Choice(
        rr.OneOrMore(
          rr.Sequence(
            rr.NonTerminal("col_name"),
            rr.Terminal("="),
            rr.NonTerminal("value")
          ),
          ","
        ),
        rr.Sequence(
          rr.Terminal("("),
          rr.OneOrMore(
            rr.NonTerminal("col_name"),
            ","
          ),
          rr.Terminal(")"),
          rr.Terminal("="),
          rr.Terminal("("),
          rr.OneOrMore(
            rr.NonTerminal("value"),
            ","
          ),
          rr.Terminal(")")
        ),
        ","
      )
    ),
    rr.Optional(
      rr.Sequence(
        rr.Terminal("WHERE"),
        rr.NonTerminal("condition")
      ),
    ),
    rr.Sequence(
      rr.Optional(
      rr.Sequence(
        rr.Terminal("RETURNING"),
        rr.NonTerminal("col_name")
      )
    ),
    rr.Terminal(";")
    )
  )
);

<drawer SVG={svg} />



## Parameters

|Parameter or clause        | Description           |
|---------------------------|-----------------------|
|*table_name*               |The table whose rows you want to update.|
|**SET** *col_name* = *value*  |Assign a value or result of an expression to a specific column.<br/>*col_name* cannot be a primary key.|
|**WHERE** *condition*      |Specify which rows you want to update using an expression that returns a boolean value. Rows for which this expression returns true will be updated. <br/> If you omit the WHERE clause, all rows in the table will be updated.|
|**RETURNING**               |Returns the values of any column based on each updated row.|


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

The following statement updates the city name from 'Yerba Buena' to 'San Francisco'. Also, it returns the value of *id* for the updated rows.

```sql
UPDATE taxi_trips 
SET city = 'San Francisco' 
WHERE city = 'Yerba Buena'
RETURNING id;
```

The following statement converts the distance unit from kilometer to mile.

```sql
UPDATE taxi_trips 
SET distance = distance * 0.6214;
```

Let's see the result.

```sql
SELECT * FROM taxi_trips ORDER BY id;
```
```
 id |      distance      |     city      
----+--------------------+---------------
  1 |             9.9424 | San Francisco
  2 |            14.2922 | New York
  3 | 3.7283999999999997 | Chicago
(3 rows)
```