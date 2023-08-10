---
id: sql-drop-sink
title: DROP SINK
description: Remove a sink.
slug: /sql-drop-sink
---

Use the `DROP SINK` command to remove a [sink](sql-create-sink.md) if you no longer need to deliver data to the sink.

## Syntax

```sql
DROP SINK [ IF EXISTS ] [schema_name.]sink_name [ CASCADE ];
```

import rr from '@theme/RailroadDiagram'

export const svg = rr.Diagram(
    rr.Sequence(
        rr.Terminal('DROP SINK'),
        rr.Optional(
            rr.Terminal('IF EXISTS')
        ),
        rr.Optional(
            rr.Sequence(
                rr.NonTerminal('schema_name'),
                rr.Terminal('.')
            ),
        ),
        rr.NonTerminal('sink_name'),
        rr.Optional(
            rr.Terminal('CASCADE'), 'skip'
        ),
        rr.Terminal(';'),
    )
);

<drawer SVG={svg} />

## Parameters

|Parameter                  | Description           |
|---------------------------|-----------------------|
|*schema_name*                   |The schema of the sink that you want to remove. You can use [`SHOW SCHEMAS`](sql-show-schemas.md) to get a list of all available schemas. If you don't specify a schema, the specified sink in the default schema `public` will be removed.|
|*sink_name*                   |The name of the sink to remove.|
|`CASCADE` option| If this option is specified, all objects (such as materialized views) that depend on the sink, and in turn all objects that depend on those objects will be dropped.|

## Examples

This statement removes the sink `rw_sink` in the default schema `public` from the database:

```sql
DROP SINK rw_sink;
```

This statement removes the sink `rw_sink` in the schema `rw_schema` from the database:

```sql
DROP SINK IF EXISTS rw_schema.rw_sink;
```

## See also

[`CREATE SINK`](sql-create-sink.md) — Create a sink.
