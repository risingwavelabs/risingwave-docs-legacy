---
id: java-client-libraries
title: Java
description: Connect to RisingWave from a Java application
slug: /java-client-libraries
---

As RisingWave is wire-compatible with PostgreSQL, you can use third-party PostgreSQL drivers to interact with RisingWave from your Java applications.

In this guide, we use the [PostgreSQL JDBC](https://jdbc.postgresql.org/) driver to connect to RisingWave.


## Start RisingWave

To learn about how to start RisingWave, see [Install, run and connect to RisingWave](../install-run-connect.md).


## Download the PostgreSQL JDBC driver

Download the correct version of the PostgreSQL JDBC driver from the [PostgreSQL JDBC website](https://jdbc.postgresql.org/download/) based on the Java version in your environment. Ensure the JDBC driver is added to your Java project.


## Connect to RisingWave

To connect to RisingWave with the JDBC driver, specify the connection parameters by passing either a connection URL or a `Properties` object parameter to `DriverManager.getConnection`.

```java
import java.sql.*;
import java.util.Properties;

public class RisingWaveConnect {

    public static void main (String arg[]) throws SQLException{
        String url = "jdbc:postgresql://localhost:4566/dev";
        Properties props = new Properties();
        props.setProperty("user", "root");
        props.setProperty("password", "secret");
        props.setProperty("ssl", "false");
        Connection conn = DriverManager.getConnection(url, props)

        //If needed, add the code for issuing queries here.
        
    }   
}
```

## Create a source

The code in this section creates a source `counter` with the `datagen` connector. The `datagen` connector is used to generate mock data.

```java
import java.sql.*;
import java.util.Properties;

public class source {

    public static void main (String arg[]) throws SQLException {

        //If necessary, add the code for connecting to RisingWave here.

        String sqlQuery = "CREATE MATERIALIZED SOURCE walk (distance INT, duration INT) WITH " +
        "(connector = 'datagen'," +
        "fields.distance.kind = 'sequence'," +
        "fields.distance.start = '1'," +
        "fields.distance.end  = '10'," +
        "fields.duration.kind = 'sequence'," +
        "fields.duration.start = '11'," +
        "fields.duration.end = '20'," +
        "datagen.rows.per.second='15'," +
        "datagen.split.num = '1') " +
        "ROW FORMAT JSON";
        PreparedStatement st = conn.prepareStatement(sqlQuery);
        st.executeQuery();
        conn.close();
    }
}
```

:::note

All the code examples in this guide include a section for connecting to RisingWave. If you perform multiple actions within one connection session, you do not need to repeat this section.

:::


## Create a materialized view

The code in this section creates a materialized view `counter` to capture the latest total distance and duration.

```java
import java.sql.*;
import java.util.Properties;

public class create_mv {

    public static void main (String arg[]) throws SQLException {

        //If necessary, add the code for connecting to RisingWave here.

        String sqlQuery = "CREATE MATERIALIZED VIEW counter AS " +
        "SELECT sum(distance) AS total_distance, sum(duration) AS total_duration " +
        "FROM walk; ";
        PreparedStatement st = conn.prepareStatement(sqlQuery); 
        st.executeQuery();
        conn.close();
    }
}
```

## Query a materialized view

The code in this section queries the materialized view `counter` to get the real-time numbers.

```java
import java.sql.*;
import java.util.Properties;

public class retrieve {

    public static void main (String arg[]) throws SQLException {

        //If necessary, add the code for connecting to RisingWave here.

        PreparedStatement showMV = conn.prepareStatement("SELECT * FROM counter;");
        ResultSet rs = showMV.executeQuery();
        while (rs.next()) {
            System.out.println("Total distance: " + rs.getString("total_distance"));
            System.out.println("Total duration: " + rs.getString("total_duration"));
        }
    }
}
```