---
id: sql-create-sink-into
title: CREATE SINK INTO
description: Create a sink into RisingWave's table..
slug: /sql-create-sink-into
---
<head>
  <link rel="canonical" href="https://docs.risingwave.com/docs/current/sql-create-sink/" />
</head>

Use the `CREATE SINK INTO` command to create a sink into RisingWave's table.

## Syntax

```sql
CREATE SINK [ IF NOT EXISTS ] sink_name INTO table_name
[FROM sink_from | AS select_query]
```

import rr from '@theme/RailroadDiagram'

export const svg = rr.Diagram(
rr.Stack(
   rr.Sequence(
      rr.Terminal('CREATE SINK'),
      rr.Optional(rr.Terminal('IF NOT EXISTS')),
      rr.NonTerminal('sink_name', 'skip'),
      rr.Terminal('INTO'),
      rr.NonTerminal('table_name'),
      rr.ZeroOrMore(
      rr.Sequence(
         rr.Terminal('FROM'),
         rr.NonTerminal('sink_from', 'skip')
      ),
      rr.Sequence(
         rr.Terminal('AS'),
         rr.NonTerminal('select_query', 'skip')
      ),
   ),
   ),
   rr.Terminal(';'),
)
);

<drawer SVG={svg} />

:::note

A table without primary key can only accept append-only sink.

:::

:::note

Currently, If there are sinks into the table, the table can not be altered to add or drop column.

:::


## Examples

We can union data from two different Kafka topics 
```sql
CREATE TABLE orders (
    id int primary key,
    price int,
    item_id int,
    customer_id int
);

CREATE source orders_s0 (
    id int primary key,
    price int,
    item_id int,
    customer_id int
) WITH ( 
    connector = 'kafka',
    topic = 'topic_0',
    ...
) FORMAT PLAIN ENCODE JSON;

CREATE source orders_s1 (
    id int primary key,
    price int,
    item_id int,
    customer_id int
) WITH ( 
    connector = 'kafka',
    topic = 'topic_1',
    ...
) FORMAT PLAIN ENCODE JSON;

CREATE SINK orders_sink0 FROM orders_s0 INTO orders;
CREATE SINK orders_sink1 FROM orders_s1 INTO orders;
```

## See also

[`CREATE SINK`](sql-create-sink.md) Create sink into an external target

[`DROP SINK`](sql-drop-sink.md) — Remove a sink.

[`SHOW CREATE SINK`](sql-show-create-sink.md) — Show the SQL statement used to create a sink.


