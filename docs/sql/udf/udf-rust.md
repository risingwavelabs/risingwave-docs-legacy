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

## Declare your functions in RisingWave

You can utilize the [`CREATE FUNCTION`](/sql/commands/sql-create-function.md) command to develop UDFs in Rust. The syntax is outlined below:

```sql
CREATE FUNCTION function_name ( arg_name arg_type [, ...] )
    [ RETURNS return_type | RETURNS TABLE ( column_name column_type [, ...] ) ]
    LANGUAGE rust
    AS [ $$ function_body $$ | 'function_body' ];
```

For instance, the scalar function `gcd` can be defined as follows:

```sql
CREATE FUNCTION gcd(int, int) RETURNS int LANGUAGE rust AS $$
    fn gcd(mut x: i32, mut y: i32) -> i32 {
        while y != 0 {
            (x, y) = (y, x % y);
        }
        return x;
    }
$$;
```

The Rust code must start with a `fn` function, and the function's name, parameters, and return type must match those declared in the `CREATE FUNCTION` statement. Refer to the [Data type mapping](udf-rust.md#data-type-mapping) for details on the correspondence between SQL types and Rust types.

For table functions, your function must return an `impl Iterator<Item = T>` type, where `T` is the type of the returned elements. For example, to generate a sequence from 0 to n-1:

```sql
CREATE FUNCTION series(n int) RETURNS TABLE (x int) LANGUAGE rust AS $$
    fn series(n: i32) -> impl Iterator<Item = i32> {
        (0..n).into_iter()
    }
$$;
```

If your function returns a structured type, the syntax is a bit more complex. For instance, the following function parses a key-value pair from a string:

```sql
CREATE FUNCTION key_value(varchar) RETURNS STRUCT<key varchar, value varchar> LANGUAGE rust AS $$
    #[derive(StructType)]
    struct KeyValue<'a> {
        key: &'a str,
        value: &'a str,
    }
    #[function("key_value(varchar) -> struct KeyValue")]
    fn key_value(kv: &str) -> Option<KeyValue<'_>> {
        let (key, value) = kv.split_once('=')?;
        Some(KeyValue { key, value })
    }
$$;
```

First, define a structure using `struct` and annotate it with `#[derive(StructType)]`. Its fields must match the struct type declared in the `CREATE FUNCTION` statement. Then, define the function and annotate it with the `#[function("...")]` macro. The string in the macro represents the SQL signature of the function, with the tail return type being `struct StructName`. For the specific syntax, see [arrow-udf](https://docs.rs/arrow-udf/0.2.1/arrow_udf/attr.function.html).

Currently, in `CREATE FUNCTION` statement, Rust code can only use libraries from the standard library, `chrono`, `rust_decimal`, `serde_json`, and does not support other third-party libraries. If you wish to use other libraries, you may consider [compiling WebAssembly modules manually](udf-rust.md#alternative-manually-build-your-functions-into-a-webassembly-module).

## Use your functions in RisingWave

After creating UDFs in RisingWave, you can employ them in SQL queries just as you would with any built-in functions. For example:

```sql
SELECT gcd(25, 15);
SELECT * FROM series(5);
```

## Alternative: Manually build your functions into a WebAssembly module

If you want to use other libraries in your Rust functions, you can manually build your functions into a WebAssembly module and then load it into RisingWave.

### Prerequisites

- Ensure that you have [Rust toolchain](https://rustup.rs) (stable channel) installed on your computer.
- Ensure that the Rust standard library for `wasm32-wasi` target is installed:

    ```shell
    rustup target add wasm32-wasi
    ```

### 1. Create a project

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
arrow-udf = "0.2"
```

### 2. Define your functions

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

You can find more usages in these [functions](https://docs.rs/arrow_udf/0.2.1/arrow_udf/attr.function.html) and more examples in these [tests](https://github.com/risingwavelabs/arrow-udf/blob/main/arrow-udf/tests/tests.rs).

See the correspondence between SQL types and Rust types in the [Data type mapping](udf-rust.md#data-type-mapping).

### 3. Build the project

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

1. Embed the WASM binary into SQL with base64 encoding. You can use the following command in psql:

    ```sql
    \set wasm_binary `base64 -i path/to/udf.wasm`
    CREATE FUNCTION gcd(int, int) RETURNS int LANGUAGE wasm USING BASE64 :'wasm_binary';
    ```

2. Load the WASM binary from the local file system of the frontend. Note the `fs://` is URI schema, and `/path/to/udf.wasm` is the real path.

    ```sql
    CREATE FUNCTION gcd(int, int) RETURNS int LANGUAGE wasm USING LINK 'fs:///path/to/udf.wasm';
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
| `struct<..>`         | not supported yet              | user defined `struct`          |
