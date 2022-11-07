import { useHistory } from "@docusaurus/router";
import React from "react";
import "./style.css";

type Props = {
  text: string;
  docs?: string;
  url?: string;
};

export default function LightButton({ text, docs, url }: Props) {
  const history = useHistory();
  return (
    <button
      onClick={() => {
        if (docs) history.push(`/docs/latest/${docs}`);
        else if (url) window.open(url, "_blank", "noopener,noreferrer");
      }}
      className="light"
    >
      {text}
    </button>
  );
}
