---
id: sql-function-mathematical
slug: /sql-function-mathematical
title: Mathematical functions and operators
---



## Mathematical operators

| Operator | Expression & Description | Example |
| ----------- | ----------- | ----------- |
| + | `operand1 + operand2` <br /> Addition. <br /> | 1 + 2 → 3 |
| - | `operand1 - operand2` <br /> Subtraction. <br /> | 1 - 2 → -1 |
| - | `- operand` <br /> Negation. <br /> | - (-1) → 1 |
| * | `operand1 * operand2` <br /> Multiplication. <br /> | 2 * 3 → 6 |
| / | `operand1 / operand2` <br /> Division (results are truncated for integers). <br /> | 3 / 2 → 1 <br /> 3.0 / 2 → 1.5 <br />  3 / 1.8 → 1.666... |
| % | `operand1 * operand2` <br /> Remainder (valid for smallint/int/bigint/numeric). <br /> | 3 % 2 → 1 |


## Mathematical functions

| Function | Description | Example |
| ----------- | ----------- | ----------- | 
| ABS (x) | Returns the absolute value of *x*. | ABS(-3) → 3 |
| ROUND (x numeric, y int) → numeric | Rounds *x* to *y* decimal places. *y* cannot be negative. | ROUND(1.23559, 2) → 1.24 |
| ROUND (numeric) → numeric <br /> ROUND (double precision) → double precision | Rounds to the nearest integer. | ROUND(1.23559) → 1 |
| FLOOR (numeric) → numeric <br /> FLOOR (double precision) → double precision | Returns the nearest integer less than or equal to the argument. | FLOOR(1.23559) → 1 <br /> FLOOR(-1.23559) → -2 |
| CEIL (numeric) → numeric <br /> FLOOR (double precision) → double precision | Returns the nearest integer greater than or equal to the argument. | CEIL(1.23559) → 2 <br /> CEIL(-1.23559) → -1 |

