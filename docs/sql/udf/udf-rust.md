---
id: udf-rust
slug: /udf-rust
title: Use UDFs in Rust
description: Define your own functions with the help of the RisingWave Rust UDF SDK.
---
<head>
  <link rel="canonical" href="https://docs.risingwave.com/docs/current/udf-rust/" />
</head>

This article provides a step-by-step guide for defining Rust functions in RisingWave.

Rust functions are compiled into WebAssembly modules and then run on the embedded WebAssembly virtual machine in RisingWave. Rust UDFs provide **higher performance** (near native) compared to Python and Java. The **RisingWave kernel** handles the management of Rust UDFs, eliminating the need for additional maintenance. However, for security reasons, Rust UDFs currently **do not support access to external networks** and are **limited to computational tasks only**, with restricted CPU and memory resources. Therefore, we recommend using Rust UDFs for **computationally intensive tasks** like packet parsing and format conversion.

## Prerequisites

- Ensure that you have [Rust toolchain](https://rustup.rs) (stable channel) installed on your computer.
- Ensure that the Rust standard library for `wasm32-wasi` target is installed:

    ```shell
    rustup target add wasm32-wasi
    ```

## 1. Create a project

Create a Rust project named `udf`:

```shell
cargo new --lib udf
cd udf
```

Add the following lines to `Cargo.toml`:

```toml
[lib]
crate-type = ["cdylib"]

[dependencies]
arrow-udf = "0.1"
```

## 2. Define your functions

In `src/lib.rs`, define your functions using the `function` macro:

```rust
use arrow_udf::function;

// define a scalar function
#[function("gcd(int, int) -> int")]
fn gcd(mut x: i32, mut y: i32) -> i32 {
    while y != 0 {
        (x, y) = (y, x % y);
    }
    x
}

// define a table function
#[function("series(int) -> setof int")]
fn series(n: i32) -> impl Iterator<Item = i32> {
    0..n
}
```

You can find more usages in these [functions](https://docs.rs/arrow_udf/0.1.0/arrow_udf/attr.function.html) and more examples in these [tests](https://github.com/risingwavelabs/arrow-udf/blob/main/arrow-udf/tests/tests.rs).

Currently we only support a limited set of data types, `timestamptz` and complex array types are not supported yet. See the [Data type mapping](udf-rust.md#data-type-mapping) section for details.

## 3. Build the project

Build your functions into a WebAssembly module:

```shell
cargo build --release --target wasm32-wasi
```

You can find the generated WASM module at `target/wasm32-wasi/release/udf.wasm`.

Optional: It is recommended to strip the binary to reduce its size:

```shell
# Install wasm-tools
cargo install wasm-tools

# Strip the binary
wasm-tools strip ./target/wasm32-wasi/release/udf.wasm > udf.wasm
```

## 4. Declare your functions in RisingWave

In RisingWave, use the [`CREATE FUNCTION`](/sql/commands/sql-create-function.md) command to declare the functions you defined.

There are two ways to load the WASM module:

1. The WASM binary can be embedded in the SQL statement using base64 encoding. You can use the following shell script to encode the binary and generate the SQL statement:

    ```shell
    encoded=$(base64 -i udf.wasm)
    sql="CREATE FUNCTION gcd(int, int) RETURNS int LANGUAGE wasm USING BASE64 '$encoded';"
    echo "$sql" > create_function.sql
    ```

   When created successfully, the WASM binary will be automatically uploaded to the object store.

2. The WASM binary can be loaded from the object store.

    ```sql
    CREATE FUNCTION gcd(int, int) RETURNS int
    LANGUAGE wasm USING LINK 's3://bucket/path/to/udf.wasm';

    CREATE FUNCTION series(int) RETURNS TABLE (x int)
    LANGUAGE wasm USING LINK 's3://bucket/path/to/udf.wasm';
    ```

    Alternatively, if you run RisingWave locally, you can use the local file system:

    ```sql
    CREATE FUNCTION gcd(int, int) RETURNS int
    LANGUAGE wasm USING LINK 'fs://path/to/udf.wasm';
    ```

## 5. Use your functions in RisingWave

Once the UDFs are created in RisingWave, you can use them in SQL queries just like any built-in functions. For example:

```sql
SELECT gcd(25, 15);
SELECT series(5);
```

## Data type mapping

The following table shows the data type mapping between SQL and Rust:

| SQL type             | Rust type as argument          | Rust type as return value      |
| -------------------- | ------------------------------ | ------------------------------ |
| `boolean`            | `bool`                         | `bool`                         |
| `smallint`           | `i16`                          | `i16`                          |
| `integer`            | `i32`                          | `i32`                          |
| `bigint`             | `i64`                          | `i64`                          |
| `real`               | `f32`                          | `f32`                          |
| `double precision`   | `f64`                          | `f64`                          |
| `decimal`            | `rust_decimal::Decimal`        | `rust_decimal::Decimal`        |
| `date`               | `chrono::NaiveDate`            | `chrono::NaiveDate`            |
| `time`               | `chrono::NaiveTime`            | `chrono::NaiveTime`            |
| `timestamp`          | `chrono::NaiveDateTime`        | `chrono::NaiveDateTime`        |
| `timestamptz`        | not supported yet              | not supported yet              |
| `interval`           | `arrow_udf::types::Interval`   | `arrow_udf::types::Interval`   |
| `jsonb`              | `serde_json::Value`            | `serde_json::Value`            |
| `varchar`            | `&str`                         | `impl AsRef<str>`, e.g. `String`, `Box<str>`, `&str`     |
| `bytea`              | `&[u8]`                        | `impl AsRef<[u8]>`, e.g. `Vec<u8>`, `Box<[u8]>`, `&[u8]` |
| `smallint[]`         | `&[i16]`                       | `impl Iterator<Item = i16>`    |
| `integer[]`          | `&[i32]`                       | `impl Iterator<Item = i32>`    |
| `bigint[]`           | `&[i64]`                       | `impl Iterator<Item = i64>`    |
| `real[]`             | `&[f32]`                       | `impl Iterator<Item = f32>`    |
| `double precision[]` | `&[f64]`                       | `impl Iterator<Item = f64>`    |
| `varchar[]`          | `&arrow::array::StringArray`   | `impl Iterator<Item = &str>`   |
| `bytea[]`            | `&arrow::array::BinaryArray`   | `impl Iterator<Item = &[u8]>`  |
| `others[]`           | not supported yet              | not supported yet              |
| `struct<..>`         | not supported yet              | `(T1, T2, ..)`                 |
