---
id: troubleshooting-common-errors-and-solutions
title: Common errors and solutions
slug: /troubleshooting-common-errors-and-solutions
---
<head>
  <link rel="canonical" href="https://docs.risingwave.com/docs/current/troubleshooting-common-errors-and-solutions/" />
</head>

This page summarizes some common issues encountered in various scenarios and provides corresponding solutions.

## RisingWave is killed with exit code `132`

If RisingWave is killed with exit code `132` when running in any environment, this corresponds to the `SIGILL`, which is a signal from the OS that some instruction in the compiled RisingWave binary is not supported.

In many cases, this instruction is from the [AVX2 instruction set](https://en.wikipedia.org/wiki/Advanced_Vector_Extensions), which we use for `SIMD` instructions. If their machine does not have support for this instruction set, they cannot run RisingWave.

This happens for all deployment modes, docker, binary, Kubernetes etc.
