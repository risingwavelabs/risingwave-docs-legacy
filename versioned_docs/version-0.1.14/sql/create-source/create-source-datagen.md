---
id: create-source-datagen
title: Load generator
description: Connect RisingWave to a built-in load generator.
slug: /create-source-datagen
---

The built-in load generator can generate mock data, which can be used in demos and tests. It provides an easy way to simulate the data stream without connecting to an actual external data source.

Use the SQL statement below to connect RisingWave to the built-in load generator.

## Syntax

```sql
CREATE MATERIALIZED SOURCE source_name ( column_name data_type, ... ) 
WITH (
   connector = ' datagen ',
   column_parameter = ' value ', ...  -- Configure the generator for each column. See detailed information below.
   datagen.rows.per.second = ' rows_integer '  -- Specify how many rows of records to generate every second. For example, '20'.
) 
ROW FORMAT JSON;
```

### `WITH` options - *`column_parameter`*

The following table shows the data types that can be generated for each load generator type.

|Generator &#92; Data|Number|Timestamp|Varchar|
|---|---|---|---|
|**Sequence**|✓|✕|✕|
|**Random**|✓|✓|✓|

Select a generator type:

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

<Tabs>
<TabItem value="sequence" label="Sequence">

The sequence load generator can generate numbers, incremented by 1, from the starting number to the ending number. For example, `1`, `2`, `3`, ... and `1.56`, `2.56`, `3.56`, ...

Specify the following fields for every column.

|Field|Description|Value|Required?|
|---|---|---|---|
|fields.*column_name*.kind|Generator type|Set to `sequence`.|False<br/>Default: `random`|
|fields.*column_name*.start|Starting number<br/>Must be smaller than the ending number.|Any number of the column data type<br/>Example: `50`|False<br/>Default: `0`|
|fields.*column_name*.end|Ending number<br/>Must be larger than the starting number.|Any number of the column data type<br/>Example: `100`|False<br/>Default: `32767`|

</TabItem>
<TabItem value="random" label="Random">

And select the type of data to be generated:

   <Tabs>
   <TabItem value="nunber" label="Number">
   
   Specify the following fields for every column in the source you are creating.

   |Field|Description|Value|Required?|
   |---|---|---|---|
   |fields.*column_name*.kind|Generator type|Set to `random`.|False<br/>Default: `random`|
   |fields.*column_name*.min|The minimum number can be generated.<br/>Must be smaller than the maximum number.|Any number of the column data type<br/>Example: `50`|False<br/>Default: `0`|
   |fields.*column_name*.max|The maximum number can be generated.<br/>Must be larger than the minimum number.|Any number of the column data type<br/>Example: `100`|False<br/>Default: `32767`|
   |fields.*column_name*.seed|A seed number that initializes the random load generator. The sequence of the generated numbers is determined by the seed value. If given the same seed number, the generator will produce the same sequence of numbers.|A positive integer<br/>Example: `3`|False<br/>If not specified, a fixed sequence of numbers will be generated.|

   

   </TabItem>
   <TabItem value="timestamp" label="Timestamp">

   The random timestamp generator produces random timestamp earlier than the current date and time.

   Specify the following fields for every column in the source you are creating.
   
   |Field|Description|Value|Required?|
   |---|---|---|---|
   |fields.*column_name*.kind|Generator type|Set to `random`.|False<br/>Default: `random`|
   |fields.*column_name*.max_past|Specify the maximum time interval to determine the earliest timestamp can be generated.|An [interval](../sql-data-types.md)<br/>Example: `2h 37min`|False<br/>Default: `1 day`|
   |fields.*column_name*.seed|A seed number that initializes the random load generator. The sequence of the generated timestamps is determined by the seed value. If given the same seed number, the generator will produce the same sequence of timestamps.|A positive integer<br/>Example: `3`|False<br/>If not specified, a fixed sequence of timestamps will be generated (if the system time is constant).|


   </TabItem>
   <TabItem value="varchar" label="Varchar">

   The random varchar generator produces random combination of uppercase and lowercase letters and numbers.
   
   Specify the following fields for every column in the source you are creating.

   |Field|Description|Value|Required?|
   |---|---|---|---|
   |fields.*column_name*.kind|Generator type|Set to `random`.|False<br/>Default: `random`|
   |fields.*column_name*.length|The length of the varchar to be generated.|A positive integer<br/>Example: `16`|False<br/>Default: `10`|
   |fields.*column_name*.seed|A seed number that initializes the random load generator. The sequence of the generated characters is determined by the seed value. If given the same seed number, the generator will produce the same sequence of characters.|A positive integer<br/>Example: `3`|False<br/>If not specified, a fixed sequence of characters will be generated.|

   </TabItem>
   </Tabs>

