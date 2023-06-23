---
id: sql-watermarks
slug: /sql-watermarks
title: Watermarks
---

In stream processing, watermarks are integral when using event time processing logic with event time based operations. Watermarks are like markers or signals that track the progress of event time, allowing you to process events within their corresponding time windows. A watermark is an estimate of the maximum event time observed so far, or a threshold indicating that events received so far have a timestamp later than or equal to the current watermark. Events that arrive with a timestamp earlier than the current watermark are considered late and are not processed within its time window. 

## Syntax

Watermarks can be generated directly on sources.

The syntax of the `WATERMARK` clause in RisingWave is as follows:

```sql
WATERMARK FOR column_name as expr
```

`column_name` is a column that is created when generating the source, usually the event time column.

`expr` specifies the watermark generation strategy. The return type of the watermark must be of type `timestamp`. A watermark will be updated if the return value is greater than the current watermark. 

For example, the watermark generation strategy can be specified as:

* Maximum observed timestamp

    ```sql
    WATERMARK FOR time_col as time_col
    ```

* Maximum observed timestamp with a delay

    ```sql
    WATERMARK FOR time_col as time_col - INTERVAL 'string' time_unit
    ```

    Supported `time_unit` values include: second, minute, hour, day, month, and year. For more details, see the `interval` data type under [Overview of data types](sql-data-types.md).

### Example

We can generate the watermark as the latest timestamp observed in `order_time` minus 5 seconds.

```sql
CREATE SOURCE s1 (
    product VARCHAR,
    user VARCHAR,
    price DOUBLE PRECISION
    order_time TIMESTAMP,
    WATERMARK FOR order_time AS order_time - INTERVAL '5' SECOND
) WITH ( 
    connector = 'kafka',
    topic = 'test_topic',
    properties.bootstrap.server = 'message_queue:29092',
    scan.startup.mode = 'earliest'
) ROW FORMAT JSON;
```