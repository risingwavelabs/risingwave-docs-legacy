---
id: sql-identifiers
slug: /sql-identifiers
title: Identifiers
---
<head>
  <link rel="canonical" href="https://docs.risingwave.com/docs/current/sql-identifiers/" />
</head>

## Naming restrictions

* The first character of an identifier must be an ASCII letter (e.g., `a`-`z` and `A`-`Z`) or an underscore (`_`).
* The remaining characters of an identifier must be ASCII letters (e.g., `a`-`z` and `A`-`Z`), underscores (`_`), ASCII digits (`0`-`9`), or dollar signs (`$`).
* Non-ASCII characters in unquoted identifiers are not allowed.
* You can circumvent any above rules by double-quoting the identifier (e.g., `"5_source"`). All characters inside a quoted identifier are taken literally, except double-quotes must be escaped by writing two adjacent double-quotes, as in (e.g., `"two""quotes"`).
* In an **expression**, certain names are interpreted as builtins rather than column names. For example:

    ```sql title="Names interpreted as builtins"
    SELECT user; -- This is the builtin `user`.

    SELECT user, avatar FROM t; -- This is also the builtin `user`, rather than a column from the table `t`.
    ```

  Several names also require special attention, including **`user`, `current_timestamp`, `current_schema`, `current_role`, `current_user`,** and **`session_user`**. To avoid such issues, you can either avoid naming a column with these words, or qualify it with the table name (as shown in the example below) when such ambiguity happens.

  ```sql title="Solution to avoid naming conflicts"
  SELECT t.user, avatar FROM t; -- Qualify it with `t.` to select the column rather than the builtin.
  ```

## Case sensitivity

Identifiers are case-insensitive. It means `wave`, `WAVE`, and `wAve` are the same identifier in RisingWave. This can cause issues when column names come from data sources that do support case-sensitive names, such as Avro-formatted sources or CSV headers.

To avoid conflicts, double-quote all field names (e.g., `"field_name"`) when working with case-sensitive sources.

RisingWave processes unquoted identifers as in lower cases. If you create a table named `WAVE`, it will display as `wave` when you choose to list all tables. You can reference it by `wave`, `WAVE`, or a combination of upper- and lower cases in SQL statements.