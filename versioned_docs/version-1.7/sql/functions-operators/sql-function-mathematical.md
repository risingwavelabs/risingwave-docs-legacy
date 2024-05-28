---
id: sql-function-mathematical
slug: /sql-function-mathematical
title: Mathematical functions and operators
---

<head>
  <link rel="canonical" href="https://docs.risingwave.com/docs/current/sql-function-mathematical/" />
</head>

## Mathematical operators

| Operator | Expression & Description                                                        | Example                                                  |
| -------- | ------------------------------------------------------------------------------- | -------------------------------------------------------- |
| +        | `operand1 + operand2` <br /> Addition.                                          | 1 + 2 → 3                                                |
| -        | `operand1 - operand2` <br /> Subtraction.                                       | 1 - 2 → -1                                               |
| -        | `- operand` <br /> Negation. <br />                                             | - (-1) → 1                                               |
| \*       | `operand1 * operand2` <br /> Multiplication.                                    | 2 \* 3 → 6                                               |
| /        | `operand1 / operand2` <br /> Division (results are truncated for integers).     | 3 / 2 → 1 <br /> 3.0 / 2 → 1.5 <br /> 3 / 1.8 → 1.666... |
| %        | `operand1 % operand2` <br /> Remainder (valid for smallint/int/bigint/numeric). | 3 % 2 → 1                                                |
| ^        | `operand1 ^ operand2` <br /> Exponent.                                          | 2.0 ^ -2 → 0.25                                          |
| \|\|/    | <code>\|\|/ operand</code> <br /> Cube root.                                    | \|\|/ 27 → 3                                             |
| @        | `@ operand` <br /> Absolute value.                                              | @ -10 → 10                                               |
| &        | `operand1 & operand2` <br /> Bitwise AND                                        | 91 & 15 → 11                                             |
| \|       | <code>operand1 \| operand2</code> <br /> Bitwise OR                             | 32 \| 3 → 35                                             |
| #        | `operand1 # operand2` <br /> Bitwise exclusive OR                               | 17 # 5 → 20                                              |
| ~        | `~ operand` <br /> Bitwise NOT                                                  | ~1 → -2                                                  |
| \<\<     | `operand1 << operand2` <br /> Bitwise shift left                                | 1 \<\< 4 → 16                                            |
| \>\>     | `operand1 >> operand2` <br /> Bitwise shift right                               | 8 \>\> 2 → 2                                             |

## Mathematical functions

| Function                                                                                                                    | Description                                                                                                                                             | Example                                         |
| --------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------- |
| abs ( _input_value_ ) → _absolute_value_ <br /> @ ( _input_value_ ) → _absolute_value_                                      | Returns the absolute value of _input_value_. The _input_value_ can be type int or decimal. The return type is the same as the _input_value_ type.       | abs(-3) → 3 <br /> @(-3) → 3                    |
| cbrt ( _double_precision_input_ ) → _double_precision_output_                                                               | Returns the cube root of the input.                                                                                                                     | cbrt(27) → 3                                    |
| ceil ( _numeric_input_ ) → _integer_output_ <br /> ceil ( _double_precision_input_ ) → _integer_output_                     | Returns the nearest integer greater than or equal to the argument. ceiling() can also be used as an alias for ceil().                                   | ceil(1.23559) → 2 <br /> ceiling(-1.23559) → -1 |
| exp ( _double_precision_input_ ) → _double_precision_output_ <br /> exp ( _numeric_input_ ) → _numeric_output_              | Returns the exponential value of _numeric_.                                                                                                             | exp(2.0) → 7.38905609893065                     |
| floor ( _numeric_input_ ) → _integer_output_ <br /> floor ( _double_precision_input_ ) → _integer_output_                   | Returns the nearest integer less than or equal to the argument.                                                                                         | floor(1.23559) → 1 <br /> floor(-1.23559) → -2  |
| ln ( _double_precision_input_ ) → _double_precision_output_ <br /> ln ( _numeric_input_ ) → _numeric_output_                | Returns the natural logarithmic value of the input.                                                                                                     | ln(10) → 2.302585092994046                      |
| log10 ( _double_precision_input_ ) → _double_precision_output_ <br /> log10 ( _numeric_input_ ) → _numeric_output_          | Returns the log base 10 value of the input value. log() can also be used and accepts the same input types.                                              | log10(25) → 1.3979400086720377                  |
| min*scale ( \_numeric_input* ) → _integer_output_                                                                           | Minimum scale (number of fractional decimal digits) needed to represent the supplied value precisely                                                    | min_scale(8.4100) → 2                           |
| pow ( _x_double_precision_, _y_double_precision_ ) → _double_precision_ <br /> pow ( _x_numeric_, _y_numeric_ ) → _numeric_ | Returns _x_double_precision_ or _x_numeric_ raised to the power of _y_double_precision_ or _y_numeric_. power() can also be used as an alias for pow(). | pow(2.0, 3.0) → 8 <br /> power(2.0, 3.0) → 8    |
| round ( _x_numeric_, _y_int_ ) → _output_value_                                                                             | Rounds _x_numeric_ to _y_int_ decimal places. _y_int_ can be negative.                                                                                  | round(1.23559, 2) → 1.24                        |
| round ( _numeric_input_ ) → _integer_output_ <br /> round ( _double_precision_input_ ) → _integer_output_                   | Rounds to the nearest integer.                                                                                                                          | round(1.23559) → 1                              |
| scale ( _numeric_input_ ) → _integer_output_                                                                                | Scale of the argument (the number of decimal digits in the fractional part)                                                                             | scale(8.4100) → 4                               |
| sign(_double_precision_input_ or _decimal_input_) -> _same_as_input_                                                        | Returns the sign of the input value as -1 if the input is negative, 1 if the input is positive, or 0 if the input is 0.                                 | sign(8.64) → 1 <br /> sign(-8.64) → -1          |
| sqrt ( _numeric_input_ ) → _numeric_output_ <br /> sqrt ( _double_precision_input_ ) → _double_precision_output_            | Returns the square root of the input.                                                                                                                   | sqrt(16) → 4                                    |
| trim*scale ( \_numeric_input* ) → _numeric_output_                                                                          | Reduces the value's scale (number of fractional decimal digits) by removing trailing zeroes                                                             | trim_scale(8.4100) → 8.41                       |
| trunc ( _double_precision_input_ ) → _double_precision_output_ <br /> trunc ( _numeric_input_ ) → _numeric_output_          | Truncate the input value to zero decimal places.                                                                                                        | trunc(-20.0932) → -20                           |

