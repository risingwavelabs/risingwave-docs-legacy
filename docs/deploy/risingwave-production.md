---
id: risingwave-production
title: Run RisingWave for production
description: Run RisingWave for production purposes.
slug: /risingwave-production
---

Select between using RisingWave Cloud for fully-managed clusters or self-hosting with Kubernetes.

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

<Tabs queryString="method">

<TabItem value="cloud" label="RisingWave Cloud">

Experience intuitive and effortless stream processing with RisingWave Cloud. Sign up now and get a free, fully managed cluster up and running with a few clicks.

<defaultButton text="Sign up for RisingWave Cloud" url="https://risingwave.cloud/auth/signup/"/><lightButton text="Quickstart" cloud="quickstart"/><lightButton text="FAQ" cloud="faq"/><lightButton text="Learn more" cloud="intro"/>

<br/>
<br/>

<img
  src={require('../images/cloud-overview.png').default}
  alt="RisingWave Cloud Overview"
/>

</TabItem>

<TabItem value="kubernetes" label="Kubernetes">

Refer the article below to use the [Kubernetes Operator for RisingWave](https://github.com/risingwavelabs/risingwave-operator) to deploy a RisingWave cluster in Kubernetes.

<card
 maxWidth="300px"
 title="Set up a RisingWave cluster in Kubernetes"
 content="Deploy RisingWave in a Kubernetes cluster with the Kubernetes Operator for RisingWave."
 doc="risingwave-kubernetes"
/>

</TabItem>

</Tabs>
