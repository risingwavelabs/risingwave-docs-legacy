---
id: view-adjust-system-parameters
title: View and adjust system parameters
description: View the system parameters and revise the settings if needed.
slug: /view-adjust-system-parameters
---

## What are system parameters?

System parameters in RisingWave refer to the parameters that advanced users can use to adjust how internal components work in RisingWave.

Currently, these system parameters are availble in RisingWave. Note that only `barrier_interval_ms` and `checkpoint_interval` can be set.

| Parameter           |    Description    |
|---|---|
|barrier_interval_ms      | The time interval of the periodic barriers. The value must be a positive integer.|
|checkpoint_interval      | Specify the number of barriers for which a checkpoint will be created. The value must be a positive integer.|
|sstable_size_mb          | There will be a checkpoint for every n barrier.|
|block_size_kb            | The size of each block in bytes in SSTable.|
|bloom_false_positive     | False positive rate of bloom filter in SSTable.|
|state_store              | The state store URL. |
|data_directory           | The remote directory for storing data and metadata objects.|
|backup_storage_url       | The URL of the remote storage for backups.|
|backup_storage_directory | The directory of the remote storage for backups.|

## How to view system parameters?

You can use the `SHOW PARAMETERS` statement to view the system parameters and their settings.

```sql
SHOW PARAMETERS;

--------------------------
           Name           |    Value    
--------------------------+-------------
 barrier_interval_ms      | 1000
 checkpoint_interval      | 10
 sstable_size_mb          | 256
 block_size_kb            | 64
 bloom_false_positive     | 0.001
 state_store              | 
 data_directory           | hummock_001
 backup_storage_url       | memory
 backup_storage_directory | backup
```

## How to adjust system parameters?

You can use the `ALTER SYSTEM SET` statement to revise the setting of a system parameter. Note that only `barrier_interval_ms` and `checkpoint_interval` can be set.

The full syntax of the `ALTER SYSTEM SET` statement is:

```sql
ALTER SYSTEM SET parameter_name { TO | = } { value | 'value' | DEFAULT };
```