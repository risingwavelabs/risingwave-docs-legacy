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
| abs ( *input_value* ) → *absolute_value* | Returns the absolute value of *input_value*. The *input_value* can be type int or decimal. The return type is the same as the *input_value* type. | abs(-3) → 3 |
| round ( *x_numeric*, *y_int* ) → *output_value* | Rounds *x_numeric* to *y_int* decimal places. *y* cannot be negative. | round(1.23559, 2) → 1.24 |
| round ( *numeric_input* ) → *integer_output* <br /> round ( *double_precision_input* ) → *integer_output* | Rounds to the nearest integer. | round(1.23559) → 1 |
| floor ( *numeric_input* ) → *integer_output* <br /> floor ( *double_precision_input* ) → *integer_output* | Returns the nearest integer less than or equal to the argument. | floor(1.23559) → 1 <br /> floor(-1.23559) → -2 |
| ceil ( *numeric_input* ) → *integer_output* <br /> ceil ( *double_precision_input* ) → *integer_output* | Returns the nearest integer greater than or equal to the argument. | ceil(1.23559) → 2 <br /> ceil(-1.23559) → -1 |

