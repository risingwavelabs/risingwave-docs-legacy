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

Here is an overview of the available options. We provide detailed example guides about how to interact with RisingWave for some of the drivers. For those without a guide, feel free to explore and utilize them based on your preferences and requirements.

This table will be continuously updated to ensure compatibility.


| Language   | Driver           | Latest tested version |
|------------|------------------|-----------------------|
| C          | [libpq](https://www.postgresql.org/docs/current/libpq.html)            |                       |
| C# (.NET)  | [Npgsql](https://www.npgsql.org/)           | 8.0.2                 |
| Go         | [pgx](https://pkg.go.dev/github.com/jackc/pgx/v5). See example [guide](/dev/go-client-libraries.md).              | v5.4.3                |
| Go         | [pq](https://github.com/lib/pq)               |                       |
| Java       | [JDBC](https://jdbc.postgresql.org/). See example [guide](/dev/java-client-libraries.md).             | 42.5.4                |
| JavaScript | [pg](https://www.npmjs.com/package/pg). See example [guide](/dev/nodejs-client-libraries.md).               | 8.11.3                |
| Python     | [psycopg2](https://pypi.org/project/psycopg2/). See example [guide](/dev/python-client-libraries.md).         |                       |
| Python     | [psycopg3](https://pypi.org/project/psycopg/)         |                       |
| Ruby       | [pg](https://github.com/ged/ruby-pg). See example [guide](/dev/ruby-client-libraries.md).               | 1.5.6                 |
| Rust       | [rust-postgres](https://crates.io/crates/postgres)    |                       |
| Rust       | [tokio-postgres](https://docs.rs/tokio-postgres/latest/tokio_postgres/)   | 0.7                   |
| PHP        | [pdo-pgsql](https://www.php.net/manual/en/ref.pdo-pgsql.php)        | 8.3.2                 |

