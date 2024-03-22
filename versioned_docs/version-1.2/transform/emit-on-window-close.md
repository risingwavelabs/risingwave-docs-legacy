---
id: emit-on-window-close
slug: /emit-on-window-close
title: Emit on window close
---
<head>
  <link rel="canonical" href="https://docs.risingwave.com/docs/current/emit-on-window-close/" />
</head>

:::note Beta Feature
Emit on window close is currently in Beta. Please contact us if you encounter any issues or have feedback.
:::

In streaming systems, there are typically two types of triggering policies for window calculations:

- **Emit on update**: This policy calculates and emits partial window results even before the window is closed.
- **Emit on window close**: This policy generates a final result when the window closes and will remain unchanged thereafter.

Taking the following query as an example,

```sql
SELECT window_start, COUNT(*)
FROM TUMBLE(events, event_time, INTERVAL '1' MINUTE)
GROUP BY window_start;
```

- **Emit on update:** With this policy, the aggregation operator emits a new count(*) result downstream whenever each barrier passes (default interval is 1 second). This updated count is then reflected in the materialized view or outputted to external systems.
- **Emit on window close:** When the watermark defined on event_time surpasses the end time of a time window, the aggregation operator emits the final immutable aggregation result downstream. This result represents the complete aggregation for the window and is not subject to further changes.

RisingWave defaults to the emit-on-update behavior to ensure consistency between materialized views and base tables. This choice aligns with the SQL definition of view and helps maintain coherence across the system.

However, in certain scenarios, selecting the emit-on-window-close triggering policy for queries may be more suitable. These situations include:

- When the downstream system of the sink is append-only, such as Kafka or S3, and we prefer to write the result only once it is finalized, rather than performing multiple writes and updates.
- When certain calculations in the query cannot efficiently handle incremental updates, such as percentile calculations, and we want to trigger the calculation only when the window closes for better performance.

To fulfill these requirements, RisingWave offers support for transforming queries into emit-on-window-close semantics using the `EMIT ON WINDOW CLOSE` clause. Additionally, a watermark must be defined on the data source, as it determines when the window can be closed. For a more detailed explanation of watermarks, please refer to [Watermarks](/transform/watermarks.md).

We can modify the query above to use emit-on-window-close semantics:

```sql
CREATE MATERIALIZED VIEW window_count AS
SELECT window_start, COUNT(*)
FROM TUMBLE(events, event_time, INTERVAL '1' MINUTE)
GROUP BY window_start
EMIT ON WINDOW CLOSE;
```

Note that a watermark needs to be defined for the data source events.

```sql
CREATE SOURCE t (
    event_time TIMESTAMP,
    <... other fields ...>
    WATERMARK FOR event_time AS event_time - INTERVAL '5 minutes'
) WITH ( ... );
```

After making this modification, the `window_count` results will no longer include any partial aggregation results from the most recent window. Instead, a final result will only be delivered when the `event_time` watermark surpasses the end time of the window.

## What queries can achieve better performance with the emit-on-window-close triggering policy?

RisingWave supports the emit-on-window-close" triggering policy for any query. However, for the following specific types of queries, RisingWave can utilize specialized operators to enhance performance further.

1. Windowed aggregation

```sql
CREATE MATERIALIZED VIEW mv AS
SELECT
    window_start, MAX(foo)
FROM TUMBLE(t, tm, INTERVAL '1 hour')
GROUP BY window_start
EMIT ON WINDOW CLOSE;
```

1. SQL window functions

```sql
CREATE MATERIALIZED VIEW mv2 AS
SELECT
    tm, foo, bar,
    LEAD(foo, 1) OVER (PARTITION BY bar ORDER BY tm) AS l1,
    LEAD(foo, 3) OVER (PARTITION BY bar ORDER BY tm) AS l2
FROM t
EMIT ON WINDOW CLOSE;
```
