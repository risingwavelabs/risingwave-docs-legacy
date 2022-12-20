---
id: python-client-libraries
title: Use RisingWave in your Python application
description: Use RisingWave in your Python application
slug: /python-client-libraries
---


As RisingWave is wire-compatible with PostgreSQL, you can use third-party PostgreSQL drivers to interact with RisingWave from your Python applications.

In this guide, we use the [`psycopg2`](https://pypi.org/project/psycopg2/) driver to connect to RisingWave.


## Run RisingWave

To learn about how to run RisingWave, see [Run RisingWave](../get-started.md#run-risingwave).


## Install the `psgcopg2` driver

For information about how to install `psycopg` and the difference between `psycopg` and `psycopg-binary`, see the [official psycopg documentation](https://www.psycopg.org/docs/install.html).


## Connect to RisingWave

To connect to RisingWave via `psycopg2`:

```python
import psycopg2

conn = psycopg2.connect(host="127.0.0.1", port=4566, user="root", dbname="dev")
```

## Create a source

The code below creates a source `walk` with the `datagen` connector. The `datagen` connector is used to generate mock data. The `walk` source consists of two columns, `distance` and `duration`, which respectively represent the distance and the duration of a walk. The source is a simplified version of the data that is tracked by smart watches.

```python
import psycopg2

conn = psycopg2.connect(host="localhost", port=4566, user="root", dbname="dev") # Connect to RisingWave.
conn.autocommit = True # Set queries to be automatically committed.

with conn.cursor() as cur:
    cur.execute("""
CREATE MATERIALIZED SOURCE walk(distance INT, duration INT)
WITH (
    connector = 'datagen',
    fields.distance.kind = 'sequence',
    fields.distance.start = '1',
    fields.distance.end  = '60',
    fields.duration.kind = 'sequence',
    fields.duration.start = '1',
    fields.duration.end = '30',
    datagen.rows.per.second='15',
    datagen.split.num = '1'
) ROW FORMAT JSON""") # Execute the query.

conn.close() # Close the connection.
```

:::note

All the code examples in this guide include a section for connecting to RisingWave. If you perform multiple actions within one connection session, you do not need to repeat this section.

:::


## Create a materialized view

The code in this section creates a materialized view `counter` to capture the latest total distance and duration..

```python
import psycopg2

conn = psycopg2.connect(host="localhost", port=4566, user="root", dbname="dev")
conn.autocommit = True

with conn.cursor() as cur:
    cur.execute("""CREATE MATERIALIZED VIEW counter
    AS
    SUM(distance) as total_distance,
    SUM(duration) as total_duration,
    FROM walk;""")

conn.close()
```

## Query a materialized view

The code in this section queries the materialized view `counter` to get the real-time data.

```python
import psycopg2

conn = psycopg2.connect(host="localhost", port=4566, user="root", dbname="dev")
conn.autocommit = True

with conn.cursor() as cur:
    cur.execute("SELECT * FROM counter;")
    print(cur.fetchall())
conn.close()
```