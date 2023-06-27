module.exports = {
  CloudSidebar: [
    {
      type: "category",
      label: "About",
      collapsible: false,
      collapsed: false,
      items: [
        {
          type: "doc",
          id: "about-whats-risingwave-cloud",
        },
        // {
        //   type: "doc",
        //   id: "about-whats-new",
        // },
        {
          type: "doc",
          id: "about-faq",
        },
      ],
    },
    {
      type: "category",
      label: "Get started",
      collapsible: false,
      collapsed: false,
      items: [
        {
          type: "doc",
          id: "quickstart",
          label: "Quick start",
        },
        {
          type: "link",
          href: "https://www.risingwave.cloud/auth/signup/",
          label: "Sign up and log in",
        },
      ]
    },
    {
      type: "category",
      label: "Cluster & database",
      collapsible: false,
      collapsed: false,
      items: [
        {
          type: "category",
          label: "Manage clusters",
          collapsible: true,
          link: {type: 'doc', id: 'cluster-manage-clusters'},
          items: [
            {
              type: "doc",
              id: "cluster-manage-clusters",
              label: "Overview",
            },
            {
              type: "doc",
              id: "cluster-choose-a-cluster-plan",
            },
            {
              type: "doc",
              id: "cluster-connect-to-a-cluster",
            },
            {
              type: "doc",
              id: "cluster-check-status-and-metrics",
              label: "Check status and metrics",
            },
            {
              type: "doc",
              id: "cluster-stop-and-delete-clusters",
            },
          ],
        },
        {
          type: "category",
          label: "Manage database users",
          collapsible: true,
          collapsed: true,
          link: {type: 'doc', id: 'cluster-manage-database-users'},
          items: [
            {
              type: "doc",
              id: "cluster-manage-database-users",
              label: "Overview",
            },
            {
              type: "doc",
              id: "cluster-create-a-database-user",
              label: "Create a user",
            },
            {
              type: "doc",
              id: "cluster-change-database-user-password",
              label: "Change user password",
            },
            {
              type: "doc",
              id: "cluster-delete-a-database-user",
              label: "Delete a user",
            },
          ],
        },
        {
          type: "doc",
          id: "cluster-monitor-materialized-views",
        },
      ],
    },
    {
      type: "category",
      label: "Develop",
      collapsible: false,
      collapsed: false,
      items: [
        {
          type: "doc",
          id: "develop-overview",
        },
        {
          type: "category",
          label: "Manage sources",
          collapsible: true,
          collapsed: true,
          link: {type: 'doc', id: 'source-manage-sources'},
          items: [
            {
              type: "doc",
              id: "source-manage-sources",
              label: "Overview",
            },
            {
              type: "doc",
              id: "source-create-a-source",
            },
            {
              type: "doc",
              id: "source-drop-a-source",
            },
          ]
        },
        {
          type: "category",
          label: "Manage sinks",
          collapsible: true,
          collapsed: true,
          link: {type: 'doc', id: 'sink-manage-sinks'},
          items: [
            {
              type: "doc",
              id: "sink-manage-sinks",
              label: "Overview",
            },
            {
              type: "doc",
              id: "sink-create-a-sink",
            },
            {
              type: "doc",
              id: "sink-drop-a-sink",
            },
          ]
        },
        {
          type: "doc",
          id: "console-overview",
        },
      ],
    },
    {
      type: "category",
      label: "Account",
      collapsible: false,
      collapsed: false,
      items: [
        {
          type: "category",
          label: "Manage your account",
          collapsible: true,
          collapsed: true,
          items: [
            {
              type: "doc",
              id: "account-manage-your-account",
              label: "Overview",
            },
            {
              type: "link",
              label: "Update your profile",
              href: "/cloud/manage-your-account/?task=update-profile",
            },
            {
              type: "link",
              label: "Change account password",
              href: "/cloud/manage-your-account/?task=change-password",
            },
            {
              type: "link",
              label: "Delete your account",
              href: "/cloud/manage-your-account/?task=delete-account",
            },
            {
              type: "link",
              label: "Switch accounts",
              href: "/cloud/manage-your-account/?task=switch-accounts",
            },
          ],
        },
        {
          type: "doc",
          id: "account-forgot-password",
        },
      ],
    },
  ],
};
