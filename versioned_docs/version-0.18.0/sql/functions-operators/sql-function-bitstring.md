---
id: sql-function-bitstring
slug: /sql-function-bitstring
title: Bit string operators
---


| Operator | Expression & Description | Example |
| ----------- | ----------- | ----------- |
| ~ | `~ operand` <br /> Bitwise not. | ~ 1 → -2 |
| &amp; | `operand1 & operand2` <br /> Bitwise and. | 3 &amp; 5 → 1 |
| &#124; | operand1 &#124; operand2 <br /> Bitwise or. | 3 &#124; 5 → 7 |
| &num; | `operand1 # operand2` <br /> Bitwise xor. | 3 &num; 5 → 6 |
| &lt;&lt; | `operand1 << operand2` <br /> Bitwise left shift. | 1 &lt;&lt; 2 → 4 |
| &gt;&gt; | `operand1 >> operand2` <br /> Bitwise right shift. | 4 &gt;&gt; 2 → 1 |

