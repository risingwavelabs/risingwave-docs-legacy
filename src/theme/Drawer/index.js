import React from "react";
import "./style.css";

export default function Drawer(props) {
  const { SVG } = props;

  return (
    <div className="svg-box" style={{}}>
      <svg
        className="svg-container"
        style={{ marginTop: "20px", width: SVG.attrs.width }}
        ref={(element) => {
          element && element.appendChild(SVG.toSVG());
        }}
      ></svg>
    </div>
  );
}
