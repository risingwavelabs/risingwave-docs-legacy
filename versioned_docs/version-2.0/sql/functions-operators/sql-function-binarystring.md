---
id: sql-function-binarystring
slug: /sql-function-binarystring
title: Binary string functions and operators
---
<head>
  <link rel="canonical" href="https://docs.risingwave.com/docs/current/sql-function-binarystring/" />
</head>

### `bit_length`

Returns number of bits in the binary string, which is 8 times the [`octet_length`](#octet_length-length).

```sql title=Syntax
bit_length ( bytea ) -> integer
```

```sql title=Example
SELECT bit_length('😇'::bytea);
```
```
32
```

---

### `md5`

Returns the MD5 hash of the binary string as a hexadecimal.

```sql title=Syntax
md5 ( bytea ) -> varchar
```

```sql title=Example
SELECT md5('risingwave'::bytea);
```
```
7ad0245ddf6c26f4f6ae269a644ac00a
```

---

### `octet_length`, `length`

Returns number of bytes in the binary string.

```sql title=Syntax
octet_length ( bytea ) -> integer
-- or
length ( bytea ) -> integer
```

```sql title=Example
SELECT octet_length('😇'::bytea);
```
```
4
```

---

### `sha1`

Returns the SHA-1 hash of the binary string.

```sql title=Syntax
sha1 ( bytea ) -> bytea
```

```sql title=Example
SELECT sha1('risingwave'::bytea);
```
```
\x48d3478f8350c86fa2e6f65a5883c2046523c8bb
```

---

### `sha224`

Returns the SHA-224 hash of the binary string.

```sql title=Syntax
sha224 ( bytea ) -> bytea
```

```sql title=Example
SELECT sha224('risingwave'::bytea);
```
```
\xb898defab7c2e2f41c9a494a22e3567274b48123625f96008439e0bb
```

---

### `sha256`

Returns the SHA-256 hash of the binary string.

```sql title=Syntax
sha256 ( bytea ) -> bytea
```

```sql title=Example
SELECT sha256('risingwave'::bytea);
```
```
\x73ab8557da7bd59f798600fb1d18d18967bc763638fc456f477799437f229e06
```

---

### `sha384`

Returns the SHA-384 hash of the binary string.

```sql title=Syntax
sha384 ( bytea ) -> bytea
```

```sql title=Example
SELECT sha384('risingwave'::bytea);
```
```
\x7f6f71a068f04e3ed6338e06fec75941b48a2dadff58dffc4c39211b1dcc4a5f000168d1be49fd7b7e44094e7a7e627e
```

---

### `sha512`

Returns the SHA-512 hash of the binary string.

```sql title=Syntax
sha512 ( bytea ) -> bytea
```

```sql title=Example
SELECT sha512('risingwave'::bytea);
```
```
\x3d6d6078c75ad459cdc689216d5de35bd6d9a9a50b9bed96417aaf7ad25057b37460564f0ad23a589c655eda45026096a6bab08b3c863f0425cbfea64b5f84a8
```

---

### `substr`

Extracts a substring from a binary string (bytea) starting at position `start_int` for `count_int` bytes. If `count_int` is omitted, the substring extends to the end of the bytea value.

```sql title=Syntax
substr ( bytea_value, start_int, [, count_int] ) -> bytea
```

```sql title=Example
SELECT substr('abcde'::bytea, 2, 7);
```
```
\x62636465
```

```sql title=Example
SELECT substr('abcde'::bytea, -2, 5);
```
```
\x6162
```
