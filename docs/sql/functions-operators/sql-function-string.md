---
id: sql-function-string
slug: /sql-function-string
title: String functions and operators
---


## String operators

| Operator | Expression & Description | Example |
| ----------- | ----------- | ----------- |
| \|\| | <code>expression1 &#124;&#124; expression2 [ &#124;&#124; expression ] ...</code> <br /> Concatenates two or more expressions. <br /> | <code>'Abcde' &#124;&#124; 1 &#124;&#124; 23 </code> → `Abcde123` |

## String functions

|Function|Description|Example|
|---|---|---|
|replace ( *input_string*, *from_string*, *to_string* ) → *output_string*|Replaces all occurrences of substring *from_string* in *input_string* with substring *to_string*.|`replace('abcdefabcdef', 'cd', 'XX')` → `abXXefabXXef`|
|trim ( *input_string* ) → *output_string*|Removes the longest string containing only spaces from the start and end of *input_string*.|`trim(' cake ')` → 'cake'|<!--Author: I didn't use the code tag `` for what's returned because `` truncates the empty spaces at the beginning and the end, and in this case, spaces should be kept. So I used '' which keeps the spaces. Same for the next two functions.-->
|ltrim ( *input_string* ) → *output_string*|Removes the longest string containing only spaces from the start of *input_string*.|`ltrim(' cake ')` → 'cake '|
|rtrim ( *input_string* ) → *output_string*|Removes the longest string containing only spaces from the end of *input_string*.|`rtrim(' cake ')` → ' cake'|
|substr/substring ( *input_string* , *start_int* [, *count_int* ]) → *output_string*|Extracts the substring from *input_string* starting at position *start_int* and extending for *count_int* characters, if specified. *start_int* should be equal to or larger than 1.| `substr('alphabet', 3)` → `phabet`; <br /> `substring('alphabet', 3, 2)` → `ph`|
|upper ( *input_string* ) → *output_string*|Converts the string to all uppercase.|`upper('tom')` → `TOM`|
|lower ( *input_string* ) → *output_string*|Converts the string to all lowercase.|`lower('TOM')` → `tom`|
|position ( *input_string*, *substring* ) → *integer_output*|Returns the starting index of the specified *substring* within *input_strin*, or zero if it is not present.|`position('high', 'ig')` → `2`|
|length ( *input_string* ) → *integer_output*|Returns the number of characters in *input_string*.|`length('jose')` → `4`|
|repeat ( *input_string*, *times_int* ) → *output_string*|Repeats *input_string* specific times. Null is returned when *times_int* is zero, negative, or null.|`repeat('A1b2', 3)` → `A1b2A1b2A1b2`|
|concat ( *any_input-value_1* [, *any_input-value_2* [, ...] ]) → *output_string* | Concatenates the arguments. NULL arguments are ignored. | `concat('Abcde', 2, NULL, 22)` → `Abcde222` |
|concat_ws ( *separator_string*, *any_input-value_1* [, *any_input-value_2* [, ...] ]) → *output_string* | Concatenates the arguments with a separator. The first argument is used as the separator, and should not be NULL. Other NULL arguments are ignored. | `concat_ws(',', 'Abcde', 2, NULL, 22)` → `Abcde,2,22` |
|split_part ( *input_string* , *delimiter_string*, *int_n* ) → varchar | Splits *input_string* at occurrences of *delimiter_string* and returns the *int_n*'th field (counting from one), or when *int_n* is negative, returns the \|*int_n*\|'th-from-last field. When *int_n* is zero, returns an 'InvalidParameterValue' error. When the input *delimiter_string* is an empty string, returns the *input_string* if querying the first or last field. Otherwise, returns an empty string. | `split_part('abc~@~def~@~ghi', '~@~', 2)` → `def` |
|regexp_match ( *input_string*, *pattern* ) → *matched_string* [] | Returns a string array of captured substring(s) resulting from the first match of a POSIX regular expression pattern to a string. If there is no match, the result is NULL.| `regexp_match('foobarbequebaz', '(bar)(beque)')` → `[bar,beque]` <br /> `regexp_match('abc', 'd')` → `NULL`|
|regexp_matches ( *input_string*, *pattern* ) → *set_of_matched_string* [] | Returns a set of string arrays of captured substring(s) resulting from matching a POSIX regular expression pattern to a string. Returns all matches by default.| `regexp_matches('foobarbequebazilbarfbonk', '(b[^b]+)(b[^b]+)')` → <br /> `{bar,beque}` <br /> `{bazil,barf}`|
|overlay ( *input_string* PLACING *substring* FROM *start_int* [ FOR *length_int* ]) → *output_string* | Replaces a substring in *input_string* with *substring*, starting at *start_int* and with *length_int*. If *length_int* is omitted, its value is the length of *substring*.| `overlay('yabadoo' PLACING 'daba' FROM 5 FOR 0)` → `yabadabadoo` <br /> `overlay('abcdef' PLACING '45' FROM 4)` → `abc45f`|



## Pattern matching expressions

```sql
string NOT LIKE pattern
string LIKE pattern
```

The `LIKE` expression returns true if the string matches the supplied pattern. The `NOT LIKE` expression returns false if `LIKE` returns true.

If the pattern does not contain percent signs or underscores, then the pattern only represents the string itself; in that case `LIKE` acts like the equals operator. An underscore (_) in a pattern stands for (matches) any single character; a percent sign (%) matches any sequence of zero or more characters.

Examples:

```sql
'abc' LIKE 'abc'           true
'abc' LIKE 'a%'            true
'abc' LIKE '_b_'           true
'abc' LIKE 'c'             false
```


ESCAPE is not supported yet. We are unable to match a literal underscore or percent sign without matching other characters.

