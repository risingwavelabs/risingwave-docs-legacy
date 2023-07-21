---
id: sql-function-sys-admin
slug: /sql-function-sys-admin
title: System administration functions
---

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

|Settings| Description|
|--|--|
|`server_version`|PostgreSQL server version. |
|`server_version_num`| PostgreSQL server version, in the numeric format. Version `8.3.0` will be displayed as `80300` in the numeric format.|
|`timezone`|Timezone for the current instance. |
|`query_mode`| Query mode of RisingWave. Enum values: `auto`, `batch`, `streaming`. The default value is `auto`.|
|`streaming_parallelism`| The number of actors assigned to each streaming job. If it is set to non-zero, all streaming jobs in the current session will use it as the parallelism setting. |
|`batch_parallelism`| The number of actors assigned to each streaming job. If it is set to non-zero, all streaming jobs in the current session will use it as the parallelism setting.|
