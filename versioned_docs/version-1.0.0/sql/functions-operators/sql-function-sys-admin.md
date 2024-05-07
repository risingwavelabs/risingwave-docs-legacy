---
id: sql-function-sys-admin
slug: /sql-function-sys-admin
title: System administration functions
---
<head>
  <link rel="canonical" href="https://docs.risingwave.com/docs/current/sql-function-sys-admin/" />
</head>

## current_setting()

Returns the current value of a specified system administration setting. This function corresponds to the SQL command `SHOW`.

```sql title=Syntax
current_setting ( setting_name string ) → string
```

```sql title=Example
SELECT current_setting ('server_version');
---------RESULT
 current_setting 
-----------------
 8.3.0
(1 row)
```

### Supported system administration settings

We are adding more settings to the list. Currently, the following settings are supported:

- `server_version`
- `server_version_num`
- `timezone`
- `query_mode`
- `streaming_parallelism`
- `batch_parallelism`
