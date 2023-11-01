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

### `jsonb_strip_nulls`

Removes all object fields that have null values from a given JSONB value, recursively. Empty objects or null values that are not object fields are left untouched.


```bash title=Syntax
jsonb_strip_nulls ( jsonb ) → jsonb
```

```sql title=Example

Examples are not ready. Need test!!

-- Handling non-null values
SELECT jsonb_strip_nulls('{"a": 1, "b": null, "c": {"d": null, "e": 2}}');
------RESULT
{"a": 1, "c": {"e": 2}}

-- Empty object preservation
SELECT jsonb_strip_nulls('{"a": {"b": null, "c": null}, "d": {} }');
------RESULT
{"a": {"c": null}, "d": {}}
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

### `jsonb_pretty`

This function takes a `jsonb` value and returns a text representing the formatted, indented JSON value.

```sql title=Syntax
jsonb_pretty ( jsonb JSONB ) → TEXT
```

```sql title=Examples
SELECT jsonb_pretty('[{"f1":1,"f2":null}, 2]');
------RESULT
[
    {
        "f1": 1,
        "f2": null
    },
    2
]
```

### `jsonb_object`

This function takes an array of text elements and returns a `jsonb` object where adjacent pairs of values are taken as the key and value of an object property.

```sql title=Syntax
jsonb_object ( text_array TEXT[] ) → JSONB
```

```sql title=Examples
jsonb_object('{a, 1, b, def, c, 3.5}' :: text[]) → {"a": "1", "b": "def", "c": "3.5"}
jsonb_object(array['a', null]) → {"a": null}
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

### `(jsonb || jsonb) -> jsonb`

Concatenates jsonb data type.

```bash title=Syntax
(jsonb || jsonb) → jsonb
```

```sql title=Example
SELECT '["a", "b"]'::jsonb || '["a", "d"]'::jsonb;  
SELECT '{"a": "b"}'::jsonb || '{"c": "d"}'::jsonb;
SELECT '[1, 2]'::jsonb || '3'::jsonb;
SELECT '{"a": "b"}'::jsonb || '42'::jsonb;
------RESULT
["a", "b", "a", "d"]
{"a": "b", "c": "d"}
[1, 2, 3]
[{"a": "b"}, 42]
```

### `jsonb @> jsonb -> boolean`

This operator checks if the left `jsonb` value contains the right `jsonb` value. For a detailed description and examples about containment and existence, see [jsonb Containment and Existence](https://www.postgresql.org/docs/current/datatype-json.html) in PostgreSQL's documentation.

```sql title=Syntax
left_jsonb_value @> right_jsonb_value → BOOLEAN
```

```bash title=Examples
'[1, 2, 3]'::jsonb @> '[1, 3]'::jsonb → t

'{"product": "PostgreSQL", "version": 9.4, "jsonb": true}'::jsonb @> '{"version": 9.4}'::jsonb → t

'{"foo": {"bar": "baz"}}'::jsonb @> '{"bar": "baz"}'::jsonb → f

'{"foo": {"bar": "baz"}}'::jsonb @> '{"foo": {}}'::jsonb → t
```

### `jsonb <@ jsonb -> boolean`

This operator checks if the left `jsonb` value is contained within the right `jsonb` value. For a detailed description and examples about containment and existence, see [jsonb Containment and Existence](https://www.postgresql.org/docs/current/datatype-json.html) in PostgreSQL's documentation.

```sql title=Syntax
left_jsonb_value <@ right_jsonb_value → BOOLEAN
```

```sql title=Examples
'{"b":2}'::jsonb <@ '{"a":1, "b":2}'::jsonb → t
```

### `jsonb ? text -> boolean`

This operator checks if a string exists as a top-level array element or object key within a `jsonb` value.

```sql title=Syntax
jsonb_value ? string → BOOLEAN
```

```bash title=Examples
'["foo", "bar", "baz"]'::jsonb ? 'bar' → t

'{"foo": "bar"}'::jsonb ? 'foo' → t

'{"foo": "bar"}'::jsonb ? 'bar' → f

'{"foo": {"bar": "baz"}}'::jsonb ? 'bar' → f

'"foo"'::jsonb ? 'foo' → t
```

### `jsonb ?| text[] -> boolean`

This operator checks if any string in an array exists as a top-level array element or object key within a `jsonb` value.

```sql title=Syntax
jsonb_value ?| text_array TEXT[] → BOOLEAN
```

```sql title=Examples
'{"a":1, "b":2, "c":3}'::jsonb ?| array['b', 'd'] → t

'["a", "b", "c"]'::jsonb ?| array['b', 'd'] → t

'"b"'::jsonb ?| array['b', 'd'] → t
```

### `json ?& text[] -> boolean`

This operator checks if all strings in an array exist as top-level array elements or object keys within a `jsonb` value.

```sql title=Syntax
jsonb_value ?& text_array TEXT[] → BOOLEAN
```

```sql title=Examples
'{"a":1, "b":2, "c":3}'::jsonb ?& array['a', 'b'] → t

'["a", "b", "c"]'::jsonb ?& array['a', 'b'] → t

'["a", "b", "c"]'::jsonb ?& array['a', 'd'] → f
```

### `jsonb #> text[] -> jsonb`

This operator extracts a nested value from a JSONB object using a text array of keys or indices.

```sql title=Syntax
jsonb_value #> text_array TEXT[] → JSONB
```

```sql title=Examples
'{"a": {"b": ["foo","bar"]}}'::jsonb #> '{a,b,1}'::text[] → "bar"

'{"a": {"b": ["foo","bar"]}}'::jsonb #> '{a,b,null}'::text[] → NULL
```

### `jsonb #>> text[] -> text`

This operator extracts a nested value as text from a JSONB object using a text array of keys or indices.

```sql title=Syntax
jsonb_value #>> text_array TEXT[] → TEXT
```

```sql title=Examples
'{"a": {"b": ["foo","bar"]}}'::jsonb #>> '{a,b,1}'::text[] → bar

'{"a": {"b": ["foo",null]}}'::jsonb #>> '{a,b,1}'::text[] → NULL

'{"a": {"b": ["foo","bar"]}}'::jsonb #>> '{a,b,null}'::text[] → NULL
```

## `IS JSON` predicate

This predicate tests whether an expression can be parsed as JSON, optionally of a specified type. It evaluates the JSON structure and returns a boolean result indicating whether the value matches the specified JSON type.

```sql title=Syntax
expression IS [ NOT ] JSON [ VALUE | ARRAY | OBJECT | SCALAR ] → bool
```

If SCALAR, ARRAY, or OBJECT is specified, the test is whether or not the JSON is of that particular type.

```sql title=Example
SELECT js,
  js IS JSON "json?",
  js IS JSON SCALAR "scalar?",
  js IS JSON OBJECT "object?",
  js IS JSON ARRAY "array?"
FROM (VALUES
      ('123'), ('"abc"'), ('{"a": "b"}'), ('[1,2]'),('abc')) foo(js);
```

```markdown title=Result

 js         | json? | scalar? | object? | array?
------------+-------+---------+---------+---------
 123        | t     | t       | f       | f
 "abc"      | t     | t       | f       | f
 {"a": "b"} | t     | f       | t       | f
 [1,2]      | t     | f       | f       | t
 abc        | f     | f       | f       | f
```
