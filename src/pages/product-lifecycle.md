---
id: product-lifecycle
title: Product lifecycle
description: RisingWave's product release lifecycle and how RisingWave defines each stage.
slug: /product-lifecycle
---

This page lists RisingWave's product release lifecycle, how RisingWave defines each stage, and a complete list of all features in the public preview stage.

## Product release lifecycle

In RisingWave, the release of product typically follows three main stages:

1. **Technical preview**: The technical preview stage is where we release a new feature for testing and feedback. It's not fully polished or finalized and is subject to change. We cannot guarantee its continued support in future releases, and it may be discontinued without notice. You may use this feature at your own risk.

2. **Public preview**: The public preview stage is where we've incorporated feedback from the technical preview and are nearing the final product. It's more stable than the technical preview, but there may still be some bugs and issues. During this stage, corresponding guides are provided in the official documentation, and the feature is marked with a "Public preview" note. A complete list of all such features is offered below.

3. **General availability (GA)**: All other features are considered to be generally available. The general availability stage is where the feature is fully developed, tested, and ready for use in production environments. At this stage, the "Public preview" note is removed.

## List of features in the public preview stage

As introduced above, when you see a "Public preview" note in the documentation, it indicates that a feature has not yet achieved 100% stability. We recommend evaluating the feature according to your specific use case. If you encounter any issues with the feature, please contact us via our [Slack channel](https://www.risingwave.com/slack). We also welcome any of your feedback to help us improve it.

The following is a list of all features in the public preview phase:

| Feature name                            | In public preview phase? | Start date | Start version | End date |
|-----------------------------------------|-------------------------|------------|---------------|----------|
| [Subscription](/transform/subscription.md) | Yes                     | 2024-06-15 | 1.0.0         | \        |
| Time travel queries                     | Yes                     | 2024-07-01 | 1.0.1         | \        |
| Manage secrets                          | Yes                     | 2024-07-10 | 1.0.2         | \        |
| Ingest from MySQL CDC (Auto-map schema) | Yes                     | 2024-07-20 | 1.0.3         | \        |


This table will be updated regularly to reflect the latest status of features as they progress through the release stages.