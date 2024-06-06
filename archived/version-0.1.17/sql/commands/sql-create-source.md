---
id: sql-create-source
title: CREATE SOURCE
description: Supported data sources and how to connect RisingWave to the sources.
slug: /sql-create-source
---

<head>
  <link rel="canonical" href="https://docs.risingwave.com/docs/current/sql-create-source/" />
</head>

A source is a resource that RisingWave can read data from. You can create a source in RisingWave using the `CREATE SOURCE` command.
If you choose to persist the data from the source in RisingWave, use the `CREATE TABLE` command with connector settings. See [CREATE TABLE](sql-create-table.md) for more details.

Regardless of whether the data is persisted in RisingWave, you can create materialized views to perform analysis or sinks for data transformations.

## Syntax

```sql
CREATE SOURCE [ IF NOT EXISTS ] source_name
[schema_definition]
WITH (
   connector='connector_name',
   connector_parameter='value', ...
)
ROW FORMAT data_format
[ MESSAGE 'message' ]
[ ROW SCHEMA LOCATION [ 'location' | CONFLUENT SCHEMA REGISTRY 'schema_registry_url' ] ];
```

import rr from '@theme/RailroadDiagram'

export const svg = rr.Diagram(
rr.Stack(
rr.Sequence(
rr.Terminal('CREATE SOURCE'),
rr.Optional(rr.Terminal('IF NOT EXISTS')),
rr.NonTerminal('source_name', 'skip'),  
 ),
rr.Optional(rr.NonTerminal('schema_definition', 'skip')),
rr.Sequence(
rr.Terminal('WITH'),
rr.Terminal('('),
rr.Stack(
rr.Stack(
rr.Sequence(
rr.Terminal('connector'),
rr.Terminal('='),
rr.NonTerminal('connector_name', 'skip'),
rr.Terminal(','),
),
rr.OneOrMore(
rr.Sequence(
rr.NonTerminal('connector_parameter', 'skip'),
rr.Terminal('='),
rr.NonTerminal('value', 'skip'),
rr.Terminal(','),
),
),
),
rr.Terminal(')'),
),
),
rr.Stack(
rr.Sequence(
rr.Terminal('ROW FORMAT'),
rr.NonTerminal('data_format', 'skip'),
),
rr.Optional(
rr.Sequence(
rr.Terminal('MESSAGE'),
rr.NonTerminal('message', 'skip'),
),
),
rr.Optional(
rr.Sequence(
rr.Terminal('ROW SCHEMA LOCATION'),
rr.Choice(1,
rr.Terminal('location'),
rr.Sequence(
rr.Terminal('CONFLUENT SCHEMA REGISTRY'),
rr.NonTerminal('schema_registry_url', 'skip'),
),
),
),
),
rr.Terminal(';'),
),
)
);

<Drawer SVG={svg} />

:::note

Names and unquoted identifiers are case-insensitive. Therefore, you must double-quote any of these fields for them to be case-sensitive.

:::

## Supported sources and formats

For supported sources and formats, see [Data ingestion overview](data-ingestion.md).
