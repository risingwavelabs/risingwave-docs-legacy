import React, { useEffect, useState } from "react";
import "./style.css";

export default function Drawer(props) {
  const { SVG } = props;
  const [width, setWidth] = useState(SVG.attrs.width);
  const [height, setHeight] = useState(SVG.attrs.height);

  useEffect(() => {
    setWidth(SVG.attrs.width);
    setHeight(SVG.attrs.height);

    return () => {};
  }, [SVG]);

  return (
    <div className="svg-box" style={{}}>
      <svg
        className="svg-container"
        style={{ width: width, height: height }}
        ref={(element) => {
          element && element.appendChild(SVG.toSVG());
        }}
      ></svg>
    </div>
  );
}
