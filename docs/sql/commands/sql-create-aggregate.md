---
id: sql-create-aggregate
title: CREATE AGGREGATE
description: Create a user-defined aggregate function.
slug: /sql-create-aggregate
---
<head>
  <link rel="canonical" href="https://docs.risingwave.com/docs/current/sql-create-aggregate/" />
</head>

The `CREATE AGGREGATE` command can be used to create [user-defined aggregate functions](/sql/udf/user-defined-functions.md) (UDAFs). Currently, UDAFs are only supported in Python and JavaScript as embedded UDFs.

## Syntax

```sql
CREATE AGGREGATE function_name ( argument_type [, ...] )
    RETURNS return_type
    LANGUAGE language_name
    AS $$ function_body $$;
```

### Parameters

| Parameter or clause | Description |
| --- | --- |
| *function_name* | The name of the aggregate function that you want to declare in RisingWave. |
| *argument_type* | The data type of the input parameter(s) that the function expects to receive. |
| **RETURNS** *return_type* | The data type of the return value from the aggregate function. |
| **LANGUAGE** | The programming language used to implement the UDAF. <br/> Currently, `Python` and `JavaScript` are supported. |
| **AS** *function_body* | The source code of the UDAF. |

In the *function_body*, the code should define several functions to implement the aggregate function.

Required functions:

- `create_state() -> state`: Create a new state.
- `accumulate(state, *args) -> state`: Accumulate a new value into the state, returning the updated state.

Optional functions:

- `finish(state) -> value`: Get the result of the aggregate function. If not defined, the state is returned as the result.
- `retract(state, *args) -> state`: Retract a value from the state, returning the updated state. If not defined, the state can not be updated incrementally in materialized views and performance may be affected.

See examples below for more details.

## Examples

### Python

The following command creates an aggregate function named `weighted_avg` to calculate the weighted average.

```sql title="Python UDAF"
create aggregate weighted_avg(value int, weight int) returns float language python as $$
def create_state():
    return (0, 0)

def accumulate(state, value, weight):
    if value is None or weight is None:
        return state
    (s, w) = state
    s += value * weight
    w += weight
    return (s, w)

def retract(state, value, weight):
    if value is None or weight is None:
        return state
    (s, w) = state
    s -= value * weight
    w -= weight
    return (s, w)

def finish(state):
    (sum, weight) = state
    if weight == 0:
        return None
    else:
        return sum / weight
$$;
```

For more details, see [Use UDFs in Python](/sql/udf/udf-python-embedded.md).

### JavaScript

The following command creates an aggregate function named `weighted_avg` to calculate the weighted average.

```sql title="Javascript UDAF"
create aggregate weighted_avg(value int, weight int) returns float language javascript as $$
    export function create_state() {
        return { sum: 0, weight: 0 };
    }
    export function accumulate(state, value, weight) {
        if (value == null || weight == null) {
            return state;
        }
        state.sum += value * weight;
        state.weight += weight;
        return state;
    }
    export function retract(state, value, weight) {
        if (value == null || weight == null) {
            return state;
        }
        state.sum -= value * weight;
        state.weight -= weight;
        return state;
    }
    export function finish(state) {
        if (state.weight == 0) {
            return null;
        }
        return state.sum / state.weight;
    }
$$;
```

For more details, see [Use UDFs in JavaScript](/sql/udf/udf-javascript.md).

## See also

[DROP AGGREGATE](/sql/commands/sql-drop-aggregate.md) — Drop a user-defined aggregate function.

[CREATE FUNCTION](/sql/commands/sql-create-functions.md) — Create a user-defined scalar or table function.
