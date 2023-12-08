---
id: sql-set
title: SET
description: Change a run-time parameter. 
slug: /sql-set
---
<head>
  <link rel="canonical" href="https://docs.risingwave.com/docs/current/sql-set/" />
</head>

Use the `SET` command to change a runtime parameter.

## Syntax

```sql
SET parameter_name { TO | = } { value | 'value' | DEFAULT};
```

## Parameters

|Parameter or clause        | Description           |
|---------------------------|-----------------------|
|*parameter_name*|Name of the runtime parameters.|
|*value*|New value of parameter. Values can be specified as string constants, identifiers, numbers, or comma-separated lists of these, as appropriate for the particular parameter. `DEFAULT` can be written to specify resetting the parameter to its default value (that is, whatever value it would have had if no `SET` had been executed in the current session).|
