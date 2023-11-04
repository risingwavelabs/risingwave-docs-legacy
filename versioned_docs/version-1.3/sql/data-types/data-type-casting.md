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

:::note

Structs can be casted to structs explictly or implicitly if the nested expressions and types can be casted.

:::

<!--You can find the casting relations here: https://github.com/risingwavelabs/risingwave/blob/be868cc6e479de30be78c98b77ab3ad686938b89/src/frontend/src/expr/type_inference/cast.rs#L201-->