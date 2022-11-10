---
id: java-client-libraries
title: Java
description: Connect to RisingWave from a Java application
slug: /java-client-libraries
---

As RisingWave is wire-compatible with PostgreSQL, you can use third-party PostgreSQL drivers to interact with RisingWave from your Java applications.

In this guide, we use the [PostgreSQL JDBC](https://pypi.org/project/psycopg2/) driver to connect to RisingWave.


## Start RisingWave

We recommend you set up a local multi-process cluster with Docker Compose. 

For the detailed steps, see [Set up a local cluster with Docker Compose](../install-run-connect.md#step-1-install-and-run-risingwave).


## Download the PostgreSQL JDBC driver

Download the correct version of the PostgreSQL JDBC driver from the [PostgreSQL JDBC website](https://jdbc.postgresql.org/) based on the Java version in your environment.


## Connect to RisingWave

To connect to RisingWave with the JDBC driver, specify the connection parameters by passing either a connection URL or a `Properties` object parameter to `DriverManager.getConnection`.

```java
import java.sql.*;
import java.util.Properties;

public class Test {

    public void testSimpleJdbcQuery() throws Exception {
        String url = "jdbc:postgresql://localhost:4566/dev";
        Properties props = new Properties();
        props.setProperty("user", "root");
        props.setProperty("password", "secret");
        props.setProperty("ssl", "false");
        Connection conn = DriverManager.getConnection(url, props);
        //If needed, add the code for issuing queries here.
        st.close();
    }
}
```

## Create a source

The code below creates a source with the `datagen` connector, and fetches all the sources in the database.

```java
import java.sql.*;
import java.util.Properties;

public class Test {
    
    public void testSimpleJdbcQuery() throws Exception {
        String url = "jdbc:postgresql://localhost:4566/dev";
        Properties props = new Properties();
        props.setProperty("user", "root");
        props.setProperty("password", "secret");
        props.setProperty("ssl", "false");
        Connection conn = DriverManager.getConnection(url, props);

        PreparedStatement st = conn.prepareStatement("CREATE MATERIALIZED SOURCE trip (id INT, distance INT) WITH" +
            "(connector = 'datagen'," +
            "fields.id.kind = 'sequence'," +
            "fields.id.start = '1'," +
            "fields.id.end  = '10'," +
            "fields.distance.kind = 'sequence'," +
            "fields.distance.start = '11'," +
            "fields.distance.end = '20'," +
            "datagen.rows.per.second='15'," +
            "datagen.split.num = '1') " +
            "row format json");
        ResultSet rs = st.executeQuery();
        while (rs.next()) {
            System.out.print("Column 1 returned ");
            System.out.println(rs.getString(1));
}
rs.close();
st.close();
    }
}
```

:::note

All the code examples in this guide include a section for connecting to RisingWave. If you perform multiple actions within one connection session, you do not need to repeat this section.

:::


## Create a materialized view

The code in this section creates a materialized view `avg_speed`, and queries all materialized views in the database.

```java
import java.sql.*;
import java.util.Properties;

public class Test {
    
    public void testSimpleJdbcQuery() throws Exception {
        String url = "jdbc:postgresql://localhost:4566/dev";
        Properties props = new Properties();
        props.setProperty("user", "root");
        props.setProperty("password", "secret");
        props.setProperty("ssl", "false");
        Connection conn = DriverManager.getConnection(url, props);

        PreparedStatement st = conn.prepareStatement("CREATE MATERIALIZED VIEW avg_speed" +
        "AS" +
        "SUM(distance) as total_distance," +
        "SUM(duration) as total_duration," +
        "SUM(distance) / SUM(duration) as avg_speed" +
        "FROM s1;");

        ResultSet rs = st.executeQuery();
        while (rs.next()) {
            System.out.print("Column 1 returned ");
            System.out.println(rs.getString(1));
}
rs.close();
st.close();
    }
}
```

## Query a materialized view

The code below queries the materialized view that is created above.

```java
import java.sql.*;
import java.util.Properties;

public class Test {
    
    public void testSimpleJdbcQuery() throws Exception {
        String url = "jdbc:postgresql://localhost:4566/dev";
        Properties props = new Properties();
        props.setProperty("user", "root");
        props.setProperty("password", "secret");
        props.setProperty("ssl", "false");
        Connection conn = DriverManager.getConnection(url, props);

        PreparedStatement st = conn.prepareStatement("SELECT * FROM avg_speed;");

        ResultSet rs = st.executeQuery();
        while (rs.next()) {
            System.out.print("Column 1 returned ");
            System.out.println(rs.getString(1));
}
rs.close();
st.close();
```