</TabItem>
</Tabs>





## Example
Here is an example of connecting RisingWave to the built-in load generator.

The following statement creates a source `s1` with four columns:

* `i1` — Integers starting from 1 and incrementing by 1
* `v1` — Structs that contain random integers `v2` ranging from -10 to 10 and random floating-point numbers `v3` ranging from 15 to 55
* `t1` — Random timestamps from as early as 10 days prior to the current system date and time
* `c1` — Random strings with each consists of 16 characters


```sql
CREATE MATERIALIZED SOURCE s1 (i1 int, v1 struct<v2 int, v3 double>, t1 timestamp, c1 varchar) 
WITH (
     connector = 'datagen',
     fields.i1.kind = 'sequence',
     fields.i1.start = '1',
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

Let's query the source `s1` after a few seconds.

```sql
SELECT * FROM s1 ORDER BY i1;
```
```
 i1 |            v1            |             t1             |        c1        
----+--------------------------+----------------------------+------------------
  1 | (5,53.96978949033611)    | 2022-11-16 10:58:53.555428 | pGWJLsbmPJZZWpBe
  2 | (7,44.24453663454818)    | 2022-11-14 10:28:24.782428 | FT7BRdifYMrRgIyI
  3 | (-4,18.808367835800485)  | 2022-11-10 11:56:06.732428 | 0zsMbNLxQh9yYtHh
  4 | (3,26.893033246334525)   | 2022-11-10 02:21:52.308428 | zujxzBql3QHxENyy
  5 | (4,28.68505963291612)    | 2022-11-14 08:07:51.751428 | aBJTDJpinRv8mLvQ
  6 | (-3,36.32012760913261)   | 2022-11-14 01:30:11.723428 | HVur4zU3hQFgVh74
  7 | (-8,16.212694434604053)  | 2022-11-13 23:43:17.012428 | LVLAhd1pQvhXVL8p
  8 | (-10,28.388082274426225) | 2022-11-10 20:09:34.258428 | siFqrkdlCnNZqAUT
  9 | (3,40.86763449564268)    | 2022-11-14 15:36:04.249428 | ORjwy3oMNbl1Yi6X
 10 | (2,29.17923692270853)    | 2022-11-16 02:25:15.151428 | YIVLnWxHyfsiPHQo
 11 | (-2,26.03842827701958)   | 2022-11-10 22:37:33.395428 | lpzCxwpoJp9njIAa
 12 | (6,20.2351457847852)     | 2022-11-09 18:03:32.838428 | oW8xmndvmXMRp1Rc
 13 | (0,36.51138960926262)    | 2022-11-11 09:01:01.466428 | 0m1Qxn96Xeq42H3Z
 14 | (2,34.2997487580596)     | 2022-11-11 19:12:40.673428 | 1jT3TnEEj56YNa7w
 15 | (7,39.13577932700749)    | 2022-11-12 00:45:48.284428 | linRToOjph0WlJrd
 16 | (7,37.43674199879566)    | 2022-11-12 14:01:59.727428 | beql98l3IIkjomTl
 17 | (9,41.62099792202798)    | 2022-11-13 04:33:23.701428 | xHbIYlJismRlIKFw
 18 | (1,49.2402596950929)     | 2022-11-07 14:38:51.538428 | TDYNZsSNYMpOpZgC
 19 | (-4,54.64984398127376)   | 2022-11-10 18:06:20.745428 | jqPQM3oyA2lOXLcn
 20 | (6,54.19735008204518)    | 2022-11-08 20:23:24.690428 | 72cIOHPb7DE8FTme
...
```