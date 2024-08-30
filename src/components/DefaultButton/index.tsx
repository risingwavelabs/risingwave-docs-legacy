import { useHistory, useLocation } from "@docusaurus/router";
import useDocusaurusContext from "@docusaurus/useDocusaurusContext";
import React from "react";
import styles from "./styles.module.css";

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
          globalData["docusaurus-plugin-content-docs"].default["versions"].map((v) => {
            if (location.pathname.includes(v.path)) {
              history.push(`${v.path}/${doc}`);
            } else if (location.pathname.includes("cloud")) {
              history.push(`/docs/current/${doc}`);
            }
          });
        } else if (url) {
          window.open(url, "_blank", "noopener,noreferrer");
        } else if (cloud) {
          history.push(`/cloud/${cloud}`);
        }
      }}
      className={block ? `${styles.default} ${styles.block}` : `${styles.default}`}
    >
      {text}
    </div>
  );
}
