---
id: sql-function-cryptographic-functions
slug: /sql-function-cryptographic-functions
title: Cryptographic functions
description: Cryptographic functions.
---
<head>
  <link rel="canonical" href="https://docs.risingwave.com/docs/current/sql-function-cryptographic-functions/" />
</head>

### `Raw encryption functions`

Raw encryption functions are basic encryption functions that perform encryption and decryption of data using cryptographic algorithms. Please note they solely apply a cipher to the data and do not provide additional security measures.

```sql title=Syntax 
encrypt(data bytea, key bytea, type text) -> bytea
decrypt(data bytea, key bytea, type text) -> bytea
```  

Encrypt/decrypt data use the cipher method specified by `type`. The syntax of the `type` string is:

```sql
algorithm [ - mode ] [ /pad: padding ]
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
SELECT encrypt('Hello, World!', 'my_secret_key', 'aes-cbc/pad:pkcs');
----RESULT
\330\317\204\357\327\367\206\241\253\024\303\013\215\030\231\257
(1 row)
```

```sql title="Example of raw encryption functions"
SELECT decrypt('\330\317\204\357\327\367\206\241\253\024\303\013\215\030\231\257', 'my_secret_key', 'aes-cbc/pad:pkcs');
----RESULT
Hello, World!
(1 row)
```