## Trigonometric functions

| Function                                               | Description                                                                                                                         | Example                              |
| ------------------------------------------------------ | ----------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------ | --- |
| sin ( _radians_ ) → _sine_                             | Returns the trigonometric sine (in double precision) of an angle measured in radians (in double precision).                         | sin(1) → 0.8414709848078965          |
| cos ( _radians_ ) → _cosine_                           | Returns the trigonometric cosine (in double precision) of an angle measured in radians (in double precision).                       | cos(1) → 0.5403023058681398          |
| tan ( _radians_ ) → _tangent_                          | Returns the trigonometric tangent (in double precision) of an angle measured in radians (in double precision).                      | tan(1) → 1.5574077246549021          |
| cot ( _radians_ ) → _cotangent_                        | Returns the trigonometric cotangent (in double precision) of an angle measured in radians (in double precision).                    | cot(1) → 0.6420926159343308          |
| asin ( _input_value_ ) → _radians_                     | Returns the inverse sine (in radians and double precision) of a given value (in double precision).                                  | asin(0.5) → 0.5235987755982989       |
| acos ( _input_value_ ) → _radians_                     | Returns the inverse cosine (in radians and double precision) of a given value (in double precision).                                | acos(0.5) → 1.0471975511965976       |
| atan ( _input_value_ ) → _radians_                     | Returns the inverse tangent (in radians and double precision) of a given value (in double precision).                               | atan(1.0) → 0.7853981633974483       |
| atan2 ( _y_value_, _x_value_ ) → _radians_             | Returns the inverse tangent (in radians and double precision) of the quotient of two given values (_y_value_ divided by _x_value_). | atan2(1.0, 1.0) → 0.7853981633974483 |
| sinh ( _input_value_ ) → _hyperbolic_sine_             | Returns the hyperbolic sine (in double precision) of a given value (in double precision).                                           | sinh(1.0) → 1.1752011936438014       |
| cosh ( _input_value_ ) → _hyperbolic_cosine_           | Returns the hyperbolic cosine (in double precision) of a given value (in double precision).                                         | cosh(1.0) → 1.5430806348152437       |
| tanh ( _input_value_ ) → _hyperbolic_tangent_          | Returns the hyperbolic tangent (in double precision) of a given value (in double precision).                                        | tanh(1.0) → 0.7615941559557649       |
| coth ( _input_value_ ) → _hyperbolic_cotangent_        | Returns the hyperbolic cotangent (in double precision) of a given value (in double precision).                                      | coth(2) → 1.0373147207275481         |
| asinh ( _input_value_ ) → _inverse_hyperbolic_sine_    | Returns the inverse hyperbolic sine (in double precision) of a given value (in double precision).                                   | asinh(1.0) → 0.881373587019543       |
| acosh ( _input_value_ ) → _inverse_hyperbolic_cosine_  | Returns the inverse hyperbolic cosine (in double precision) of a given value (in double precision).                                 | acosh(2.0) → 1.3169578969248166      |
| atanh ( _input_value_ ) → _inverse_hyperbolic_tangent_ | Returns the inverse hyperbolic tangent (in double precision) of a given value (in double precision).                                | atanh(0.5) → 0.5493061443340549      |
| sind ( _degrees_ ) → _sine_                            | Returns the trigonometric sine (in double precision) of an angle measured in degrees (in double precision).                         | sind(15) → 0.2588190451025208        |
| cosd ( _degrees_ ) → _cosine_                          | Returns the trigonometric cosine (in double precision) of an angle measured in degrees (in double precision).                       | cosd(15) → 0.9659258262890683        |
| tand ( _degrees_ ) → _tangent_                         | Returns the trigonometric tangent (in double precision) of an angle measured in degrees (in double precision).                      | tand(15) → 0.26794919243112275       |
| cotd ( _degrees_ ) → _cotangent_                       | Returns the trigonometric cotangent (in double precision) of an angle measured in degrees (in double precision)                     | cotd(45) → 1                         | ​   |

## Degrees and radians functions

| Function                          | Description                                                                                                    | Example                          |
| --------------------------------- | -------------------------------------------------------------------------------------------------------------- | -------------------------------- |
| degrees ( _radians_ ) → _degrees_ | Returns the conversion (in double precision) of an angle measured in radians (in double precision) to degrees. | degrees(pi()/2) → 90             |
| radians ( _degrees_ ) → _radians_ | Returns the conversion (in double precision) of an angle measured in degrees (in double precision) to radians. | radians(180) → 3.141592653589793 |
