---
id: sql-discard
title: DISCARD
description: Discard session state.
slug: /sql-discard
---
<head>
  <link rel="canonical" href="https://docs.risingwave.com/docs/current/sql-discard/" />
</head>

Use the `DISCARD` command to reset the state of current session.

## Syntax

```sql
DISCARD ALL;
```

## Parameter

|Parameter             | Description           |
|-------------------------------|-----------------------|
|All             |Since RisingWave doesn't support temporary object, this command will essentially do nothing.|
