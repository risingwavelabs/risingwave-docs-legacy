---
 id: ingest-from-supabase-cdc
 title: Ingest data from Supabase CDC
 description: Describes how to ingest data from Supabase CDC.
 slug: /ingest-from-supabase-cdc
---
<head>
  <link rel="canonical" href="https://docs.risingwave.com/docs/current/ingest-from-supabase-cdc/" />
</head>

[Supabase](https://supabase.com) is an open-source Firebase alternative. It uses PostgreSQL as the underlying storage system and therefore can be integrated with RisingWave seamlessly.

You can ingest data from Supabase into RisingWave. For more details on this integration, we have an [end-to-end demo](https://www.risingwave.com/blog/unleash-the-true-power-of-supabase-realtime-with-risingwave/) to showcase how Supabase seamlessly integrates with RisingWave.

## Set up Supabase 

Create a Supabase project and a source table. Enable real-time when creating the table to allow RisingWave to ingest CDC data.

## Ingest CDC data into RisingWave

Since every Supabase project is a dedicated PostgreSQL database, use the PostgreSQL source connector to ingest CDC data from RisingWave. For the syntax, parameters, and examples, see [Ingest data from PostgreSQL CDC](/docs/guides/ingest-from-postgres-cdc.md#create-a-table-using-the-native-cdc-connector).

To start ingesting data from Supabase, a connection with the database must be established first by using the `CREATE SOURCE` command.

```sql
CREATE SOURCE supabase_pgdb WITH (
    connector = 'postgres-cdc',
    hostname = 'db.xxxxxx.supabase.co',
    port = '8306',
    username = 'root',
    password = '123456',
    database.name = 'mydb',
    slot.name = 'mydb_slot',
    publication.name = 'rw_publication'
);
```

To ingest data from a specific table, use the `CREATE TABLE` command. A primary key must be defined. 

```sql
CREATE TABLE tt3 (
    v1 integer primary key,
    v2 timestamp with time zone
) FROM supabase_pgdb TABLE 'public.tt3';
```