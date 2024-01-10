---
id: query-syntax-constants
slug: /query-syntax-constants
title: Constants
---
<head>
  <link rel="canonical" href="https://docs.risingwave.com/docs/current/query-syntax-constants/" />
</head>

Constants are immutable values that remain fixed throughout a program's execution.

## String constants

A string constant is any arbitrary series of characters enclosed by single quotes ('). For examples, `'Database'`.

To incorporate a single-quote character within a string constant, use two consecutive single quotes. For example, `'Stream processing''s advantages'`. 

## Numeric constants

RisingWave supports expressing integer literals in decimal (base 10), hexadecimal (base 16), octal (base 8), and binary (base 2). Examples:

```sql
2147       -- Decimal
0x42e3     -- Hexadecimal
0o664      -- Octal
0b1101     -- Binary
```
