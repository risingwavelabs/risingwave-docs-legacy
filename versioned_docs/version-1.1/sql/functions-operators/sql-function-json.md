---
id: sql-function-json
slug: /sql-function-json
title: JSON functions
---
<head>
  <link rel="canonical" href="https://docs.risingwave.com/docs/current/sql-function-json/" />
</head>

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

### `jsonb_each`

Expands the top-level JSON object into a set of key/value pairs.

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

Expands the top-level JSON object into a set of key/value pairs. The returned values will be of type varchar.

```bash title=Syntax
jsonb_each_text ( jsonb ) → setof record ( key varchar, value varchar )
```

```sql title=Example
SELECT jsonb_each_text('{"a":"foo", "b":"bar"}'::jsonb);
------RESULT
(a,foo)
(b,bar)

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
