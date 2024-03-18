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

### `jsonb_build_array`

Builds a JSON array out of a variadic argument list. Each argument is converted as per `to_jsonb`.

```bash title=Syntax
jsonb_build_array ( VARIADIC "any" ) → jsonb
```

```sql title=Example
SELECT jsonb_build_array(1, 2, 'foo', 4, 5);
------RESULT
 [1, 2, "foo", 4, 5]

SELECT jsonb_build_array(variadic array[1, 2, 4, 5]);
------RESULT
 [1, 2, 4, 5]

```

### `jsonb_build_object`

Builds a JSON object out of a variadic argument list. By convention, the argument list consists of alternating keys and values. Key arguments are coerced to text; value arguments are converted as per `to_jsonb`.

```bash title=Syntax
jsonb_build_object ( VARIADIC "any" ) → jsonb
```

```sql title=Example
SELECT jsonb_build_object('foo', 1, 2, row(3,'bar'));
------RESULT
{"2": {"f1": 3, "f2": "bar"}, "foo": 1}

SELECT jsonb_build_object(variadic array['foo', '1', '2', 'bar']); 
------RESULT
 {"2": "bar", "foo": 1}
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

### `jsonb_extract_path`

Extracts JSON sub-object at the specified path.

This function is equivalent to the [`#>`](#jsonb--text---jsonb) operator in functionality.

```bash title=Syntax
jsonb_extract_path ( from_json jsonb, VARIADIC path_elems text[] ) → jsonb
```
- `from_json` is the input JSON value from which to extract the sub-object.

- `path_elems` is the path elements that specify the location of the desired sub-object in the JSON structure. Multiple path elements can be provided as separate arguments.


```sql title=Example
SELECT json_extract_path('{"f2":{"f3":1},"f4":{"f5":99,"f6":"foo"}}', 'f4', 'f6')
------RESULT
"foo"

SELECT jsonb_extract_path('{"a": {"b": ["foo","bar"]}}', variadic array['a', 'b', '1']); 
------RESULT
 bar

```

### `jsonb_extract_path_text`

Extracts JSON sub-object at the specified path as text.

