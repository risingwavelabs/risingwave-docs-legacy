---
id: sql-show-create-sink
title: SHOW CREATE SINK
description: Show the query used to create the specified sink.
slug: /sql-show-create-sink
---
<head>
  <link rel="canonical" href="https://docs.risingwave.com/docs/current/sql-show-create-sink/" />
</head>

Use the `SHOW CREATE SINK` command to see the SQL statement used to create the specified sink. By
using this command, you can verify the sink's settings and troubleshoot any issues.

## Syntax

```sql
SHOW CREATE SINK sink_name;
```



## Parameters

|Parameter    | Description|
|---------------|------------|
|*sink_name* |The sink for which you want to show the corresponding SQL statement.|


## See also

[CREATE SINK](sql-create-sink.md) — Create a sink.