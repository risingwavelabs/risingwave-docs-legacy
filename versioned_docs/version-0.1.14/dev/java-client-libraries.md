---
id: java-client-libraries
title: Use RisingWave in your Java application
description: Use RisingWave in your Java application
slug: /java-client-libraries
---

As RisingWave is wire-compatible with PostgreSQL, you can use third-party PostgreSQL drivers to interact with RisingWave from your Java applications.

In this guide, we use the [PostgreSQL JDBC](https://jdbc.postgresql.org/) driver to connect to RisingWave.


## Run RisingWave

To learn about how to run RisingWave, see [Run RisingWave](../get-started.md#run-risingwave).
> You do not need to connect to RisingWave at this stage.


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
        Connection conn = DriverManager.getConnection(url, props);

        //If needed, add the code for issuing queries here.
        conn.close();
    }   
}
```

## Create a source

The code below creates a source `walk` with the `datagen` connector. The `datagen` connector is used to generate mock data. The `walk` source consists of two columns, `distance` and `duration`, which respectively represent the distance and the duration of a walk. The source is a simplified version of the data that is tracked by smart watches.

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
        "fields.distance.end  = '60'," +
        "fields.duration.kind = 'sequence'," +
        "fields.duration.start = '1'," +
        "fields.duration.end = '30'," +
        "datagen.rows.per.second='15'," +
        "datagen.split.num = '1') " +
        "ROW FORMAT JSON";
        PreparedStatement st = conn.prepareStatement(sqlQuery); //Define a query and pass it to a PreparedStatement object.
        st.executeQuery(); //Execute the query.
        conn.close();  //Close the connection.
    }
}
```

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

The code in this section queries the materialized view `counter` to get the real-time data.

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