This function is equivalent to the [`#>>`](#jsonb--text---text) operator in functionality.


```bash title=Syntax
jsonb_extract_path_text ( from_json jsonb, VARIADIC path_elems text[] ) → text
```

```sql title=Example
SELECT jsonb_extract_path_text('{"f2":{"f3":1},"f4":{"f5":99,"f6":"string"}}', 'f4', 'f6');
------RESULT
string

SELECT jsonb_extract_path_text('{"a": {"b": ["foo","bar"]}}', variadic array['a', 'b', '1']); 
------RESULT
 bar
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
-- Handling non-null values
SELECT jsonb_strip_nulls('{"a": 1, "b": null, "c": {"d": null, "e": 2}}');
------RESULT
{"a": 1, "c": {"e": 2}}

-- Empty object preservation
SELECT jsonb_strip_nulls('{"a": {"b": null, "c": null}, "d": {} }');
------RESULT
{"a": {}, "d": {}}
```

### `jsonb_path_exists`

Checks if a JSON path returns any items from a JSON value.

If the `vars` argument is provided, it must be a JSON object. Its fields act as named values that are substituted into the `path` expression. When the `silent` argument is specified and set to `true`, the function will suppress errors like the [`@?`](#jsonb--varchar--boolean) and [`@@`](#jsonb--varchar--boolean-1) operators.

For information on the SQL/JSON Path syntax, refer to the [PostgreSQL documentation](https://www.postgresql.org/docs/current/functions-json.html#FUNCTIONS-SQLJSON-PATH).

```bash title=Syntax
jsonb_path_exists ( target jsonb, path varchar [, vars jsonb [, silent boolean ]] ) → boolean
```

```sql title=Example
SELECT jsonb_path_exists('{"a":1, "b":2, "c":3}', '$.b');
------RESULT
t
```

### `jsonb_path_match`

Evaluates a JSON path predicate on a JSON value and returns the results as a boolean. Only the first item of the result is taken into account.

```bash title=Syntax
jsonb_path_match ( target jsonb, path varchar [, vars jsonb [, silent boolean ]] ) → boolean
```

```sql title=Example
SELECT jsonb_path_match('{"employee":{"name":"John","age":30}}', 'exists($.employee.age ? (@ > 25))');
------RESULT
t
```

### `jsonb_path_query`

Extracts items from a JSON value matching a JSON path and returns as a set.

```bash title=Syntax
jsonb_path_query ( target jsonb, path varchar [, vars jsonb [, silent boolean ]] ) → setof jsonb
```

```sql title=Example
SELECT jsonb_path_query('{
  "employees": [
    {
      "name": "John",
      "age": 30
    },
    {
      "name": "Jane",
      "age": 25
    },
    {
      "name": "David",
      "age": 35
    },
    {
      "name": "Michael",
      "age": 32
    }
  ]
}', '$.employees[*] ? (@.age >= 25 && @.age <= 30)');
------RESULT
       jsonb_path_query       
------------------------------
 {"age": 30, "name": "John"}
 {"age": 25, "name": "Jane"}
```

### `jsonb_path_query_array`

Extracts matching JSON path items and returns them wrapped in an array.

```bash title=Syntax
jsonb_path_query_array ( target jsonb, path varchar [, vars jsonb [, silent boolean ]] ) → jsonb
```

```sql title=Example
SELECT jsonb_path_query_array('{
  "employees": [
    {
      "name": "John",
      "age": 30
    },
    {
      "name": "Alice",
      "age": 35
    },
    {
      "name": "Bob",
      "age": 25
    }
  ]
}', '$.employees[*] ? (@.age >= $min && @.age <= $max)', '{"min": 24, "max": 32}');
------RESULT
                  jsonb_path_query_array                   
-----------------------------------------------------------
 [{"age": 30, "name": "John"}, {"age": 25, "name": "Bob"}]
```

### `jsonb_path_query_first`

Extracts the first matching item from a JSON value using a JSON path.

```bash title=Syntax
jsonb_path_query_first ( target jsonb, path varchar [, vars jsonb [, silent boolean ]] ) → jsonb
```

```sql title=Example
SELECT jsonb_path_query_first('{
  "employees": [
    {
      "name": "John",
      "age": 30
    },
    {
      "name": "Jane",
      "age": 25
    },
    {
      "name": "David",
      "age": 35
    }
  ]
}', '$.employees[0]');
------RESULT
   jsonb_path_query_first    
-----------------------------
 {"age": 30, "name": "John"}
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

### `to_jsonb`

Converts any SQL value to JSONB data type. It recursively handles arrays and composites, transforming them into arrays and objects in the resulting JSON representation. If a direct cast from the SQL data type to JSON is available, it is used for the conversion; otherwise, scalar values are produced as JSON scalars, with text representations appropriately escaped to ensure valid JSON string values.

```sql title=Syntax
to_jsonb ( any ) → JSONB
```

```sql title=Examples
to_jsonb(array['apple', 'banana', 'cherry']) → ["apple", "banana", "cherry"]
to_jsonb('Products labeled "expired"'::string) → "Products labeled \"expired\""
```

## JSON operators

### `jsonb -> integer → jsonb`

Extracts the n'th element of a JSON array (array elements are indexed from zero, but negative integers count from the end).

```sql title=Example
SELECT'[{"a":"foo"},{"b":"bar"},{"c":"baz"}]'::jsonb -> 2;
------RESULT
 {"c":"baz"}
```

### `jsonb -> varchar → jsonb`

Extracts JSON object field with the given key.

```sql title=Example
SELECT '{"a": {"b":"foo"}}'::jsonb -> 'a';
------RESULT
 {"b": "foo"}
```

### `jsonb ->> integer → varchar`

Extracts the n'th element of a JSON array, as text.

```sql title=Example
SELECT '[1,2,3]'::jsonb ->> 2;
------RESULT
3
```

### `jsonb ->> varchar → varchar`

Extracts JSON object field with the given key, as text.

```sql title=Example
SELECT '{"a":1,"b":2}'::jsonb ->> 'b';
------RESULT
2
```

### `jsonb - text → jsonb`

Deletes a key (and its value) from a JSON object, or matching string value(s) from a JSON array.

```bash title=Examples
'{"a": "b", "c": "d"}'::jsonb - 'a' → {"c": "d"}
'["a", "b", "c", "b"]'::jsonb - 'b' → ["a", "c"]
```

### `jsonb - text[] → jsonb`

Deletes all matching keys or array elements from a JSON object.

```bash title=Example
'{"a": "b", "c": "d"}'::jsonb - '{a,c}'::text[] → {}
```

### `jsonb - integer → jsonb`

Deletes the array element with the specified index (negative integers counting from the end). Throws an error if JSON object is not an array.

```bash title=Example
'["a", "b"]'::jsonb - 1 → ["a"]
```

### `jsonb #- text[] → jsonb`

Deletes the field or array element at the specified path, where path elements can be either field keys or array indexes.

```bash title=Example
'["a", {"b":1}]'::jsonb #- '{1,b}' → ["a", {}]
```

### `(jsonb || jsonb) → jsonb`

Concatenates jsonb data.

```sql title=Examples
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

### `jsonb @> jsonb → boolean`

This operator checks if the left `jsonb` value contains the right `jsonb` value. For a detailed description and examples about containment and existence, see [jsonb Containment and Existence](https://www.postgresql.org/docs/current/datatype-json.html) in PostgreSQL's documentation.

```bash title=Examples
'[1, 2, 3]'::jsonb @> '[1, 3]'::jsonb → t

'{"product": "PostgreSQL", "version": 9.4, "jsonb": true}'::jsonb @> '{"version": 9.4}'::jsonb → t

'{"foo": {"bar": "baz"}}'::jsonb @> '{"bar": "baz"}'::jsonb → f

'{"foo": {"bar": "baz"}}'::jsonb @> '{"foo": {}}'::jsonb → t
```

### `jsonb <@ jsonb → boolean`

This operator checks if the left `jsonb` value is contained within the right `jsonb` value. For a detailed description and examples about containment and existence, see [jsonb Containment and Existence](https://www.postgresql.org/docs/current/datatype-json.html) in PostgreSQL's documentation.

```bash title=Examples
'{"b":2}'::jsonb <@ '{"a":1, "b":2}'::jsonb → t
```

### `jsonb ? text → boolean`

This operator checks if a string exists as a top-level array element or object key within a `jsonb` value.

```bash title=Examples
'["foo", "bar", "baz"]'::jsonb ? 'bar' → t

'{"foo": "bar"}'::jsonb ? 'foo' → t

'{"foo": "bar"}'::jsonb ? 'bar' → f

'{"foo": {"bar": "baz"}}'::jsonb ? 'bar' → f

'"foo"'::jsonb ? 'foo' → t
```

### `jsonb ?| text[] → boolean`

This operator checks if any string in an array exists as a top-level array element or object key within a `jsonb` value.

```sql title=Examples
'{"a":1, "b":2, "c":3}'::jsonb ?| array['b', 'd'] → t

'["a", "b", "c"]'::jsonb ?| array['b', 'd'] → t

'"b"'::jsonb ?| array['b', 'd'] → t
```

### `json ?& text[] → boolean`

This operator checks if all strings in an array exist as top-level array elements or object keys within a `jsonb` value.

```sql title=Examples
'{"a":1, "b":2, "c":3}'::jsonb ?& array['a', 'b'] → t

'["a", "b", "c"]'::jsonb ?& array['a', 'b'] → t

'["a", "b", "c"]'::jsonb ?& array['a', 'd'] → f
```

### `jsonb #> text[] → jsonb`

This operator extracts a nested value from a JSONB object using a text array of keys or indices.

```sql title=Examples
'{"a": {"b": ["foo","bar"]}}'::jsonb #> '{a,b,1}'::text[] → "bar"

'{"a": {"b": ["foo","bar"]}}'::jsonb #> '{a,b,null}'::text[] → NULL
```

### `jsonb #>> text[] → text`

This operator extracts a nested value as text from a JSONB object using a text array of keys or indices.

```sql title=Examples
'{"a": {"b": ["foo","bar"]}}'::jsonb #>> '{a,b,1}'::text[] → bar

'{"a": {"b": ["foo",null]}}'::jsonb #>> '{a,b,1}'::text[] → NULL

'{"a": {"b": ["foo","bar"]}}'::jsonb #>> '{a,b,null}'::text[] → NULL
```

### `jsonb @? varchar → boolean`

Determine whether the specified JSON path returns any item for the given JSON value.

```sql title=Examples
SELECT '{"a":1, "b":2, "c":3}'::jsonb @? '$.a';
------RESULT
t

SELECT '{"a":1, "b":2, "c":3}'::jsonb @? '$.d';
------RESULT
f
```

### `jsonb @@ varchar → boolean`

Returns the result of a JSON path predicate check on the specified JSON value, considering only the first item of the result. If the result is not a Boolean, it returns NULL.

```sql title=Examples
SELECT '{"numbers":[1,2,3,4,5]}'::jsonb @@ '$.numbers[*] == 5';
------RESULT
t
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
