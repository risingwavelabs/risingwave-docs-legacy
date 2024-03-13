---
id: udf-rust-embedded
slug: /udf-rust-embedded
title: Embedded Rust UDFs
description: Define embedded Rust UDFs.
---
<head>
  <link rel="canonical" href="https://docs.risingwave.com/docs/current/udf-rust-embedded/" />
</head>

You can define embedded Rust UDFs, which will be run in an embedded Rust interpreter in RisingWave. The Rust code is inlined in the [`CREATE FUNCTION`](/sql/commands/sql-create-function.md) statement.

Here is an example:


```sql title="Create function"
CREATE FUNCTION gcd(int, int) RETURNS int LANGUAGE rust AS $$
fn gcd(mut a: i32, mut b: i32) -> i32 {
    while b != 0 {
        let t = b;
        b = a % b;
        a = t;
    }
    a
}
$$;
```

```sql title="Call function"
SELECT gcd(25, 15);

-----RESULT
5
```

:::note
The function will be [built](https://github.com/risingwavelabs/arrow-udf/blob/765aecd70223a90066dce7f9943b697d641feb96/arrow-udf-wasm/src/build.rs) into a wasm binary in the frontend. This requires the Rust toolchain (with the wasm32-wasi target) installed in frontend's environment.
:::