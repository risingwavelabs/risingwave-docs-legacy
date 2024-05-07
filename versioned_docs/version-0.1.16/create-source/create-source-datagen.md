---
id: create-source-datagen
title: Generate test data
description: Connect RisingWave to a built-in load generator.
slug: /create-source-datagen
---
<head>
  <link rel="canonical" href="https://docs.risingwave.com/docs/current/create-source-datagen/" />
</head>

The built-in load generator can generate mock data, which can be used in demos and tests. It provides an easy way to simulate the data stream without connecting to an actual external data source.

Use the SQL statement below to connect RisingWave to the built-in load generator.

## Syntax

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

<Tabs>
<TabItem value="diagram" label="Diagram">

import rr from '@theme/RailroadDiagram'

export const svg = rr.Diagram(
rr.Stack(
   rr.Sequence(
      rr.Terminal('CREATE TABLE'),
      rr.NonTerminal('source_name', 'skip'),
      rr.Terminal('('),
      rr.OneOrMore (rr.Sequence ( rr.Terminal ('column_name'), rr.Terminal ('data_type')), ','),
      rr.Terminal(')'),
   ),
   rr.Sequence(
      rr.Terminal('WITH'),
      rr.Terminal('('),
      rr.Stack(
         rr.Stack(
            rr.Sequence(
               rr.Terminal('connector = \' datagen \''),
               rr.Terminal(',')
            ),
            rr.OneOrMore (
               rr.Sequence(
                  rr.Terminal('fields'),
                  rr.Terminal('.'),
                  rr.NonTerminal('column_name'),
                  rr.Terminal('.'),
                  rr.NonTerminal('column_parameter'),
                  rr.Terminal('='),
                  rr.Terminal('\''),
                  rr.NonTerminal('value'),
                  rr.Terminal('\''),
                  rr.Terminal(','),
               ),rr.Comment('Configure each column. See detailed information below.'),
            ),
            rr.Sequence(
               rr.Terminal('datagen.rows.per.second'),
               rr.Terminal('='),
               rr.Terminal('\''),
               rr.NonTerminal('rows_integer'),
               rr.Terminal('\''),
               rr.Comment('Number of rows to generate per second'),
            ),
            rr.Terminal(')'),
         ),
      ),
   ),
   rr.Sequence( 
      rr.Terminal('ROW FORMAT JSON'),
      rr.Terminal(';'),
   )
      
)
);

<drawer SVG={svg} />

</TabItem>

<TabItem value="code" label="Code">

```sql
CREATE TABLE source_name ( column_name data_type, ... ) 
WITH (
   connector = ' datagen ',
   fields.column_name.column_parameter = ' value ', ...  -- Configure the generator for each column. See detailed information below.
   datagen.rows.per.second = ' rows_integer '  -- Specify how many rows of records to generate every second. For example, '20'.
) 
ROW FORMAT JSON;
```

</TabItem>

</Tabs>

### `WITH` options - *`column_parameter`*

The following table shows the data types that can be generated for each load generator type.

|Generator &#92; Data|Number|Timestamp|Varchar|Struct|Array|
|---|---|---|---|---|---|
|**Sequence**|✓|✕|✕|✓|✓|
|**Random**|✓|✓|✓|✓|✓|

Select the type of data to be generated.

<Tabs>

<TabItem value="number" label="Number">
<Tabs>
<TabItem value="sequence" label="Sequence">

The sequence load generator can generate numbers, incremented by 1, from the starting number to the ending number. For example, `1`, `2`, `3`, ... and `1.56`, `2.56`, `3.56`, ...

Specify the following fields for every column.

|`column_parameter`|Description|Value|Required?|
|---|---|---|---|
|`kind`|Generator type|Set to `sequence`.|False<br/>Default: `random`|
|`start`|Starting number<br/>Must be smaller than the ending number.|Any number of the column data type<br/>Example: `50`|False<br/>Default: `0`|
|`end`|Ending number<br/>Must be larger than the starting number.|Any number of the column data type<br/>Example: `100`|False<br/>Default: `32767`|

</TabItem>

<TabItem value="random" label="Random">
The random number generator produces random numbers within a certain range.

Specify the following fields for every column in the source you are creating.

|`column_parameter`|Description|Value|Required?|
|---|---|---|---|
|`kind`|Generator type|Set to `random`.|False<br/>Default: `random`|
|`min`|The minimum number can be generated.<br/>Must be smaller than the maximum number.|Any number of the column data type<br/>Example: `50`|False<br/>Default: `0`|
|`max`|The maximum number can be generated.<br/>Must be larger than the minimum number.|Any number of the column data type<br/>Example: `100`|False<br/>Default: `32767`|
|`seed`|A seed number that initializes the random load generator. The sequence of the generated numbers is determined by the seed value. If given the same seed number, the generator will produce the same sequence of numbers.|A positive integer<br/>Example: `3`|False<br/>If not specified, a fixed sequence of numbers will be generated.|

