---
id: sql-function-mathematical
slug: /sql-function-mathematical
title: Mathematical functions and operators
description: Perform numerical calculations and analysis.
---
<head>
  <link rel="canonical" href="https://docs.risingwave.com/docs/current/sql-function-mathematical/" />
</head>

## Mathematical operators

| Operator | Expression & Description | Example |
| ----------- | ----------- | ----------- |
| `+` | `operand1 + operand2` <br /> Addition. | `1 + 2 → 3` |
| `-` | `operand1 - operand2` <br /> Subtraction. | `1 - 2 → -1` |
| `-` | `- operand` <br /> Negation. <br /> | `- (-1) → 1` |
| `*` | `operand1 * operand2` <br /> Multiplication. | `2 * 3 → 6` |
| `/` | `operand1 / operand2` <br /> Division (results are truncated for integers). | `3 / 2 → 1` <br /> `3.0 / 2 → 1.5` <br /> `3 / 1.8 → 1.666` |
| `%` | `operand1 % operand2` <br /> Remainder (valid for smallint/int/bigint/numeric). | `3 % 2 → 1` |
| `^` | `operand1 ^ operand2` <br /> Exponent. | `2.0 ^ -2 → 0.25` |
| `\|\|/` | <code>\|\|/ operand</code> <br /> Cube root. | `\|\|/ 27 → 3` |
| `@` | `@ operand` <br /> Absolute value. | `@ -10 → 10` |
| `&` | `operand1 & operand2` <br /> Bitwise AND | `91 & 15 → 11` |
| `\|` | <code>operand1 \| operand2</code> <br /> Bitwise OR | `32 \| 3 → 35` |
| `#` | `operand1 # operand2` <br /> Bitwise exclusive OR | `17 # 5 → 20` |
| `~` | `~ operand` <br /> Bitwise NOT | `~1 → -2` |
| `<<` | `operand1 << operand2` <br /> Bitwise shift left | `1 << 4 → 16` |
| `>>` | `operand1 >> operand2` <br /> Bitwise shift right | `8 >> 2 → 2` |

## Mathematical functions

| Function | Description | Example |
| ----------- | ----------- | ----------- |
| abs ( *input_value* ) → *absolute_value* <br /> @ ( *input_value* ) → *absolute_value* | Returns the absolute value of *input_value*. The *input_value* can be type int or decimal. The return type is the same as the *input_value* type. | abs(-3) → 3 <br /> @(-3) → 3 |
| cbrt ( *double_precision_input* ) → *double_precision_output* | Returns the cube root of the input. | cbrt(27) → 3 |
| ceil ( *numeric_input* ) → *integer_output* <br /> ceil ( *double_precision_input* ) → *integer_output* | Returns the nearest integer greater than or equal to the argument. ceiling() can also be used as an alias for ceil(). | ceil(1.23559) → 2 <br /> ceiling(-1.23559) → -1 |
| exp ( *double_precision_input* ) → *double_precision_output* <br /> exp ( *numeric_input* ) → *numeric_output*| Returns the exponential value of *numeric*. | exp(2.0) → 7.38905609893065 |
| floor ( *numeric_input* ) → *integer_output* <br /> floor ( *double_precision_input* ) → *integer_output* | Returns the nearest integer less than or equal to the argument. | floor(1.23559) → 1 <br /> floor(-1.23559) → -2 |
| ln ( *double_precision_input* ) → *double_precision_output* <br /> ln ( *numeric_input* ) → *numeric_output*| Returns the natural logarithmic value of the input. | ln(10) → 2.302585092994046 |
| log10 ( *double_precision_input* ) → *double_precision_output* <br /> log10 ( *numeric_input* ) → *numeric_output*| Returns the log base 10 value of the input value. log() can also be used and accepts the same input types. | log10(25) → 1.3979400086720377 |
| min_scale ( *numeric_input* ) → *integer_output* | Minimum scale (number of fractional decimal digits) needed to represent the supplied value precisely| min_scale(8.4100) → 2 |
| pow ( *x_double_precision*, *y_double_precision* ) → *double_precision* <br /> pow ( *x_numeric*, *y_numeric* ) → *numeric* | Returns *x_double_precision* or *x_numeric* raised to the power of *y_double_precision* or *y_numeric*. power() can also be used as an alias for pow(). | pow(2.0, 3.0) → 8 <br /> power(2.0, 3.0) → 8|
| round ( *x_numeric*, *y_int* ) → *output_value* | Rounds *x_numeric* to *y_int* decimal places. *y_int* can be negative.| round(1.23559, 2) → 1.24 |
| round ( *numeric_input* ) → *integer_output* <br /> round ( *double_precision_input* ) → *integer_output* | Rounds to the nearest integer. | round(1.23559) → 1 |
| scale ( *numeric_input* ) → *integer_output* | Scale of the argument (the number of decimal digits in the fractional part) | scale(8.4100) → 4 |
| sign(*double_precision_input* or *decimal_input*) -> *same_as_input* | Returns the sign of the input value as -1 if the input is negative, 1 if the input is positive, or 0 if the input is 0. | sign(8.64) → 1 <br /> sign(-8.64) → -1 |
| sqrt ( *numeric_input* ) → *numeric_output* <br /> sqrt ( *double_precision_input* ) → *double_precision_output*| Returns the square root of the input. | sqrt(16) → 4|
| trim_scale ( *numeric_input* ) → *numeric_output* | Reduces the value's scale (number of fractional decimal digits) by removing trailing zeroes| trim_scale(8.4100) → 8.41 |
| trunc ( *double_precision_input* ) → *double_precision_output* <br /> trunc ( *numeric_input* ) → *numeric_output*| Truncate the input value to zero decimal places. | trunc(-20.0932) → -20 |

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
| atanh ( *input_value* ) → *inverse_hyperbolic_tangent* | Returns the inverse hyperbolic tangent (in double precision) of a given value (in double precision). | atanh(0.5) → 0.5493061443340549 |
| sind ( *degrees* ) → *sine* | Returns the trigonometric sine (in double precision) of an angle measured in degrees (in double precision). | sind(15) → 0.2588190451025208 |
| cosd ( *degrees* ) → *cosine* | Returns the trigonometric cosine (in double precision) of an angle measured in degrees (in double precision). | cosd(15) → 0.9659258262890683 |
| tand ( *degrees* ) → *tangent* | Returns the trigonometric tangent (in double precision) of an angle measured in degrees (in double precision). | tand(15) → 0.26794919243112275 |
| cotd ( *degrees* ) → *cotangent* | Returns the trigonometric cotangent (in double precision) of an angle measured in degrees (in double precision). | cotd(45) → 1 |​
| acosd ( *degrees* ) → *inverse_cosine* | Returns the trigonometric inverse cosine (in double precision) of an angle measured in degrees (in double precision).  | acosd(0.25) → 75.52248781407008 |​

## Degrees and radians functions

| Function | Description | Example |
| ----------- | ----------- | ----------- |
| degrees ( *radians* ) → *degrees* | Returns the conversion (in double precision) of an angle measured in radians (in double precision) to degrees. | degrees(pi()/2) → 90 |
| radians ( *degrees* ) → *radians* | Returns the conversion (in double precision) of an angle measured in degrees (in double precision) to radians. | radians(180) → 3.141592653589793 |
