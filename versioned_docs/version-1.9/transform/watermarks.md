---
id: watermarks
slug: /watermarks
title: Watermarks
---
<head>
  <link rel="canonical" href="https://docs.risingwave.com/docs/current/watermarks/" />
</head>

In stream processing, watermarks are integral when using event time processing logic with event time based operations. Watermarks are like markers or signals that track the progress of event time, allowing you to process events within their corresponding time windows. A watermark is an estimate of the maximum event time observed so far, or a threshold indicating that events received so far have a timestamp later than or equal to the current watermark. Events that arrive with a timestamp earlier than the current watermark are considered late and are not processed within its time window.

Let us go over an example on how watermarks are generated and utilized during window computations. Say the following events and their corresponding event-time timestamps arrive.

|Event|Timestamp|
|-----|---------|
|Event F| 11:59:30 AM |
|Event G| 12:00:00 PM |
|Event H| 12:00:10 PM |
|Event I| 11:59:50 PM |

Consider a scenario where the watermark is set as the maximum event time observed so far minus 10 seconds. So the following watermarks will be generated.

|Event|Timestamp|Watermark|
|-----|---------|---------|
|Event F| 11:59:30 AM | 11:59:20 AM |
|Event G| 12:00:00 PM | 11:59:50 AM |
|Event H| 12:00:11 PM | 12:00:01 PM |
|Event I| 11:59:50 PM | 12:00:01 PM |

Now let us assume there is a window counting events for the hour ending at 12 PM. Therefore, the window will wait until there is a watermark with a timestamp of at least 12:00:00 PM before producing results. As a result, Events F and G are considered on-time and will be included in the calculation. Events H and I will not be included in the calculation for the window ending at 12 PM, with Event I being considered late since its event time timestamp is earlier than the current watermark timestamp.

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

    Supported `time_unit` values include: second, minute, hour, day, month, and year. For more details, see the `interval` data type under [Overview of data types](/sql/sql-data-types.md).


:::note

Currently, RisingWave only supports using one of the columns from the table as the watermark column. To use nested fields e.g. fields in `STRUCT`, or perform expression evaluation on the input rows e.g. casting data types, please refer to [generated columns](/sql/query-syntax/query-syntax-generated-columns.md).

:::

### Example

The following query generates the watermark as the latest timestamp observed in `order_time` minus 5 seconds.

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
) FORMAT PLAIN ENCODE JSON;
```

The following query uses a [generated column](/sql/query-syntax/query-syntax-generated-columns.md) to extract the timestamp column first, and then generates the watermark using it.

```sql
CREATE SOURCE s2 (
    order_id BITINT,
    detail STRUCT<
        product VARCHAR,
        user VARCHAR,
        price DOUBLE PRECISION
        order_time TIMESTAMP
    >,
    order_time AS (detail).order_time,
    WATERMARK FOR order_time AS order_time - INTERVAL '5' SECOND
) WITH ( ... );
```
