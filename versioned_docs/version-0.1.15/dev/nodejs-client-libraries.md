---
id: nodejs-client-libraries
title: Use RisingWave in your Node.js application
description: Use RisingWave in your Node.js application
slug: /nodejs-client-libraries
---

As RisingWave is wire-compatible with PostgreSQL, you can use third-party PostgreSQL drivers to interact with RisingWave from your Node.js applications.

In this guide, we use the [Node.js pg driver](https://www.npmjs.com/package/pg) to connect to RisingWave.


## Run RisingWave

To learn about how to run RisingWave, see [Run RisingWave](/get-started.md#run-risingwave).


## Install npm

```shell
npm install pg
```

## Connect to RisingWave

:::note

You can use either a client or a connection pool to connect to RisingWave. If you are working on a web application that makes frequent queries, we recommend that you use a connection pool. The code examples in this topic use connection pools.

:::

Connecting to RisingWave and running a query is normally done together. Therefore, we include a basic query in the code. Replace it with the query that you want to run.

```js
const { Pool } = require('pg')

const credentials = {
  user: 'root',
  host: '127.0.0.1',
  database: 'dev',
  password: 'secret',
  port: 4566,
}
 
const start = async () => {
    const pool = new Pool(credentials);
    const res = await pool.query("SELECT 1+2"); /*A basic query to ensure the connection is successful. 
    Replace it with your own query. */
    console.log(res); //Print out the results.
    await pool.end();
}

start().catch(console.error);
```

## Create a source

The code below creates a source `walk` with the [`datagen`](/create-source/create-source-datagen.md) connector. The `datagen` connector is used to generate mock data. The `walk` source consists of two columns, `distance` and `duration`, which respectively represent the distance and the duration of a walk. The source is a simplified version of the data that is tracked by smart watches.

```js
const { Pool } = require('pg')

const credentials = {
    user: 'root',
    host: '127.0.0.1',
    database: 'dev',
    password: 'secret',
    port: 4566,
}

const createsource = `CREATE MATERIALIZED SOURCE walk(distance INT, duration INT)
WITH ( connector = 'datagen',
    fields.distance.kind = 'sequence',
    fields.distance.start = '1',
    fields.distance.end  = '60',
    fields.duration.kind = 'sequence',
    fields.duration.start = '1',
    fields.duration.end = '30',
    datagen.rows.per.second='15',
    datagen.split.num = '1'
) ROW FORMAT JSON`;

const start = async () => {
    const pool = new Pool(credentials);
    const res = await pool.query(createsource);
    console.log(res);
    await pool.end();
}
start().catch(console.error);
```

:::note

All the code examples in this guide include a section for connecting to RisingWave. If you run multiple queries within one connection session, you do not need to repeat the connection code.

:::


## Create a materialized view

The code in this section creates a materialized view `counter` to capture the latest total distance and duration..

```js
const { Pool } = require('pg')

const credentials = {
    user: 'root',
    host: '127.0.0.1',
    database: 'dev',
    password: 'secret',
    port: 4566,
}

const createmv = `CREATE MATERIALIZED VIEW counter
    AS SELECT
    SUM(distance) as total_distance,
    SUM(duration) as total_duration
    FROM walk`;

const start = async () => {
    const pool = new Pool(credentials);
    const res = await pool.query(createmv);
    console.log(res);
    await pool.end();
}
start().catch(console.error);
```

## Query a materialized view

The code in this section queries the materialized view `counter` to get the real-time data.

```js
const { Pool } = require('pg');

const credentials = {
    user: 'root',
    host: '127.0.0.1',
    database: 'dev',
    password: 'secret',
    port: 4566,
}

const start = async () => {
    const pool = new Pool(credentials);
    const res = await pool.query("SELECT * from counter;");
    console.log(res.rows); // Print out only the actual data.
    await pool.end();
}
start().catch(console.error);
```