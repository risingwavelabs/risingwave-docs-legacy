---
id: migrate-to-sql-backend
title: Migrate from etcd to SQL backend for metadata management
description: Migrate from etcd to SQL backend for metadata management in RisingWave.
slug: /migrate-to-sql-backend
---
<head>
  <link rel="canonical" href="https://docs.risingwave.com/docs/current/migrate-to-sql-backend/" />
</head>

Starting from **v1.9.0**, RisingWave has introduced support for using a SQL backend as a meta store for managing
metadata. This marks a significant shift as the SQL backend is set to gradually deprecate etcd in future releases. The SQL backend currently supports these databases:

- **SQLite** (Please note that SQLite does not support multi-meta configurations.)
- **PostgreSQL** (Recommended for production environments.)
- **MySQL**

Transitioning to a SQL backend offers numerous benefits, including enhanced stability, performance, and observability. In this guide, we will walk through the process of migrating an existing cluster from the etcd backend to a SQL backend.

## Prerequisite

Ensure the following before starting the migration:

### Start a SQL backend service

You need to have a SQL backend service running and accessible. Depending on your choice of SQL backend, here are the general requirements:

- SQLite
  - Provide a writable directory where the SQLite database file can be stored.
  - SQLite operates directly from a file, so no separate service needs to be started.

- PostgreSQL
  - Ensure that a PostgreSQL server is running and a database is prepared for use with RisingWave.

- MySQL
  - Ensure that a MySQL server is running and a database is prepared for use with RisingWave.

Make sure the SQL backend service is operational and you have the necessary credentials and access configurations to connect to it from the server where RisingWave is deployed.

### Back up etcd data

The migration process from etcd to a SQL backend is performed offline, so we recommend taking a backup of your current etcd data to avoid any data loss before the migration. Refer to the [meta-backup](./meta-backup.md) for detailed instructions.

## Procedure

Follow the steps below to migrate an existing cluster from the etcd backend to a SQL backend.

1. Stop all components except etcd

   To safely migrate your metadata, stop all running components of the RisingWave cluster, except the etcd service. This ensures that no new data is written to etcd during the migration process.

2. Run the migration command

   Execute the RisingWave migration command to transfer metadata from etcd to the SQL backend. You need to provide the necessary options, including the addresses for both the etcd source and the SQL backend target.

    ```bash
    risingwave ctl meta migration --etcd-endpoints <etcd_address> --sql-endpoint <sql_address> -f
    ```

   Replace <etcd_address> with the address of your etcd service and <sql_address> with the address of your SQL backend.

3. Update meta configuration

   After the migration, update the RisingWave meta configuration to point to the new SQL backend and remove the etcd configs.

    ```bash
    --sql-endpoint [endpoint address]
    --backend sql
    ```

4. Start the RisingWave cluster and stop etcd

   Start the RisingWave cluster with the updated configuration to enable SQL backend. Once the cluster is confirmed to be running correctly, you can safely stop the etcd service.

## Post-migration

After completing the migration, monitor your cluster to ensure it is functioning as expected with the new SQL backend. Pay attention to the following key areas:

### Performance monitoring

Keep an eye on the performance metrics to identify any changes or improvements in stability and response times.
Monitoring tools and dashboards can help track the performance of your SQL backend and RisingWave cluster.

### Troubleshooting

Be prepared to troubleshoot any issues that may arise due to the change in the backend. Familiarize yourself with the SQL backend’s diagnostic tools and error messages. For any problems, consult the RisingWave documentation and [community](https://www.risingwave.com/slack) for support.

### Backup management

After running the system for a while, if you confirm that everything is working correctly, don't forget to delete the backup if you made one.

## When migration command fails

If the migration command fails, check the following:

- Ensure that the target SQL backend service is running and healthy.
- Verify that the target database exists and is accessible.
- Confirm that the user has sufficient permissions to write to the database.
- If the migration process was interrupted, re-run the migration command with the `-f` (force) parameter to overwrite all metadata.
