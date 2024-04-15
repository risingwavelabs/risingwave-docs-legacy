---
id: risingwave-as-postgres-fdw
title: RisingWave as a PostgreSQL foreign data wrapper
description: A demo on accessing data stored in RisingWave from PostgreSQL
slug: /risingwave-as-postgres-fdw
---

A foreign data wrapper in PostgreSQL allows you to directly virtualize data stored in an external database as a local external table, also known as a foreign table. This tutorial will demonstrate how to interact between PostgreSQL and RisingWave. In this example, RisingWave will use CDC (Change Data Capture) to extract data from PostgreSQL, and analyze it using a materialized view. Then PostgreSQL will directly retrieve the computation results stored in RisingWave.

:::note Beta Feature
RisingWave serving as a foreign data wrapper of PostgreSQL is currently in Beta. Please contact us if you encounter any issues or have feedback.
:::

## Prerequisites

The following demo needs to be completed under two `psql` connections. One connection links to PostgreSQL, providing the source data for analysis and obtaining the analysis results from RisingWave. In our demo, the command to connect to PostgreSQL is `psql -h localhost -p 5432 -d myd -U postgresuser`, with the password being `postgrespw`. The other connection links to RisingWave to establish a job for analyzing the data. In our demo, the command to connect to RisingWave is `psql -h localhost -p 4566 -d dev -U root`, with no password required. You can choose to exit from `psql` and log in to the other database when you need to operate in another database. Alternatively, you can use `tmux` to open two terminals simultaneously, connecting to the respective databases with `psql`.

- The PostgreSQL used supports the `postgres_fdw` extension. 

- Both PostgreSQL and RisingWave are accessible from each other.

- Both of the users in PostgreSQL (`postgresuser` in this demo) and in RisingWave (`root` in this demo) have the necessary permissions to create tables and materialized views.

## Prepare data in PostgreSQL

The following commands create a table in PostgreSQL and insert data into it.

```sql
---Run in PostgreSQL
CREATE TABLE person (
  "id" int,
  "name" varchar(64),
  "credit_card" varchar(200),
  "city" varchar(200),
  PRIMARY KEY ("id")
);

INSERT INTO person VALUES (1001, 'peter white', '1781 2313 8157 6974', 'boise');
INSERT INTO person VALUES (1002, 'sarah spencer', '3453 4987 9481 6270', 'los angeles');
INSERT INTO person VALUES (1004, 'julie white', '0052 8113 1582 4430', 'seattle');
INSERT INTO person VALUES (1005, 'sarah smith', '4591 5419 7260 8350', 'los angeles');
INSERT INTO person VALUES (1007, 'walter spencer', '5136 7504 2879 7886', 'los angeles');
INSERT INTO person VALUES (1008, 'john abrams', '6064 8548 6057 2021', 'redmond');
INSERT INTO person VALUES (1010, 'kate smith', '9474 6887 6463 6972', 'bend');
INSERT INTO person VALUES (1011, 'vicky noris', '9959 4034 5717 6729', 'boise');
INSERT INTO person VALUES (1012, 'walter jones', '8793 6517 3085 0542', 'boise');
INSERT INTO person VALUES (1013, 'sarah walton', '2280 4209 8743 0735', 'kent');
INSERT INTO person VALUES (1015, 'vicky jones', '3148 5012 3225 2870', 'los angeles');
INSERT INTO person VALUES (1016, 'john walton', '0426 2682 6145 8371', 'seattle');
INSERT INTO person VALUES (1017, 'luke jones', '9641 9352 0248 2749', 'redmond');
```

## Analyze data in RisingWave

The following command creates a table in RisingWave. This table will use the native CDC connector to synchronize the data of the Person table from PostgreSQL, and then create a materialized view to analyze the ingested data.

```sql
---Run in RisingWave
---Create a table in RisingWave to replicate the Person table of PostgreSQL into RisingWave
CREATE TABLE pg_person (
    "id" int,
    "name" varchar,
    "credit_card" varchar,
    "city" varchar,
    PRIMARY KEY ("id")
) with (
    connector = 'postgres-cdc',
    hostname = 'localhost',
    port = '5432',
    username = 'postgresuser',
    password = 'postgrespw',
    database.name = 'mydb',
    schema.name = 'public',
    table.name = 'person',
    slot.name = 'person'
);

---Create a materialized view to analyze the population of each city
CREATE MATERIALIZED VIEW city_population AS
SELECT
    city,
    COUNT(*) as population
FROM
    pg_person
GROUP BY
    city;
```

