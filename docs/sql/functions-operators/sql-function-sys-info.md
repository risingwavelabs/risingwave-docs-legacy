---
id: sql-function-sys-info
slug: /sql-function-sys-info
title: System information functions
---

|Function|Description|Example|
|---|---|---|
| pg_typeof() → regtype |Returns the standard name of the data type of the provided value. <br /> More specifically, it returns the OID of the data type of the provided value. It returns a regtype, which is an OID alias type. Therefore it’s the same as an OID for comparison purposes but displays as a type name.|`pg_typeof(round(null))` → `double precision` <br /> `pg_typeof(row(true, 1, 'hello'))` → `record` <br /> `pg_typeof(array[1, 2])` → `integer[]`|