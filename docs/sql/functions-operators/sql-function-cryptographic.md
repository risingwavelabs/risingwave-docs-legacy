---
id: sql-function-cryptographic
slug: /sql-function-cryptographic
title: Cryptographic functions
description: Cryptographic functions.
---
<head>
  <link rel="canonical" href="https://docs.risingwave.com/docs/current/sql-function-cryptographic/" />
</head>

### `Raw encryption functions`

Raw encryption functions are basic encryption functions that perform encryption and decryption of data using cryptographic algorithms. Please note they solely apply a cipher to the data and do not provide additional security measures.

```sql title=Syntax
encrypt(data bytea, key bytea, type text) -> bytea
decrypt(data bytea, key bytea, type text) -> bytea
```

The cipher method is specified by `type`. The syntax of the `type` string is:

```sql
algorithm [-mode][/pad:padding]
```

`algorithm` is:
+ aes — AES (Rijndael-128, -192 or -256)

`mode` is one of:

+ cbc — next block depends on previous (default)
+ ecb — each block is encrypted separately (for testing only)

`padding` is one of:

+ pkcs — data may be any length (default)
+ none — data must be multiple of cipher block size

:::note
The given encryption/decryption key MUST match length 16/24/32 bytes as required by aes-128/192/256.
:::

```sql title="Examples of type text"
aes-cbc/pad:pkcs => AES algorithm, cbc mode, enabling padding
aes => AES algorithm, cbc mode, enabling padding
aes-ecb => AES algorithm, ecb mode, enabling padding
```

```sql title="Example of raw encryption functions"
SELECT encrypt('Hello, World!', 'my_secret_key111', 'aes-cbc/pad:pkcs');
----RESULT
\x9cf6a49f90b3ac816aeeeed286606fdb
(1 row)
```

```sql title="Example of raw encryption functions"
SELECT decrypt('\x9cf6a49f90b3ac816aeeeed286606fdb','my_secret_key111', 'aes-cbc/pad:pkcs');)
----RESULT
\x48656c6c6f2c20576f726c6421
(1 row)
```
