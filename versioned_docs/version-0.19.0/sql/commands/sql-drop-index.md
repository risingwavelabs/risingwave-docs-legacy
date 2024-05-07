---
id: sql-drop-index
title: DROP INDEX
description: Remove an index.
slug: /sql-drop-index
---
<head>
  <link rel="canonical" href="https://docs.risingwave.com/docs/current/sql-drop-index/" />
</head>

Use the `DROP INDEX` command to remove an index from a table or a materialized view.

## Syntax

```sql
DROP INDEX [ IF EXISTS ] [ schema_name.]index_name;
```


import rr from '@theme/RailroadDiagram'

export const svg = rr.Diagram(
    rr.Sequence(
        rr.Terminal('DROP INDEX'),
        rr.Optional(
            rr.Terminal('IF EXISTS')
        ),
        rr.Optional(
            rr.Sequence(
                rr.NonTerminal('schema_name'),
                rr.Terminal('.')
            ),
        ),
        rr.NonTerminal('index_name'),
        rr.Terminal(';'),
    )
);

<drawer SVG={svg} />



## Parameters

|Parameter                  | Description           |
|---------------------------|-----------------------|
|**IF EXISTS** clause       |Do not return an error if the specified index does not exist.|
|*schema_name*                   |The schema of the index that you want to remove. <br /> You can use [`SHOW SCHEMAS`](sql-show-schemas.md) to get a list of all available schemas. If you don't specify a schema, the specified index in the default schema `public` will be removed.|
|*index_name*                    |The name of the index to remove. <br/> You can use [`DESCRIBE`](sql-describe.md) to show the indexes of a table.|



## Examples

This statement removes the `id_index` index from the `taxi_trips` table in the default schema (`public`):

```sql
DROP INDEX id_index;
```

This statement removes the `ad_id_index` index from the `ad_ctr_5min` materialized view in the `rw_schema` schema:

```sql
DROP INDEX rw_schema.id_index;
```

## See also

[`CREATE INDEX`](sql-create-index.md) — Construct an index on a table or a materialized view to speed up queries.