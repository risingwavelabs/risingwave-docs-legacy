---
id: python-client-libraries
title: Use RisingWave in your Python application
description: Use RisingWave in your Python application
slug: /python-client-libraries
---
<head>
  <link rel="canonical" href="https://docs.risingwave.com/docs/current/python-client-libraries/" />
</head>


RisingWave provides a Python SDK [`risingwave-py`](https://pypi.org/project/risingwave-py/) (currently under public preview) to help user develops event-driven applications. 
As RisingWave is wire-compatible with PostgreSQL, you can also use third-party PostgreSQL drivers like `psycopg2` and `sqlalchemy` to interact with RisingWave from your Python applications.

## Use `risingwave-py` to connect to RisingWave

[risingwave-py](https://pypi.org/project/risingwave-py/) is a RisingWave Python SDK that provides the following capabilities:
- Interact with RisingWave via Pandas DataFrame.
- Subscribe and process changes from RisingWave tables / materialized views.
- Run [SQL commands](https://docs.risingwave.com/docs/current/sql-references/) supported in RisingWave.

### Run RisingWave

To learn about how to run RisingWave, see [Run RisingWave](/get-started.md#run-risingwave).

### Connect to RisingWave

To connect to RisingWave via `risingwave-py`:

```python
from risingwave import RisingWave, RisingWaveConnOptions

# Connect to RisingWave instance on localhost with named parameters
rw = RisingWave(
    RisingWaveConnOptions.from_connection_info(
        host="localhost", port=4566, user="root", password="root", database="dev"
    )
)

# Connect to RisingWave instance on localhost with connection string
rw = RisingWave(RisingWaveConnOptions("postgresql://root:root@localhost:4566/dev"))

# You can create a new SQL connection and execute operations under the with statement. 
# This is the recommended way for python sdk usage.
with rw.getconn() as conn:
    conn.insert(...)
    conn.fetch(...)
    conn.execute(...)
    conn.mv(...)
    conn.on_change(...)


# You can also use the existing connection created by RisingWave object to execute operations.
# This will be used in the later sections for simplicity.
rw.insert(...)
rw.fetch(...)
rw.execute(...)
rw.mv(...)
rw.on_change(...)

```

### Ingestion into RisingWave

#### Load a Pandas DataFrame into RisingWave
```python
from datetime import datetime
import pandas as pd

df = pd.DataFrame(
    {
        "product": ["foo", "bar"],
        "price": [123.4, 456.7],
        "ts": [datetime.strptime("2023-10-05 14:30:00", "%Y-%m-%d %H:%M:%S"), 
               datetime.strptime("2023-10-05 14:31:20", "%Y-%m-%d %H:%M:%S")],
    }
)

# A test table will be created if not exist in risingwave with the correct schema
rw.insert(table_name="test", data=df)

# You can provide a optional force_flush parameter and set it to True
# if you would the inserted data to be visible in fetch query immediately.
# Otherwise, Data will be inserted in batches asynchronusly for better performance.
# rw.insert(table_name="test", data=df, force_flush = True)
```

#### Load data into RisingWave from external systems
```python
# Create a table and load data from upstream kafka
rw.execute("""
    CREATE TABLE IF NOT EXISTS source_abc
    WITH (
        connector='kafka',
        properties.bootstrap.server='localhost:9092',
        topic='test_topic'
    ) 
    FORMAT UPSERT ENCODE AVRO (
        schema.registry = 'http://127.0.0.1:8081',
        schema.registry.username='your_schema_registry_username',
        schema.registry.password='your_schema_registry_password'
)""")
```

See [here](https://docs.risingwave.com/docs/current/data-ingestion/) for supported sources and the SQL syntax.


### Query from RisingWave
```python
from risingwave import OutputFormat

result: pd.DataFrame = rw.fetch("""
        SELECT window_start, window_end, product, ROUND(avg(price)) as avg_price
        FROM tumble(test, ts, interval '10 seconds') 
        GROUP BY window_start, window_end, product""", 
        format=OutputFormat.DATAFRAME)

print(result)
# Output:
#          window_start          window_end product  avg_price
# 0 2023-10-05 14:31:20 2023-10-05 14:31:30     bar      457.0
# 1 2023-10-05 14:30:00 2023-10-05 14:30:10     foo      123.0

# You can also use OutputFormat.RAW to get back list of tuples as the query results
# rw.fetch("...",  format=OutputFormat.RAW)
# [(datetime.datetime(2023, 10, 5, 14, 31, 20), datetime.datetime(2023, 10, 5, 14, 31, 30), 'bar', 457.0), 
#  (datetime.datetime(2023, 10, 5, 14, 30), datetime.datetime(2023, 10, 5, 14, 30, 10), 'foo', 123.0)]
```

### Event-driven processing with RisingWave
Event-driven applications depend on real-time data processing to react to events as they occur. With `risingwave-py`, you can define materialized views using SQL and run them in RisingWave. Behind the scenes, events are processed continuously, and the results are incrementally maintained.

#### Define the processing logic in SQL

In the following example, `test_mv` is created to incrementally maintain the result of defined SQL as events are ingested in to the `test` table.

```python
mv = rw.mv(name="test_mv",
           stmt="""SELECT window_start, window_end, product, ROUND(avg(price)) as avg_price
                   FROM tumble(test, ts, interval '10 seconds') 
                   GROUP BY window_start, window_end, product""")
```

#### Subcribe changes from table / materialized view with your own handler

In addition to using SQL to do ad-hoc query on tables and materialized views. With `risingwave-py`, You can also subscribe subcribe changes from table / materialized view and define handler of the change events from table / materialized view for you applications. 

```python
# Write your own handler
# the event will contains all fields of the subscribed MV/Table plus two additional columns:
# - op: varchar. The change operations. Valid values: [Insert, UpdateInsert, Delete, UpdateDelete]. 
#                The reason why we have UpdateInsert and UpdateDelete is because RisingWave treats an UPDATE 
#                as a delete of the old value followed by an insert of the new value.
# - rw_timestamp: bigint. The Unix timestamp in milliseconds when the data was written.
def simple_event_handler(event: pd.DataFrame):
    for _, row in event.iterrows():
        # Trigger an action (e.g. place an order via REST API) when the avg_price exceeds 300
        if (row["op"] == "UpdateInsert" or row["op"] == "Insert") and row["avg_price"] >= 300:
                print(
                    f"{row['window_start']} - {row['window_end']}: {row['product']} avg price {row['avg_price']} exceeds 300")
                # ...


import threading

# Subscribe changes of a materialized view and feed it to your own handler.
# Run on_change in a separate thread without blocking the main thread.
threading.Thread(
    target=lambda: mv.on_change(
        # Pass your handler here
        handler = simple_event_handler,
        # Support DATAFRAME and RAW tuples here
        output_format=OutputFormat.DATAFRAME,
        # If set to True, progress of the subscription will be saved and can be recovered on python application crashed
        persist_progress=True, 
        # Maximal number of rows returned each time
        max_batch_size = 10)
    ).start()

# Subscribe changes of a table and print them to console.
# Run on_change in a separate thread without blocking the main thread.
threading.Thread(
    target=lambda: rw.on_change(
        subscribe_from="test",
        handler = lambda data: print(data),
        output_format=OutputFormat.RAW,
        persist_progress=False, 
        max_batch_size = 5)
    ).start()


# Future inserted data into the base table will be reflected in the subscriptions
# df = pd.DataFrame(
#     {
#         "product": ["foo", "bar"],
#         "price": [1000.2, 5000.4],
#         "ts": [datetime.strptime("2023-10-05 17:30:00", "%Y-%m-%d %H:%M:%S"), 
#                datetime.strptime("2023-10-05 17:31:20", "%Y-%m-%d %H:%M:%S")],
#     }
# )
# rw.insert(table_name="test", data=df)
```

You can refer to the `risingwave-py` [GitHub repo](https://github.com/risingwavelabs/risingwave-py) for more details.


## Use `psycopg2` to connect to RisingWave

In this section, we use the [`psycopg2`](https://pypi.org/project/psycopg2/) driver to connect to RisingWave.

### Run RisingWave

To learn about how to run RisingWave, see [Run RisingWave](/get-started.md#run-risingwave).

### Install the `psgcopg2` driver

For information about how to install `psycopg` and the difference between `psycopg` and `psycopg-binary`, see the [official psycopg documentation](https://www.psycopg.org/docs/install.html).


### Connect to RisingWave

To connect to RisingWave via `psycopg2`:

```python
import psycopg2

conn = psycopg2.connect(host="127.0.0.1", port=4566, user="root", dbname="dev")
```

### Create a source

The code below creates a source `walk` with the `datagen` connector. The `datagen` connector is used to generate mock data. The `walk` source consists of two columns, `distance` and `duration`, which respectively represent the distance and the duration of a walk. The source is a simplified version of the data that is tracked by smart watches.

```python
import psycopg2

conn = psycopg2.connect(host="localhost", port=4566, user="root", dbname="dev") # Connect to RisingWave.
conn.autocommit = True # Set queries to be automatically committed.

with conn.cursor() as cur:
    cur.execute("""
CREATE TABLE walk(distance INT, duration INT)
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
) FORMAT PLAIN ENCODE JSON""") # Execute the query.

conn.close() # Close the connection.
```

:::note

All the code examples in this guide include a section for connecting to RisingWave. If you perform multiple actions within one connection session, you do not need to repeat this section.

:::


### Create a materialized view

The code in this section creates a materialized view `counter` to capture the latest total distance and duration.

```python
import psycopg2

conn = psycopg2.connect(host="localhost", port=4566, user="root", dbname="dev")
conn.autocommit = True

with conn.cursor() as cur:
    cur.execute("""CREATE MATERIALIZED VIEW counter
    AS SELECT
    SUM(distance) as total_distance,
    SUM(duration) as total_duration
    FROM walk;""")

conn.close()
```

### Query a materialized view

The code in this section queries the materialized view `counter` to get real-time data.

```python
import psycopg2

conn = psycopg2.connect(host="localhost", port=4566, user="root", dbname="dev")
conn.autocommit = True

with conn.cursor() as cur:
    cur.execute("SELECT * FROM counter;")
    print(cur.fetchall())
conn.close()
```

## Use `sqlalchemy` to connect to RisingWave

In this section, we use the [SQLAlchemy](https://www.sqlalchemy.org) driver to connect to RisingWave.

### Run RisingWave

To learn about how to run RisingWave, see [Run RisingWave](/get-started.md#run-risingwave).

### Install necessary Python packages

Ensure you have Python3 installed.

For more information about `sqlalchemy`, see the [SQLAlchemy](https://www.sqlalchemy.org). Refer to the documentation version that corresponds to the version of SQLAlchemy that you run. 

For information about how to install `psycopg-binary`, see the [official psycopg documentation](https://www.psycopg.org/docs/install.html).

```terminal
pip3 install SQLAlchemy sqlalchemy-risingwave psycopg2-binary
```

### Connect to RisingWave

To connect to RisingWave via `sqlalchemy`:

```python
DB_URI = 'risingwave+psycopg2://root@risingwave-standalone:4566/dev'

engine = create_engine(DB_URI)
```

Note that RisingWave does not provide direct compatibility with `sqlaclehmy-postgres` so `risingwave+psycopg2` is used as the URI scheme. The rest of the URL follows the same format as the PostgreSQL driver. 

### Create a source

The code below creates a table `users` using the engine created in the previous section.

```python
with engine.connect() as conn:
    conn.execute("""CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY,
    name VARCHAR,
    age INTEGER)""")
```

You can create materialized views and query from materialized views using the same format shown above. 

