/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

// This file is a copy of https://github.com/facebook/docusaurus/blob/v3.5.2/packages/docusaurus-theme-classic/src/theme/DocItem/index.tsx.
// Changes are marked with "XXX: RW CUSTOMIZATION" comments.

import React from 'react';
import { HtmlClassNameProvider } from '@docusaurus/theme-common';
import { DocProvider } from '@docusaurus/plugin-content-docs/client';
import DocItemMetadata from '@theme/DocItem/Metadata';
import DocItemLayout from '@theme/DocItem/Layout';
import type { Props } from '@theme/DocItem';

// XXX: RW CUSTOMIZATION
import useDocusaurusContext from "@docusaurus/useDocusaurusContext";
import FeedbackForm from "@site/src/components/FeedbackForm";
import "./custom.css";

export default function DocItem(props: Props): JSX.Element {
  const docHtmlClassName = `docs-doc-id-${props.content.metadata.id}`;
  const MDXComponent = props.content;

  // XXX: RW CUSTOMIZATION
  const { siteConfig } = useDocusaurusContext();
  const { docsUrl, bugReportUrl } = siteConfig.customFields as {
    docsUrl: string;
    bugReportUrl: string;
  };
  const metadata = props.content.metadata;
  const requestIssueUrl = `${bugReportUrl}${docsUrl}${metadata.permalink}`;

  return (
    <DocProvider content={props.content}>
      <HtmlClassNameProvider className={docHtmlClassName}>
        <DocItemMetadata />
        <DocItemLayout>
          <MDXComponent />
        </DocItemLayout>
      </HtmlClassNameProvider>

      {/* XXX: RW CUSTOMIZATION */}
      {metadata.editUrl && (
        <div className="row">
          <FeedbackForm
            id={metadata.id}
            editUrl={metadata.editUrl}
            requestIssueUrl={requestIssueUrl}
          />
        </div>
      )}
    </DocProvider>
  );
}