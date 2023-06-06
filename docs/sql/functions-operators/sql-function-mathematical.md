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
| ^ | `operand1 ^ operand2` <br /> Exponent. <br /> | 2.0 ^ -2 → 0.25 |


## Mathematical functions

| Function | Description | Example |
| ----------- | ----------- | ----------- | 
| abs ( *input_value* ) → *absolute_value* <br /> @ ( *input_value* ) → *absolute_value* | Returns the absolute value of *input_value*. The *input_value* can be type int or decimal. The return type is the same as the *input_value* type. | abs(-3) → 3 <br /> @(-3) → 3 |
| ceil ( *numeric_input* ) → *integer_output* <br /> ceil ( *double_precision_input* ) → *integer_output* | Returns the nearest integer greater than or equal to the argument. ceiling() can also be used an alias for ceil(). | ceil(1.23559) → 2 <br /> ceiling(-1.23559) → -1 |
| exp ( *double_precision_input* ) → *double_precision_output* | Returns the exponential value of *numeric*. | exp(2.0) → 7.38905609893065 |
| floor ( *numeric_input* ) → *integer_output* <br /> floor ( *double_precision_input* ) → *integer_output* | Returns the nearest integer less than or equal to the argument. | floor(1.23559) → 1 <br /> floor(-1.23559) → -2 |
| pow ( *x_double_precision*, *y_double_precision* ) → *double_precision_output* <br /> power ( *x_double_precision*, *y_double_precision* ) → *double_precision_output* | Returns *x_double_precision* raised to the power of *y_double_precision*. | pow(2.0, 3.0) → 8 <br /> power(2.0, 3.0) → 8|
| round ( *x_numeric*, *y_int* ) → *output_value* | Rounds *x_numeric* to *y_int* decimal places. *y* cannot be negative. | round(1.23559, 2) → 1.24 |
| round ( *numeric_input* ) → *integer_output* <br /> round ( *double_precision_input* ) → *integer_output* | Rounds to the nearest integer. | round(1.23559) → 1 |
| translate( *input_string*, *from_string*, *to_string*) → output_string | Replaces each character in the *input_string* that matches a character in the *from_string* with the corresponding character in the *to_string*. | translate('M1X3', '13', 'ae') → MaXe |

## Trigonometric functions

| Function | Description | Example |
| ----------- | ----------- | ----------- |
| sin ( *radians* ) → *sine* | Returns the trigonometric sine (in double precision) of an angle measured in radians (in double precision). | sin(1) → 0.8414709848078965 |
| cos ( *radians* ) → *cosine* | Returns the trigonometric cosine (in double precision) of an angle measured in radians (in double precision). | cos(1) → 0.5403023058681398 |
| tan ( *radians* ) → *tangent* | Returns the trigonometric tangent (in double precision) of an angle measured in radians (in double precision). | tan(1) → 1.5574077246549021 |
| cot ( *radians* ) → *cotangent* | Returns the trigonometric cotangent (in double precision) of an angle measured in radians (in double precision). | cot(1) → 0.6420926159343308 |
| asin ( *input_value* ) → *radians* | Returns the inverse sine (in radians and double precision) of a given value (in double precision). | asin(0.5) → 0.5235987755982989 |
| acos ( *input_value* ) → *radians* | Returns the inverse cosine (in radians and double precision) of a given value (in double precision). | acos(0.5) → 1.0471975511965976 |
| atan ( *input_value* ) → *radians* | Returns the inverse tangent (in radians and double precision) of a given value (in double precision). | atan(1.0) → 0.7853981633974483 |
| atan2 ( *y_value*, *x_value* ) → *radians* | Returns the inverse tangent (in radians and double precision) of the quotient of two given values (*y_value* divided by *x_value*). | atan2(1.0, 1.0) → 0.7853981633974483 |
| sinh ( *input_value* ) → *hyperbolic_sine* | Returns the hyperbolic sine (in double precision) of a given value (in double precision). | sinh(1.0) → 1.1752011936438014 |
| cosh ( *input_value* ) → *hyperbolic_cosine* | Returns the hyperbolic cosine (in double precision) of a given value (in double precision). | cosh(1.0) → 1.5430806348152437 |
| tanh ( *input_value* ) → *hyperbolic_tangent* | Returns the hyperbolic tangent (in double precision) of a given value (in double precision). | tanh(1.0) → 0.7615941559557649 |
| coth ( *input_value* ) → *hyperbolic_cotangent* | Returns the hyperbolic cotangent (in double precision) of a given value (in double precision). | coth(2) → 1.0373147207275481 |
| asinh ( *input_value* ) → *inverse_hyperbolic_sine* | Returns the inverse hyperbolic sine (in double precision) of a given value (in double precision). | asinh(1.0) → 0.881373587019543 |
| acosh ( *input_value* ) → *inverse_hyperbolic_cosine* | Returns the inverse hyperbolic cosine (in double precision) of a given value (in double precision). | acosh(2.0) → 1.3169578969248166 |
| atanh ( *input_value* ) → *inverse_hyperbolic_tangent* | Returns the inverse hyperbolic tangent (in double precision) of a given value (in double precision). | atanh(0.5) → 0.5493061443340548 |
| sind ( *degrees* ) → *sine* | Returns the trigonometric sine (in double precision) of an angle measured in degrees (in double precision). | sind(15) → 0.2588190451025207 |
| cosd ( *degrees* ) → *cosine* | Returns the trigonometric cosine (in double precision) of an angle measured in degrees (in double precision). | cosd(15) → 0.9659258262890683 |
| tand ( *degrees* ) → *tangent* | Returns the trigonometric tangent (in double precision) of an angle measured in degrees (in double precision). | tand(15) → 0.2679491924311227|
| cotd ( *degrees* ) → *cotangent* | Returns the trigonometric cotangent (in double precision) of an angle measured in degrees (in double precision) | cotd(45) → 1 |​