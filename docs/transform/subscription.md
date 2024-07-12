---
id: subscription
title: Subscription
description: Introduce subscription and subscription cursors.
slug: /subscription
---
<head>
  <link rel="canonical" href="https://docs.risingwave.com/docs/current/subscription/" />
</head>

Subscription is used to pull data change records for a specific table or materialized view (MV). The data from a subscription includes both the existing data in the table at the time of subscription creation and the incremental change records in the table after the subscription is created. You can use the method of creating a subscription cursor to retrieve the full data set or the incremental data set after a specified starting point.

This feature allows you to monitor all data changes without relying on external event stores like Kafka. Compared to the Kafka sink or other event store sinks, subscription requires fewer component and thus, less maintenance.

## Create subscription

Use the syntax below to create subscription.

```sql
CREATE SUBSCRIPTION <subscription_name> FROM <table_or_mv_name> WITH (
retention = '<duration>'
);
```

The `FROM` clause must specify either a table or a materialized view (mv).

The `retention` parameter should be provided as a string in the format of an interval. It represents the duration for which incremental data will be retained. Any incremental data that exceeds the specified retention duration will be automatically deleted and will no longer be accessible.

## Subscription cursor

A subscription cursor is a unit used to consume data from a subscription. In RisingWave, it’s a tool specifically designed to work in conjunction with a subscription, differing from the general cursor.

In RisingWave, the subscription cursor allows you to specify a specific starting point within the data of the subscription. Once the subscription cursor is created, you can use a loop to fetch and consume the data starting from that point onwards. A subscription can have multiple subscription cursors, which can be used to consume different ranges or intervals of data from the subscription.

### Syntax

The syntax of creating a subscription cursor is as follows:

```sql
DECLARE cursor_name SUBSCRIPTION CURSOR FOR subscription_name [since_clause];
```

The `since_clause` is used to specify the starting point for reading data. By setting this clause, you can control the range of data that is returned, allowing you to retrieve only the incremental data or data starting from a specific time or event. 

If you don’t specify the `since_clause`, the returned data will include both the historical data up to the time of declaration and the incremental data after declaration. If you want to specify it, here are the available choices:

1. `since now()/proctime()` : The returned data will include only the incremental data starting from the time of declaration.

2. `since begin()` : The returned data will include the oldest incremental data available, typically starting from the beginning of the subscription's retention period.

3. `since unix_ms` : Starts reading from the first time point greater than or equal to the specified `unix_ms` value. It's important to note that the `unix_ms` value should fall within the range of `now() - subscription's retention` and `now`.

### Fetch from cursor

#### `FETCH NEXT FROM cursor_name`

After creating a subscription cursor, you can fetch the data by the `FETCH NEXT FROM cursor_name` command. Then you will see a result like  below:

```sql
FETCH NEXT FROM cur;

----RESULT
 t1.v1 | t1.v2 | t1.v3 | t1.op | rw_timestamp  
-------+-------+-------+-------+---------------
     1 |     1 |     1 |     4 | 1715669376304
(1 row)
```

The `op` column in the result stands for the change operations. It has four options: `op = 1` (insert), `op = 2` (delete), `op = 3` (update_insert),  and `op = 4` (update_delete). The `update` statement here is transformed into `update_insert` and `update_delete` operations. As for `rw_timestamp`, it corresponds to the Unix timestamp in milliseconds when the data was written.

Note that each time `FETCH NEXT FROM cursor_name` is called, it will return one row of incremental data from the subscribed table. It does not return all the incremental data at once, but requires the user to repeatedly call this statement to fetch the data.

This method is non-blocking. Even if the current table has no new incremental data, `FETCH NEXT FROM cursor_name` will not block, but will return an empty row. When new incremental data is generated, calling this statement again will return the latest row of data.

#### `FETCH n FROM cursor_name`

You also can fetch multiple rows at once from the cursor using the `FETCH n FROM cursor_name` command. `n` is the number of rows to fetch.

```sql
FETCH n FROM cursor_name;
```

### Examples

Let’s create a table `t1` and subscribe this table, then create a cursor for this subscription.

```sql
-- Create a table and insert some data.
create table t1(v1 int, v2 int, v3 int);
insert into t1 values(1,1,1);

-- Create a subscription.
create subscription sub from t1 with (retention = '1D');

-- Create a subscription cursor.
declare cur subscription cursor for sub;
```

After creation, we can use the `FETCH NEXT FROM cursor_name`  statement to fetch data from this cursor:

```sql
fetch next from cur;
   
----RESULT
v1 | v2 | v3 | op | rw_timestamp 
----+----+----+----+--------------
  1 |  1 |  1 |  1 |             
(1 row)
```

 Then we can update table `t1` and fetch again to view the changes:

```sql

update t1 set v3 = 10 where v1 = 1;
fetch next from cur;

----RESULT
 t1.v1 | t1.v2 | t1.v3 | t1.op | rw_timestamp  
