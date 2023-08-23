---
id: rw_catalog
slug: /rw_catalog
title: RisingWave catalogs
---

RisingwWave catalogs contain system tables and views that provide metadata about different relations in the system, as well as information about the cluster jobs and their status. The metadata includes details about each database, schema, and relation in the system, such as materialized views, tables, sources, sinks, indexes, and views. The status information includes the progress of DDL commands, system snapshots, and more.

## How to display RisingWave catalogs

After you connect to RisingWave vis `psql`, enter `\d` to display RisingWave catalogs.

```sql
\d
------RESULTS
                List of relations
   Schema   |         Name          | Type  | Owner 
------------+-----------------------+-------+-------
 rw_catalog | rw_actors             | table | root
 rw_catalog | rw_connections        | table | root
 rw_catalog | rw_databases          | table | root
 rw_catalog | rw_ddl_progress       | table | root
 rw_catalog | rw_fragments          | table | root
 rw_catalog | rw_functions          | table | root
 rw_catalog | rw_indexes            | table | root
 rw_catalog | rw_materialized_views | table | root
 rw_catalog | rw_meta_snapshot      | table | root
 rw_catalog | rw_parallel_units     | table | root
 rw_catalog | rw_relation_info      | table | root
 rw_catalog | rw_schemas            | table | root
 rw_catalog | rw_sinks              | table | root
 rw_catalog | rw_sources            | table | root
 rw_catalog | rw_table_fragments    | table | root
 rw_catalog | rw_table_stats        | table | root
 rw_catalog | rw_tables             | table | root
 rw_catalog | rw_users              | table | root
 rw_catalog | rw_views              | table | root
 rw_catalog | rw_worker_nodes       | table | root
(20 rows)
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
 rw_connections        | Contains details about the connections available in the database, such as their IDs, names, owners, types, and more.|
 rw_databases          | Contains information about the databases available in the database, such as the IDs, names, and owners.|
 rw_ddl_progress       | Contains the progress of running DDL statements. You can use this relation to view the progress of running DDL statements. For details, see [View statement progress](/manage/view-statement-progress.md).|
 rw_fragments          | Contains low-level information about fragments in the database, including fragment IDs, table IDs, and more. |
 rw_functions          | Contains information about functions in the database, including their IDs, names, schema identifiers, types, argument and return data types, programming language, and more. |
 rw_indexes            | Contains information about indexes in the database, including their IDs, names, schema identifiers, definitions, and more.|
 rw_materialized_views | Contains information about materialized views in the database, including their names, definitions, schema and owner IDs, and access control lists.
 rw_meta_snapshot      | Contains information about existing snapshots of the RisingWave meta service. You can use this relation to get IDs of meta snapshots and then restore the meta service from a snapshot. For details, see [Back up and restore meta service](/manage/meta-backup.md).|
 rw_parallel_units     | Contains information about parallel worker units used for executing database operations, including their unique IDs, worker IDs, and primary keys.|
 rw_relation_info      | Contains low-level relation information about tables, sources, materialized views, and indexes that are available in the database.|
 rw_schemas            | Contains information about schemas that are available in the database, including their names, unique IDs, owner IDs, and more. |
 rw_sinks              | Contains information about sinks that are available in the database, including their unique IDs, names, schema IDs, owner IDs, connector types, sink types, connection IDs, definitions, and more.|
 rw_sources            | Contains information about sources that are available in the database, including their unique IDs, names, schema IDs, owner IDs, connector types, column definitions, row formats, append-only flags, connection IDs, and more.|
 rw_table_fragments    | Contains information about table fragments in the database, including their parent table IDs, fragment statuses, and primary keys.|
 rw_table_stats        | Contains statistical information about tables, including their unique IDs, total key count, total key size, and total value size in bytes.|
 rw_tables             | Contains information about tables that are available in the database, including their unique IDs, names, schema IDs, owner IDs, definitions, and more.|
 rw_users              | Contains information about users that are available in the database, including their unique IDs, names, and boolean flags indicating whether they are a superuser, whether they can create databases, whether they can create other users, and whether can log in.|
 rw_views              | Contains information about views that are available in the database, including their unique IDs, names, schema IDs, owner IDs, definitions, and more.|
 rw_worker_nodes       | Contains information about worker nodes that are available in the database, including their unique IDs, hostnames, ports, types, states, parallelism levels, and boolean flags indicating whether they are used for streaming, serving, or are unschedulable.|
