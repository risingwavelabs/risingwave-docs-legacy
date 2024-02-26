---
id: multiple-table-sink
slug: /multiple-table-sink
title: Maintain wide table with table sinks
---
<head>
  <link rel="canonical" href="https://docs.risingwave.com/docs/current/multiple-table-sink/" />
</head>

This guide tells a way to maintain a wide table whose columns are comes from different sources. Traditional data warehouse or ETL use a join query to do it. But the streaming join brings issues such as low efficiency and large memory consumption. 

In some cases with limitation, use the [CREATE SINK INTO TABLE](/commands/sql-create-sink-into.md) and [ON CONFLICT clause](/commands/sql-create-table.md#pk-conflict-behavior) can save the resources and get high efficiency.

## Merge multiple sinks with the same primary key

:::note
Keep in mind that the `ON CONFLICT` clause does not affect the update or delete events, the sinks should be forced to be append-only, otherwise, the delete or update events from any sink will delete the regarding row.
:::

```SQL
CREATE TABLE d1(v1 int, k int primary key);
CREATE TABLE d2(v2 int, k int primary key);
CREATE TABLE d3(v3 int, k int primary key);
CREATE TABLE wide_d(v1 int, v2 int, v3 int, k primary key)
ON CONFLICT DO UPDATE IF NOT NULL;

CREATE SINK sink1 INTO wide_d (v1, k) AS
  SELECT v1, k FROM d1
  with (
      type = 'append-only',
      force_append_only = 'true',
  );
CREATE SINK sink2 INTO wide_d (v2, k) AS
  SELECT v2, k FROM d2
  with (
      type = 'append-only',
      force_append_only = 'true',
  );
CREATE SINK sink3 INTO wide_d (v3,k) AS 
  SELECT v3, k FROM d3
  with (
      type = 'append-only',
      force_append_only = 'true',
  );
```

## Enrich data with foreign keys in Star/Snowflake Schema Model

With star schema, the data is constructed with a central fact table surrounded by several related dimension tables. Each dimension table is joined to the fact table through a foreign key relationship. With the good properties that the join key is the primary key of the dimension tables, we can rewrite the query as a series of sink into table.

```sql
CREATE TABLE fact(pk int primary key, k1 int, k2 int, k3 int);
CREATE TABLE d1(pk int primary key, v int);
CREATE TABLE d2(pk int primary key, v int);
CREATE TABLE d3(pk int primary key, v int);

CREATE TABLE wide_fact(pk int primary key, v1 int, v2 int, v3 int)
  ON CONFLICT DO UPDATE IF NOT NULL;

/* the main sink is not force-append-only to control if the record exists*/
CREATE SINK fact_sink INTO wide_fact (pk) AS
  SELECT pk FROM fact;

CREATE SINK sink1 INTO wide_fact (pk, v1) AS
  SELECT fact.pk, d1.v
  FROM fact JOIN d1 ON fact.k1 = d1.pk
with (
  type = 'append-only',
  force_append_only = 'true',
);

CREATE SINK sink2 INTO wide_fact (pk, v2) AS
  SELECT fact.pk, d2.v
  FROM fact JOIN d2 ON fact.k2 = d2.pk
with (
  type = 'append-only',
  force_append_only = 'true',
);

CREATE SINK sink3 INTO wide_fact (pk, v3) AS
  SELECT fact.pk, d3.v
  FROM fact JOIN d3 ON fact.k3 = d3.pk
with (
  type = 'append-only',
  force_append_only = 'true',
);
```