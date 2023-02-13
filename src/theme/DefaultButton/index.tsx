import { useHistory, useLocation } from "@docusaurus/router";
import useDocusaurusContext from "@docusaurus/useDocusaurusContext";
import React from "react";
import "./style.css";

type Props = {
  text: string;
  doc?: string;
  url?: string;
  block?: boolean;
};

export default function DefaultButton({ text, doc, url, block }: Props) {
  const history = useHistory();
  const { globalData } = useDocusaurusContext();
  const location = useLocation();

  return (
    <button
      onClick={() => {
        if (doc) {
          globalData["docusaurus-plugin-content-docs"].default["versions"].map((v) => {
            if (location.pathname.includes(v.path)) {
              history.push(`${v.path}/${doc}`);
            }
          });
        } else if (url) {
          window.open(url, "_blank", "noopener,noreferrer");
        }
      }}
      className={block ? "default block" : "default"}
    >
      {text}
    </button>
  );
}
