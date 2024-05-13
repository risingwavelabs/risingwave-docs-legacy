---
id: client-libraries-overview
title: The overview of client libraries
description: The overview of client libraries.
slug: /client-libraries-overview
---
<head>
  <link rel="canonical" href="https://docs.risingwave.com/docs/current/client-libraries-overview/" />
</head>

As RisingWave is wire-compatible with PostgreSQL, you have the flexibility to utilize third-party PostgreSQL drivers to seamlessly interact with RisingWave from your applications.

Here is an overview of the available options. Feel free to explore the detailed tutorials to learn how to effectively use RisingWave in your preferred programming language and driver. Keep in mind that this table is continuously updated to ensure compatibility.

| Language   | Driver           | Latest tested version | Tutorial Link           |
|------------|------------------|-----------------------|-------------------------|
| C          | libpq            |                       |                         |
| C# (.NET)  | Npgsql           | 8.0.2                 |                         |
| Go         | pgx              | v5.4.3                | [pgx tutorial](/dev/go-client-libraries.md)  |
| Go         | pq               |                       |                         |
| Java       | JDBC             | 42.5.4                | [JDBC tutorial](/dev/java-client-libraries.md)|
| JavaScript | pg               | 8.11.3                | [Node.js pg tutorial](/dev/nodejs-client-libraries.md) |
| Python     | psycopg2         |                       | [psycopg2 tutorial](/dev/python-client-libraries.md) |
| Python     | psycopg3         |                       |                         |
| Ruby       | pg               | 1.5.6                 | [ruby-pg tutorial](/dev/ruby-client-libraries.md)                        |
| Rust       | rust-postgres    |                       |                         |
| Rust       | tokio-postgres   | 0.7                   |                         |
| PHP        | pdo-pgsql        | 8.3.2                 |                         |
