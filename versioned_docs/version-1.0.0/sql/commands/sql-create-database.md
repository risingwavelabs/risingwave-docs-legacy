---
id: sql-create-database
title: CREATE DATABASE
description: Create a new database.
slug: /sql-create-database
---
<head>
  <link rel="canonical" href="https://docs.risingwave.com/docs/current/sql-create-database/" />
</head>

Use the `CREATE DATABASE` command to create a new database.

## Syntax

```sql
CREATE DATABASE [ IF NOT EXISTS ] database_name;
```


import rr from '@theme/RailroadDiagram'

export const svg = rr.Diagram(
rr.Stack(
   rr.Sequence(
      rr.Terminal("CREATE DATABASE"),
      rr.Optional(rr.Terminal("IF NOT EXISTS")),
      rr.NonTerminal("database_name", "skip"),
      rr.Terminal(";")
   )
)
);

<drawer SVG={svg} />


## Parameters
|Parameter or clause            | Description           |
|-------------------------------|-----------------------|
|*database_name*                |The name of the database to be created.|
|<b>IF NOT EXISTS</b> clause    |Creates a database if the database name has not already been used. Otherwise throws an error.|

## Example
```sql
CREATE DATABASE IF NOT EXISTS travel;
```

:::note

Names and unquoted identifiers are case-insensitive. Therefore, you must double-quote any of these fields for them to be case-sensitive.

:::