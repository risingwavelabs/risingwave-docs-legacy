---
id: rw_catalog
slug: /rw_catalog
title: RisingWave catalogs
---
<head>
  <link rel="canonical" href="https://docs.risingwave.com/docs/current/rw_catalog/" />
</head>

RisingWave catalogs contain system tables and views that provide metadata about different relations in the system, as well as information about the cluster jobs and their status. The metadata includes details about each database, schema, and relation in the system, such as materialized views, tables, sources, sinks, indexes, and views. The status information includes the progress of DDL commands, system snapshots, and more.

## How to display RisingWave catalogs

After you connect to RisingWave vis `psql`, enter `\d` to display RisingWave catalogs.

The result looks like this:

```sql
\d
------RESULTS
                        List of relations
   Schema   |                Name                 | Type  | Owner 
------------+-------------------------------------+-------+-------
 rw_catalog | rw_actors                           | table | root
 rw_catalog | rw_columns                          | table | root
 rw_catalog | rw_connections                      | table | root
...
```

You can view the schemas of these catalogs:

```sql
DESCRIBE rw_catalog.rw_ddl_progress;
------RESULTS
Name      |  Type   
---------------+---------
 ddl_id        | bigint
 ddl_statement | varchar
 progress      | varchar
(3 rows)
```

```sql
DESCRIBE rw_catalog.rw_meta_snapshot;
------RESULTS
          Name          |            Type
------------------------+-----------------------------
 meta_snapshot_id       | bigint
 hummock_version_id     | bigint
 safe_epoch             | bigint
 safe_epoch_ts          | timestamp without time zone
 max_committed_epoch    | bigint
 max_committed_epoch_ts | timestamp without time zone
(6 rows)
```

You can also retrieve the values of the catalogs. Please note that the schema (`rw_catalog`) is optional.

```sql
SELECT name, owner, definition FROM rw_tables;
------RESULTS
 name | owner |            definition            
------+-------+----------------------------------
 t1   |     1 | CREATE TABLE t1 (v1 INT, v2 INT)
(1 row)
```

You can use two time-related fields, `created_at` and `initiated_at`, to retrieve the times when an object is created and initialized. This can be useful when you want learn about when a source or materialized view is created or initialized.

```sql
SELECT name, initialized_at, created_at FROM rw_sources;
------RESULT
 name |        initialized_at         |          created_at
------+-------------------------------+-------------------------------
 s    | 2023-07-25 10:53:30.128+00:00 | 2023-07-25 10:53:30.130+00:00
(1 row)
```

## Available RisingWave catalogs

|Relation Name | Description|
|---|---|
 rw_actors             | Contains the available actor IDs, their statuses, and the corresponding fragment IDs, and parallel unit IDs. |
