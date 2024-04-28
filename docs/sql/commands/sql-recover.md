---
id: sql-recover
title: RECOVER
description: Trigger recovery manually.
slug: /sql-recover
---
<head>
  <link rel="canonical" href="https://docs.risingwave.com/docs/current/sql-recover/" />
</head>

Use the `RECOVER` command to trigger an ad-hoc recovery manually. This is helpful when there is a high barrier latency and you need to force a recovery to activate. By doing this, commands like `CANCEL` or `DROP` can take effect immediately.


```sql title="Syntax"
RECOVER;
```

```sql title="Syntax"
RECOVER;
----RESULT
RECOVER
```