import { useHistory } from "@docusaurus/router";
import React from "react";
import "./style.css";

type Props = {
  text: string;
  doc?: string;
  url?: string;
};

export default function RollButton({ text, doc, url }: Props) {
  const history = useHistory();
  return (
    <div>
      <button
        onClick={() => {
          if (doc) history.push(`/docs/latest/${doc}`);
          else if (url) window.open(url, "_blank", "noopener,noreferrer");
        }}
        className="button-3 learn-more"
      >
        <span className="circle" aria-hidden="true">
          <span className="icon arrow"></span>
        </span>
        <span className="button-text">{text}</span>
      </button>
    </div>
  );
}
