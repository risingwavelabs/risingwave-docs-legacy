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
SHOW SOURCES [ FROM schema_name ];
```
## Parameters
|Parameter or clause        | Description           |
|---------------------------|-----------------------|
|*schema_name*                   |The schema of the sources to be listed. The default schema is "public".|


## Example

```sql
SHOW SOURCES;
```