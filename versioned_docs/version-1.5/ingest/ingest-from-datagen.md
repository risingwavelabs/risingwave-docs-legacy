---
id: ingest-from-datagen
title: Generate test data
description: Connect RisingWave to a built-in load generator.
slug: /ingest-from-datagen
---
<head>
  <link rel="canonical" href="https://docs.risingwave.com/docs/current/ingest-from-datagen/" />
</head>

The built-in load generator can generate mock data, which can be used in demos and tests. It provides an easy way to simulate the data stream without connecting to an actual external data source.

Use the SQL statement below to connect RisingWave to the built-in load generator.

## Syntax

```sql
CREATE TABLE source_name ( column_name data_type, ... )
WITH (
   connector = ' datagen ',
   fields.column_name.column_parameter = ' value ', ...  -- Configure the generator for each column. See detailed information below.
   datagen.rows.per.second = ' rows_integer '  -- Specify how many rows of records to generate every second. For example, '20'.
) FORMAT PLAIN ENCODE JSON;
```

### `WITH` options - *`column_parameter`*

The following table shows the data types that can be generated for each load generator type.

|Generator &#92; Data|Number|Timestamp|Timestamptz|Varchar|Struct|Array|
|---|---|---|---|---|---|---|
|**Sequence**|✓|✕|✕|✕|✓|✓|
|**Random**|✓|✓|✓|✓|✓|✓|

Select the type of data to be generated.

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

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
<TabItem value="timestamp/timestamptz" label="Timestamp and Timestamptz">

The random timestamp and timestamptz generator produces random timestamps and timestamps with time zone, respectively, earlier than the current date and time or the source creation time.

Specify the following fields for every column in the source you are creating.

|`column_parameter`|Description|Value|Required?|
|---|---|---|---|
|`kind`|Generator type|Set to `random`.|False<br/>Default: `random`|
|`max_past`|Specify the maximum deviation from the baseline timestamp or timestamptz to determine the earliest possible timestamp or timestamptz that can be generated. |An [interval](/sql/sql-data-types.md)<br/>Example: `2h 37min`|False<br/>Default: `1 day`|
|`max_past_mode`|Specify the baseline timestamp or timestamptz. <br/> The range for generated timestamps or timestamptzs is [base time - `max_past` , base time]|`absolute` — The base time is set to the execution time of the generator. The base time is fixed for each generation.<br />`relative` —  The base time is the system time obtained each time a new record is generated.|False<br/>Default: `absolute`|
|`basetime`|If set, the generator will ignore `max_past_mode` and use the specified time as the base time.|A [date and time string](https://docs.rs/chrono/latest/chrono/struct.DateTime.html#method.parse_from_rfc3339)<br/>Example: `2023-04-01T16:39:57-08:00`|False<br/>Default: generator execution time|
|`seed`|A seed number that initializes the random load generator. The sequence of the generated timestamps or timestamptzs is determined by the seed value. If given the same seed number, the generator will produce the same sequence of timestamps or timestamptzs.|A positive integer<br/>Example: `3`|False<br/>If not specified, a fixed sequence of timestamps or timestamptzs will be generated (if the system time is constant).|

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
 ) FORMAT PLAIN ENCODE JSON;
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
 ) FORMAT PLAIN ENCODE JSON;
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
) FORMAT PLAIN ENCODE JSON;
```

</TabItem>

</Tabs>

## Example

Here is an example of connecting RisingWave to the built-in load generator.

The following statement creates a source `s1` with five columns:

- `i1` — An array of three integers starting from 1 and incrementing by 1
- `v1` — Structs that contain random integers `v2` ranging from -10 to 10 and random floating-point numbers `v3` ranging from 15 to 55
- `t1` — Random timestamps from as early as 2 hours as 37 minutes prior to the generator execution time
- `z1` - Random timestamps with timezones from as early as 2 hours as 37 minutes prior to the generator execution time
- `c1` — Random strings with each consists of 16 characters

```sql
CREATE TABLE s1 (i1 int [], v1 struct<v2 int, v3 double>, t1 timestamp, z1 timestamptz, c1 varchar)
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
     fields.t1.max_past = '2h 37min',
     fields.t1.max_past_mode = 'relative',
     fields.t1.seed = '3',

     fields.z1.kind = 'random',
     fields.z1.max_past = '2h 37min',
     fields.z1.max_past_mode = 'relative',
     fields.z1.seed = '3'

     fields.c1.kind = 'random',
     fields.c1.length = '16',
     fields.c1.seed = '3',

     datagen.rows.per.second = '10'
 ) FORMAT PLAIN ENCODE JSON;
