---
id: sql-show-materizalized-views
title: SHOW MATERIALIZED VIEWS
description: Show existing materialized views.
slug: /sql-show-mv
---

<head>
  <link rel="canonical" href="https://docs.risingwave.com/docs/current/sql-show-mv/" />
</head>

Use the `SHOW MATERIALZED VIEWS` command to show existing materialized views.

## Syntax

```sql
SHOW MATERIALIZED VIEWS [FROM schema_name];
```

import rr from '@theme/RailroadDiagram'

export const svg = rr.Diagram(
rr.Stack(
rr.Sequence(
rr.Terminal('SHOW MATERIALIZED VIEWS'),
rr.Optional(
rr.Sequence(
rr.Terminal('FROM'),
rr.NonTerminal('schema_name', 'skip'),
),
),
),
rr.Terminal(';'),
),
);

<Drawer SVG={svg} />

## Parameters

| Parameter     | Description                                                                                                                                   |
| ------------- | --------------------------------------------------------------------------------------------------------------------------------------------- |
| _schema_name_ | The schema in which the materialized views will be listed. If not given, materialized views from the default schema, "public", will be listed |

## Example

```sql
SHOW MATERIALIZED VIEWS FROM schema_1;
```
