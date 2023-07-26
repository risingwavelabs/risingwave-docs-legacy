import { useHistory, useLocation } from "@docusaurus/router";
import useDocusaurusContext from "@docusaurus/useDocusaurusContext";
import React from "react";
import "./style.css";

type Props = {
  text: string;
  doc?: string;
  url?: string;
  cloud?: string;
  block?: boolean;
};

export default function DefaultButton({ text, doc, url, block, cloud }: Props) {
  const history = useHistory();
  const { globalData } = useDocusaurusContext();
  const location = useLocation();

  return (
    <div
      onClick={() => {
        if (doc) {
          for (let v of globalData["docusaurus-plugin-content-docs"].default["versions"]) {
            if (location.pathname.includes(v.path)) {
              return history.push(`${v.path}/${doc}`);
            } else {
              return history.push(`/docs/current/${doc}`);
            }
          }
        } else if (url) {
          window.open(url, "_blank", "noopener,noreferrer");
        } else if (cloud) {
          history.push(`/cloud/${cloud}`);
        }
      }}
      className={block ? "default block" : "default"}
    >
      {text}
    </div>
  );
}
