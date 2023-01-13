---
id: install-psql-without-postgresql
title: Install psql without PostgreSQL
description:  Install psql without installing the full PostgreSQL package.
slug: /install-psql-without-postgresql
---

To use RisingWave, you need a PostgreSQL client, not the PostgreSQL server. The PostgreSQL [official installers and packages](https://www.postgresql.org/download/) come with all the components needed to run a PostgreSQL server, but some of these components are not needed for RisingWave.

[`psql`](https://www.postgresql.org/docs/current/app-psql.html), which is included in the PostgreSQL package, is a command-line interface for interacting with PostgreSQL databases. As RisingWave is wire-compatible with PostgreSQL, `psql` becomes an essential tool for you to connect to RisingWave, issue SQL queries, and manage database objects.

To install `psql` without the rest of the PostgreSQL package, you can use your operating system's package manager. Here are the steps to install psql on some common operating systems:

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

<Tabs>
<TabItem value="macos" label="macOS">

1. Install [Homebrew](https://brew.sh) if you don't have it on your mac.

1. Update package definitions (formulae).

    ```
    brew update
    ```
1. Install [`libpq`](https://www.postgresql.org/docs/current/libpq.html).

    ```
    brew install libpq
    ```
    > Homebrew's package for the PostgreSQL client tools is `libpq`, which includes `psql`, `pg_dump`, and other client utilities.
1. Link all binaries of `libpq` to `/usr/local/bin`.

    ```
    brew link --force libpq
    ```
    > `libpq` does not install itself in the `/usr/local/bin` directory. Thus, you need to link them to the directory to use the installed binaries.

</TabItem>
<TabItem value="debian" label="Debian/Ubuntu">

1. Update apt's package list.

    ```
    sudo apt update
    ```

1. Install the client packages.

    ```
    sudo apt install postgresql-client
    ```

</TabItem>
<TabItem value="redhat" label="Red Hat/CentOS">

1. Install the repository RPM to point YUM at the PostgreSQL repository.
    
    Go to [Linux Downloads (Red Hat Family)](https://www.postgresql.org/download/linux/redhat/) and select your platform for the command and repository URL.
    <img
    src={require('../images/install_postgresql_redhat.png').default}
    alt="Linux downloads (Red Hat family)"/>

1. Install the latest client packages.

    ```
    sudo yum install postgresql
    ```
    > Strange as it may seem, `postgresql` is the right package we are looking for in YUM.<br/>`postgresql` — PostgreSQL client programs including `psql`<br/>`postgresql-server` — The complete set of programs required to set up a PostgreSQL server


</TabItem>
<TabItem value="fedora" label="Fedora">

Simply run:

```
sudo dnf install postgresql.x86_64 
```
> `postgresql` represents the PostgreSQL client programs including `psql` in DNF.

</TabItem>
<TabItem value="windows" label="Windows">

For Windows users, please use the [interactive installer by EDB](https://www.postgresql.org/download/windows/).

This is the usual way of installing PostgreSQL on Windows. But to install the client only, select **Command Line Tools** and uncheck other options when selecting components during installation.

</TabItem>
</Tabs>