## Query result in PostgreSQL using FDW

The following command creates a foreign table in PostgreSQL to connect to RisingWave and query the materialized view. The first four commands prepare the remote access of `postgres_fdw`. You can check the PostgreSQL's doc [here](https://www.postgresql.org/docs/current/postgres-fdw.html) for more details.

```sql
---Run in PostgreSQL
---Enable the postgres_fdw extension
CREATE EXTENSION postgres_fdw;

---Create a foreign table to connect to RisingWave
CREATE SERVER risingwave
        FOREIGN DATA WRAPPER postgres_fdw
        OPTIONS (host 'localhost', port '4566', dbname 'dev');

---Create a user mapping for the foreign server, mapping the RisingWave's user `root` to the PostgreSQL's user `postgresuser`
CREATE USER MAPPING FOR postgresuser
        SERVER risingwave
        OPTIONS (user 'root', password '');

---Import the definition of table and materialized view from RisingWave.
IMPORT FOREIGN SCHEMA public
    FROM SERVER risingwave INTO public;

---List the foreign table and materialized view in PostgreSQL.
SELECT * FROM pg_foreign_table;
---------+----------+-------------------------------------------------
 ftrelid | ftserver |                    ftoptions
---------+----------+-------------------------------------------------
   16413 |    16411 | {schema_name=public,table_name=city_population}
   16416 |    16411 | {schema_name=public,table_name=pg_person}

---Check whether the data is synchronized from PostgreSQL to RisingWave.
SELECT * FROM pg_person;
------|----------------+---------------------+-------------
  id  |      name      |     credit_card     |    city
------+----------------+---------------------+-------------
 1005 | sarah smith    | 4591 5419 7260 8350 | los angeles
 1012 | walter jones   | 8793 6517 3085 0542 | boise
 1002 | sarah spencer  | 3453 4987 9481 6270 | los angeles
 1007 | walter spencer | 5136 7504 2879 7886 | los angeles
 1011 | vicky noris    | 9959 4034 5717 6729 | boise
 1016 | john walton    | 0426 2682 6145 8371 | seattle
 1010 | kate smith     | 9474 6887 6463 6972 | bend
 1015 | vicky jones    | 3148 5012 3225 2870 | los angeles
 1017 | luke jones     | 9641 9352 0248 2749 | redmond
 1001 | peter white    | 1781 2313 8157 6974 | boise
 1004 | julie white    | 0052 8113 1582 4430 | seattle
 1008 | john abrams    | 6064 8548 6057 2021 | redmond
 1013 | sarah walton   | 2280 4209 8743 0735 | kent

---Query the materialized view in RisingWave with PostgreSQL's foreign table.
SELECT * FROM city_population;
-------------+------------
    city     | population
-------------+------------
 boise       |          3
 los angeles |          4
 bend        |          1
 kent        |          1
 redmond     |          2
 seattle     |          2
```

:::note

Currently, write operations to RisingWave through a foreign data wrapper are not supported. The data in the foreign table is read-only.

:::

## Differences between sinking to Postgres and using FDW in Postgres

There are two main methods to interact between RisingWave and PostgreSQL: sinking data to PostgreSQL and utilizing a foreign data wrapper of PostgreSQL to access data in RisingWave. The table below provides a summary of the differences between these two methods. Your choice between these methods will depend on your specific requirements, data architecture, and performance considerations.

| Aspect            | Sinking to PostgreSQL                     | Using PostgreSQL FDW to access data               |
|-------------------|-------------------------------------------|---------------------------------------------------|
| Data Access       | Data is physically stored in PostgreSQL   | Data is physically stored in RisingWave           |
| Performance       | Potential latency for RisingWave to write to PostgreSQL | Potential latency when reading data from RisingWave |
| Message Delivery Guarantee | At-least-once while sinking into PostgreSQL tables  | Exactly-once for MVs and the data is not moved |
| Extra Requirement | None                                      | Requires the `postgres_fdw` extension and involves more setup steps |
