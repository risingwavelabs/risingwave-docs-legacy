---
id: sql-function-comparison
slug: /sql-function-comparison
title: Comparison functions and operators
---



## Comparison operators

| Operator | Expression & Description | Example |
| ----------- | ----------- | ----------- |
| = | `operand1 = operand2` <br /> Equal. <br /> TRUE if the operands separated by = have the same value. | 1 = 1 → t <br /> '1' = 1 → t <br /> 'a' = 'b' → f <br /> (1, 0) = (1, 1) → f <br /> ('a', 'b') = ('a', 'b') → t |
| &lt;&gt; <br/> != | `operand1 <> operand2` or `operand1 != operand2` <br /> Not equal. <br /> TRUE if the operands separated by &lt;&gt; or != have different values. | 1 &lt;&gt; 1 → f <br /> '1' != 1 → f <br /> 'a' != 'b' → t <br /> (1, 0) &lt;&gt; (1, 1) → t <br /> ('a', 'b') != ('a', 'b') → f|
| &lt; | `operand1 < operand2` <br /> Less than. <br /> TRUE if *operand1* is less than *operand2*. | 0 &lt; 1 → t <br /> 1 &lt; 1 → f|
| &lt;= | `operand1 <= operand2` <br /> Less than or equal to. <br /> TRUE if *operand1* is less than or equal to *operand2*. | 1 &lt;= 1 → t <br /> 1 &lt;= 0 → f |
| &gt; | `operand1 > operand2` <br /> Greater than. <br /> TRUE if *operand1* is greater than *operand2*. | 1 &gt; 0 → t <br /> 1 &gt; 1 → f |
| &gt;= | `operand1 >= operand2` <br /> Greater than or equal to. <br /> TRUE if *operand1* is greater than or equal to *operand2*. | 1 &gt;= 1 → t <br /> 0 &gt;= 1 → f |



## Comparison predicate

| Operator | Expression & Description | Example |
| ----------- | ----------- | ----------- |
| IS DISTINCT FROM | `operand1 IS DISTINCT FROM operand2` <br /> Equal (null comparible). <br /> TRUE if *operand1* is not equal to *operand2*. | 1 IS DISTINCT FROM NULL → t <br /> 1 IS DISTINCT FROM 1 → f  |
| IS NOT DISTINCT FROM | `operand1 IS NOT DISTINCT FROM operand2` <br />Not equal (null comparible). <br />  TRUE if *operand1* is equal to *operand2*. | 1 IS NOT DISTINCT FROM NULL → f <br /> |
| BETWEEN ... AND ... | `operand BETWEEN min AND max` <br /> Between (inclusive range). <br /> TRUE if the operand is greater than or equal to *min* and less than or equal to *max*. | 1 BETWEEN 0 AND 1 → t <br /> 'c' BETWEEN 'a' AND 'b' → f |
| NOT BETWEEN ... AND ... | `operand NOT BETWEEN min AND max` <br /> Not between (inclusive range). <br /> TRUE if the operand is less than *min* and greater than *max*. | 1 NOT BETWEEN 0 AND 1 → f |
| IN() | `operand IN (value,...)` <br /> Whether a value is equal to any of the values you specify. <br /> TRUE if the operand is equal to one of the specified expressions/values. NULL if the operand is null or if the operand is not in the specified expressions/values that contain a null. | 1 IN (0,1,2,3) → t <br /> 'a' IN ('ab','b','c','d') → f <br /> null IN (null, 3, 0.5*2, min(v1)) → NULL <br /> 99 IN (null, 3, 2) → NULL |
| NOT IN() | `operand NOT IN (value,...)` <br /> Whether a value is not equal to any of the values you specify. <br /> TRUE if the operand is not equal to any specified expressions/values. | 1 NOT IN (0,1,2,3) → f |
| IS TRUE | `boolean IS TRUE` <br /> Whether a boolean expression is true. <br /> | true IS TRUE → t <br /> null::boolean IS TRUE → f |
| IS NOT TRUE | `boolean IS TRUE` <br /> Whether a boolean expression is false or unknown. <br /> | true IS NOT TRUE → f <br /> null::boolean IS NOT TRUE → t |
| IS FALSE | `boolean IS FALSE` <br /> Whether a boolean expression is false. <br /> | true IS FALSE → f <br /> null::boolean IS FALSE → f |
| IS NOT FALSE | `boolean IS NOT FALSE` <br /> Whether a boolean expression is true or unknown. <br /> | true IS NOT FALSE → t <br /> null::boolean IS NOT FALSE → t |
| IS NULL | `value IS NULL` <br /> Whether a value is null. <br /> | 1 IS NULL → f |
| IS NOT NULL | `value IS NOT NULL` <br /> Whether a value is not null. <br /> | 1 IS NOT NULL → t |
