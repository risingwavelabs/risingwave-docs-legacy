---
id: query-syntax-literals
slug: /query-syntax-literals
title: Literals
---
<head>
  <link rel="canonical" href="https://docs.risingwave.com/docs/current/query-syntax-literals/" />
</head>

Literals play a crucial role in improving the accuracy of data representation and optimizing system efficiency. See the following subsections for an introduction of various types of literals.

## String literals

### Standard string literals

A string literal is a sequence of characters enclosed within single quotes ('). For example, `'Database'` is a string constant.

To include a single-quote character within a string constant, you can use two consecutive single quotes. For example, `'Stream processing''s advantages'` is a valid string constant that incorporates a single-quote character.

### String literals with C-style escapes

String literals with C-style escapes use escape sequences to represent special characters within a string, just as in the C programming language. These literals are constructed by prepending the letter 'e' to the string literal.

The following escape sequences are supported:

Escape Sequence | Interpretation
--- | ---
`\b` | backspace
`\f` | form feed
`\n` | newline
`\r` | carriage return
`\t` | tab
`\o, \oo, \ooo (o = 0–7)` | octal byte value
`\xh, \xhh (h = 0–9, A–F)` | hexadecimal byte value
`\uXXXX (x = 0–9, A–F)`  | 16-bit hexadecimal Unicode character value
`\UXXXXXXXX (x = 0–9, A–F)` | 32-bit hexadecimal Unicode character value

## Numeric literals

RisingWave supports expressing numeric literals in various number systems, including decimal (base 10), hexadecimal (base 16), octal (base 8), and binary (base 2). Here are some examples:

```sql
2147       -- Decimal
0x42e3     -- Hexadecimal
0o664      -- Octal
0b1101     -- Binary
```

Numeric literals in different bases provide you with flexibility in choosing the most suitable representation for specific needs.
