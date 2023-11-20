---
id: query-syntax-owner-to-clause
slug: /query-syntax-owner-to-clause
title: OWNER TO clause
---
<head>
  <link rel="canonical" href="https://docs.risingwave.com/docs/current/query-syntax-owner-to-clause/" />
</head>

"OWNER TO" is a clause that is used to assign or change the owner of an object, including the database, schema, table, materialized view, source, and sink. It is typically used in conjunction with the ALTER statement.

Here is the basic syntax of an `ALTER` statement with the `OWNER TO` clause:

```sql
ALTER { DATABASE | SCHEMA | TABLE | [MATERIALIZED] VIEW | SOURCE | SINK } target OWNER TO new_user
```
:::info
Note that the statement `ALTER TABLE target OWNER TO new_user` will also change the owner of the table's indexes, internal tables and the associated source (if the table is created using `CREATE TABLE table_name WITH (connector='connector_name')`).
:::

Basic `OWNER TO` clause examples:



```sql title=Example
-- Change the owner of a database
ALTER DATABASE d OWNER TO user1;
```
 

```sql title=Example
-- Change the owner of a schema
ALTER SCHEMA s OWNER TO user1;
```



```sql title=Example
-- Change the owner of a table
ALTER TABLE t OWNER TO user1;
```




```sql title=Example
-- Change the owner of a view
ALTER VIEW v OWNER TO user1;
```




```sql title=Example
-- Change the owner of a materialized view
ALTER MATERIALIZED VIEW mv OWNER TO user1;
```




```sql title=Example
-- Change the owner of a source
ALTER SOURCE src OWNER TO user1;
```




```sql title=Example
-- Change the owner of a sink 
ALTER SINK sink OWNER TO user1;
```

