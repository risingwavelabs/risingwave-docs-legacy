---
id: sql-describe
title: DESCRIBE
description: Get information about the columns in a table, source, or materialized view.
slug: /sql-describe
---

<head>
  <link rel="canonical" href="https://docs.risingwave.com/docs/current/sql-describe/" />
</head>

Use the `DESCRIBE` command to view columns in the specified table, source, or materialized view.

`DESCRIBE` is a shortcut for [`SHOW COLUMNS`](sql-show-columns.md).

:::tip

`DESCRIBE` also lists the indexes on a table or materialized view, whereas `SHOW COLUMNS` doesn't.

:::

## Syntax

```sql
DESCRIBE relation_name;
```

import rr from '@theme/RailroadDiagram'

export const svg = rr.Diagram(
rr.Sequence(
rr.Terminal('DESCRIBE'),
rr.NonTerminal('relation_name', 'skip'),
rr.Terminal(';')
)
);

<Drawer SVG={svg} />

## Parameters

| Parameter or clause | Description                                                           |
| ------------------- | --------------------------------------------------------------------- |
| _relation_name_     | The table, source, or materialized view whose columns will be listed. |

## Example

```sql title=Preparation
CREATE TABLE customers (
  customer_id BIGINT PRIMARY KEY,
  name VARCHAR,
  email VARCHAR
);
COMMENT ON COLUMN customers.customer_id IS 'Unique identifier for each customer';
COMMENT ON COLUMN customers.name IS 'Name of the customer';
COMMENT ON COLUMN customers.email IS 'Email address of the customer';
COMMENT ON TABLE customers IS 'All customer records';
CREATE INDEX idx_customers_email ON customers(email);
```

After creating the table, columns, and indexes, as well as adding comments to each of them, we can use the `DESCRIBE` command to see all the information in a structured format.

```sql title=Output
DESCRIBE customers;
```

```markdown
| Name                | Type                                                                  | Is Hidden | Description                         |
| ------------------- | --------------------------------------------------------------------- | --------- | ----------------------------------- |
| customer_id         | bigint                                                                | false     | Unique identifier for each customer |
| name                | character varying                                                     | false     | Name of the customer                |
| email               | character varying                                                     | false     | Email address of the customer       |
| primary key         | customer_id                                                           |           |                                     |
| distribution key    | customer_id                                                           |           |                                     |
| idx_customers_email | index(email ASC, customer_id ASC) include(name) distributed by(email) |           |                                     |
| table description   | customers                                                             |           | All customer records                |
```
