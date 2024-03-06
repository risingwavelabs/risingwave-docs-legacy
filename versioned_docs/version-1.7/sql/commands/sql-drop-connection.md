---
id: sql-drop-connection
title: DROP CONNECTION
description: Remove a connection.
slug: /sql-drop-connection
---
<head>
  <link rel="canonical" href="https://docs.risingwave.com/docs/current/sql-drop-connection/" />
</head>

Use the `DROP CONNECTION` command to remove a connection.

Before you can drop a connection, you must remove all its dependent sources and sinks.

## Syntax

```sql
DROP CONNECTION [ IF EXISTS ] connection_name;
```

## Parameters

|Parameter or clause            | Description           |
|-------------------------------|-----------------------|
|*connection_name*              |The name of the connection to be removed.|

## Examples

This statement removes the connection `c1`.

```sql
DROP CONNECTION c1;
```

## See also

[`CREATE CONNECTION`](sql-create-connection.md) - Create a connection.
