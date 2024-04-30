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

Sometimes in testing, you may hope to test the recovery path beside the normal path. For example, when creating a streaming job:

+ The normal path uses a mutation barrier to update the streaming actors and their topology.
+ The recovery path updates the persisted metadata, which would be used to construct the graph upon any recovery.

With the `RECOVER` command to trigger recovery manually, you may cover such cases better.