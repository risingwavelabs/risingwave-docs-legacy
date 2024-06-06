---
id: view-adjust-system-parameters
title: View and adjust system parameters
description: View the system parameters and adjust their values if needed.
slug: /view-adjust-system-parameters
---

## What are system parameters?

System parameters in RisingWave refer to the parameters that advanced users can use to adjust how internal components work in RisingWave.

Currently, these system parameters are availble in RisingWave.

| Parameter           |    Description    |
|---|---|
|`barrier_interval_ms`     | The time interval of the periodic barriers.|
|`checkpoint_frequency`      | Specify the number of barriers for which a checkpoint will be created. The value must be a positive integer.|
|`sstable_size_mb`          | The target size of SSTable.|
|`block_size_kb`          | The size of each block in bytes in SSTable.|
|`bloom_false_positive`     | False positive rate of bloom filter in SSTable.|
|`state_store`             | The state store URL. |
|`data_directory`           | The remote directory for storing data and metadata objects.|
|`backup_storage_url`       | The URL of the remote storage for backups.|
|`backup_storage_directory` | The directory of the remote storage for backups.|
|`telemetry_enabled` | Whether to enable telemetry or not. For more information, see [Telemetry](/telemetry.md).|

## How to view system parameters?

You can use the `SHOW PARAMETERS` statement to view the system parameters and their settings.

```sql
SHOW PARAMETERS;

--------------------------
           Name           |    Value    
--------------------------+-------------
 barrier_interval_ms      | 1000
 checkpoint_frequency      | 10
 sstable_size_mb          | 256
 block_size_kb            | 64
 bloom_false_positive     | 0.001
 state_store              | 
 data_directory           | hummock_001
 backup_storage_url       | memory
 backup_storage_directory | backup
 telemetry_enabled        | true
```

## How to adjust system parameters?

You can use the `ALTER SYSTEM SET` statement to revise the setting of a system parameter. Note that currently only `checkpoint_frequency` and `telemetry_enabled` can be set.

:::note

As RisingWave reads system parameters at different times, there is no guarantee that a parameter value change takes effect immediately. We recommend that you adjust system parameters before running a streaming query after your RisingWave cluster starts.

:::

The full syntax of the `ALTER SYSTEM SET` statement is:

```sql
ALTER SYSTEM SET parameter_name { TO | = } { value | 'value' | DEFAULT };
```
