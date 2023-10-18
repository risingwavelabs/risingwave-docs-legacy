---
id: sql-set-background-ddl
title: SET BACKGROUND_DDL
description: Run Data Definition Language (DDL) operations in the background.
slug: /sql-set-background-ddl
---
<head>
  <link rel="canonical" href="https://docs.risingwave.com/docs/current/sql-set-background-ddl/" />
</head>

:::caution Experimental feature
The `SET BACKGROUND_DDL` command is currently an experimental feature. Its functionality is subject to change. We cannot guarantee its continued support in future releases, and it may be discontinued without notice. You may use this feature at your own risk.
:::

Use the `SET BACKGROUND_DDL` command to run Data Definition Language (DDL) operations, such as creating materialized views in the background.

When `BACKGROUND_DDL` is set to true, RisingWave will immediately return a response when you execute a DDL operation, allowing you to proceed with other tasks. 

## Syntax

```sql
SET BACKGROUND_DDL = { true | false };
```

## Examples

```sql
CREATE TABLE t (v1 int);

INSERT INTO t SELECT * FROM generate_series(1, 1000000);

SET BACKGROUND_DDL=true;

CREATE MATERIALIZED VIEW m AS SELECT * FROM t; 
-- The "CREATE_MATERIALIZED_VIEW" response will be returned immediately.
```