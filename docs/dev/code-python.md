---
<<<<<<< Updated upstream
id: python-client-libraries
title: Python
description: Connect to RisingWave from a Python application
slug: /python-client-libraries
---


As RisingWave is wire-compatible with PostgreSQL, you can use third-party PostgreSQL drivers to interact with RisingWave from your Python applications.

In this guide, we use the [`psycopg2`](https://pypi.org/project/psycopg2/) driver to connect to RisingWave.
=======
id: python-libraries
title: Connect to RisingWave from a Python application
description: Connect to RisingWave from a Python application
slug: /python-libraries
---


RisingWave is wire-compatible with PostgreSQL. You can use third-party PostgreSQL adapters to interact with RisingWave from your Python applications.

In this guide, we use the [`psycopg2`](https://pypi.org/project/psycopg2/) adapter to connect to RisingWave.
>>>>>>> Stashed changes


## Start RisingWave

<<<<<<< Updated upstream
We recommend you set up a local cluster with Docker Compose. 

For the detailed steps, see [Set up a local cluster with Docker Compose](../install-run-connect.md#step-1-install-and-run-risingwave).
=======
We recommend you set up a local multi-node cluster via Docker Desktop. 

For the detailed steps, see [Set up a multi-node cluster via Docker](../install-run-connect.md#step-1-install-and-run-risingwave).
>>>>>>> Stashed changes


## Install the psgcopg2 driver

For information about how to install `psycopg` and the difference between `psycopg` and `psycopg-binary`, see [the official psycopg documentation](https://www.psycopg.org/docs/install.html).


## Connect to RisingWave

To connect to RisingWave via `psycopg2`:

```python

import psycopg2

conn = psycopg2.connect(host="127.0.0.1", port=4566, user="root", dbname="dev")
```

## Create a source

The code below creates a source with the `datagen` connector, and fetches all the sources in the database.

```python
import psycopg2

conn = psycopg2.connect(host="localhost", port=4566, user="root", dbname="dev")
conn.autocommit = True

with conn.cursor() as cur:
    cur.execute("create materialized source s1 (id int,  ) with " \
    "(connector = 'datagen'," \
    "fields.id.kind = 'sequence'," \
    "fields.v1.start = '1'," \
    "fields.v1.end  = '10'," \
    "fields.v2.kind = 'sequence'," \
    "fields.v2.start = '11'," \
    "fields.v2.end = '20'," \
    "datagen.rows.per.second='15'," \
    "datagen.split.num = '1') " \
"row format json")

with conn.cursor () as cur:
    cur.execute("SHOW SOURCES;")
    print(cur.fetchall())

conn.close()
```

:::note

All the code examples in this guide include a section for connecting to RisingWave. If you perform multiple actions within one connection session, you do not need to repeat this section.

:::


## Create a materialized view

The code in this section creates a materialized view `avg_speed`, and queries all materialized views in the database.

```python
import psycopg2

conn = psycopg2.connect(host="localhost", port=4566, user="root", dbname="dev")
conn.autocommit = True

with conn.cursor() as cur:
    cur.execute("CREATE MATERIALIZED VIEW avg_speed" \
    "AS" \ 
    "SUM(distance) as total_distance," \
    "SUM(duration) as total_duration," \
    "SUM(distance) / SUM(duration) as avg_speed"\
    "FROM s1;")


with conn.cursor () as cur:
    cur.execute("SHOW MATERIALIZED VIEWS;")
    print(cur.fetchall())

conn.close()
```

## Query a materialized view

The code below queries the materialized view that is created above.

```python
import psycopg2

conn = psycopg2.connect(host="localhost", port=4566, user="root", dbname="dev")
conn.autocommit = True

with conn.cursor () as cur:
    cur.execute("SELECT * FROM avg_speed;")
    print(cur.fetchall())

conn.close()
```








