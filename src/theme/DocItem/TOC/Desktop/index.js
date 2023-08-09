import React from "react";
import { ThemeClassNames } from "@docusaurus/theme-common";
import { useDoc } from "@docusaurus/theme-common/internal";
import TOC from "@theme/TOC";
import ChatBot from "@site/src/components/ChatBot";
import AIBot from "@site/src/components/AIBot";

export default function DocItemTOCDesktop() {
  const { toc, frontMatter } = useDoc();
  return (
    <>
      {/* <ChatBot /> */}
      <AIBot />
      <TOC
        toc={toc}
        minHeadingLevel={frontMatter.toc_min_heading_level}
        maxHeadingLevel={frontMatter.toc_max_heading_level}
        className={ThemeClassNames.docs.docTocDesktop}
      />
    </>
  );
}
