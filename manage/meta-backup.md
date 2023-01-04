---
id: meta-backup
title: Back up and restore meta service
description: Back up and restore meta service
slug: /meta-backup
---

This guide introduces how to back up meta service data and how to recover it.

## Configure system variables

A meta snapshot is a backup of meta service's data at a point of time. Meta snapshots are persisted in s3-compatible storage.  
To specify target storage, set storage_url and storage_directory.

```
[backup]
storage_url = "s3://[bucket]"
storage_directory = "backup"
```

### Caveat

Usually these two system variables should not be changed after the cluster is intialized. Otherwise, if they are changed, all meta snapshot taken previously become invalidated and shouldn't be used anymore.  
The reason is as follows. Meta backup and recovery doesn't replicate SST files. To ensure consistency bewteen meta snapshots and SST files, meta service additionally maintains the retention time for SSTs required by meta snapshots, via monitoring the snapshot storage in use. That's to say, SST files required by meta snapshots from a snapshot storage that is not in use, may be garbage collected at any time.

## Create a meta snapshot

Meta snapshot is created by meta service.  
To create a new meta snapshot with `risectl`

```
risectl meta backup-meta
```

`risectl` is included in the pre-built RisingWave binary. It can also be built from source.

## View existent meta snapshots

To list existent meta snapshots with SQL

```
select meta_snapshot_id from rw_catalog.rw_meta_snapshot;
```

Example output:

```
 meta_snapshot_id 
------------------
                3
                4
```

## Delete a meta snapshot

To delete a meta snapshot with `risectl`

```
risectl meta delete-meta-snapshots [snapshot_ids]
```

## Restore meta snapshot

1. Shutdown the meta service.
2. Create a new empty meta store.
3. Restore meta snapshot to the new meta store

    ```
    backup-restore \
    --meta-store-type etcd \
    --meta-snapshot-id [snapshot_id] \
    --etcd-endpoints [etcd_endpoints] \
    --storage-url [storage_url]
    ```
    `backup-restore` reads snapshot data from snapshot storage and writes them to etcd. `backup-restore` is not included in the pre-built risingwave binary. Please build it from source by compiling risingwave_backup_cmd package.
4. Config meta service to use the new meta store.

### Caveat

Step 1 is crucial, again because meta backup and recovery doesn't replicate SST files. Thus it's not allowed at any time that multiple cluster running with the same SSTs set, which otherwise would corrupt the SST files.

## Access historical data backed by meta snapshot

Meta snapshot is also used to support historical data access, known as time travel query sometimes.

1. List all valid historical point-in-time, i.e epoch.

    ```
    select safe_epoch,safe_epoch_ts,max_committed_epoch,max_committed_epoch_ts from rw_catalog.rw_meta_snapshot;
    ```

   Example output:

    ```
        safe_epoch    |      safe_epoch_ts      | max_committed_epoch | max_committed_epoch_ts  
    ------------------+-------------------------+---------------------+-------------------------
    3603859827458048 | 2022-12-28 11:08:56.918 |    3603862776381440 | 2022-12-28 11:09:41.915
    3603898821640192 | 2022-12-28 11:18:51.922 |    3603900263432192 | 2022-12-28 11:19:13.922
    ```

   Valid epochs are in range [safe_epoch, max_committed_epoch]. For example any epochs in [3603859827458048, 3603862776381440] or in [3603898821640192, 3603900263432192] are acceptable.  
   safe_epoch_ts and max_committed_epoch_ts are human-readable equivalences.
2. Set session config QUERY_EPOCH. By default it's 0, means disable historical query.

    ```
    SET QUERY_EPOCH=[chosen epoch];
    ```
   Then batch queries in this session returns data as of this epoch, instead of latest one.
3. Disable historical query.

    ```
    SET QUERY_EPOCH=0;
    ```

### Limitation

Only support access of historical data at point-in-time backed by at least one meta snapshot.