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
      {/* <ChatbotItem /> */}
      {metadata.editUrl && (
        <div className="row">
          <FeedbackForm
            unversionedId={metadata.unversionedId}
            editUrl={metadata.editUrl}
            requestIssueUrl={requestIssueUrl}
          />
        </div>
      )}
    </DocProvider>
  );
}
