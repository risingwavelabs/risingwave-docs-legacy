---
id: data-type-casting
slug: /data-type-casting
title: Casting
---
<head>
  <link rel="canonical" href="https://docs.risingwave.com/docs/current/data-type-casting/" />
</head>

Certain data types can be cast to and from other types implicitly or explicitly.

- 🟢 Implicit: Values can be automatically converted to the target type.
- 🟠 Assignment: Values can be automatically converted when inserted to a column of the target type.
- 🔷 Explicit: Values can be converted to the target type only when you use the [`cast`](/sql/functions-operators/sql-function-cast.md) function or the `::` operator.

| From / To | boolean | smallint | integer | bigint | numeric | real | double | varchar | date | timestamp | timestamp with time zone | time | interval | bytea | jsonb | rw_int256 |
|-|-|-|-|-|-|-|-|-|-|-|-|-|-|-|-|--|
| boolean |  | ✖️ | 🔷 | ✖️ | ✖️ | ✖️ | ✖️ | 🟠 | ✖️ | ✖️ | ✖️ | ✖️ | ✖️ | ✖️ | ✖️ | ✖️ |
| smallint | ✖️ |  | 🟢 | 🟢 | 🟢 | 🟢 | 🟢 | 🟠 | ✖️ | ✖️ | ✖️ | ✖️ | ✖️ | ✖️ | ✖️ | 🟢 |
| integer | 🔷 | 🟠 |  | 🟢 | 🟢 | 🟢 | 🟢 | 🟠 | ✖️ | ✖️ | ✖️ | ✖️ | ✖️ | ✖️ | ✖️ | 🟢 |
| bigint | ✖️ | 🟠 | 🟠 |  | 🟢 | 🟢 | 🟢 | 🟠 | ✖️ | ✖️ | ✖️ | ✖️ | ✖️ | ✖️ | ✖️ | 🟢 |
| numeric | ✖️ | 🟠 | 🟠 | 🟠 |  | 🟢 | 🟢 | 🟠 | ✖️ | ✖️ | ✖️ | ✖️ | ✖️ | ✖️ | ✖️ | ✖️ |
| real | ✖️ | 🟠 | 🟠 | 🟠 | 🟠 |  | 🟢 | 🟠 | ✖️ | ✖️ | ✖️ | ✖️ | ✖️ | ✖️ | ✖️ | ✖️ |
| double | ✖️ | 🟠 | 🟠 | 🟠 | 🟠 | 🟠 |  | 🟠 | ✖️ | ✖️ | ✖️ | ✖️ | ✖️ | ✖️ | ✖️ | ✖️ |
| varchar | 🔷 | 🔷 | 🔷 | 🔷 | 🔷 | 🔷 | 🔷 |  | 🔷 | 🔷 | 🔷 | 🔷 | 🔷 | 🔷 | 🔷 | 🔷 |
| date | ✖️ | ✖️ | ✖️ | ✖️ | ✖️ | ✖️ | ✖️ | 🟠 |  | 🟢 | 🟢 | ✖️ | ✖️ | ✖️ | ✖️ | ✖️ |
| timestamp | ✖️ | ✖️ | ✖️ | ✖️ | ✖️ | ✖️ | ✖️ | 🟠 | 🟠 |  | 🟢 | 🟠 | ✖️ | ✖️ | ✖️ | ✖️ |
| timestamp with time zone | ✖️ | ✖️ | ✖️ | ✖️ | ✖️ | ✖️ | ✖️ | 🟠 | 🟠 | 🟠 |  | 🟠 | ✖️ | ✖️ | ✖️ | ✖️ |
| time | ✖️ | ✖️ | ✖️ | ✖️ | ✖️ | ✖️ | ✖️ | 🟠 | ✖️ | ✖️ | ✖️ |  | 🟢 | ✖️ | ✖️ | ✖️ |
| interval | ✖️ | ✖️ | ✖️ | ✖️ | ✖️ | ✖️ | ✖️ | 🟠 | ✖️ | ✖️ | ✖️ | 🟠 |  | ✖️ | ✖️ | ✖️ |
| bytea | ✖️ | ✖️ | ✖️ | ✖️ | ✖️ | ✖️ | ✖️ | 🟠 | ✖️ | ✖️ | ✖️ | ✖️ | ✖️ |  | ✖️ | ✖️ |
| jsonb | 🔷 | 🔷 | 🔷 | 🔷 | 🔷 | 🔷 | 🔷 | 🟠 | ✖️ | ✖️ | ✖️ | ✖️ | ✖️ | ✖️ |  | ✖️ |
| rw_int256 | ✖️ | ✖️ | ✖️ | ✖️ | ✖️ | ✖️ | 🔷 | 🟠 | ✖️ | ✖️ | ✖️ | ✖️ | ✖️ | ✖️ | ✖️ |  |

|From type|Implicit|Assignment|Explicit|
|-|-|-|-|
|boolean||varchar<br/>|integer<br/>|
|smallint|integer<br/>bigint<br/>numeric<br/>real<br/>double<br/>rw_int256|varchar||
|integer|bigint<br/>numeric<br/>real<br/>double<br/>rw_int256|smallint|boolean|
|bigint|numeric<br/>real<br/>double<br/>rw_int256|smallint<br/>integer<br/>varchar||
|numeric|real<br/>double|smallint<br/>integer<br/>bigint<br/>varchar||
|real|double|smallint<br/>integer<br/>bigint<br/>numeric<br/>varchar||
|double||smallint<br/>integer<br/>bigint<br/>numeric<br/>real<br/>varchar||
|varchar|||boolean<br/>smallint<br/>integer<br/>bigint<br/>numeric<br/>real<br/>double<br/>date<br/>timestamp<br/>timestamp with time zone<br/>time<br/>interval<br/>bytea<br/>jsonb<br/>rw_int256 |
|date|timestamp<br/>timestamp with time zone|varchar||
|timestamp|timestamp with time zone|varchar<br/>date<br/>time||
|timestamp with time zone||varchar<br/>date<br/>timestamp<br/>time||
|time|interval|varchar||
|interval||varchar<br/>time||
|bytea||varchar||
|jsonb|boolean<br/>smallint<br/>integer<br/>bigint<br/>numeric<br/>real<br/>double|varchar||
|rw_int256||varchar||

:::note

Structs can be casted to structs explictly or implicitly if the nested expressions and types can be casted.

:::

<!--You can find the casting relations here: https://github.com/risingwavelabs/risingwave/blob/be868cc6e479de30be78c98b77ab3ad686938b89/src/frontend/src/expr/type_inference/cast.rs#L201-->