---
id: sql-function-sys-info
slug: /sql-function-sys-info
title: System information functions
---

|Function|Description|Example|
|---|---|---|
| pg_typeof() → regtype |Returns the standard name of the data type of the provided value. <br /> More specifically, it returns the OID of the data type of the provided value. It returns a regtype, which is an OID alias type. Therefore it’s the same as an OID for comparison purposes but displays as a type name.|`select pg_typeof(round(null));` → `double precision`|