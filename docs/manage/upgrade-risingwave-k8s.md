---
id: cluster-upgrades
title: Upgrade the RisingWave version in a cluster
description: How to upgrade the RisingWave version in a cluster.
slug: /cluster-upgrades
keywords: [risingwave upgrade]
---
We strongly recommend that you regularly upgrade your RisingWave version to pick up bug fixes, performance improvements, and new features.

## Upgrade with the RisingWave operator

1. Review the release notes: Before performing an upgrade, carefully review the release notes of the new software version. Take note of any breaking changes, new features, or improvements that may impact your cluster.

2. Backup your data: It is crucial to back up any critical data or configuration files before initiating the upgrade process. This ensures that you can restore your cluster to its previous state if any issues arise during the upgrade.

3. Upgrade strategy: Determine the appropriate upgrade strategy based on your specific requirements. Kubernetes provides different upgrade strategies like Rolling Updates, Blue-Green Deployments, or Canary Releases. Choose the strategy that best suits your application's availability and resilience needs.

4. Prepare for the upgrade: Ensure that your cluster is in a stable state before initiating the upgrade. Check the health of your cluster and resolve any existing issues. Also, ensure that your nodes have sufficient resources to accommodate the upgraded software version.

5. Update Kubernetes manifests: Modify your Kubernetes manifests (deployment, statefulset, etc.) to specify the new version of the software. Update the container image tag or any other relevant configuration parameters.

6. Apply the changes: Use the appropriate Kubernetes command (e.g., kubectl apply) to apply the changes to your cluster. This will trigger the deployment of the updated software version across the cluster based on your chosen upgrade strategy.

7. Monitor the upgrade: Monitor the upgrade process to ensure that the new software version is being rolled out successfully. Use Kubernetes monitoring tools or custom monitoring solutions to track the status of the deployment and verify that the updated pods are running as expected.

8. Perform validation tests: Run validation tests on your application to ensure that it functions correctly with the new software version. This includes testing critical functionalities, integrations, and performance benchmarks.

9. Rollback plan: In case the upgrade encounters issues or your application experiences unexpected behavior, have a rollback plan ready. This plan should include steps to revert to the previous version of the software and restore the backup data if necessary.

10. Post-upgrade cleanup: Once you are confident that the upgrade was successful and your application is functioning correctly, clean up any old resources, such as deprecated Pods or ReplicaSets, to ensure a clean and efficient cluster state.

## Upgrade with Helm
