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

This feature allows you to monitor all data changes without relying on external event stores like Kafka. Compared to the Kafka sink or other event store sinks, a subscription requires fewer components and thus, less maintenance.

:::info Public Preview
This feature is in the public preview stage, meaning it's nearing the final product but is not yet fully stable. If you encounter any issues or have feedback, please contact us through our [Slack channel](https://www.risingwave.com/slack). Your input is valuable in helping us improve the feature. For more information, see our [Public preview feature list](/product-lifecycle/#features-in-the-public-preview-stage).
:::

## Manage subscription

Use the syntax below to create, drop or alter subscription.

### Create subscription

To create a subscription, use the syntax below:

```sql
CREATE SUBSCRIPTION <subscription_name> FROM <table_or_mv_name> WITH (
retention = '<duration>'
);
```

The `FROM` clause must specify either a table or a materialized view (mv).

The `retention` parameter should be provided as a string in the format of an interval. It represents the duration for which incremental data will be retained. Any incremental data that exceeds the specified retention duration will be automatically deleted and will no longer be accessible.

### Drop subscription

To drop a subscription, use the syntax below:

```sql
DROP SUBSCRIPTION <subscription_name>;
```

### Alter subscription

To rename a subscription, change the owner, or set a new schema, use the syntax below:

```sql
ALTER SUBSCRIPTION <subscription_name>
    [ RENAME TO <new_subscription_name> ]
    [ OWNER TO <new_owner> ]
    [ SET SCHEMA <new_schema_name> ]
    ;
```

## Subscription cursor

A subscription cursor is a unit used to consume data from a subscription. In RisingWave, it’s a tool specifically designed to work in conjunction with a subscription, differing from the general cursor.

In RisingWave, the subscription cursor allows you to specify a specific starting point within the data of the subscription. Once the subscription cursor is created, you can use a loop to fetch and consume the data starting from that point onwards. A subscription can have multiple subscription cursors, which can be used to consume different ranges or intervals of data from the subscription.

### Syntax

The syntax of creating a subscription cursor is as follows:

```sql
DECLARE cursor_name SUBSCRIPTION CURSOR FOR subscription_name [since_clause | FULL];
```

The `since_clause` is used to specify the starting point for reading data. By setting this clause, you can control the range of data that is returned, allowing you to retrieve only the incremental data or data starting from a specific time or event. 

Below are the available choices for `since_clause`. If you don’t specify the `since_clause`, the returned data will just include the incremental data after declaration, which equals to the first choice below.

1. `since now()/proctime()` : The returned data will include only the incremental data starting from the time of declaration.

2. `since begin()` : The returned data will include the oldest incremental data available, typically starting from the beginning of the subscription's retention period.

