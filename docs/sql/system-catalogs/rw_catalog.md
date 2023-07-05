---
id: rw_catalog
slug: /rw_catalog
title: RisingWave catalogs
---

RisingWave catalogs are tables that store the matadata of system schemas, such as information about the progress of a DDL command or about the snapshots of the RisingWave Meta service.

## How to display RisingWave catalogs

After you connect to RisingWave vis `psql`, enter `\d` to display RisingWave catalogs.

```sql
\d
------RESULTS
                List of relations
   Schema   |       Name       | Type  | Owner 
------------+------------------+-------+-------
 rw_catalog | rw_ddl_progress  | table | root
 rw_catalog | rw_meta_snapshot | table | root
 rw_catalog | rw_relation_info | table | root
(3 rows)
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

```sql
DESCRIBE rw_catalog.rw_relation_info;
------RESULTS
       Name       |  Type   
------------------+---------
 schemaname       | varchar
 relationname     | varchar
 relationowner    | integer
 definition       | varchar
 relationtype     | varchar
 relationid       | integer
 relationtimezone | varchar
 fragments        | varchar
(8 rows)
```

## What do these catalogs mean to you?

|Relation Name | Description|
|---|---|
|rw_ddl_progress| Contains the progress of running DDL statements. You can use this relation to view the progress of running DDL statements. For details, see [View statement progress](/manage/view-statement-progress.md).|
|rw_meta_snapshot| Contains information about existing snapshots of the RisingWave meta service. You can use this relation to get IDs of meta snapshots and then restore the meta service from a snapshot. For details, see [Back up and restore meta service](/manage/meta-backup.md). |
|rw_relation_info| Contains low-level relation information for tables, sources, materialized views, and indexes that users have created. |
