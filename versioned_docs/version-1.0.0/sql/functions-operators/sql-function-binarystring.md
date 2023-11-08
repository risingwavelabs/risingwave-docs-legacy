---
id: sql-function-binarystring
slug: /sql-function-binarystring
title: Binary string functions and operators
---
<head>
  <link rel="canonical" href="https://docs.risingwave.com/docs/current/sql-function-binarystring/" />
</head>

### `bit_length`

Returns number of bits in the binary string, which is 8 times the [`octet_length`](#octet_length-length). 

```sql title=Syntax 
bit_length ( bytea ) -> integer
```  

```sql title=Example 
SELECT bit_length('😇'::bytea);
```  
```
32
```

---  

### `octet_length`, `length`

Returns number of bytes in the binary string.

```sql title=Syntax 
octet_length ( bytea ) -> integer
-- or
length ( bytea ) -> integer
```  

```sql title=Example 
SELECT octet_length('😇'::bytea);
```  
```
4
```
