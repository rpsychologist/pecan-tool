"use client";
import { useMemo, useRef } from "react";
import useChartDimensions from "./hooks/useChartDimensions";
import { useNetworkSimulation } from "./hooks/useNetworkSimulation";
import { useNetworkRendering } from "./hooks/useNetworkRendering";
import { useNetworkUpdates } from "./hooks/useNetworkUpdates";
import { NetworkVizProps } from "./types";
import { color, linkArc, reLinkToEdge } from "./utils/viz-utils";
import * as d3 from "d3";

// Constants
const arrowTypes = [1, 2, 3, 4];
const linkColor = "black";
const therapyNodeColor = "white";
const therapyNodeColorCircle = "#e74c3c";
const highlightNodeColor = "#e74c3c";
const grayNodecolor = "#C0C0C0";
const legendProblemLineColor = "#808080";
const legendPositiveLineColor = "#4CAF50";

const NetworkViz = ({
  sliderState,
  data,
  componentId,
  dispatch,
  disableClick,
  feedbackLoops = false,
  feedback = false,
  handleClick,
  distance = 100,
  linkFilter = 0,
  noLinkHighlight = false,
  hierachyFeedback = false,
  fixedHeight = null,
  fixedWidth = null,
  alphaTarget = 0.15,
  showLegend = false,
}: NetworkVizProps) => {
  const [ref, dms] = useChartDimensions({
    marginTop: 10,
    marginBottom: 10,
    marginLeft: 10,
    marginRight: 10,
    width: fixedWidth,
    height: fixedHeight,
  });
  const width = dms.width;
  const height = dms.height;
  const {
    nodeCount,
    nodes: nodeData,
    links: linkData,
    linkCount,
    highlightNode = [],
    responseDirection,
  } = data;
  let nodes = useMemo(() => [...nodeData.filter((d) => d.chosen)], [nodeData]);
  let links = useMemo(() => [...linkData.filter((d) => d.display)], [linkData]);
  const markerSize = width > 450 ? 20 : 15;
  const refSvg = useRef<SVGSVGElement>(null);
  const viewBoxScale = width < 450 ? 1.5 : 1;
  const lineThickness = useMemo(
    () =>
      d3
        .scalePow()
        .domain([0, 100])
        .range([1, width < 450 ? 7 : 10])
        .exponent(3),
    [width]
  );

  const size = useMemo(
    () =>
      d3
        .scaleLinear()
        .domain([0, 100])
        .range([20, Math.sqrt(width * viewBoxScale)]),
    [width]
  );

  const simulation = useNetworkSimulation({
    nodes,
    links,
    width,
    height,
    nodeCount,
    distance,
    hierachyFeedback,
    alphaTarget,
    targetNodeCount: data.targetNodeCount,
    directNodeCount: data.directNodeCount,
    indirectNodeCount: data.indirectNodeCount,
  });
  const { refLink, refNode } = useNetworkRendering({
    componentId,
    nodes,
    nodeCount,
    links,
    linkCount,
    width,
    height,
    markerSize,
    size,
    distance,
    alphaTarget,
    lineThickness,
    highlightNode,
    responseDirection,
    feedback,
    linkFilter,
    noLinkHighlight,
    hierachyFeedback,
    disableClick,
    handleClick,
    nodeData,
    simulation,
    onTick: (nodes: Node[], links: Link[]) => {
      if (!refLink.current || !refNode.current) return;
      d3.select(refLink.current)
        .selectAll("path")
        .attr("d", (d: Link) => linkArc(d, hierachyFeedback))
        .attr("d", function (this: SVGPathElement, d: Link) {
          return reLinkToEdge({
            pathEl: this,
            d,
            size,
            markerSize,
            hierachyFeedback,
          });
        });

      d3.select(refNode.current)
        .selectAll("g.root")
        .attr("transform", (d: Node) => `translate(${d.x},${d.y})`)
        .attr("cx", (d: Node) => d.x)
        .attr("cy", (d: Node) => d.y);
    },
  });

  useNetworkUpdates({
    nodes,
    links,
    refNode,
    refLink,
    size,
    lineThickness,
    highlightNode,
    responseDirection,
    feedback,
    linkFilter,
    noLinkHighlight,
    hierachyFeedback,
    width,
    data,
    simulation,
    distance,
    alphaTarget,
    linkColor,
    linkCount,
  });


  return (
    <div
      ref={ref}
      style={{
        height: "100%",
        width: "100%",
      }}
      className="container"
    >
      <svg
        ref={refSvg}
        id="visualizationSvg"
        width={width}
        height={height}
        viewBox={`${(-width * viewBoxScale) / 2},${
          (-height * viewBoxScale) / 2
        },${width * viewBoxScale},${height * viewBoxScale}`}
      >
        <defs>
          {arrowTypes.map((d, id) => {
            return (
              <marker
                key={id}
                id={`arrow-${d}`}
                viewBox="0 0 10 10"
                refX="0"
                refY="5"
                markerUnits="userSpaceOnUse"
                markerWidth={markerSize}
                markerHeight={markerSize}
                orient="auto"
              >
                <path fill={color(d)} d="M 0 0 L 10 5 L 0 10 z" />
              </marker>
            );
          })}
          {/* Legend arrow marker */}
          <marker
            id="legend-arrow"
            viewBox="0 0 10 10"
            refX="5"
            refY="5"
            markerUnits="userSpaceOnUse"
            markerWidth="10"
            markerHeight="10"
            orient="auto"
          >
            <path fill="black" d="M 0 0 L 10 5 L 0 10 z" />
          </marker>
          {/* Legend arrow marker */}
          <marker
            id="legend-arrow-positive"
            viewBox="0 0 10 10"
            refX="5"
            refY="5"
            markerUnits="userSpaceOnUse"
            markerWidth="10"
            markerHeight="10"
            orient="auto"
          >
            <path fill={legendPositiveLineColor} d="M 0 0 L 10 5 L 0 10 z" />
          </marker>
          <symbol viewBox="0 0 256 256" id="test-icon">
            <rect width="256" height="256" fill="none" />
            <path d="M232,104v48a16,16,0,0,1-16,16H168v48a16,16,0,0,1-16,16H104a16,16,0,0,1-16-16V168H40a16,16,0,0,1-16-16V104A16,16,0,0,1,40,88H88V40a16,16,0,0,1,16-16h48a16,16,0,0,1,16,16V88h48A16,16,0,0,1,232,104Z" />
          </symbol>
          <symbol id="problem-icon" viewBox="0 0 24 24">
            <path
              fillRule="evenodd"
              d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25Zm-2.625 6c-.54 0-.828.419-.936.634a1.96 1.96 0 0 0-.189.866c0 .298.059.605.189.866.108.215.395.634.936.634.54 0 .828-.419.936-.634.13-.26.189-.568.189-.866 0-.298-.059-.605-.189-.866-.108-.215-.395-.634-.936-.634Zm4.314.634c.108-.215.395-.634.936-.634.54 0 .828.419.936.634.13.26.189.568.189.866 0 .298-.059.605-.189.866-.108.215-.395.634-.936.634-.54 0-.828-.419-.936-.634a1.96 1.96 0 0 1-.189-.866c0-.298.059-.605.189-.866Zm-4.34 7.964a.75.75 0 0 1-1.061-1.06 5.236 5.236 0 0 1 3.73-1.538 5.236 5.236 0 0 1 3.695 1.538.75.75 0 1 1-1.061 1.06 3.736 3.736 0 0 0-2.639-1.098 3.736 3.736 0 0 0-2.664 1.098Z"
              clipRule="evenodd"
            />
          </symbol>
          <symbol id="sad-icon" viewBox="0 0 16 16">
            <path d="M8 16A8 8 0 1 0 8 0a8 8 0 0 0 0 16M7 6.5C7 7.328 6.552 8 6 8s-1-.672-1-1.5S5.448 5 6 5s1 .672 1 1.5m-2.715 5.933a.5.5 0 0 1-.183-.683A4.5 4.5 0 0 1 8 9.5a4.5 4.5 0 0 1 3.898 2.25.5.5 0 0 1-.866.5A3.5 3.5 0 0 0 8 10.5a3.5 3.5 0 0 0-3.032 1.75.5.5 0 0 1-.683.183M10 8c-.552 0-1-.672-1-1.5S9.448 5 10 5s1 .672 1 1.5S10.552 8 10 8" />
          </symbol>
          <symbol viewBox="0 0 512 512" id="gaming-icon">
            <path d="M135.1 204.6c-10.7 0-19.3 8.7-19.3 19.4s8.7 19.4 19.3 19.4c10.6 0 19.3-8.7 19.3-19.4s-8.6-19.4-19.3-19.4z"></path>
            <path d="M466.3 248.9c-21.2-88.5-43.6-135.5-88.5-148.8-9.8-2.9-18.1-4-25.7-4-27.6 0-46.9 14.7-96.1 14.7-49.2 0-68.5-14.7-96.1-14.7-7.7 0-16 1.1-25.7 4-44.9 13.3-67.3 60.4-88.5 148.8-21.2 88.5-17.3 152.4 7.7 164.3 4.1 1.9 8.2 2.8 12.5 2.8 21.7 0 45.1-23.8 67.7-52 25.7-32.1 32.1-33 110.3-33h24.3c78.1 0 84.6.8 110.3 33 22.5 28.2 46 52 67.7 52 4.2 0 8.4-.9 12.5-2.8 24.9-12 28.7-75.9 7.6-164.3zm-331.1 14.7c-21.6 0-39.2-17.8-39.2-39.6s17.6-39.6 39.2-39.6c21.7 0 39.2 17.8 39.2 39.6.1 21.9-17.5 39.6-39.2 39.6zm172.9-19.5c-11.1 0-20.1-9-20.1-20.1 0-11.1 9-20.1 20.1-20.1 11.1 0 20.1 9 20.1 20.1 0 11.1-9 20.1-20.1 20.1zM352 288c-11.1 0-20.1-9-20.1-20 0-11.2 9-20.1 20.1-20.1 11.1 0 20.1 8.9 20.1 20.1 0 11-9 20-20.1 20zm0-87.8c-11.1 0-20.1-9-20.1-20.1 0-11.1 9-20.1 20.1-20.1 11.1 0 20.1 9 20.1 20.1 0 11.1-9 20.1-20.1 20.1zm43.9 43.9c-11.1 0-20.1-9-20.1-20.1 0-11.1 9-20.1 20.1-20.1 11.1 0 20.1 9 20.1 20.1 0 11.1-9 20.1-20.1 20.1z"></path>
          </symbol>
        </defs>
        <g ref={refLink} fill="none" />
        <g ref={refNode} id="nodes" fill="currentColor" />

        {/* Legend */}
        {showLegend && (
          <g
            transform={`translate(${(-width * viewBoxScale) / 2 + 20}, ${
              (height * viewBoxScale) / 2 - 120
            })`}
          >
            {/* Problem Node */}
            <g transform="translate(0, 0)">
              <circle r="10" fill={therapyNodeColorCircle} />
              <use
                href="#problem-icon"
                x="-8"
                y="-8"
                width="16"
                height="16"
                fill="white"
              />
              <text x="20" y="5" fontSize="12" fill="black">
                Problem
              </text>
            </g>

            {/* Positive Node */}
            <g transform="translate(0, 30)">
              <use
                href="#test-icon"
                x="-8"
                y="-8"
                width="16"
                height="16"
                fill={"green"}
              />
              <text x="20" y="5" fontSize="12" fill="black">
                Hjälpande faktor
              </text>
            </g>

            {/* Problem Cause Line */}
            <g transform="translate(0, 60)">
              <line
                x1="-8"
                y1="0"
                x2="25"
                y2="0"
                stroke={legendProblemLineColor}
                strokeWidth="3"
                strokeDasharray="0"
                markerEnd="url(#legend-arrow)"
              />
              <text x="40" y="5" fontSize="12" fill="black">
                Leder till
              </text>
            </g>

            {/* Positive Cause Line */}
            <g transform="translate(0, 90)">
              <line
                x1="-8"
                y1="0"
                x2="25"
                y2="0"
                stroke={legendPositiveLineColor}
                strokeWidth="3"
                strokeDasharray="0"
                markerEnd="url(#legend-arrow-positive)"
              />
              <text x="40" y="5" fontSize="12" fill="black">
                Hjälper mot
              </text>
            </g>
          </g>
        )}
      </svg>
    </div>
  );
};

export default NetworkViz;
