---
id: sql-create-sink
title: CREATE SINK
description: Create a sink.
slug: /sql-create-sink
---

<head>
  <link rel="canonical" href="https://docs.risingwave.com/docs/current/sql-create-sink/" />
</head>

Use the `CREATE SINK` command to create a sink. A sink is an external target where you can send data processed in RisingWave. You can create a sink from a table or source, or a materialized view.

If your goal is to create an append-only sink, you can use the emit-on-window-close policy when creating the materialized view that you want to sink data from. For details about the policy, see [Emit on window close](/transform/emit-on-window-close.md).

## Syntax

```sql
CREATE SINK [ IF NOT EXISTS ] sink_name
[FROM sink_from | AS select_query]
WITH (
   connector='connector_name',
   connector_parameter = 'value', ...
);
```

import rr from '@theme/RailroadDiagram'

export const svg = rr.Diagram(
rr.Stack(
rr.Sequence(
rr.Terminal('CREATE SINK'),
rr.Optional(rr.Terminal('IF NOT EXISTS')),
rr.NonTerminal('sink_name', 'skip'),
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
rr.Sequence(
rr.Terminal('WITH'),
rr.Terminal('('),
rr.Stack(
rr.Stack(
rr.Sequence(
rr.Terminal('connector'),
rr.Terminal('='),
rr.Terminal('\'connector_name\''),
rr.Terminal(','),
),
rr.Sequence(
rr.Terminal('connector_parameter'),
rr.Terminal('='),
rr.Terminal('\'value\''),
rr.Terminal(','),
),
),
),
rr.Terminal(')'),
),
rr.Terminal(';'),
)
);

<Drawer SVG={svg} />

## Supported sinks

Click a sink name to see the SQL syntax, options, and sample statement of sinking data from RisingWave to the sink.

- [Kafka](/guides/create-sink-kafka.md) (Supports versions 3.1.0 or later)
- [MySQL](/guides/sink-to-mysql.md) (Supports versions 5.7 and 8.0.x)
- [PostgreSQL](/guides/sink-to-postgres.md)
- [AWS Kinesis](/guides/sink-to-aws-kinesis.md)
- [TiDB](/guides/sink-to-tidb.md)
- [Apache Iceberg](/guides/sink-to-iceberg.md)
- [Delta Lake](/guides/sink-to-delta-lake.md)

## See also

[`DROP SINK`](sql-drop-sink.md) — Remove a sink.

[`SHOW CREATE SINK`](sql-show-create-sink.md) — Show the SQL statement used to create a sink.

:::note

Timestamptz values are stored in UTC.

When sinking downstream, timestamptz is represented as a string in the format `2023-11-11 18:30:09.453000`.

:::
