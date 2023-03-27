---
id: sql-set-time-zone
title: SET TIME ZONE
description: Set time zone.
slug: /sql-set-time-zone
---

Use the `SET TIME ZONE` command to specify the time zone that should be used to interpret date and time values.

## Syntax

```sql
SET TIME ZONE {time_zone | LOCAL | DEFAULT}
```


## Parameters

| Parameter                 | Description           |
| ------------------------- | --------------------- |
| *time_zone*             | Specifies the time zone using a valid time zone name, such as "America/New_York" or "Asia/Shanghai". |
| **LOCAL** | Sets the time zone to the system's local time zone. |
| **DEFAULT** | Sets the time zone to the server's default time zone. |



## Examples

```sql
SET TIME ZONE "America/New_York";
```

```sql
SET TIME ZONE LOCAL;
```

```sql
SET TIME ZONE DEFAULT;
```
