import React, { useEffect } from "react";
import clsx from "clsx";
import { ThemeClassNames } from "@docusaurus/theme-common";
import { useDoc } from "@docusaurus/theme-common/internal";
import LastUpdated from "@theme/LastUpdated";
import EditThisPage from "@theme/EditThisPage";
import TagsListInline from "@theme/TagsListInline";
import styles from "./styles.module.css";

function TagsRow(props) {
  return (
    <div className={clsx(ThemeClassNames.docs.docFooterTagsRow, "row margin-bottom--sm")}>
      <div className="col">
        <TagsListInline {...props} />
      </div>
    </div>
  );
}
function EditMetaRow({ editUrl, lastUpdatedAt, lastUpdatedBy, formattedLastUpdatedAt }) {
  return (
    <div className={clsx(ThemeClassNames.docs.docFooterEditMetaRow, "row")}>
      <div className="col">{editUrl && <EditThisPage editUrl={editUrl} />}</div>

      <div className={clsx("col", styles.lastUpdated)}>
        {(lastUpdatedAt || lastUpdatedBy) && (
          <LastUpdated
            lastUpdatedAt={lastUpdatedAt}
            formattedLastUpdatedAt={formattedLastUpdatedAt}
            lastUpdatedBy={lastUpdatedBy}
          />
        )}
      </div>
    </div>
  );
}
export default function DocItemFooter() {
  const { metadata } = useDoc();
  const { editUrl, lastUpdatedAt, formattedLastUpdatedAt, lastUpdatedBy, tags } = metadata;
  const canDisplayTagsRow = tags.length > 0;
  const canDisplayEditMetaRow = !!(editUrl || lastUpdatedAt || lastUpdatedBy);
  const canDisplayFooter = canDisplayTagsRow || canDisplayEditMetaRow;
  if (!canDisplayFooter) {
    return null;
  }
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
    childs.forEach((child) => {
      if (targetTable) targetTable.removeChild(child);
    });
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
      const isScroll = scrollable(table);
      isScroll && addHintNode(table);
      table.tBodies[0].addEventListener("scroll", (e) => hideHint(e));
    });

    return () => {
      document.body.removeChild(script);
      document.querySelectorAll("table").forEach((table) => {
        const isScroll = scrollable(table);
        isScroll && removeHintNode(table);
        table.tBodies[0].removeEventListener("scroll", (e) => hideHint(e));
      });
    };
  }, []);

  return (
    <footer className={clsx(ThemeClassNames.docs.docFooter, "docusaurus-mt-lg")}>
      {canDisplayTagsRow && <TagsRow tags={tags} />}
      {canDisplayEditMetaRow && (
        <EditMetaRow
          editUrl={undefined}
          lastUpdatedAt={lastUpdatedAt}
          lastUpdatedBy={lastUpdatedBy}
          formattedLastUpdatedAt={formattedLastUpdatedAt}
        />
      )}
    </footer>
  );
}
