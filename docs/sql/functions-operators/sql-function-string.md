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
|REPLACE (string varchar, from_string varchar, to_string varchar) → varchar|Replaces all occurrences of substring *from_string* in *string* with substring *to_string*.|`REPLACE('abcdefabcdef', 'cd', 'XX')` → `abXXefabXXef`|
|TRIM (string varchar) → varchar|Removes the longest string containing only spaces from the start and end of *string*.|`TRIM(' cake ')` → 'cake'|<!--Author: I didn't use the code tag `` for what's returned because `` truncates the empty spaces at the beginning and the end, and in this case, spaces should be kept. So I used '' which keeps the spaces. Same for the next two functions.-->
|LTRIM (string varchar) → varchar|Removes the longest string containing only spaces from the start of *string*.|`LTRIM(' cake ')` → 'cake '|
|RTRIM (string varchar) → varchar|Removes the longest string containing only spaces from the end of *string*|`RTRIM(' cake ')` → ' cake'|
|SUBSTR/SUBSTRING (string varchar, start int [, count int ]) → varchar|Extracts the substring from *string* starting at position *start* and extending for *count* characters, if specified. *start* should be equal to or larger than 1.| `SUBSTR('alphabet', 3)` → `phabet`; <br /> `SUBSTRING('alphabet', 3, 2)` → `ph`|
|UPPER (varchar) → varchar|Converts the string to all uppercase.|`UPPER('tom')` → `TOM`|
|LOWER (varchar) → varchar|Converts the string to all lowercase.|`LOWER('TOM')` → `tom`|
|POSITION (string varchar, substring varchar) → int	|Returns the starting index of the specified *substring* within *string*, or zero if it is not present.|`POSITION('high', 'ig')` → `2`|
|LENGTH (varchar) → int|Returns the number of characters in the string.|`LENGTH('jose')` → `4`|
|REPEAT ( string varchar, times int ) → varchar|Repeats *string* specific times. Null is returned when *times* is zero, negative, or null.|`REPEAT('A1b2', 3)` → `A1b2A1b2A1b2`|
|CONCAT (val1 any [, val2 any [, ...] ]) → varchar | Concatenates the arguments. NULL arguments are ignored. | `CONCAT('Abcde', 2, NULL, 22)` → `Abcde222` |
|CONCAT_WS (sep varchar, val1 any [, val2 any [, ...] ]) → varchar | Concatenates the arguments with a separator. The first argument is used as the separator, and should not be NULL. Other NULL arguments are ignored. | `CONCAT_WS(',', 'Abcde', 2, NULL, 22)` → `Abcde,2,22` |
|SPLIT_PART (string varchar, delimiter varchar, n int) → varchar | Splits *string* at occurrences of *delimiter* and returns the *n*'th field (counting from one), or when *n* is negative, returns the \|*n*\|'th-from-last field. When n is zero, returns an 'InvalidParameterValue' error. When the input *delimiter* is an empty string, returns the input *string* if querying the first or last field. Otherwise, returns an empty string. | `SPLIT_PART('abc~@~def~@~ghi', '~@~', 2)` → `def` |


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

