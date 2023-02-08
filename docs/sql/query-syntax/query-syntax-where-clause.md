---
id: query-syntax-where-clause
slug: /query-syntax-where-clause
title: WHERE clause
---

The `WHERE` clause specifies any conditions or filters to apply to your data. This allows you to select only a specific subset of the data. The `WHERE` clause is used right after the `FROM` clause.

Here is the basic syntax of a SELECT statement with the optional `WHERE` clause:

```sql
SELECT column1, column2, columnN
FROM table_name
WHERE condition
```

Here, `condition` is any expression that evaluates to a result of type boolean. Any row that does not satisfy this condition will be removed from the output. A row satisfies the condition if it returns true when the actual row values are substituted for any variable references.

Basic `WHERE` clause examples:

```sql
-- select all rows that have id equal to 5
SELECT *
FROM table_name
WHERE id=5;
-- select all rows that match the given composite expression
SELECT *
FROM table_name
WHERE id=2 OR id=3;
```

Syntax diagram:

import rr from '@theme/RailroadDiagram'


export const svg = rr.Diagram(
rr.Stack(
   rr.Sequence(
      rr.Terminal('WHERE'),
      rr.NonTerminal('expression')
   ),      
)
);

<drawer SVG={svg} />