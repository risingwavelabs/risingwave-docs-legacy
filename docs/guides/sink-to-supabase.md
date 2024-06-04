---
 id: sink-to-supabase
 title: Sink data from RisingWave to Supabase
 description: Sink data from RisingWave to Supabase with the JDBC connector.
 slug: /sink-to-supabase
---
<head>
  <link rel="canonical" href="https://docs.risingwave.com/docs/current/sink-to-supabase/" />
</head>

[Supabase](https://supabase.com) is an open-source Firebase alternative. It uses PostgreSQL as the underlying storage system and therefore can be integrated with RisingWave seamlessly.

You can sink data from RisingWave into Supabase. For more details on this integration, we have an [end-to-end demo](https://www.risingwave.com/blog/unleash-the-true-power-of-supabase-realtime-with-risingwave/) to showcase how Supabase seamlessly integrates with RisingWave.

## Set up Supabase 

Before creating a sink in RisingWave, create a project and target table to sink data to in Supabase first. 

## Sink data from RisingWave

As Supabase is compatible with PostgreSQL, you can sink data to Supabase the same way you would sink data to PostgreSQL with the JDBC connector. 

For the syntax, parameters, and examples, see [Sink data from RisingWave to PostgreSQL](/guides/sink-to-postgres.md).

The following SQL command creates a sink, `promotion_update`, that sinks data from the materialized view, `product_calc_mv`, in RisingWave, to the `promotions` table in Supabase. The columns of the materialized view must match the columns of the table in Supabase.

```sql
CREATE SINK promotion_update FROM product_calc_mv WITH (
  connector='jdbc',
  jdbc.url='jdbc:postgresql://xxxx.supabase.co:5432/postgres?user=postgres&password=xxx',
  table.name = 'promotions',
  type = 'upsert'
);
```