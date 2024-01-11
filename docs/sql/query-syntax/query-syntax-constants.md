---
id: query-syntax-constants
slug: /query-syntax-constants
title: Constants
---
<head>
  <link rel="canonical" href="https://docs.risingwave.com/docs/current/query-syntax-constants/" />
</head>

Constants are immutable values that remain fixed throughout a program's execution. They provide a way to store data that should not be modified during the program's runtime.

## String constants

A string constant is a sequence of characters enclosed within single quotes ('). For example, `'Database'` is a string constant.

To include a single-quote character within a string constant, you can use two consecutive single quotes. For example, `'Stream processing''s advantages'` is a valid string constant that incorporates a single-quote character.

## Numeric constants

RisingWave supports expressing numeric literals in various number systems, including decimal (base 10), hexadecimal (base 16), octal (base 8), and binary (base 2). Here are some examples:

```sql
2147       -- Decimal
0x42e3     -- Hexadecimal
0o664      -- Octal
0b1101     -- Binary
```
Numeric constants in different bases provide you with flexibility in choosing the most suitable representation for specific needs.
