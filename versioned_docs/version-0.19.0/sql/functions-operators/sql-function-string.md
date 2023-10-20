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

|Function|Description|Example|
|---|---|---|
| `ascii`( *input_string* ) → *int* | Returns the Unicode code point of the first character of the *input_string*. If the string is empty, it returns `NULL`. | `ascii('RisingWave')` → `82` <br /> `ascii('🌊')` → `127754` |
|`btrim` ( *input_string* [, *characters* ]) → *output_string*|Equals to `trim (BOTH)`.|`btrim(' cake ')` → 'cake'<br/>`btrim('abcxyzabc', 'cba')` → `xyz`|<!--Author: I didn't use the code tag `` for what's returned because `` truncates the empty spaces at the beginning and the end, and in this case, spaces should be kept. So I used '' which keeps the spaces. Same for the next two functions.-->
| `chr`( *input_int* ) → *string* | Returns the character with the Unicode code point equivalent to the *input_int* value provided. | `chr(65)` → `A` |
|`concat` ( *any_input-value_1* [, *any_input-value_2* [, ...] ]) → *output_string* | Concatenates the arguments. NULL arguments are ignored. | `concat('Abcde', 2, NULL, 22)` → `Abcde222` |
|`concat_ws` ( *separator_string*, *any_input-value_1* [, *any_input-value_2* [, ...] ]) → *output_string* | Concatenates the arguments with a separator. The first argument is used as the separator, and should not be NULL. Other NULL arguments are ignored. | `concat_ws(',', 'Abcde', 2, NULL, 22)` → `Abcde,2,22` |
|`decode`(*input_string*, *format_type*) → *bytea* | Decodes the text data in *input_string* into binary data. Supported formats for the encoded *input_string* include `base64`, `hex`, and `escape`. | `decode('MTIz', 'base64')` → `123` |
|`encode`(*bytea*, *format_type*) → *output_string* | Encodes the binary data in *bytea* into its textual representation. Supported encoding formats include `base64`, `hex`, and `escape`. | `encode(E'123'::bytea, 'base64')` → `MTIz` |
|`initcap`( *input_string* ) → *string* | Capitalizes the first letter of each word in the *input_string* and converts the remaining characters to lowercase. | `initcap('POWERFUL and flexible')` → `Powerful And Flexible` |
|`length` ( *input_string* ) → *integer_output*|Returns the number of characters in *input_string*.|`length('jose')` → `4`|
|`lower` ( *input_string* ) → *output_string*|Converts the string to all lowercase.|`lower('TOM')` → `tom`|
|`lpad`( *input_string*, *input_int* ) → *string* <br /><br /> lpad( *input_string*, *input_int*, *padding_string* ) → *string* | Pads the *input_string* on the left with spaces until it reaches the specified *input_int* length. If the *input_string* is longer than the *input_int* length, it is truncated to the specified length. Providing the optional *padding_string* replaces the spaces with the *padding_string*. | `lpad('42', 5)` → '&nbsp;&nbsp;&nbsp;42' <br /><br /> `lpad('42', 5, 'R')` → `RRR42` |
|`ltrim` ( *input_string* [, *characters* ]) → *output_string*|Equals to `trim (LEADING)`.|`ltrim(' cake ')` → 'cake '<br/>`ltrim('abcxyzabc', 'cba')` → `xyzabc`|
|`overlay` ( *input_string* PLACING *substring* FROM *start_int* [ FOR *length_int* ]) → *output_string* | Replaces a substring in *input_string* with *substring*, starting at *start_int* and with *length_int*. If *length_int* is omitted, its value is the length of *substring*. | `overlay('yabadoo' PLACING 'daba' FROM 5 FOR 0)` → `yabadabadoo` <br /> `overlay('abcdef' PLACING '45' FROM 4)` → `abc45f` <br /> `overlay('RisingWave' PLACING '🌊' FROM 7)` → `Rising🌊ave` |
|`position` ( *input_string*, *substring* ) → *integer_output*|Returns the starting index of the specified *substring* within *input_strin*, or zero if it is not present.|`position('high', 'ig')` → `2`|
|`rtrim` ( *input_string* [, *characters* ]) → *output_string*|Equals to `trim (TRAILING)`.|`rtrim(' cake ')` → ' cake'<br/>`rtrim('abcxyzabc', 'cba')` → `abcxyz`|
|`regexp_match` ( *input_string*, *pattern*, [, *optional_flag* ] ) → *matched_string* [] | Returns a string array of captured substring(s) resulting from the first match of a POSIX regular expression pattern to a string. If there is no match, the result is NULL. Optional flags include `i`, which stands for case-insensitive matching, and `c`, which represents case-sensitive matching.| `regexp_match('foobarbequebaz', '(bar)(beque)')` → `{bar,beque}` <br /> `regexp_match('abc', 'd')` → `NULL` <br /> `regexp_match('abc', 'Bc', 'ici')` → `{bc}`|
|`regexp_matches` ( *input_string*, *pattern*, [, *optional_flag* ] ) → *set_of_matched_string* [] | Returns a set of string arrays of captured substring(s) resulting from matching a POSIX regular expression pattern to a string. Returns all matches by default. Optional flags include `i`, which stands for case-insensitive matching, and `c`, which represents case-sensitive matching.| `regexp_matches('foobarbequebazilbarfbonk', '(b[^b]+)(b[^b]+)')` → <br /> `{bar,beque}` <br /> `{bazil,barf}` <br /> `regexp_matches('abcabc', 'Bc', 'i')` → <br /> `{bc}` <br /> `{bc}`|
|`repeat` ( *input_string*, *times_int* ) → *output_string*|Repeats *input_string* specific times. Null is returned when *times_int* is zero, negative, or null.|`repeat('A1b2', 3)` → `A1b2A1b2A1b2`|
|`replace` ( *input_string*, *from_string*, *to_string* ) → *output_string*|Replaces all occurrences of substring *from_string* in *input_string* with substring *to_string*.|`replace('abcdefabcdef', 'cd', 'XX')` → `abXXefabXXef`|
|`reverse`( *input_string* ) → *string* | Returns the *input_string* with its characters in the reverse order. | `reverse('RisingWave')` → `evaWgnisiR` |
|`rpad`( *input_string*, *input_int* ) → *string* <br /><br /> rpad( *input_string*, *input_int*, *padding_string* ) → *string* | Pads the *input_string* on the right with spaces until it reaches the specified *input_int* length. If the *input_string* is longer than the *input_int* length, it is truncated to the specified length. Providing the optional *padding_string* replaces the spaces with the *padding_string*. | `rpad('42', 5)` → '42&nbsp;&nbsp;&nbsp;' <br /><br /> `rpad('42', 5, 'R')` → `42RRR` |
|`split_part` ( *input_string* , *delimiter_string*, *int_n* ) → varchar | Splits *input_string* at occurrences of *delimiter_string* and returns the *int_n*'th field (counting from one), or when *int_n* is negative, returns the \|*int_n*\|'th-from-last field. When *int_n* is zero, returns an 'InvalidParameterValue' error. When the input *delimiter_string* is an empty string, returns the *input_string* if querying the first or last field. Otherwise, returns an empty string. | `split_part('abc~@~def~@~ghi', '~@~', 2)` → `def` |
|`starts_with`( *input_string*, *prefix_string* ) → *boolean* | Returns true if the *input_string* starts with the specified *prefix_string*, otherwise returns false. | `starts_with('RisingWave is powerful', 'Rising')` → `true` |
|`starts_with`( *input_string*, *substring* ) → *boolean* | Returns true (`t`) if *input_string* starts with *substring*. This function is equivalent to the `^@` operator. | `starts_with('abcdef', 'abc')` → `t` |
| `strpos`( *input_string*, *substring* ) → *int* | Returns the position of the first occurrence of the *substring* in the *input_string*. If the substring is not found, it returns 0. | `strpos('RisingWave is powerful', 'powerful')` → `15` |
|`substr`/`substring` ( *input_string* , *start_int* [, *count_int* ]) → *output_string*|Extracts the substring from *input_string* starting at position *start_int* and extending for *count_int* characters, if specified. *start_int* should be equal to or larger than 1.| `substr('alphabet', 3)` → `phabet`; <br /> `substring('alphabet', 3, 2)` → `ph`|
|`to_ascii`( *input_string* ) → *string* | Returns the *input_string* with non-ASCII characters replaced by their closest ASCII equivalents. | `to_ascii('Café')` → `Cafe` |
|`to_hex`( *input_int* ) → *string* <br /><br /> `to_hex`( *input_bigint* ) → *string* | Converts *input_int* or *input_bigint* to its hexadecimal representation as a string. | `to_hex(255)` → `ff` <br /><br /> `to_hex(123456789012345678)` → `1b69b4ba630f34e` |
|`translate` ( *input_string*, *from_string*, *to_string*) → *output_string* | Replaces each character in the *input_string* that matches a character in the *from_string* with the corresponding character in the *to_string*. | `translate('M1X3', '13', 'ae')` → `MaXe` |
|`trim` ( [ LEADING \| TRAILING \| BOTH ] \[ *characters* ] FROM *input_string* ) → *output_string* |Trims the longest contiguous substring of characters from the beginning, end, or both ends (BOTH by default) of `input_string` that contains only the characters specified in `characters` (which defaults to whitespace if not specified).|`trim(' cake ')` → 'cake'<br/>`trim(both 'cba' from 'abcxyzabc')` → `xyz`<br/>|
|`trim` ( [ LEADING \| TRAILING \| BOTH ] [ FROM ] *input_string* [, *characters* ] ) → *output_string* |An alternative syntax of `trim()`.|`trim(both from 'abcxyzabc', 'cba')` → `xyz`<br/>`trim('abcxyzabc', 'cba')` → `xyz`|
|`upper` ( *input_string* ) → *output_string*|Converts the string to all uppercase.|`upper('tom')` → `TOM`|

## Pattern matching expressions

```sql
string NOT LIKE pattern [ ESCAPE '' ]
string LIKE pattern [ ESCAPE '' ]
```

The `LIKE` expression returns true if the string matches the supplied pattern. The `NOT LIKE` expression returns false if `LIKE` returns true.

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
