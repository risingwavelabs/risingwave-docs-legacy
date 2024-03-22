---
id: sql-show-parameters
title: SHOW PARAMETERS
description: Show the details of your RisingWave cluster.
slug: /sql-show-parameters
---
<head>
  <link rel="canonical" href="https://docs.risingwave.com/docs/current/sql-show-parameters/" />
</head>

You can use the `SHOW PARAMETERS` command to view the system parameters, along with their current values.

```sql title="Examples"
SHOW PARAMETERS;

----RESULT

 Name                         |     Value      | Mutable 
----------------------------------------+----------------+---------
 barrier_interval_ms                    | 1000           | t
 checkpoint_frequency                   | 1              | t
 sstable_size_mb                        | 256            | f
 parallel_compact_size_mb               | 512            | f
 block_size_kb                          | 64             | f
 bloom_false_positive                   | 0.001          | f
 state_store                            | hummock+memory | f
 data_directory                         | hummock_001    | f
 backup_storage_url                     | memory         | t
 backup_storage_directory               | hummock_001/backup | t
 max_concurrent_creating_streaming_jobs | 1              | t
 pause_on_next_bootstrap                | false          | t
 enable_tracing                         | false          | t
```