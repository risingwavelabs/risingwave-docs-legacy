---
id: troubleshooting-deployment-issues
title: Deployment issues
slug: /troubleshooting-deployment-issues
---
<head>
  <link rel="canonical" href="https://docs.risingwave.com/docs/current/troubleshooting-deployment-issues/" />
</head>

This page summarizes some issues about deployment.

## RisingWave is terminated with exit code `132`

If RisingWave is terminated with exit code `132` when running in any environment, this corresponds to the `SIGILL`, which is a signal from the OS that some instruction in the compiled RisingWave binary is not supported.

In many cases, this instruction is from the [AVX2 instruction set](https://en.wikipedia.org/wiki/Advanced_Vector_Extensions), which we use for `SIMD` instructions. If their machine does not have support for this instruction set, they cannot run RisingWave.

This happens for all deployment modes, docker, binary, Kubernetes etc.
