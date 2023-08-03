---
id: emit-on-window-close
slug: /emit-on-window-close
title: Emit on Window Close
---

:::caution Experimental feature
⚠️ Experimental feature, there may be breaking changes in the future.
:::

In streaming systems, there are usually two kinds of triggering policy for window calculations:

- **Emit immediately**: calculates and emits partial window results even when the window has not closed yet.
- **Emit on window close**: generates a final result when the window closes and will no longer change.

Taking the following query as an example,

```sql
SELECT window_start, COUNT(*)
FROM TUMBLE(events, event_time, INTERVAL '1' MINUTE)
GROUP BY window_start;
```

- **Emit immediately:** when each barrier (every 1s by default) passes, the aggregation operator will emit a new `count(*)` result downstream, which is then reflected in the materialized view or outputted to external systems.
- **Emit on window close:** when the watermark defined on `event_time` exceeds the end time of a time window, the aggregation operator emits the final immutable aggregation result downstream.

RisingWave chooses emit-on-update as the default behavior in order to guarentee consistency between materialized views and base tables. This behavior is also consistent with the definition of *view* in SQL.

However, in some situations, we might want to choose emit-on-window-close as the triggering policy for queries. Such scenarios include:

- The target downstream system of sink is append-only (such as Kafka or S3). We want to write into downstream only after the result is finally determined, instead of writing and updating for multiple times.
- Some calculations in the query cannot efficiently perform incremental updates (such as percentile, etc.). For better performance, we want only to trigger a calculation when the window closes.

To meet these requirements, RisingWave supports turning queries into emit-on-window-close semantics via the `EMIT ON WINDOW CLOSE` clause. At the same time, a watermark must be defined on the data source, because this determines when the window can close. For more explanation on watermark, please refer to [Watermark](/transform/watermarks.md).

Taking the above query as an example,

```sql
CREATE MATERIALIZED VIEW window_count AS
SELECT window_start, COUNT(*)
FROM TUMBLE(events, event_time, INTERVAL '1' MINUTE)
GROUP BY window_start
EMIT ON WINDOW CLOSE;
```

Accordingly, a watermark needs to be defined for the data source events.

```sql
CREATE SOURCE t (
    event_time TIMESTAMP,
    <... other fields ...>
    WATERMARK FOR event_time AS event_time - INTERVAL '5 minutes'
) WITH ( ... );
```

After such modification, the results in `window_count` will not include any partial aggregation results of the latest window. Instead, a final result only appears when the `event_time` watermark exceeds the end time of the window.

## What queries can have better performance under emit-on-window-close?

Currently, RisingWave supports `emit on window close` for any query through a generic implementation. However, for the following queries, RisingWave can use specialized operators to achieve better performance.

- Windowed aggregation

```sql
CREATE MATERIALIZED VIEW mv AS
SELECT
    window_start, MAX(foo)
FROM TUMBLE(t, tm, INTERVAL '1 hour')
GROUP BY window_start
EMIT ON WINDOW CLOSE;
```

- SQL window function

```sql
CREATE MATERIALIZED VIEW mv2 AS
SELECT
    tm, foo, bar,
    LEAD(foo, 1) OVER (PARTITION BY bar ORDER BY tm) AS l1,
    LEAD(foo, 3) OVER (PARTITION BY bar ORDER BY tm) AS l2
FROM t
EMIT ON WINDOW CLOSE;
```