3. `since unix_ms` : Starts reading from the first time point greater than or equal to the specified `unix_ms` value. It's important to note that the `unix_ms` value should fall within the range of `now() - subscription's retention` and `now`.

If you specify `FULL` instead of the `since_clause`, the subscription cursor starts consuming data from stock.

### Fetch from cursor

:::note
FETCH from cursor function is currently only supported in the PSQL simple query mode. If you are using components like JDBC that default to the extended query mode, please manually set the mode to simple query mode.
:::

#### Non-blocking data fetching

After creating a subscription cursor, you can fetch the data using the `FETCH NEXT FROM cursor_name` or `FETCH n FROM cursor_name` command. These are non-blocking methods for retrieving data. Even if no new data is available, it returns an empty row immediately. When new incremental data is available, calling this statement again will return the latest row of data.

1. `FETCH NEXT FROM cursor_name` command returns one row of incremental data from the subscribed table.

    ```sql
    FETCH NEXT FROM cur;

    ----RESULT
    t1.v1 | t1.v2 | t1.v3 |    t1.op     |  rw_timestamp  
    -------+-------+-------+--------------+---------------
        1 |     1 |     1 | UpdateDelete | 1715669376304
    (1 row)
    ```

2. `FETCH n FROM cursor_name` command returns multiple rows at once from the cursor. `n` is the number of rows to fetch. `FETCH NEXT` is equivalent to `FETCH 1`.

    ```sql
    FETCH n FROM cursor_name;
    ```

The `op` column in the result stands for the change operations. It has four options: `insert`, `update_insert`, `delete`,  and `update_delete`. For a single UPDATE statement, the subscription log will contain two separate rows: one with `update_insert` and another with `update_delete`. This is because RisingWave treats an UPDATE as a delete of the old value followed by an insert of the new value. As for `rw_timestamp`, it corresponds to the Unix timestamp in milliseconds when the data was written.

#### Blocking data fetching

When waiting for new subscription data to arrive, you can block the `FETCH` operation with an optional timeout until new data is available, instead of returning an empty result. The `timeout` value should be a string in the interval format.

```sql
FETCH NEXT/n FROM cursor_name WITH (timeout = 'xx');
```

1. For large data sets:

    If the subscription has a large number of values and the fetch operation is set to retrieve many rows, the fetch operation might exceed the specified `timeout`. In this case, it will return all values currently fetched during the timeout process.

    If `timeout` is not set for the case of large data sets, it is equivalent to `timeout = u64::MAX`.

2. No new data:

    - Previously fetched rows: If you have already fetched more than one row, the fetch statement will not block. It will return all the values that have been fetched so far.

    - No values available: If no values are currently available, the fetch operation will block until new data becomes available or until the specified timeout is exceeded.

    If `timeout` is not set for the case of no new data, it is equivalent to `timeout = 0`.

#### Order of the fetched data

- For data with different `rw_timestamp`, values are returned in the order the events occurred.

- For data with the same `rw_timestamp`, the order matches the event sequence if the data belongs to the same primary key in the subscribed materialized view or table.

- For data with the same `rw_timestamp` but different primary keys, the order may not reflect the exact event sequence.

### Show subscription cursors

To show all subscription cursors in the current session, use the syntax below:

```sql
SHOW SUBSCRIPTION CURSORS;

------RESULT
 Name | SubscriptionName 
------+------------------
 cur2 | sub
 cur  | sub
(2 rows)
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
 v1 | v2 | v3 |   op   | rw_timestamp 
----+----+----+--------+--------------
  1 |  1 |  1 | Insert |             
(1 row)
```

 Then we can update table `t1` and fetch again to view the changes:

```sql

update t1 set v3 = 10 where v1 = 1;
fetch next from cur;

----RESULT
 t1.v1 | t1.v2 | t1.v3 |     t1.op     |  rw_timestamp  
-------+-------+-------+---------------+---------------
     1 |     1 |     1 | UpdateDelete  | 1715669376304
(1 row)

fetch next from cur;
----RESULT
 t1.v1 | t1.v2 | t1.v3 |     t1.op     |  rw_timestamp  
-------+-------+-------+---------------+---------------
     1 |     1 |    10 | UpdateInsert  | 1715669376304
(1 row)
```

We can also create another subscription cursor to specify `since_clause` .  Let’s use `since unix_ms` to rebuild the cursor:

```sql
declare cur2 subscription cursor for sub since 1715669376304;
fetch next from cur2;

----RESULT
 t1.v1 | t1.v2 | t1.v3 |     t1.op     |  rw_timestamp  
-------+-------+-------+---------------+---------------
     1 |     1 |     1 | UpdateDelete  | 1715669376304
(1 row)


fetch next from cur2;
----RESULT
 t1.v1 | t1.v2 | t1.v3 |     t1.op     |  rw_timestamp  
-------+-------+-------+---------------+---------------
     1 |     1 |    10 | UpdateInsert  | 1715669376304
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
) ON CONFLICT OVERWRITE;
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
        cur.execute("INSERT INTO subscription_progress (sub_name, progress)", (sub_name, progress, progress))
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
