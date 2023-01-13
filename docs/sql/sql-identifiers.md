---
id: sql-identifiers
slug: /sql-identifiers
title: Identifiers
---

## Naming restrictions

* The first character of an identifier must be an ASCII letter (e.g., `a`-`z` and `A`-`Z`) or an underscore (`_`).
* The remaining characters of an identifier must be ASCII letters (e.g., `a`-`z` and `A`-`Z`), underscores (`_`), ASCII digits (`0`-`9`), or dollar signs (`$`).
* Non-ASCII characters in unquoted identifiers are not allowed.
* You can circumvent any above rules by double-quoting the identifier (e.g., `"5_source"`). All characters inside a quoted identifier are taken literally, except double-quotes must be escaped by writing two adjacent double-quotes, as in (e.g., `"two""quotes"`).


## Case sensitivity

Identifiers are case-insensitive. It means `wave`, `WAVE`, and `wAve` are the same identifier in RisingWave. This can cause issues when column names come from data sources that do support case-sensitive names, such as Avro-formatted sources or CSV headers.

To avoid conflicts, double-quote all field names (e.g., `"field_name"`) when working with case-sensitive sources.

RisingWave processes unquoted identifers as in lower cases. If you create a table named `WAVE`, it will display as `wave` when you choose to list all tables. You can reference it by `wave`, `WAVE`, or a combination of upper- and lower cases in SQL statements.