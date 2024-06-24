---
id: multiple-table-sink
slug: /multiple-table-sink
title: Maintain wide table with table sinks
---
<head>
  <link rel="canonical" href="https://docs.risingwave.com/docs/current/multiple-table-sink/" />
</head>

This guide introduces how to maintain a wide table whose columns come from different sources. Traditional data warehouses or ETL use a join query for this purpose. However, streaming join brings issues such as low efficiency and high memory consumption.

In some cases with limitation, use the [CREATE SINK INTO TABLE](/sql/commands/sql-create-sink-into.md) and [ON CONFLICT clause](/sql/commands/sql-create-table.md#pk-conflict-behavior) can save the resources and achieve high efficiency.

## Merge multiple sinks with the same primary key

```sql
CREATE TABLE d1(v1 int, k int primary key);
CREATE TABLE d2(v2 int, k int primary key);
CREATE TABLE d3(v3 int, k int primary key);
CREATE TABLE wide_d(v1 int, v2 int, v3 int, k int primary key)
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

:::note
Keep in mind that the `ON CONFLICT` clause does not affect the update or delete events, the sinks should be forced to be append-only. Otherwise, the delete or update events from any sink will delete the regarding row.
:::

## Enrich data with foreign keys in Star/Snowflake schema model

With star schema, the data is constructed with a central fact table surrounded by several related dimension tables. Each dimension table is joined to the fact table through a foreign key relationship. Given that the join key is the primary key of the dimension tables, we can rewrite the query as a series of sink into table.

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

The example above and the following SQL with left join operation are completely equivalent.

```sql
CREATE MATERIALIZED VIEW wide_fact AS 
SELECT fact.pk, d1.v v1, d2.v v2, d3.v v3
FROM fact
LEFT JOIN d1 ON fact.k1 = d1.pk
LEFT JOIN d2 ON fact.k2 = d2.pk
LEFT JOIN d3 ON fact.k3 = d3.pk
```

But maintaining wide table with table sinks can save the resources and achieve high efficiency.

<img
  src={require('../images/maintain_wide_table_with_table_sink.drawio.png').default}
  alt="The streaming state when maintain wide table with table sinks"
/>

Furthermore, for the large dimension table, we can use [Temporal Join](/sql/query-syntax/query-syntax-join-clause.md) as the partial join to reduce the streaming state and improve performance.