rw_actor_id_to_ddl | Contains information about the participants who executed the database schema change operations (DDL) and their corresponding `actor_id` identifiers. The outputs include actor IDs, fragment IDs, job IDs, schema IDs,  DDL types, and names of the affected object.|
  rw_columns            | Contains information about columns of all relations (except sources) in the database, including their names, positions, data types, generation details, and more.|
 rw_connections        | Contains details about the connections available in the database, such as their IDs, names, owners, types, and more.|
 rw_databases          | Contains information about the databases available in the database, such as the IDs, names, and owners.|
 rw_depend             | Contains the dependency relationships between tables, indexes, views, materialized views, sources, and sinks.|
 rw_ddl_progress       | Contains the progress of running DDL statements. You can use this relation to view the progress of running DDL statements. For details, see [View statement progress](/manage/view-statement-progress.md).|
 rw_description        | Contains optional descriptions (comments) for each database object. Descriptions can be added with the [`COMMENT ON`](/sql/commands/sql-comment-on.md) command and viewed with `DESCRIBE` or `SHOW COLUMNS FROM` command.|
 rw_event_logs         | Contains information about events, including event IDs, timestamps, event types, and additional information if available. |
 rw_fragment_id_to_ddl| Contains information about the database schema change operations (DDL) and their corresponding `fragment_id` identifiers. The outputs include fragment IDs, job IDs, schema IDs,  DDL types, and names of the affected object.|
 rw_fragment_parallelism          | Contains information about the parallelism configuration at the fragment level, including fragment IDs, parallelism, and more. |
 rw_fragments          | Contains low-level information about fragments in the database, including fragment IDs, table IDs, and more. |
 rw_functions          | Contains information about functions in the database, including their IDs, names, schema identifiers, types, argument and return data types, programming language, and more. |
 rw_hummock_branched_objects         | Contains information about branched objects of Hummock (the storage engine in RisingWave), including object IDs, corresponding SST IDs, and compaction group IDs. |
 rw_hummock_checkpoint_version       | Contains information about the checkpoint version of data in Hummock (the storage engine in RisingWave), including version ID, maximum committed epoch, safe epoch, and compaction group details.|
 rw_hummock_compact_task_progress    | Contains information about compaction task status, including compaction group IDs, task IDs, SST-related information, numbers of pending read and write IOs, and more.|
 rw_hummock_compaction_group_configs | Contains information about the configuration settings for the Hummock compaction groups in the database, including compaction group IDs, parent compaction group IDs, member tables, compaction settings, and active write limits. |
 rw_hummock_current_version          | Contains information about the current version of data in Hummock (the storage engine in RisingWave), including version ID, maximum committed epoch, safe epoch, and compaction group details. |
 rw_hummock_meta_configs             | Contains metadata configurations and their values for Hummock (the storage engine in RisingWave). |
 rw_hummock_pinned_snapshots         | Contains information about the pinned snapshots in Hummock (the storage engine in RisingWave), including the worker node ID and the minimum pinned snapshot ID. |
 rw_hummock_pinned_versions          | Contains information about the pinned versions in Hummock (the storage engine in RisingWave), including the worker node ID and the minimum pinned snapshot ID.  |
 rw_hummock_sstables                 | Contains information about the SSTables (Sorted String Tables) used in Hummock (the storage engine in RisingWave). |
 rw_hummock_version_deltas           | Contains information about version deltas in Hummock (the storage engine in RisingWave). A version delta represents the modifications or differences in data between consecutive epochs.|
 |rw_iceberg_files| Contains the current files of the Iceberg source or table.|
 |rw_iceberg_snapshots| Contains all Iceberg snapshots in RisingWave. Based on it, you can read a specific snapshot by a time travel query.|
 rw_indexes            | Contains information about indexes in the database, including their IDs, names, schema identifiers, definitions, and more.|
 rw_internal_tables    | Contains information about internal tables in the database. Internal tables are tables that store intermediate results (also known as internal states) of queries. Equivalent to the [`SHOW INTERNAL TABLES`](/sql/commands/sql-show-internal-tables.md) command.|
 rw_materialized_views | Contains information about materialized views in the database, including their unique IDs, names, schema IDs, owner IDs, definitions, append-only information, access control lists, initialization and creation timestamps, and the cluster version when the materialized view was initialized and created.|
 rw_meta_snapshot      | Contains information about existing snapshots of the RisingWave meta service. You can use this relation to get IDs of meta snapshots and then restore the meta service from a snapshot. For details, see [Back up and restore meta service](/manage/meta-backup.md).|
 rw_parallel_units     | Contains information about parallel worker units used for executing database operations, including their unique IDs, worker IDs, and primary keys.|
 rw_relation_info      | Contains low-level relation information about tables, sources, materialized views, and indexes that are available in the database.|
 rw_relations          | Contains information about relations in the database, including their unique IDs, names, types, schema IDs, and owners.|
 rw_schemas            | Contains information about schemas that are available in the database, including their names, unique IDs, owner IDs, and more. |
 rw_secrets            | Contains information about the ID, name, owner, and access control of secret objects. For more details about secrets, see [Manage secrets](/deploy/manage-secrets.md).|
 rw_sinks              | Contains information about sinks that are available in the database, including their unique IDs, names, schema IDs, owner IDs, connector types, sink types, connection IDs, definitions, and more.|
 rw_sources            | Contains information about sources that are available in the database, including their unique IDs, names, schema IDs, owner IDs, connector types, column definitions, row formats, append-only flags, connection IDs, and more.|
 rw_streaming_parallelism            | Contains information about the streaming parallelism configuration for streaming jobs, including their IDs, names, relation types, and parallelism.|
 rw_system_tables      | Contains information about system tables in the database, including their unique IDs, names, schema IDs, owners, and more. |
 rw_table_fragments    | Contains information about table fragments in the database, including their parent table IDs, fragment statuses, and primary keys.|
 rw_table_stats        | Contains statistical information about tables, including their unique IDs, total key count, total key size, and total value size in bytes.|
 rw_tables             | Contains information about tables that are available in the database, including their unique IDs, names, schema IDs, owner IDs, definitions, append-only information, access control lists, initialization and creation timestamps, and the cluster version when the table was initialized and created.|
 rw_types              | Contains information about data types that are supported by the database, including their IDs and names.|
 rw_user_secrets       | This table stores the encrypted passwords of all users in the database and is accessible exclusively to super users.|
 rw_users              | Contains information about users that are available in the database, including their unique IDs, names, and boolean flags indicating whether they are a superuser, whether they can create databases, whether they can create other users, and whether can log in.|
 rw_views              | Contains information about views that are available in the database, including their unique IDs, names, schema IDs, owner IDs, definitions, and more.|
 rw_worker_nodes       | Contains information about worker nodes available in the database, such as meta nodes, compactor nodes, and compute nodes. The detailed information includes their unique IDs, hostnames, ports, types, states, parallelism levels, boolean flags (indicating whether they are used for streaming, serving, or are unschedulable), kernel versions, memory, CPU, and uptime.|
