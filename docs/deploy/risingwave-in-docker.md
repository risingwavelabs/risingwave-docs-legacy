---
id: risingwave-in-docker
title: Set up a local RisingWave cluster in Docker
description: Start a multi-node local RisingWave cluster in Docker.
slug: /risingwave-in-docker
---

You can set up a full-featured RisingWave cluster via Docker Desktop. The cluster is composed of multiple RisingWave components, including:

* A frontend node
* A compute node
* A meta node
* A compactor node
* A datagen source connector
* A message queue

RisingWave also incorporates these third-party components:

* Grafana
* Etcd
* MinIO
* Prometheus


As prerequisites, you need to install [Docker Desktop](https://docs.docker.com/get-docker/) in your environment. Ensure that it is running before launching the cluster.

Then, clone the [risingwave-demo](https://github.com/risingwavelabs/risingwave-demo) repository.

```shell
git clone https://github.com/risingwavelabs/risingwave-demo.git
```

Now navigate to the `docker` directory and start the cluster from the docker-compose file.

```shell
cd risingwave-demo/docker
docker-compose up -d
```

:::note

If the following error occurs:
```shell
ERROR: The Compose file './docker-compose.yml' is invalid because:
'name' does not match any of the regexes: '^x-'
```
Use `docker compose` instead of `docker-compose`, or enable **Use Docker Compose V2** on the Settings page of Docker Desktop.

For more information, see [Docker Documentation](https://docs.docker.com/compose/#compose-v2-and-the-new-docker-compose-command).

:::

## What's next

[Connect to RisingWave](/install-run-connect.md/#step-2-connect-to-risingwave) via the Postgres interactive terminal `psql`.