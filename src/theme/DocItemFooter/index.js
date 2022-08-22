/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
import React from "react";
import clsx from "clsx";
import LastUpdated from "@theme/LastUpdated";
import EditThisPage from "@theme/EditThisPage";
import TagsListInline from "@theme/TagsListInline";
import styles from "./styles.module.css";
import { ThemeClassNames } from "@docusaurus/theme-common";
import { useEffect } from "react";

function TagsRow(props) {
  return (
    <div className={clsx(ThemeClassNames.docs.docFooterTagsRow, "row margin-bottom--sm")}>
      <div className="col">
        <TagsListInline {...props} />
      </div>
    </div>
  );
}

function EditMetaRow({ lastUpdatedAt, lastUpdatedBy, formattedLastUpdatedAt }) {
  return (
    <div className={clsx(ThemeClassNames.docs.docFooterEditMetaRow, "row")}>
      <div className={clsx("col", styles.lastUpdated)}>
        {(lastUpdatedAt || lastUpdatedBy) && (
          <LastUpdated
            lastUpdatedAt={lastUpdatedAt}
            lastUpdatedBy={lastUpdatedBy}
            formattedLastUpdatedAt={formattedLastUpdatedAt}
          />
        )}
      </div>
    </div>
  );
}

export default function DocItemFooter(props) {
  const { content: DocContent } = props;
  const { metadata } = DocContent;
  const { editUrl, lastUpdatedAt, formattedLastUpdatedAt, lastUpdatedBy, tags } = metadata;
  const canDisplayTagsRow = tags.length > 0;
  const canDisplayEditMetaRow = !!(editUrl || lastUpdatedAt || lastUpdatedBy);
  const canDisplayFooter = canDisplayTagsRow || canDisplayEditMetaRow;

  const dateOptions = { day: "numeric", month: "long", year: "numeric" };

  let formattedDate = new Date(formattedLastUpdatedAt);
  formattedDate = formattedDate.toLocaleDateString("en-US", dateOptions);

  const getTableWidth = () => {
    const viewWidth = document.querySelector("article");
    const computedStyles = document.defaultView.getComputedStyle(viewWidth);
    const paddingLeft = parseFloat(computedStyles.paddingLeft);
    const paddingRight = parseFloat(computedStyles.paddingRight);
    return viewWidth.clientWidth - (paddingLeft + paddingRight);
  };

  const scrollable = (table) => {
    return table?.tBodies[0].childNodes[0].scrollWidth > getTableWidth();
  };

  const reDisplay = (targetTable) => {
    targetTable.lastChild.classList.remove("invisible");
    targetTable.lastChild.classList.add("visible");
  };

  const addHintNode = (targetTable) => {
    const hintNode = document.createElement("div");
    hintNode.className = "scrollHint visible";
    hintNode.innerText = "";

    !targetTable.querySelectorAll("div.scrollHint").length
      ? targetTable.appendChild(hintNode.cloneNode(true), targetTable)
      : reDisplay(targetTable);
  };

  const removeHintNode = (targetTable) => {
    const childs = targetTable.parentNode.querySelectorAll("div.scrollHint");
    childs.forEach((child) => targetTable.removeChild(child));
  };

  const hideHint = (e) => {
    e.target.parentNode.lastChild.className = "scrollHint invisible";
  };

  useEffect(() => {
    const theads = document.querySelectorAll("thead>tr");
    const tbodys = document.querySelectorAll("tbody");
    if (theads.length) {
      for (let i = 0; i < theads.length; ++i) {
        theads[i].classList.add("syncscroll");
        theads[i].setAttribute("name", "table" + i);
        tbodys[i].classList.add("syncscroll");
        tbodys[i].setAttribute("name", "table" + i);
      }
    }

    const script = document.createElement("script");
    script.src = "https://asvd.github.io/syncscroll/syncscroll.js";
    script.async = true;
    document.body.appendChild(script);

    document.querySelectorAll("table").forEach((table) => {
      scrollable(table) ? addHintNode(table) : removeHintNode(table);
      table.tBodies[0].addEventListener("scroll", (e) => hideHint(e));
    });

    return () => {
      document.body.removeChild(script);
      theads.forEach((tr) => {
        tr.addEventListener("scroll", (e) => hideHint(e));
      });
    };
  }, []);

  if (!canDisplayFooter) {
    return null;
  }

  return (
    <footer className={clsx(ThemeClassNames.docs.docFooter, "docusaurus-mt-lg")}>
      {canDisplayTagsRow && <TagsRow tags={tags} />}
      {canDisplayEditMetaRow && (
        <EditMetaRow
          lastUpdatedAt={lastUpdatedAt}
          lastUpdatedBy={lastUpdatedBy}
          formattedLastUpdatedAt={formattedDate}
        />
      )}
    </footer>
  );
}
