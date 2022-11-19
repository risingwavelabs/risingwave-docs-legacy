import { useHistory } from "@docusaurus/router";
import React from "react";
import "./style.css";

type Props = {
  text: string;
  doc?: string;
  url?: string;
  block?: boolean;
};

export default function LightButton({ text, doc, url, block }: Props) {
  const history = useHistory();
  return (
    <button
      onClick={() => {
        if (doc) history.push(`/docs/latest/${doc}`);
        else if (url) window.open(url, "_blank", "noopener,noreferrer");
      }}
      className={block ? "light block" : "light"}
    >
      {text}
    </button>
  );
}
