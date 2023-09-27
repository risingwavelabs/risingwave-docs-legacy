---
id: udf-foreign-data
slug: /udf-foreign-data
title: Use UDFs to query foreign data
description: Query data stored in other databases via UDFs
---

This article provides an example on how to query data stored in a different database via RisingWave. In this example we are using Python to query a Postgres database, but the same principles apply for other languages and databases.

To query foreign data via UDFs, you will need to create a UDF for each table you wish to query.

## Notes on performance

Querying foreign data is not efficient, since RisingWave will call a UDF server, which itself has to establish a connection against the foreign database. If performance is a concern, it is recommended to 

1. Stream changes from this database using CDC, if the data changes frequently

1. Load the entire database table into RisingWave, if the data does not change frequently



## Prerequisites

- Ensure that you have [Python](https://www.python.org/downloads/) (3.8 or later) installed on your computer.
  
- Ensure that you have [docker](https://docs.docker.com/engine/install/) installed and running. 

- Ensure that you have the [psql cli](https://www.postgresql.org/docs/current/app-psql.html) available. 

- Ensure that you have [started and connected to RisingWave](get-started.md#run-risingwave).


## 1. UDF setup

Run the following command to download and install the RisingWave UDF API package and its dependencies.

```shell
pip install risingwave
```

<details>
<summary>Cannot run this command?</summary>
If "command not found: pip" is returned, <a href="https://packaging.python.org/en/latest/tutorials/installing-packages/#ensure-you-can-run-pip-from-the-command-line">check if pip is available</a> in your environment and <a href="https://packaging.python.org/en/latest/tutorials/installing-packages/#ensure-pip-setuptools-and-wheel-are-up-to-date">ensure it is up to date</a>.
</details>

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';


Create a python file, containing our UDF

<details>
<summary>How?</summary>
Here are a few methods for creating a Python file.
<Tabs>
<TabItem value="code" label="Code editor">
Here we take VS Code as an example.

1. Open VS Code and create a new file by selecting **File** from the top menu and clicking on **New File**.

1. Type `udf.py` as the name and extension of the file.

1. Copy and paste the script below into the newly created file.

1. Save the edits.

</TabItem>

<TabItem value="terminal" label="Terminal">
Here we take the Vim text editor as an example.

1. Open a terminal window.

1. Run `vim udf.py` to create the file and open it in Vim.

1. Press `I` to enter insert mode in Vim.

1. Copy and paste the script below into the editor.

1. Press `Esc` to exit insert mode.

1. Enter `:wq` to save the file and exit Vim.

</TabItem>
</Tabs>
</details>

```python title="udf.py"
from risingwave.udf import udf, udtf, UdfServer
import psycopg2

@udtf(input_types=['VARCHAR'], result_types=['INT', 'INT', 'VARCHAR'])
def select_people_table_pg(query):
    connection = None
    people_records = []
    try:
        connection = psycopg2.connect(user="postgres", # It is recommended to use a read-only user in production
                                      password="mysecretpassword", # Please do NOT hardcode your password in production!
                                      host="127.0.0.1",
                                      port="5432",
                                      database="people")

        cursor = connection.cursor()
        postgres_select_query = query
        cursor.execute(postgres_select_query)
        print("Selecting rows from people table using cursor.fetchall")
        people_records = cursor.fetchall()

    # UDF server will show errors
    except (Exception, psycopg2.Error) as error:
        print("Error while fetching data from PostgreSQL", error)

    finally:
        # closing database connection.
        if connection is not None:
            cursor.close()
            connection.close()
            print("PostgreSQL connection is closed")
    
    # return all result tuples
    for row in people_records:
        yield row


# Start a UDF server
if __name__ == '__main__':
    server = UdfServer(location="0.0.0.0:8815")
    server.add_function(select_people_table_pg)
    server.serve()
```

<details>
<summary>See code explanation</summary>

We use the `udtf` decorator to declare a UDF that returns multiple tuples at once. We pass the query string to `select_people_table_pg` as the parameter `query`. The query is executed in against a postgres server running on `127.0.0.1:5432`

</details>

After creating `udf.py`, start the UDF server.

1. In a terminal window, navigate to the directory where `udf.py` is saved.

1. Run this command to execute `udf.py`.

    ```shell
    python3 udf.py
    ```

## 2. Postgres setup

To make this more fun, let's create data that our UDF can query. For this purpose we will run a local Postgres database using docker.

1. In a terminal run the following command: 

    ```shell
    docker run --rm -it -p 5432:5432 -e POSTGRES_PASSWORD=mysecretpassword postgres
    ```

1. Connect against the running postgres server in another terminal window 

    ```shell
    psql "port=5432 host=localhost user=postgres sslmode=disable" 
    ```

1. Provide the password `mysecretpassword`

1. Create our example data by running below commands

    ```sql
    -- Create the database
    CREATE DATABASE people;

    -- Connect to the database
    \c people;

    -- Create the table
    CREATE TABLE people (
        id SERIAL PRIMARY KEY,
        age INT,
        name VARCHAR(50)
    );

    -- Insert 10 dummy rows
    INSERT INTO people (age, name) VALUES 
      (30, 'Neo'),
      (29, 'Trinity'),
      (44, 'Morpheus'),
      (NULL, 'Agent Smith'),  -- Assuming NULL for age as an AI program
      (35, 'Cypher'),
      (28, 'Tank'),
      (30, 'Dozer'),
      (27, 'Switch'),
      (22, 'Mouse'),
      (NULL, 'The Oracle');

    -- Verify the inserted data
    SELECT * FROM people; 
    ```

1. Exit the connection with postgres by typing `exit`. 

## 3. Declare your FUNCTION in RisingWave

In RisingWave, use the [`CREATE FUNCTION`](/sql/commands/sql-create-function.md) command to declare the functions you defined.

1. Connect against your local RisingWave server and type

```sql
CREATE FUNCTION select_people_table_pg(VARCHAR) RETURNS TABLE (id int, age int, name varchar) LANGUAGE python AS select_people_table_pg USING LINK 'http://localhost:8815'; -- If you are running RisingWave using Docker, replace the address with 'http://host.docker.internal:8815'.
```

## 4. Query the external data in Potsgres via RisingWave

Once the UDFs are created in RisingWave, you can use them in SQL queries to query external data from the `people` table, just like it would be stored in RisingWave.

```sql
select * from select_people_table_pg('SELECT * FROM people WHERE age > 25;'::VARCHAR);
---
 id | age |   name
----+-----+----------
  1 |  30 | Neo
  2 |  29 | Trinity
  3 |  44 | Morpheus
  5 |  35 | Cypher
  6 |  28 | Tank
  7 |  30 | Dozer
  8 |  27 | Switch
(7 rows)

-- below query is equivalent to the above one
-- but the WHERE clause is applied in RisingWave instead of filtering in postgres directly
-- it therefore has worse performance than the one above
select * from select_people_table_pg('SELECT * FROM people;'::VARCHAR) WHERE age > 25;
```

Please note that if errors happend when evaluating the UDF, the results will be empty and error message could be found both in logs of compute nodes and the UDF server, e.g. 

```sql
select * from select_people_table_pg('an invalid query;'::VARCHAR);
---
 id | age |   name
----+-----+----------
(0 rows)
```
