import React from "react";
import "./style.css";

export default function RollButton(props) {
  const { text } = props;

  return (
    <div>
      <button className="button-3 learn-more">
        <span className="circle" aria-hidden="true">
          <span className="icon arrow"></span>
        </span>
        <span className="button-text">{text}</span>
      </button>
    </div>
  );
}
