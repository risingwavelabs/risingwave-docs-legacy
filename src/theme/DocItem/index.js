import React from "react";
import { HtmlClassNameProvider } from "@docusaurus/theme-common";
import { DocProvider } from "@docusaurus/theme-common/internal";
import DocItemMetadata from "@theme/DocItem/Metadata";
import DocItemLayout from "@theme/DocItem/Layout";
import FeedbackForm from "@site/src/components/FeedbackForm";
import useDocusaurusContext from "@docusaurus/useDocusaurusContext";

export default function DocItem(props) {
  const { siteConfig } = useDocusaurusContext();
  const { customFields } = siteConfig;
  const { docsUrl, bugReportUrl } = customFields;

  const docHtmlClassName = `docs-doc-id-${props.content.metadata.unversionedId}`;
  const MDXComponent = props.content;
  const { content: DocContent } = props;
  const { metadata } = DocContent;

  const requestIssueUrl = `${bugReportUrl}${docsUrl}${metadata.permalink}`;

  return (
    <DocProvider content={props.content}>
      <HtmlClassNameProvider className={docHtmlClassName}>
        <DocItemMetadata />
        <DocItemLayout>
          <MDXComponent />
        </DocItemLayout>
      </HtmlClassNameProvider>
      {metadata.editUrl && (
        <div className="col margin-top--sm" style={{ padding: "0" }}>
          <FeedbackForm editUrl={metadata.editUrl} requestIssueUrl={requestIssueUrl} />
        </div>
      )}
    </DocProvider>
  );
}
