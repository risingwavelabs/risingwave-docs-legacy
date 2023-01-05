---
id: meta-backup
title: Back up and restore meta service
description: Back up and restore meta service
slug: /meta-backup
---

This guide introduces how to back up meta service data and restore from a backup.

## Configure system variables

A meta snapshot is a backup of meta service's data at a specific point in time. Meta snapshots are persisted in S3-compatible storage.

Here's an example of how to specify target storage and set `storage_url` and `storage_directory`:

```
[backup]
storage_url = "s3://[bucket]"
storage_directory = "backup"
```

Typically, `storage_url` and `storage_directory` should not be changed after initializing the cluster. Otherwise, if they are changed, all meta snapshots taken previously become invalidated and shouldn't be used anymore.
This is because the meta backup and recovery process does not replicate SST files. To ensure consistency between meta snapshots and SST files, the meta service additionally maintains the retention time for SSTs required by meta snapshots via monitoring the snapshot storage in use. That is to say, SST files required by meta snapshots from a snapshot storage that is not in use may be garbage collected at any time.


## Create a meta snapshot

Meta snapshot is created by meta service.

Here's an example of how to create a new meta snapshot with `risectl`:

```
risectl meta backup-meta
```

`risectl` is included in the pre-built RisingWave binary. It can also be built from source. For details, see [Run RisingWave locally](/deploy/risingwave-local.md).

## View existing meta snapshots

The following SQL command lists existing meta snapshots:

```sql
SELECT meta_snapshot_id FROM rw_catalog.rw_meta_snapshot;
```

Example output:

```
 meta_snapshot_id 
------------------
                3
                4
```

## Delete a meta snapshot

Here's an example of how to delete a meta snapshot with `risectl`:

```
risectl meta delete-meta-snapshots [snapshot_ids]
```

## Restore from a meta snapshot

Use the following steps to restore from a meta snapshot.

1. Shut down the meta service.
    :::note
    This step is especially important because the meta backup and recovery process does not replicate SST files. It is not permitted for multiple clusters to run with the same SSTs set at any time, as this can corrupt the SST files.
    :::
2. Create an empty meta store.
3. Restore the meta snapshot to the new meta store.

    ```
    backup-restore \
    --meta-store-type etcd \
    --meta-snapshot-id [snapshot_id] \
    --etcd-endpoints [etcd_endpoints] \
    --storage-url [storage_url]
    ```
    `backup-restore` reads snapshot data from snapshot storage and writes them to `etcd`. 
    `backup-restore` is not included in the pre-built risingwave binary. Please build it from source by compiling the `risingwave_backup_cmd` package.
4. Configure meta service to use the new meta store.

## Access historical data backed up by meta snapshot

Meta snapshot is used to support historical data access, also known as time travel query.

Use the following steps to perform a time travel query.

1. List all valid historical point-in-time (i.e., epoch).

    ```sql
    SELECT safe_epoch,safe_epoch_ts,max_committed_epoch,max_committed_epoch_ts FROM rw_catalog.rw_meta_snapshot;
    ```

   Example output:

    ```
        safe_epoch    |      safe_epoch_ts      | max_committed_epoch | max_committed_epoch_ts  
    ------------------+-------------------------+---------------------+-------------------------
     3603859827458048 | 2022-12-28 11:08:56.918 |    3603862776381440 | 2022-12-28 11:09:41.915
     3603898821640192 | 2022-12-28 11:18:51.922 |    3603900263432192 | 2022-12-28 11:19:13.922
    ```

   Valid epochs are within range (`safe_epoch`,`max_committed_epoch`). For example, any epochs in [3603859827458048, 3603862776381440] or in [3603898821640192, 3603900263432192] are acceptable.  
   `safe_epoch_ts` and `max_committed_epoch_ts` are human-readable equivalences.
2. Set session config `QUERY_EPOCH`. By default, it's 0, which means disabling historical query.

    ```sql
    SET QUERY_EPOCH=[chosen epoch];
    ```
   Then, batch queries in this session return data as of this epoch instead of the latest one.
3. Disable historical query.

    ```sql
    SET QUERY_EPOCH=0;
    ```

:::info Limitation

RisingWave only supports historical data access at a specific point in time backed up by at least one meta snapshot.

:::