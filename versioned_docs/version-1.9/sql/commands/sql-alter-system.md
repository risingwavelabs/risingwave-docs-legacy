---
id: sql-alter-system
title: ALTER SYSTEM
description: Modify a server configuration parameter.
slug: /sql-alter-system
---
<head>
  <link rel="canonical" href="https://docs.risingwave.com/docs/current/sql-alter-system/" />
</head>

The `ALTER SYSTEM` command modifies the value of a server configuration parameter. You can use this command to configure some parameters, like the [system parameters](/manage/view-configure-system-parameters.md#how-to-configure-system-parameters) and [runtime parameters](/manage/view-configure-runtime-parameters.md#how-to-configure-runtime-parameters). 

```sql title="Syntax"
ALTER SYSTEM SET configuration_parameter { TO | = } { value [, ...] | DEFAULT }
```


```sql title="Examples"
ALTER SYSTEM SET rw_streaming_enable_delta_join TO true;
```

