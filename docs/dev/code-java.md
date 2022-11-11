---
id: java-client-libraries
title: Java
description: Connect to RisingWave from a Java application
slug: /java-client-libraries
---

As RisingWave is wire-compatible with PostgreSQL, you can use third-party PostgreSQL drivers to interact with RisingWave from your Java applications.

In this guide, we use the [PostgreSQL JDBC](https://pypi.org/project/psycopg2/) driver to connect to RisingWave.


## Start RisingWave

To learn about how to start RisingWave, see [Install, run and connect to RisingWave](../install-run-connect.md).


## Download the PostgreSQL JDBC driver

Download the correct version of the PostgreSQL JDBC driver from the [PostgreSQL JDBC website](https://jdbc.postgresql.org/) based on the Java version in your environment. Ensure the JDBC driver is added to your Java project.


## Connect to RisingWave

To connect to RisingWave with the JDBC driver, specify the connection parameters by passing either a connection URL or a `Properties` object parameter to `DriverManager.getConnection`.

```java
import java.sql.*;
import java.util.Properties;

public class connect {

    public static void main (String arg[]) {
        String url = "jdbc:postgresql://localhost:4566/dev";
        Properties props = new Properties();
        props.setProperty("user", "root");
        props.setProperty("password", "secret");
        props.setProperty("ssl", "false");

        try (Connection conn = DriverManager.getConnection(url, props)) {
            if (conn != null) {
                System.out.println("Connected to RisingWave.");
            } else {
                System.out.println("Failed to connect to RisingWave.");
            }

        } catch (SQLException e) {
            System.err.format("SQL State: %s\n%s", e.getSQLState(), e.getMessage());
        } catch (Exception e) {
            e.printStackTrace();
        }
        //If needed, add the code for issuing queries here.
    }   
}
```

## Create a source

The code below creates a source with the `datagen` connector, and fetches all the sources in the database.

```java
import java.sql.*;
import java.util.Properties;

public class source {

    public static void main (String arg[]) throws SQLException {
        String url = "jdbc:postgresql://localhost:4566/dev";
        Properties props = new Properties();
        props.setProperty("user", "root");
        props.setProperty("password", "secret");
        props.setProperty("ssl", "false");
        Connection conn = DriverManager.getConnection(url, props);

        String sql_query = "CREATE MATERIALIZED SOURCE trip (id INT, distance INT) WITH" +
        "(connector = 'datagen'," +
        "fields.id.kind = 'sequence'," +
        "fields.id.start = '1'," +
        "fields.id.end  = '10'," +
        "fields.distance.kind = 'sequence'," +
        "fields.distance.start = '11'," +
        "fields.distance.end = '20'," +
        "datagen.rows.per.second='15'," +
        "datagen.split.num = '1') " +
        "ROW FORMAT JSON";

        PreparedStatement st = conn.prepareStatement(sql_query);
        st.execute();
        st.close();
    }
    }
```

:::note

All the code examples in this guide include a section for connecting to RisingWave. If you perform multiple actions within one connection session, you do not need to repeat this section.

:::


## Create a materialized view

The code in this section creates a materialized view `mv1` to capture the latest amount of trips and total distance.

```java
import java.sql.*;
import java.util.Properties;

public class create_mv {

    public static void main (String arg[]) throws SQLException {
        String url = "jdbc:postgresql://localhost:4566/dev";
        Properties props = new Properties();
        props.setProperty("user", "root");
        props.setProperty("password", "secret");
        props.setProperty("ssl", "false");
        Connection conn = DriverManager.getConnection(url, props);

        String sql_query = "CREATE MATERIALIZED VIEW mv1 AS " +
        "SELECT count(id) AS no_of_trips, sum(distance) AS total_distance " +
        "FROM trip; ";

        try (PreparedStatement st = conn.prepareStatement(sql_query)){ 
            st.executeQuery();
        }

        conn.close();
    }
}
```

## Query a materialized view

The code in this section queries the materialized view `mv1` to get the real-time numbers.

```java
import java.sql.*;
import java.util.Properties;

public class retrieve {

    public static void main (String arg[]) throws SQLException {
        String url = "jdbc:postgresql://localhost:4566/dev";
        Properties props = new Properties();
        props.setProperty("user", "root");
        props.setProperty("password", "secret");
        props.setProperty("ssl", "false");
        Connection conn = DriverManager.getConnection(url, props);

        try (PreparedStatement show_mv = conn.prepareStatement(
            "SELECT * FROM mv1;")) {
            try (ResultSet rs = show_mv.executeQuery()) {
                while (rs.next()) {
                    System.out.println("Number of trips: " + rs.getString("no_of_trips"));
                    System.out.println("Total distance: "+ rs.getString("total_distance"));
                }
            }
        }
    }
}
```








