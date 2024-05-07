---
id: sql-function-string
slug: /sql-function-string
title: String functions and operators
---
<head>
  <link rel="canonical" href="https://docs.risingwave.com/docs/current/sql-function-string/" />
</head>

## String operators

| Operator | Expression & Description | Example |
| ----------- | ----------- | ----------- |
| \|\| | <code>expression1 &#124;&#124; expression2 [ &#124;&#124; expression ] ...</code> <br /> Concatenates two or more expressions. <br /> | <code>'Abcde' &#124;&#124; 1 &#124;&#124; 23 </code> → `Abcde123` |
| `^@` | `string ^@ substring` <br /> Returns true (`t`) if *string* starts with *substring*. This operator is equivalent to the `starts_with`() function.| `'abcdef' ^@ 'abc'` → `t` |

## String functions

### `ascii`

This function returns the Unicode code point of the first character of the *input_string*. If the string is empty, it returns `NULL`.

```bash title=Syntax
ascii ( input_string ) → int
```

```bash title=Examples
ascii('RisingWave') → 82
ascii('🌊') → 127754
```

---

### `bit_length`

This function returns the number of bits in the input string, which is 8 times the `octet_length`.

```bash title=Syntax
bit_length ( input_string ) → integer
```

```bash title=Examples
bit_length('wave') → 32
```

---

### `btrim`

This function is equal to `trim (BOTH)`. It removes the specified characters from both the beginning and end of the input string.

```bash title=Syntax
btrim ( input_string [, characters ] ) → output_string
```

```bash title=Examples
btrim(' cake ') → 'cake'
btrim('abcxyzabc', 'cba') → 'xyz'
```

---

### `char_length`, `character_length`, `length`

These functions return the number of characters in the input string.

```bash title=Syntax
char_length ( input_string ) → integer_output
character_length ( input_string ) → integer_output
length ( input_string ) → integer_output
```

```bash title=Examples
char_length('wave') → 4
```

---

### `chr`

This function returns the character with the Unicode code point equivalent to the input integer value provided.

```bash title=Syntax
chr ( input_int ) → string
```

```bash title=Examples
chr(65) → 'A'
```

---

### `concat`

This function concatenates the arguments. NULL arguments are ignored.

```bash title=Syntax
concat ( any_input-value_1 [, any_input-value_2 [, ...] ]) → output_string
```

```bash title=Examples
concat('Abcde', 2, NULL, 22) → 'Abcde222'
```

---

### `concat_ws`

This function concatenates the arguments with a separator. The first argument is used as the separator and should not be NULL. Other NULL arguments are ignored.

```bash title=Syntax
concat_ws ( separator_string, any_input-value_1 [, any_input-value_2 [, ...] ]) → output_string
```

```bash title=Examples
concat_ws(',', 'Abcde', 2, NULL, 22) → 'Abcde,2,22'
```

---

### `decode`

This function decodes the text data in the input string into binary data. Supported formats for the encoded input string include `base64`, `hex`, and `escape`.

```bash title=Syntax
decode ( input_string, format_type ) → bytea
```

```bash title=Examples
decode('MTIz', 'base64') → '123'
```

---

### `encode`

This function encodes the binary data in bytea into its textual representation. Supported encoding formats include `base64`, `hex`, and `escape`.

```bash title=Syntax
encode ( bytea, format_type ) → output_string
```

```bash title=Examples
encode(E'123'::bytea, 'base64') → 'MTIz'
```

---

### `format`

This function produces output formatted according to a format string, in a style similar to the C function `sprintf`.

```bash title=Syntax
format( format_string [, format_arg [, ...] ] ) → output_string
```

The *format_string* specifies how the *output_string* should be formatted. It consists of text and format specifiers. Text is copied directly to the output string. Format specifiers are placeholders for the arguments to be inserted into the output string. The number of format specifiers should be equal to or less than the number of arguments.

The syntax of the format specifier:

```bash
%type
```

*type* is the type of format conversion to use to generate the output of the format specifier.

The allowed values for *type* are:

