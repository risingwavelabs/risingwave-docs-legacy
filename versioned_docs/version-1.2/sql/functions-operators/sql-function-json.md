---
id: sql-function-json
slug: /sql-function-json
title: JSON functions and operators
---
<head>
  <link rel="canonical" href="https://docs.risingwave.com/docs/current/sql-function-json/" />
</head>

## JSON functions

### `jsonb_array_elements`

Expands the top-level JSON array into a set of JSON values.

```bash title=Syntax
jsonb_array_elements ( jsonb ) → setof jsonb
```

```sql title=Example
SELECT * FROM jsonb_array_elements('[1,true, [2,false]]'::jsonb);
------RESULT
1
true
[2, false]
```

### `jsonb_array_elements_text`

Expands the top-level JSON array into a set of text (varchar) values.

```bash title=Syntax
jsonb_array_elements_text ( jsonb ) → setof varchar
```

```sql title=Example
SELECT * FROM jsonb_array_elements_text('["foo", "bar"]'::jsonb)
------RESULT
foo
bar
```

### `jsonb_array_length`

Returns the number of elements in the top-level JSON array.

```bash title=Syntax
jsonb_array_length ( jsonb ) → integer
```

```sql title=Example
SELECT jsonb_array_length('[1,2,3,{"f1":1,"f2":[5,6]},4]');
------RESULT
5
```

### `jsonb_each`

Expands the top-level JSON object into a set of key-value pairs.

```bash title=Syntax
jsonb_each ( jsonb ) → setof record ( key varchar, value jsonb )
```

```sql title=Example
SELECT * FROM jsonb_each('{"a":"foo", "b":"bar"}'::jsonb);
------RESULT
a "foo"
b "bar"
```

### `jsonb_each_text`

Expands the top-level JSON object into a set of key-value pairs. The returned values will be of type varchar.

```bash title=Syntax
jsonb_each_text ( jsonb ) → setof record ( key varchar, value varchar )
```

```sql title=Example
SELECT * FROM jsonb_each_text('{"a":"foo", "b":"bar"}'::jsonb);
------RESULT
 key | value 
-----+-------
 a   | foo
 b   | bar

```

### `jsonb_object_keys`

Returns the set of keys in the top-level JSON object.

```bash title=Syntax
jsonb_object_keys ( jsonb ) → setof varchar
```

```sql title=Example
SELECT * FROM jsonb_object_keys('{"f1":"abc","f2":{"f3":"a", "f4":"b"}}'::jsonb);
------RESULT
f1
f2
```

### `jsonb_typeof`

Returns the type of the top-level JSON value as a text string.

```bash title=Syntax
jsonb_typeof ( jsonb ) → varchar
```

```sql title=Example
SELECT jsonb_typeof ('-123.4');
------RESULT
number

```

## JSON operators

### `jsonb -> integer`

Extracts the n'th element of a JSON array (array elements are indexed from zero, but negative integers count from the end).

```bash title=Syntax
jsonb -> integer → jsonb
```

```sql title=Example
SELECT'[{"a":"foo"},{"b":"bar"},{"c":"baz"}]'::jsonb -> 2;
------RESULT
 {"c":"baz"}
```

### `jsonb -> varchar`

Extracts JSON object field with the given key.

```bash title=Syntax
jsonb -> varchar → jsonb
```

```sql title=Example
SELECT '{"a": {"b":"foo"}}'::jsonb -> 'a';
------RESULT
 {"b": "foo"}
```

### `jsonb ->> integer`

Extracts the n'th element of a JSON array, as text.

```bash title=Syntax
jsonb ->> integer → varchar
```

```sql title=Example
SELECT '[1,2,3]'::jsonb ->> 2;
------RESULT
3
```

### `jsonb ->> varchar`

Extracts JSON object field with the given key, as text.

```bash title=Syntax
jsonb ->> varchar → varchar
```

```sql title=Example
SELECT '{"a":1,"b":2}'::jsonb ->> 'b';
------RESULT
2
```

## `IS JSON` predicate

This predicate tests whether an expression can be parsed as JSON, optionally of a specified type. It evaluates the JSON structure and returns a boolean result indicating whether the value matches the specified JSON type.

#### Syntax

```sql
expression IS [ NOT ] JSON [ VALUE | ARRAY | OBJECT | SCALAR ] → bool
```

If SCALAR, ARRAY, or OBJECT is specified, the test is whether or not the JSON is of that particular type.

#### Example

```sql
SELECT js,
  js IS JSON "json?",
  js IS JSON SCALAR "scalar?",
  js IS JSON OBJECT "object?",
  js IS JSON ARRAY "array?"
FROM (VALUES
      ('123'), ('"abc"'), ('{"a": "b"}'), ('[1,2]'),('abc')) foo(js);
```
```
------RESULT

 js         | json? | scalar? | object? | array?
------------+-------+---------+---------+---------
 123        | t     | t       | f       | f
 "abc"      | t     | t       | f       | f
 {"a": "b"} | t     | f       | t       | f
 [1,2]      | t     | f       | f       | t
 abc        | f     | f       | f       | f
```
