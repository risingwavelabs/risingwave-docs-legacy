---
id: data-type-casting
slug: /data-type-casting
title: Casting
---
<head>
  <link rel="canonical" href="https://docs.risingwave.com/docs/current/data-type-casting/" />
</head>

Certain data types can be cast to and from other types implicitly or explicitly.

- **Implicitly cast to**: Values can be automatically converted to the target type.
- **Assigned to**: Values can be automatically converted when inserted to a column of the target type.
- **Explicitly cast to**: Values can be converted to the target type using explicit [Type casts](/sql/query-syntax/query-syntax-value-exp.md#type-casts).

|From type|Implicitly cast to|Assigned to|Explicitly cast to|
|-|-|-|-|
|**boolean**||varchar<br/>|integer<br/>|
|**smallint**|integer<br/>bigint<br/>numeric<br/>real<br/>double<br/>rw_int256|varchar||
|**integer**|bigint<br/>numeric<br/>real<br/>double<br/>rw_int256|smallint|boolean|
|**bigint**|numeric<br/>real<br/>double<br/>rw_int256|smallint<br/>integer<br/>varchar||
|**numeric**|real<br/>double|smallint<br/>integer<br/>bigint<br/>varchar||
|**real**|double|smallint<br/>integer<br/>bigint<br/>numeric<br/>varchar||
|**double**||smallint<br/>integer<br/>bigint<br/>numeric<br/>real<br/>varchar||
|**varchar**|||boolean<br/>smallint<br/>integer<br/>bigint<br/>numeric<br/>real<br/>double<br/>date<br/>timestamp<br/>timestamp with time zone<br/>time<br/>interval<br/>bytea<br/>jsonb<br/>rw_int256 |
|**date**|timestamp<br/>timestamp with time zone|varchar||
|**timestamp**|timestamp with time zone|varchar<br/>date<br/>time||
|**timestamp with time zone**||varchar<br/>date<br/>timestamp<br/>time||
|**time**|interval|varchar||
|**interval**||varchar<br/>time||
|**bytea**||varchar||
|**jsonb**|boolean<br/>smallint<br/>integer<br/>bigint<br/>numeric<br/>real<br/>double|varchar||
|**rw_int256**||varchar||

:::note

Structs can be casted to structs explicitly or implicitly if the nested expressions and types can be casted.

:::

<!--You can find the casting relations here: https://github.com/risingwavelabs/risingwave/blob/be868cc6e479de30be78c98b77ab3ad686938b89/src/frontend/src/expr/type_inference/cast.rs#L201-->