- `s`: Formats the argument value as a string. NULL is treated as an empty string.
- `I`: Treats the argument value as an SQL identifer.
<!-- `L` is not supported yet - `L`: Quotes the argument value as an SQL literal. -->

Please note that *format_string* and *format_arg* can be variables.

For example, the following query works fine in RisingWave.

```sql
SELECT format(f, a, b) from (values
    ('%s %s', 'Hello', 'World'),
    ('%s%s', 'Hello', null),
    (null, 'Hello', 'World')
) as t(f, a, b);
----
Hello World
Hello
NULL
```

---

### `initcap`

This function capitalizes the first letter of each word in the input string and converts the remaining characters to lowercase.

```bash title=Syntax
initcap ( input_string ) → string
```

```bash title=Examples
initcap('POWERFUL and flexible') → 'Powerful And Flexible'
```

---

### `lower`

This function converts the string to all lowercase.

```bash title=Syntax
lower ( input_string ) → output_string
```

```bash title=Examples
lower('TOM') → 'tom'
```

---

### `left`

This function returns the first input integer characters in the input string. If the input integer is negative, the last *input_integer* characters are removed from the output string.

```bash title=Syntax
left ( input_string, input_integer ) → output_string
```

```bash title=Examples
left('risingwave', 4) → 'risi'
left('risingwave', -4) → 'rising'
```

---

### `lpad`

This function pads the input string on the left with spaces until it reaches the specified input integer length. If the input string is longer than the input integer length, it is truncated to the specified length. Providing the optional padding string replaces the spaces with the padding string.

```bash title=Syntax
lpad ( input_string, input_int ) → string

lpad ( input_string, input_int, padding_string ) → string
```

```bash title=Examples
lpad('42', 5) → '&nbsp;&nbsp;&nbsp42'
lpad('42', 5, 'R') → 'RRR42'
```

---

### `ltrim`

This function is equal to `trim (LEADING)`. It removes the specified characters from the beginning of the input string.

```bash title=Syntax
ltrim ( input_string [, characters ] ) → output_string
```

```bash title=Examples
ltrim(' cake ') → 'cake '
ltrim('abcxyzabc', 'cba') → 'xyzabc'
```

---

### `octet_length`

This function returns the number of bytes in the string.

```bash title=Syntax
octet_length ( input_string )
```

```bash title=Examples
octet_length('wave') → 4
```

---

### `overlay`

This function replaces a substring in the input string with a substring, starting at a specified position and with an optional length. If the length is omitted, its value is the length of the substring.

```bash title=Syntax
overlay ( input_string PLACING substring FROM start_int [ FOR length_int ] ) → output_string
```

```bash title=Examples
overlay('yabadoo' PLACING 'daba' FROM 5 FOR 0) → 'yabadabadoo'
overlay('abcdef' PLACING '45' FROM 4) → 'abc45f'
overlay('RisingWave' PLACING '🌊' FROM 7) → 'Rising🌊ave'
```

---

### `position`

This function returns the starting index of the specified substring within the input string, or zero if it is not present.

```bash title=Syntax
position ( substring in input_string ) → integer_output
```

```bash title=Examples
position('ing' in 'rising') → 4
```

---

### `regexp_count`

Returns the number of times a POSIX regular expressions pattern appears in *input_string*. Back reference, positive, negative lookahead, and positive, negative lookbehind are supported. Optional flags include `i`, which stands for case-insensitive matching, and `c`, which represents case-sensitive matching.

```bash title=Syntax
regexp_count( input_string, pattern [, start_int [, optional_flag ]] ) → output_int
```

```bash title=Examples
regexp_count('ABCABCAXYaxy', 'A.', 1, 'c') → 3
regexp_count('ABCABCAXYaxy', 'A.', 2, 'c') → 2
```

---

### `regexp_match`

Returns a string array of captured substring(s) resulting from the first match of a POSIX regular expression pattern to a string. If there is no match, the result is NULL. Back reference, positive, negative lookahead, and positive, negative lookbehind are supported. Optional flags include `i`, which stands for case-insensitive matching, and `c`, which represents case-sensitive matching.

```bash title=Syntax
regexp_match( input_string, pattern [, optional_flag ] ) → matched_string[]
```