</TabItem>

</Tabs>



</TabItem>
<TabItem value="timestamp" label="Timestamp">

The random timestamp generator produces random timestamp earlier than the current date and time or the source creation time.

Specify the following fields for every column in the source you are creating.

|`column_parameter`|Description|Value|Required?|
|---|---|---|---|
|`kind`|Generator type|Set to `random`.|False<br/>Default: `random`|
|`max_past`|Specify the maximum deviation from the baseline timestamp to determine the earliest possible timestamp can be generated. |An [interval](/sql/sql-data-types.md)<br/>Example: `2h 37min`|False<br/>Default: `1 day`|
|`max_past_mode`|Specify the baseline timestamp. <br/> The range for generated timestamps is [baseline - `max_past` , baseline]|`absolute` — Baseline is set to the creation time of the source.<br />`relative` —  Baseline is the current system time.|False<br/>Default: `absolute`|
|`seed`|A seed number that initializes the random load generator. The sequence of the generated timestamps is determined by the seed value. If given the same seed number, the generator will produce the same sequence of timestamps.|A positive integer<br/>Example: `3`|False<br/>If not specified, a fixed sequence of timestamps will be generated (if the system time is constant).|


</TabItem>
<TabItem value="varchar" label="Varchar">

The random varchar generator produces random combination of uppercase and lowercase letters and numbers.

Specify the following fields for every column in the source you are creating.

|`column_parameter`|Description|Value|Required?|
|---|---|---|---|
|`kind`|Generator type|Set to `random`.|False<br/>Default: `random`|
|`length`|The length of the varchar to be generated.|A positive integer<br/>Example: `16`|False<br/>Default: `10`|
|`seed`|A seed number that initializes the random load generator. The sequence of the generated characters is determined by the seed value. If given the same seed number, the generator will produce the same sequence of characters.|A positive integer<br/>Example: `3`|False<br/>If not specified, a fixed sequence of characters will be generated.|

</TabItem>

<TabItem value="struct" label="Struct">

The generator supports generating data in a [`struct`](/sql/data-types/data-type-struct.md). A column of `struct` type can contain multiple nested columns of different types.

The following statement creates a load generator source which contains one column, `v1`. `v1` consists of two nested columns `v2` and `v3`.

```sql
CREATE TABLE s1 (v1 struct<v2 int, v3 double>)
WITH (
     connector = 'datagen',
     fields.v1.v2.kind = 'sequence',
     fields.v1.v2.start = '-10',
     fields.v1.v3.kind = 'sequence',
     fields.v1.v3.start = '1.5',
     datagen.rows.per.second = '5'
 ) ROW FORMAT JSON;
```

:::info
- You need to configure each nested column in the struct. Select other tabs according to the data type of the nested columns for information on column parameters.
- When you configure a nested column, use `column.nested_column` to specify it. For example, `v1.v2` and `v1.v3` in the `WITH` clause above.
:::


</TabItem>

<TabItem value="array" label="Array">

The generator supports generating data in an [`array`](/sql/data-types/data-type-array.md). An array is a list of elements of the same type. Append `[]` to the data type of the column when creating the source.

The following statement creates a load generator source which contains one column, `c1`. `c1` is an array of `varchar`.

```sql
CREATE TABLE s1 (c1 varchar [])
WITH (
     connector = 'datagen',
     fields.c1.length = '3',
     fields.c1._.kind = 'random',
     fields.c1._.length = '1',
     fields.c1._.seed = '3',
     datagen.rows.per.second = '10'
 ) ROW FORMAT JSON;
```

:::info
- You need to specify the number of elements in the array in the `WITH` clause. `fields.c1.length = '3'` in the example above means that `c1` is an array of three elements.
- When you configure the elements in an array, use `column._` to specify them. For example, `c1._` in the `WITH` clause above. <br/>Select other tabs according to the data type of the array for information on column parameters.
:::

If you want to generate an array of struct, your statement should look like the following.

```sql
CREATE TABLE s1 (v1 struct<v2 int> []) 
WITH (
    connector = 'datagen',
    fields.v1.length = '2',
    fields.v1._.v2.kind = 'random',
    fields.v1._.v2.min = '1',
    fields.v1._.v2.max = '2',
    fields.v1._.v2.seed = '1',
    datagen.rows.per.second = '10'
) ROW FORMAT JSON;
```

