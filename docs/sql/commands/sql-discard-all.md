---
id: sql-discard-all
title: DISCARD ALL
description: Discard session state.
slug: /sql-discard-all
---
<head>
  <link rel="canonical" href="https://docs.risingwave.com/docs/current/sql-discard-all/" />
</head>

Use the `DISCARD ALL` command to discard session state.

This will release all temporary resources tied to the current session and restores the session to its initial state.

## Syntax

```sql
DISCARD ALL;
```