```bash title=Examples
regexp_match('foobarbequebaz', '(bar)(beque)') → {bar,beque}
regexp_match('abc', 'd') → NULL
regexp_match('abc', 'Bc', 'ici') → {bc}
```

---

### `regexp_matches`

Returns a set of string arrays of captured substring(s) resulting from matching a POSIX regular expression pattern to a string. Returns all matches by default. Back reference, positive, negative lookahead, and positive, negative lookbehind are supported. Optional flags include `i`, which stands for case-insensitive matching, and `c`, which represents case-sensitive matching.

```bash title=Syntax
regexp_matches( input_string, pattern [, optional_flag ] ) → set_of_matched_string[]
```

```bash title=Examples
regexp_matches('foobarbequebazilbarfbonk', '(b[^b]+)(b[^b]+)') →
{bar,beque}
{bazil,barf}

regexp_matches('abcabc', 'Bc', 'i') →
{bc}
{bc}
```

---

### `regexp_replace`

Replaces the substring that is either the first match or, optionally, the N'th match to the POSIX regular expression *pattern* in the *input_string*, starting from the character index specified by the optional *start_integer*.

Back reference, positive, negative lookahead, and positive, negative lookbehind are supported.

Optional flags can modify the matching behavior:

- The `g` flag indicates that all occurrences of the pattern in the input string should be replaced. If not used, only the first occurrence is replaced.
- The `i` flag enables case-insensitive matching.
- The `c` flag enables case-sensitive matching.

**Note:** If *start_integer* is used, *flags* is not permitted unless *N_integer* is also specified.

```bash title=Syntax
regexp_replace( input_string, pattern, replacement_string [, start_integer [, N_integer ] ] [, flags ] ) → output_string
```

```bash title=Examples
regexp_replace('foobarbaz', 'b(..)', 'X\1Y', 'g') → fooXarYXazY

regexp_replace('HELLO world', '[aeiou]', 'X', 'ig') → HXLLX wXrld

regexp_replace('RisingWave', '[aeiou]', 'X', 1, 3, 'i') → RisingWXve
```

---

### `repeat`

Repeats *input_string* specific times. Null is returned when *times_int* is zero, negative, or null.

```bash title=Syntax
repeat( input_string, times_int ) → output_string
```

```bash title=Examples
repeat('A1b2', 3) → A1b2A1b2A1b2
```

---

### `replace`

Replaces all occurrences of substring *from_string* in *input_string* with substring *to_string*.

```bash title=Syntax
replace( input_string, from_string, to_string ) → output_string
```

```bash title=Examples
replace('abcdefabcdef', 'cd', 'XX') → abXXefabXXef
```

---

### `reverse`

Returns the *input_string* with its characters in the reverse order.

```bash title=Syntax
reverse( input_string ) → string
```

```bash title=Examples
reverse('RisingWave') → evaWgnisiR
```

---

### `right`

Returns the last *input_integer* characters in the *input_string*. If *input_integer* is negative, the first \|*input_integer*\| characters are removed from *output_string*.

```bash title=Syntax
right( input_string, input_integer ) → output_string
```

```bash title=Examples
right('risingwave', 4) → wave
right('risingwave', -4) → ngwave
```

---

### `rpad`

Pads the input string on the right with spaces until it reaches the specified length. If the string is longer than the specified length, it is truncated to the specified length. Providing the optional padding string replaces the spaces with the padding string.

```bash title=Syntax
rpad( input_string, input_int, padding_string ) → string
```

```bash title=Examples
rpad('42', 5) → '42    '
rpad('42', 5, 'R') → '42RRR'
```

---

### `rtrim`

Equals to `trim (TRAILING)`.

```bash title=Syntax
rtrim( input_string[, characters] ) → output_string
```

```bash title=Examples
rtrim(' cake ') → 'cake'
rtrim('abcxyzabc', 'cba') → 'abcxyz'
```

---

### `split_part`

Splits the input string at occurrences of the delimiter string and returns the n'th field (counting from one), or when n is negative, returns the |n|'th-from-last field. When n is zero, returns an 'InvalidParameterValue' error. When the input delimiter string is an empty string, returns the input string if querying the first or last field. Otherwise, returns an empty string.

