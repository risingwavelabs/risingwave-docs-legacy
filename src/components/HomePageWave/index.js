import React from "react";
import * as d3 from "d3";
import { useEffect, useRef } from "react";
import data from "./data";

let svg;

export default function HomePageWave() {
  const svgContainer = useRef(null);

  useEffect(() => {
    if (svgContainer.current) {
      svg = d3.select(svgContainer.current).attr("viewBox", [0, 200, 4096, 300]);

      let g = svg.append("g");
      let pathElements = [0, 0, 0, 0, 0].map(() => g.append("path"));
      function repeat(el, i) {
        el.attr("d", data.paths[0][i])
          .attr("fill", data.color[i])
          .transition()
          .ease(d3.easeQuadInOut)
          .duration(Math.random() * 1000 + (pathElements.length - i) * 800)
          .attr("d", data.paths[1][i])
          .transition()
          .duration(Math.random() * 1000 + (pathElements.length - i) * 800)
          .attr("d", data.paths[2][i])
          .transition()
          .duration(Math.random() * 1000 + (pathElements.length - i) * 800)
          .attr("d", data.paths[3][i])
          .transition()
          .duration(Math.random() * 1000 + (pathElements.length - i) * 800)
          .attr("d", data.paths[4][i])
          .transition()
          .duration(Math.random() * 1000 + (pathElements.length - i) * 800)
          .attr("d", data.paths[5][i])
          .transition()
          .duration(Math.random() * 1000 + (pathElements.length - i) * 800)
          .attr("d", data.paths[0][i])
          .on("end", () => repeat(el, i));
      }
      pathElements.map((el, i) => {
        repeat(el, i);
      });
    }

    return () => d3.select(svgContainer.current).selectAll("*").remove();
  }, []);

  return (
    <div style={{ overflow: "hidden" }}>
      <svg width={4096} height={350} ref={svgContainer}></svg>
    </div>
  );
}
