---
id: sql-show-sources
title: SHOW SOURCES
description: Show existing sources.
slug: /sql-show-sources
---
<head>
  <link rel="canonical" href="https://docs.risingwave.com/docs/current/sql-show-sources/" />
</head>

Use the `SHOW SOURCES` command to show existing sources. 

## Syntax

```sql
SHOW SOURCES [ FROM schema_name ] [ LIKE_expression ];
```

## Parameters
|Parameter or clause        | Description           |
|---------------------------|-----------------------|
|*schema_name*                   |The schema of the sources to be listed. The default schema is `public`.|
|LIKE_expression| Filters the output based on names by applying pattern matching. See details in [LIKE pattern matching expressions](/sql/functions-operators/sql-function-string.md#like-pattern-matching-expressions).|

## Examples

```sql
SHOW SOURCES;

----RESULT
 Name 
------
nics_metrics
tcp_metrics
twitter_events
(3 rows)
```