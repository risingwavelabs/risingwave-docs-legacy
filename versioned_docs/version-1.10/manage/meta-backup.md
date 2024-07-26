---
id: meta-backup
title: Back up and restore meta service
description: Back up and restore meta service
slug: /meta-backup
---
<head>
  <link rel="canonical" href="https://docs.risingwave.com/docs/current/meta-backup/" />
</head>

This guide introduces how to back up meta service data and restore from a backup.

A meta snapshot is a backup of meta service's data at a specific point in time. Meta snapshots are persisted in S3-compatible storage.

## Set backup parameters

Before you can create a meta snapshot, you need to set the `backup_storage_url` and `backup_storage_directory` system parameters prior to the first backup attempt.

:::caution
Be careful not to set the `backup_storage_url` and `backup_storage_directory` when there are snapshots. However, it's not strictly forbidden. If you insist on doing so, please note the snapshots taken before the setting will all be invalidated and cannot be used in restoration anymore.
:::

To learn about how to configure system parameters, see [How to configure system parameters](../manage/view-configure-system-parameters.md#how-to-configure-system-parameters).

## Create a meta snapshot

Meta snapshot is created by meta service whenever requested by users. There is no automatic process in RisingWave kernel that creates meta snapshot regularly.

Here's an example of how to create a new meta snapshot with `risectl`:

```bash
risectl meta backup-meta
```

`risectl` is included in the pre-built RisingWave binary. For details, see [Quick start](get-started.md#binaries).

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

```bash
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

    ```bash
    risectl \
    meta \
    restore-meta \
    --meta-store-type etcd \
    --meta-snapshot-id [snapshot_id] \
    --etcd-endpoints [etcd_endpoints] \
    --backup-storage-url [backup_storage_url, e.g. s3://bucket_read_from] \
    --backup-storage-directory [backup_storage_directory, e.g. dir_read_from] \
    --hummock-storage-url [hummock_storage_url, e.g. s3://bucket_write_to] \
    --hummock-storage-directory [hummock_storage_directory, e.g. dir_write_to]
    ```

    If etcd enables authentication, also specify the following:

    ```bash
    --etcd-auth \
    --etcd-username [etcd_username] \
    --etcd-password [etcd_password] \
    ```

    `restore-meta` reads snapshot data from backup storage and writes them to etcd and hummock storage.

    Below is an example of setting parameters:
    ```
    psql=> show parameters;
                  Name                     |                Value                 | Mutable
   ----------------------------------------+--------------------------------------+---------
    state_store                            | hummock+s3://state_bucket            | f
    data_directory                         | state_data                           | f
    backup_storage_url                     | s3://backup_bucket                   | t
    backup_storage_directory               | backup_data                          | t
    ```
    Parameters to `risectl meta restore-meta` should be:
    - `--backup-storage-url s3://backup_bucket`.
    - `--backup-storage-directory backup_data`.
    - `--hummock-storage-url s3://state_bucket`. Note that the `hummock+` prefix is stripped.
    - `--hummock-storage-directory state_data`.
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
