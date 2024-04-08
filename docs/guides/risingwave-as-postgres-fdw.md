---
id: risingwave-as-postgres-fdw
title: Use Risingwave as a Postgres Foreign Data Wrapper
description: Use Risingwave as a Postgres Foreign Data Wrapper
slug: /risingwave-as-postgres-fdw
---

Postgres's FDW (Foreign Data Wrapper) offers the capability to directly virtualize data stored in an external database as a local external table (foreign table). This tutorial will provide an example of interaction between Postgres (PostgreSQL) and Risingwave. In this example, Risingwave will use CDC (Change Data Capture) to pull data from Postgres and analyze it using a Materialized View, then directly retrieve the computation results stored in Risingwave from Postgres.

:::note Beta Feature
The RisingWave's support as a Postgres' FDW is currently in Beta. Please contact us if you encounter any issues or have feedback.
:::


## Prepare Data in Postgres

The following commands create a table in Postgres and insert data into it.

```sql
---Run in Postgres
create table person (
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

# Analyze Data in Risingwave

The following command creates a table in Risingwave. This table will use Native CDC to synchronize the data of the Person table from Postgres, and then create a materialized view to analyze the ingested data.

```sql
---Run in Risingwave
---Create a table in Risingwave to replicate the Person table of Postgres into Risingwave
create table pg_person (
    "id" int,
    "name" varchar,
    "credit_card" varchar,
    "city" varchar,
    PRIMARY KEY ("id")
) with (
    connector = 'postgres-cdc',
    hostname = '127.0.0.1',
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

# Query Result in Postgres using FDW

The following command creates a foreign table in Postgres to connect to Risingwave and query the materialized view.

```sql
---Run in Postgres
---Enable the postgres_fdw extension
CREATE EXTENSION postgres_fdw;

---Create a foreign table to connect to Risingwave
CREATE SERVER risingwave
        FOREIGN DATA WRAPPER postgres_fdw
        OPTIONS (host 'host.docker.internal', port '4566', dbname 'dev');

---Create a user mapping for the foreign server, mapping the Risingave's root `user` to the Postgres' user `postgresuser`
CREATE USER MAPPING FOR postgresuser
        SERVER risingwave
        OPTIONS (user 'root', password '');

---Import the defination of table and materialized view from Risingwave.
IMPORT FOREIGN SCHEMA public
    FROM SERVER risingwave INTO public;

---List the foreign table and materialized view in Postgres.
select * from pg_foreign_table;
---------+----------+-------------------------------------------------
 ftrelid | ftserver |                    ftoptions
---------+----------+-------------------------------------------------
   16413 |    16411 | {schema_name=public,table_name=city_population}
   16416 |    16411 | {schema_name=public,table_name=pg_person}

---Check whether the data is synchronized from Postgres to Risingwave.
select * from pg_person;
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

---Query the materialized view in Risingwave with Postgres' foreign table.
select * from city_population;
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

