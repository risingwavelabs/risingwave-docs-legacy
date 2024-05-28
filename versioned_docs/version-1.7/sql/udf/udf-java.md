---
id: udf-java
slug: /udf-java
title: Use UDFs in Java
description: Define your own functions with the help of the RisingWave Java UDF SDK.
---

<head>
  <link rel="canonical" href="https://docs.risingwave.com/docs/current/udf-java/" />
</head>

This article provides a step-by-step guide for installing the RisingWave Java UDF SDK, defining functions using Java, starting a Java process as a UDF server, and declaring and using UDFs in RisingWave.

## Prerequisites

- Ensure that you have [Java Developer's Kit (JDK)](https://www.oracle.com/technetwork/java/javase/downloads/index.html) (11 or later) installed on your computer.

- Ensure that you have [Apache Maven](https://maven.apache.org/guides/getting-started/maven-in-five-minutes.html) (3.0 or later) installed on your computer. Maven is a build tool that helps manage Java projects and dependencies.

## 1. Create a Maven project from template

The RisingWave Java UDF SDK is distributed as a Maven artifact. We have prepared a sample project so you don't have to create it from scratch. Run the following command to clone the template repository.

```sh
git clone https://github.com/risingwavelabs/risingwave-java-udf-template.git
```

<details>
  <summary>I'd like to start from scratch</summary>

To create a new project using the RisingWave Java UDF SDK, follow these steps:

Generate a new Maven project:

```sh
mvn archetype:generate -DgroupId=com.example -DartifactId=udf-example -DarchetypeArtifactId=maven-archetype-quickstart -DarchetypeVersion=1.4 -DinteractiveMode=false
```

Configure your `pom.xml` file as follows:

```xml
<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
    xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 http://maven.apache.org/xsd/maven-4.0.0.xsd">
    <modelVersion>4.0.0</modelVersion>
    <groupId>com.example</groupId>
    <artifactId>udf-example</artifactId>
    <version>1.0-SNAPSHOT</version>

    <dependencies>
        <dependency>
            <groupId>com.risingwave.java</groupId>
            <artifactId>risingwave-udf</artifactId>
            <version>0.1.1</version>
        </dependency>
    </dependencies>
</project>
```

The `--add-opens` flag must be added when running unit tests through Maven:

```xml
<build>
    <plugins>
        <plugin>
            <groupId>org.apache.maven.plugins</groupId>
            <artifactId>maven-surefire-plugin</artifactId>
            <version>3.0.0-M7</version>
            <configuration>
                <argLine>--add-opens=java.base/java.nio=ALL-UNNAMED</argLine>
            </configuration>
        </plugin>
    </plugins>
</build>
```

</details>

## 2. Define your functions in Java

### Scalar functions

A user-defined scalar function maps zero, one, or multiple scalar values to a new scalar value.

In order to define a scalar function, you have to create a new class that implements the `ScalarFunction`
interface in `com.risingwave.functions` and implement exactly one evaluation method named `eval(...)`.
This method must be declared public and non-static.

Any data type listed in [Data type mapping](udf-java.md#data-type-mapping) can be used as a parameter or return type of an evaluation method.

Here's an example of a scalar function that calculates the greatest common divisor (GCD) of two integers:

```java
import com.risingwave.functions.ScalarFunction;

public class Gcd implements ScalarFunction {
    public int eval(int a, int b) {
        while (b != 0) {
            int temp = b;
            b = a % b;
            a = temp;
        }
        return a;
    }
}
```

:::note Differences with Flink

- The `ScalarFunction` is an interface instead of an abstract class.
- Multiple overloaded `eval` methods are not supported.
- Variable arguments such as `eval(Integer...)` are not supported.

:::

### Table functions

A user-defined table function maps zero, one, or multiple scalar values to one or multiple
rows (structured types).

In order to define a table function, you have to create a new class that implements the `TableFunction`
interface in `com.risingwave.functions` and implement exactly one evaluation method named `eval(...)`.
This method must be declared public and non-static.

The return type must be an `Iterator` of any data type listed in [Data type mapping](udf-java.md#data-type-mapping).

Similar to scalar functions, input and output data types are automatically extracted using reflection.
This includes the generic argument T of the return value for determining an output data type.

Here's an example of a table function that generates a series of integers:

```java
import com.risingwave.functions.TableFunction;

public class Series implements TableFunction {
    public Iterator<Integer> eval(int n) {
        return java.util.stream.IntStream.range(0, n).iterator();
    }
}
```

:::note Differences with Flink

- The `TableFunction` is an interface instead of an abstract class. It has no generic arguments.
- Instead of calling `collect` to emit a row, the `eval` method returns an `Iterator` of the output rows.
- Multiple overloaded `eval` methods are not supported.
- Variable arguments such as `eval(Integer...)` are not supported.
- In SQL, table functions can be used in the `FROM` clause directly. `JOIN LATERAL TABLE` is not supported.

:::

## 3. Start a UDF server

Run the following command to create a UDF server and register for the functions you defined.

```java
import com.risingwave.functions.UdfServer;

public class App {
    public static void main(String[] args) {
        try (var server = new UdfServer("0.0.0.0", 8815)) {
            // Register functions
            server.addFunction("gcd", new Gcd());
            server.addFunction("series", new Series());
            // Start the server
            server.start();
            server.awaitTermination();
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}
```

Run the following command start the UDF server.

```sh
_JAVA_OPTIONS="--add-opens=java.base/java.nio=ALL-UNNAMED" mvn exec:java -Dexec.mainClass="com.example.App"
```

The UDF server will start running, allowing you to call the defined UDFs from RisingWave.

## 4. Declare your functions in RisingWave

In RisingWave, use the [`CREATE FUNCTION`](/sql/commands/sql-create-function.md) command to declare the functions you defined.

Here are the SQL statements for declaring the two UDFs defined in [step 3](#3-define-your-functions-in-java).

```sql
CREATE FUNCTION gcd(int, int) RETURNS int
AS gcd
USING LINK 'http://localhost:8815';

CREATE FUNCTION series(int) RETURNS TABLE (x int)
AS series
USING LINK 'http://localhost:8815';
```

## 5. Use your functions in RisingWave

Once the UDFs are created in RisingWave, you can use them in SQL queries just like any built-in functions. For example:

```sql
SELECT gcd(25, 15);
SELECT * FROM series(10);
```

## Data type mapping

The RisingWave Java UDF SDK supports the following data types:

| SQL Type         | Java Type                               | Notes                                                                              |
| ---------------- | --------------------------------------- | ---------------------------------------------------------------------------------- |
| BOOLEAN          | boolean, Boolean                        |                                                                                    |
| SMALLINT         | short, Short                            |                                                                                    |
| INT              | int, Integer                            |                                                                                    |
| BIGINT           | long, Long                              |                                                                                    |
| REAL             | float, Float                            |                                                                                    |
| DOUBLE PRECISION | double, Double                          |                                                                                    |
| DECIMAL          | BigDecimal                              |                                                                                    |
| DATE             | java.time.LocalDate                     |                                                                                    |
| TIME             | java.time.LocalTime                     |                                                                                    |
| TIMESTAMP        | java.time.LocalDateTime                 |                                                                                    |
| INTERVAL         | com.risingwave.functions.PeriodDuration |                                                                                    |
| VARCHAR          | String                                  |                                                                                    |
| BYTEA            | byte[]                                  |                                                                                    |
| JSONB            | String                                  | Use `@DataTypeHint("JSONB") String` as the type. See [example](#example---jsonb).  |
| T[]              | T'[]                                    | `T` can be any of the above SQL types. `T'` should be the corresponding Java type. |
| STRUCT\<\>       | user-defined class                      | Define a data class as the type. See [example](#example---struct-type).            |

#### Example - JSONB

```java title="Define the function in Java"
import com.google.gson.Gson;

// Returns the i-th element of a JSON array.
public class JsonbAccess implements ScalarFunction {
    static Gson gson = new Gson();

    public @DataTypeHint("JSONB") String eval(@DataTypeHint("JSONB") String json, int index) {
        if (json == null)
            return null;
        var array = gson.fromJson(json, Object[].class);
        if (index >= array.length || index < 0)
            return null;
        var obj = array[index];
        return gson.toJson(obj);
    }
}
```

```sql title="Create the function in RisingWave"
CREATE FUNCTION jsonb_access(jsonb, int) RETURNS jsonb
AS jsonb_access USING link 'http://localhost:8815';
```

#### Example - Struct type

```java title="Define the function in Java"
// Split a socket address into host and port.
public static class IpPort implements ScalarFunction {
    public static class SocketAddr {
        public String host;
        public short port;
    }

    public SocketAddr eval(String addr) {
        var socketAddr = new SocketAddr();
        var parts = addr.split(":");
        socketAddr.host = parts[0];
        socketAddr.port = Short.parseShort(parts[1]);
        return socketAddr;
    }
}
```

```sql title="Create the function in RisingWave"
CREATE FUNCTION ip_port(varchar) RETURNS struct<host varchar, port smallint>
AS ip_port USING link 'http://localhost:8815';
```