```

Let's query `s1` after a few seconds.

```sql
SELECT * FROM s1 ORDER BY i1 LIMIT 20;
```

```
     i1     |            v1            |             t1             |                z1                |        c1
------------+--------------------------+----------------------------+----------------------------------+------------------
 {1,2,3}    | (7,53.96978949033611)    | 2023-11-28 13:35:04.967040 | 2023-11-28 21:35:04.967330+00:00 | pGWJLsbmPJZZWpBe
 {4,5,6}    | (5,44.24453663454818)    | 2023-11-28 14:13:15.264457 | 2023-11-28 22:13:15.264481+00:00 | FT7BRdifYMrRgIyI
 {7,8,9}    | (3,18.808367835800485)   | 2023-11-28 15:12:41.918935 | 2023-11-28 23:12:41.919590+00:00 | 0zsMbNLxQh9yYtHh
 {10,11,12} | (-4,26.893033246334525)  | 2023-11-28 14:55:43.193883 | 2023-11-28 22:55:43.193917+00:00 | zujxzBql3QHxENyy
 {13,14,15} | (-3,28.68505963291612)   | 2023-11-28 13:35:05.967253 | 2023-11-28 21:35:05.967520+00:00 | aBJTDJpinRv8mLvQ
 {16,17,18} | (4,36.32012760913261)    | 2023-11-28 14:13:16.264624 | 2023-11-28 22:13:16.264646+00:00 | HVur4zU3hQFgVh74
 {19,20,21} | (-10,16.212694434604053) | 2023-11-28 15:12:42.919339 | 2023-11-28 23:12:42.919465+00:00 | LVLAhd1pQvhXVL8p
 {22,23,24} | (-8,28.388082274426225)  | 2023-11-28 14:55:44.193726 | 2023-11-28 22:55:44.193787+00:00 | siFqrkdlCnNZqAUT
 {25,26,27} | (2,40.86763449564268)    | 2023-11-28 15:19:51.600898 | 2023-11-28 23:19:51.600977+00:00 | ORjwy3oMNbl1Yi6X
 {28,29,30} | (3,29.179236922708526)   | 2023-11-28 15:27:49.755084 | 2023-11-28 23:27:49.755105+00:00 | YIVLnWxHyfsiPHQo
 {31,32,33} | (6,26.03842827701958)    | 2023-11-28 16:07:02.012019 | 2023-11-29 00:07:02.012133+00:00 | lpzCxwpoJp9njIAa
 {34,35,36} | (-2,20.2351457847852)    | 2023-11-28 14:23:37.167393 | 2023-11-28 22:23:37.167453+00:00 | oW8xmndvmXMRp1Rc
 {37,38,39} | (2,36.51138960926262)    | 2023-11-28 15:19:52.600699 | 2023-11-28 23:19:52.600741+00:00 | 0m1Qxn96Xeq42H3Z
 {40,41,42} | (0,34.2997487580596)     | 2023-11-28 15:27:50.754878 | 2023-11-28 23:27:50.754899+00:00 | 1jT3TnEEj56YNa7w
 {43,44,45} | (7,39.13577932700749)    | 2023-11-28 16:07:03.011837 | 2023-11-29 00:07:03.011905+00:00 | linRToOjph0WlJrd
 {46,47,48} | (7,37.43674199879566)    | 2023-11-28 14:23:38.167161 | 2023-11-28 22:23:38.167271+00:00 | beql98l3IIkjomTl
 {49,50,51} | (1,41.62099792202798)    | 2023-11-28 15:24:46.803776 | 2023-11-28 23:24:46.803844+00:00 | xHbIYlJismRlIKFw
 {52,53,54} | (9,49.240259695092895)   | 2023-11-28 15:39:22.752067 | 2023-11-28 23:39:22.752115+00:00 | TDYNZsSNYMpOpZgC
 {55,56,57} | (6,54.64984398127376)    | 2023-11-28 13:32:15.049957 | 2023-11-28 21:32:15.050089+00:00 | jqPQM3oyA2lOXLcn
 {58,59,60} | (-4,54.197350082045176)  | 2023-11-28 14:07:53.278392 | 2023-11-28 22:07:53.278457+00:00 | 72cIOHPb7DE8FTme
(20 rows)
...
```