```bash title=Syntax
split_part( input_string, delimiter_string, int_n ) → varchar
```

```bash title=Examples
split_part('abc~@~def~@~ghi', '~@~', 2) → 'def'
```

---

### `starts_with`

Returns true if the input string starts with the specified prefix string, otherwise returns false.

```bash title=Syntax
starts_with( input_string, prefix_string ) → boolean
```

```bash title=Examples
starts_with('RisingWave is powerful', 'Rising') → true
```

---

### `substr`/`substring`

Extracts the substring from input_string starting at position start_int and extending for count_int characters, if specified. start_int should be equal to or larger than 1.

```bash title=Syntax
substr( input_string, start_int[, count_int] ) → output_string
```

```bash title=Examples
substr('alphabet', 3) → 'phabet';
substring('alphabet', 3, 2) → 'ph'
```

---

### `to_ascii`

Returns the input string with non-ASCII characters replaced by their closest ASCII equivalents.

```bash title=Syntax
to_ascii( input_string ) → string
```

```bash title=Examples
to_ascii('Café') → 'Cafe'
```

---

### `to_hex`

Converts input_int or input_bigint to its hexadecimal representation as a string.

```bash title=Syntax
to_hex( input_int ) → string
```

```bash title=Examples
to_hex(255) → 'ff'
to_hex(123456789012345678) → '1b69b4ba630f34e'
```

---

### `translate`

Replaces each character in the *input_string* that matches a character in the *from_string* with the corresponding character in the *to_string*.

```bash title=Syntax
translate( input_string, from_string, to_string ) → output_string
```

```bash title=Examples
translate('M1X3', '13', 'ae') → 'MaXe'
```

---

### `trim`

Trims the longest contiguous substring of characters from the beginning, end, or both ends (BOTH by default) of *input_string* that contains only the characters specified in characters (which defaults to whitespace if not specified).

There are two syntax variants.

```bash title=Syntax A
trim( [ LEADING | TRAILING | BOTH ] [ characters ] FROM input_string ) → output_string
```

```bash title=Syntax B
trim( [ LEADING | TRAILING | BOTH ]  [FROM ] input_string[, characters] ) → output_string
```

```bash title=Examples
trim(' cake ') → 'cake'
trim(both 'cba' from 'abcxyzabc') → 'xyz'
trim(both from 'abcxyzabc', 'cba') → 'xyz'
trim('abcxyzabc', 'cba') → 'xyz'
```

---

### `upper`

Converts the string to all uppercase.

```bash title=Syntax
upper( input_string ) → output_string
```

```bash title=Examples
upper('tom') → 'TOM'
```

---

## `LIKE` pattern matching expressions

```sql
string [ NOT ] { LIKE | ILIKE } pattern [ ESCAPE '' ]

string [!]~~[*] pattern [ ESCAPE '' ]
```

The `LIKE` expression returns true if the string matches the supplied pattern. The `NOT LIKE` expression returns false if `LIKE` returns true. By using `ILIKE` instead of `LIKE`, the matching becomes case-insensitive.

Alternatively, you can use the operators `~~` and `~~*` as equivalents to `LIKE` and `ILIKE`, respectively. Similarly, the operators `!~~` and `!~~*` equal to `NOT LIKE` and `NOT ILIKE`.

### Wildcards

- An underscore `_` in a pattern matches any single character
  
- A percent sign `%` matches any sequence of zero or more characters.

If the pattern does not contain `_` or `%`, then the pattern only represents the string itself. For example, the pattern 'apple' matches only the string 'apple'. In that case, `LIKE` acts like the equals operator `=`.

### Escape

To match a literal underscore or percent sign without matching other characters, the respective character in pattern must be preceded by the escape character `\`. To match the escape character itself, write two escape characters: `\\`.

You can use `ESCAPE ''` to disable the escape mechanism, but specifying a custom escape character using the `ESCAPE` clause is not supported.

### Examples

```sql
'abc' LIKE 'abc'           true
'abc' LIKE 'a%'            true
'abc' LIKE '_b_'           true
'abc' LIKE 'c'             false
```