</TabItem>

</Tabs>


## Example
Here is an example of connecting RisingWave to the built-in load generator.

The following statement creates a source `s1` with four columns:

* `i1` — An array of three integers starting from 1 and incrementing by 1
* `v1` — Structs that contain random integers `v2` ranging from -10 to 10 and random floating-point numbers `v3` ranging from 15 to 55
* `t1` — Random timestamps from as early as 10 days prior to the source creation time
* `c1` — Random strings with each consists of 16 characters


```sql
CREATE TABLE s1 (i1 int [], v1 struct<v2 int, v3 double>, t1 timestamp, c1 varchar) 

WITH (
     connector = 'datagen',
  
     fields.i1.length = '3',
     fields.i1._.kind = 'sequence',
     fields.i1._.start = '1',
  
     fields.v1.v2.kind = 'random',
     fields.v1.v2.min = '-10',
     fields.v1.v2.max = '10',
     fields.v1.v2.seed = '1',
  
     fields.v1.v3.kind = 'random',
     fields.v1.v3.min = '15',
     fields.v1.v3.max = '55',
     fields.v1.v3.seed = '1',
  
     fields.t1.kind = 'random',
     fields.t1.max_past = '10 day',
     fields.t1.seed = '3',
  
     fields.c1.kind = 'random',
     fields.c1.length = '16',
     fields.c1.seed = '3',
  
     datagen.rows.per.second = '10'
 ) ROW FORMAT JSON;
```

Let's query `s1` after a few seconds.

```sql
SELECT * FROM s1 ORDER BY i1 LIMIT 20;
```
```
     i1     |            v1            |             t1             |        c1        
------------+--------------------------+----------------------------+------------------
 {1,2,3}    | (7,53.96978949033611)    | 2023-02-01 17:42:28.339901 | pGWJLsbmPJZZWpBe
 {4,5,6}    | (5,44.24453663454818)    | 2023-01-30 17:11:59.566901 | FT7BRdifYMrRgIyI
 {7,8,9}    | (3,18.808367835800485)   | 2023-01-26 18:39:41.516901 | 0zsMbNLxQh9yYtHh
 {10,11,12} | (-4,26.893033246334525)  | 2023-01-26 09:05:27.092901 | zujxzBql3QHxENyy
 {13,14,15} | (-3,28.68505963291612)   | 2023-01-30 14:51:26.535901 | aBJTDJpinRv8mLvQ
 {16,17,18} | (4,36.32012760913261)    | 2023-01-30 08:13:46.507901 | HVur4zU3hQFgVh74
 {19,20,21} | (-10,16.212694434604053) | 2023-01-30 06:26:51.796901 | LVLAhd1pQvhXVL8p
 {22,23,24} | (-8,28.388082274426225)  | 2023-01-27 02:53:09.042901 | siFqrkdlCnNZqAUT
 {25,26,27} | (2,40.86763449564268)    | 2023-01-30 22:19:39.033901 | ORjwy3oMNbl1Yi6X
 {28,29,30} | (3,29.179236922708526)   | 2023-02-01 09:08:49.935901 | YIVLnWxHyfsiPHQo
 {31,32,33} | (6,26.03842827701958)    | 2023-01-27 05:21:08.179901 | lpzCxwpoJp9njIAa
 {34,35,36} | (-2,20.2351457847852)    | 2023-01-26 00:47:07.622901 | oW8xmndvmXMRp1Rc
 {37,38,39} | (2,36.51138960926262)    | 2023-01-27 15:44:36.250901 | 0m1Qxn96Xeq42H3Z
 {40,41,42} | (0,34.2997487580596)     | 2023-01-28 01:56:15.457901 | 1jT3TnEEj56YNa7w
 {43,44,45} | (7,39.13577932700749)    | 2023-01-28 07:29:23.068901 | linRToOjph0WlJrd
 {46,47,48} | (7,37.43674199879566)    | 2023-01-28 20:45:34.511901 | beql98l3IIkjomTl
 {49,50,51} | (1,41.62099792202798)    | 2023-01-29 11:16:58.485901 | xHbIYlJismRlIKFw
 {52,53,54} | (9,49.240259695092895)   | 2023-01-23 21:22:26.322901 | TDYNZsSNYMpOpZgC
 {55,56,57} | (6,54.64984398127376)    | 2023-01-27 00:49:55.529901 | jqPQM3oyA2lOXLcn
 {58,59,60} | (-4,54.197350082045176)  | 2023-01-25 03:06:59.474901 | 72cIOHPb7DE8FTme
(20 rows)
...
```