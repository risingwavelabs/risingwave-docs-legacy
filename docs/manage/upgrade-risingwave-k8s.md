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

1. Review the chart: Begin by reviewing the Helm chart for the application you want to upgrade. Check the chart's documentation or release notes for any specific upgrade instructions or considerations.

2. Check the current Release: Use the helm list command to check the current status of your release. This will provide information about the deployed release, such as the release name and version.

3. Update the values: If necessary, update the values in your values.yaml file to reflect any changes or customizations you want to apply during the upgrade. Pay attention to any new or modified configuration options specific to the upgraded version.

4. Upgrade the release: Use the helm upgrade command to initiate the upgrade process. Specify the release name and the chart repository or chart path. For example:

```bash
helm upgrade RELEASE_NAME CHART [flags]

```

   Ensure that you specify the appropriate release name and chart details based on your setup.

1. Wait for upgrade completion: Monitor the upgrade process using helm status or kubectl commands to check the status of the updated resources. Wait for the upgrade to complete successfully across all the pods and resources.

1. Validate the upgrade: Perform functional and integration tests to verify that the upgraded application is working as expected. Validate critical functionalities, integrations, and any customizations made during the upgrade.

1. Rollback if necessary: If the upgrade encounters issues or your application experiences unexpected behavior, you can use the helm rollback command to revert to the previous release. This command will roll back to the previous version, allowing you to restore the previous working state.

1. Cleanup: Once you are confident that the upgrade was successful, you can clean up any unused resources or temporary files generated during the upgrade process. This helps maintain a clean and efficient cluster state.