-------+-------+-------+-------+---------------
     1 |     1 |     1 |     4 | 1715669376304
(1 row)

fetch next from cur;
----RESULT
 t1.v1 | t1.v2 | t1.v3 | t1.op | rw_timestamp  
-------+-------+-------+-------+---------------
     1 |     1 |    10 |     3 | 1715669376304
(1 row)
```

We can also create another subscription cursor to specify `since_clause` .  Let’s use `since unix_ms` to rebuild the cursor:

```sql
declare cur2 subscription cursor for sub since 1715669376304;
fetch next from cur2;

----RESULT
 t1.v1 | t1.v2 | t1.v3 | t1.op | rw_timestamp  
-------+-------+-------+-------+---------------
     1 |     1 |     1 |     4 | 1715669376304
(1 row)


fetch next from cur2;
----RESULT
 t1.v1 | t1.v2 | t1.v3 | t1.op | rw_timestamp  
-------+-------+-------+-------+---------------
     1 |     1 |    10 |     3 | 1715669376304
(1 row)
```

## Subscribing via Postgres driver

For this feature, you only need to use [the Postgres driver](https://docs.risingwave.com/docs/dev/client-libraries-overview/), and no extra dependencies are required.

Here’s an example using Python and [psycopg2](https://pypi.org/project/psycopg2/).

```python
import psycopg2
import time

def main():
    # Connect to the PostgreSQL database
    conn = psycopg2.connect(
        host="localhost",
        port="4566",
        user="root",
        database="dev"
    )

    try:
        # Create a cursor object
        cur = conn.cursor()

        # Declare a cursor for the subscription
        cur.execute("DECLARE cur SUBSCRIPTION CURSOR FOR sub_users;")

        while True:
            # Fetch the next row from the cursor
            cur.execute("FETCH NEXT FROM cur;")
            row = cur.fetchone()

            if row is None:
                # Sleep for 1 second if no row is fetched
                time.sleep(1)
                continue

						# Replace with your event handling logic
            print("Row fetched:", row)

    finally:
        # Close the cursor and connection
        print("Terminated")
        cur.close()
        conn.close()

if __name__ == "__main__":
    main()
```

Example output:

```python
Row fetched: (1, 'Alice', 30, 1, 1716434906890)
Row fetched: (2, 'Bob', 25, 1, 1716434909889)
Row fetched: (3, 'Charlie', 35, 1, 1716434912889)
Row fetched: (4, 'Diana', 28, 1, 1716434920889)
```

## Exactly-once delivery

The persistent nature of subscriptions allows the subscriber to resume from a specific point in time (`rw_timestamp`) without data loss after a failure recovery. We also guarantee no duplicates in subscriptions, thus ensuring exactly-once delivery.

### Persisting the consumption progress

To achieve exactly-once delivery, it’s required to periodically persist the timestamp in storage. We recommend using RisingWave as the store, as no extra component is needed.

First, we need to create a table for storing the progress.

```sql
CREATE TABLE IF NOT EXISTS subscription_progress (
    sub_name VARCHAR PRIMARY KEY,
    progress BIGINT
);
```

Here's an example python code for retrieving and updating the consumption progress:

```python
def get_last_progress(conn, sub_name):
    with conn.cursor() as cur:
        cur.execute("SELECT progress FROM subscription_progress WHERE sub_name = %s", (sub_name,))
        result = cur.fetchone()
        return result[0] if result else None

def update_progress(conn, sub_name, progress):
    with conn.cursor() as cur:
        cur.execute("""
            INSERT INTO subscription_progress (sub_name, progress)
            VALUES (%s, %s)
            ON CONFLICT (sub_name) DO UPDATE SET progress = %s
        """, (sub_name, progress, progress))
        cur.execute("FLUSH")
        conn.commit()
```

The client needs to retrieve the last progress during bootstrapping and periodically store the progress.

```python
# Fetch the last progress from subscription_progress table
last_progress = get_last_progress(conn, sub_name)

with conn.cursor() as cur:
    if last_progress is not None:
        cur.execute(
            "DECLARE cur SUBSCRIPTION CURSOR FOR {} SINCE {}".format(sub_name, last_progress))
    else:
        cur.execute(
            "DECLARE cur SUBSCRIPTION CURSOR FOR {};".format(sub_name))

    while True:
        cur.execute("FETCH NEXT FROM cur")
        row = cur.fetchone()
        last_progress = row[0]  # 'rw_timestamp' is the progress indicator

        ...
        
        if trigger_update():
            update_progress(conn, sub_name, last_progress)
```

## Use case

Potential use cases for subscriptions are as follows. If you have explored more use cases, feel free to share them with us in our [Slack channel](https://www.risingwave.com/slack).

- **Real-time alerting/notification:** Subscribers can employ sophisticated alerting rules to detect abnormal events and notify downstream applications.
- **Event-driven architectures:** Develop event-driven systems that react to changes based on specific business logic, such as synchronizing data to microservices.
