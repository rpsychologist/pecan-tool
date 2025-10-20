import { useEffect, useRef } from "react";
import * as d3 from "d3";
import { Node, Link } from "../types";
import {
  setLinkOpacity,
  lineOpacity,
  getHierarchFill,
  reLinkToEdge,
  calcDistance,
  drag,
  reAddNodes,
  getLinkClass,
  getNodeFill,
} from "../utils/viz-utils";

interface UseNetworkRenderingProps {
  nodes: Node[];
  links: Link[];
  nodeCount: number;
  linkCount: number;
  width: number;
  height: number;
  markerSize: number;
  alphaTarget: number;
  size: d3.ScaleLinear<number, number>;
  lineThickness: d3.ScalePower<number, number>;
  highlightNode: string[];
  responseDirection: "incoming" | "outgoing";
  feedback: boolean;
  linkFilter: number;
  noLinkHighlight: boolean;
  hierachyFeedback: boolean;
  disableClick: boolean;
  distance: number;
  handleClick: (nodeId: string[]) => void;
  nodeData: Node[];
  simulation: d3.Simulation<Node, Link>;
  onTick: (nodes: Node[], links: Link[]) => void;
}

export const useNetworkRendering = ({
  componentId,
  nodes,
  links,
  nodeCount,
  linkCount,
  distance,
  alphaTarget,
  width,
  height,
  markerSize,
  size,
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
  onTick,
}: UseNetworkRenderingProps) => {
  const refLink = useRef<SVGGElement>(null);
  const refNode = useRef<SVGGElement>(null);

  useEffect(() => {
    let isHighlightedPositive = false;
    if (highlightNode.length === 1) {
      isHighlightedPositive =
        nodes.filter((d) => d.id === highlightNode[0])[0]?.type === "positive";
    }
    if (!refLink.current || !refNode.current) return;

    const linkElements = d3
      .select(refLink.current)
      .selectAll("path")
      .data(links, (d: Link) => `${d.target.id}_${d.source.id}`);

    const linkEnter = linkElements
      .join("path")
      .attr("id", (d: Link) => `link-${componentId}-${d.source.id}-${d.target.id}`)
      .attr("class", (d: Link) =>
        getLinkClass({
          d,
          highlightNode,
          links,
          feedback,
          hierachyFeedback,
          responseDirection,
          positive: isHighlightedPositive,
          noLinkHighlight: false
        })
      )
      .attr("opacity", (d: Link) =>
        setLinkOpacity({
          d,
          linkFilter,
          highlightNode,
          responseDirection,
          feedback,
          links,
          noLinkHighlight,
          hierachyFeedback,
          positive: isHighlightedPositive,
        })
      )
      .attr("stroke", (d: Link) => {
        if (d.source.type === "positive") {
          return "#27ae60";
        } else return "black";
      })
      .style("stroke-width", (d: Link) => lineThickness(d.size))
      .attr("marker-end", (d: Link) => {
        if (d.source.type === "positive") {
          return "url(#arrow-2)";
        } else {
          return "url(#arrow-1)";
        }
      });

    // Create text elements separately
    const textElements = d3
      .select(refLink.current)
      .selectAll("text.link-text")
      .data(links.filter((d: Link) => d.source.type === "positive"), 
            (d: Link) => `text-${componentId}-${d.source.id}-${d.target.id}`);

    const textEnter = textElements
      .join("text")
      .attr("class", "link-text")
      .style("fill", "#27ae60")
      .style("font-size", "12px")
      .style("font-weight", "500")
      .style("pointer-events", "none")
      .style("dominant-baseline", "text-before-edge")
      .style("text-shadow", "1px 1px 2px white");

    // Add textPath to text elements
    textEnter.selectAll("textPath")
      .data((d: Link) => [d])
      .join("textPath")
      .attr("href", (d: Link) => `#link-${componentId}-${d.source.id}-${d.target.id}`)
      .attr("startOffset", "50%")
      .attr("dy", -5)
      .text("Hjälper mot");

    const nodeElements = d3
      .select(refNode.current)
      .selectAll("g.root")
      .data(nodes, (d: Node) => d.id);

    const nodeEnter = nodeElements
      .join((enter: d3.EnterElement) => {
        const root = enter.append("g").attr("class", "root");
        const nodes = root.append("g").attr("transform", "translate(-20,0)");

        const iconSad = nodes
          .filter((d: Node) => d.type !== "positive")
          .append("use")
          .attr("class", "problemNodes")
          .attr("href", (d: Node) =>
            d.nodeId !== "gaming" ? "#sad-icon" : "#gaming-icon"
          )
          .attr("x", -size(0) / 2)
          .attr("y", -size(0) / 2)
          .attr("fill", "white")
          .attr("width", size(0))
          .attr("height", size(0));

        const circles = nodes
          .filter((d: Node) => d.type !== "positive")
          .append("circle")
          .attr("fill", (d: Node) =>
            getNodeFill({
              d,
              highlightNode,
              links,
              hierachyFeedback,
              responseDirection,
            })
          )
          .attr("stroke", "white")
          .attr("stroke-width", 1.5)
          .attr("r", (d: Node) => size(d.size || 0))
          .attr("cx", (d: Node) => 0);

        const icons = root
          .filter((d: Node) => d.type === "positive")
          .append("use")
          .attr("href", "#test-icon")
          .attr("x", -30)
          .attr("y", -15)
          .attr("fill", "#27ae60")
          .attr("width", 30)
          .attr("height", 30);

        root.on("click", (d: Node) => {
          if (disableClick) return null;
          if (feedback) {
            const nodeId = nodeData
              .filter((node: Node) => node.name === d.name)
              .map((d: Node) => d.id);
            return handleClick(nodeId);
          }
        });

        const text = root
          .append("text")
          .attr("x", 0)
          .attr("y", "0em")
          .attr("class", `${width < 450 ? "text-md" : "text-xs"} font-medium md:text-xl select-none `)
          .attr("text-anchor", "right")
          .attr("dominant-baseline", "middle")
          .attr("stroke-linejoin", "round");

        const tSpan = text
          .selectAll("tspan")
          .data((d: Node) => d.name.split("<br />"))
          .enter()
          .append("tspan")
          .attr("x", 0)
          .attr("dy", (d: string, i: number) => (i > 0 ? "1.2em" : 0))
          .text((d: string) => d);

        text
          .clone(true)
          .lower()
          .attr("fill", "none")
          .attr("stroke", "white")
          .attr("stroke-width", 7.5);

        nodes.lower();
        return root;
      })
      .call(drag(simulation));

    nodeEnter.selectAll("circle").lower();
    if (nodes.length > 0) {
      simulation.nodes(nodes).on("tick", () => {
        onTick(nodes, links);
      });

      if (links.length > 0) {
        links = reAddNodes(links, nodes);
        simulation
          .force("link")
          .links(links)
          .distance(calcDistance({ distance, width }));
      }

      simulation.alphaTarget(alphaTarget).restart();
    }
    setTimeout(() => {
      simulation.stop();
    }, 2000);

    return () => {
      linkElements.remove();
      nodeElements.remove();
      simulation.stop();
    };
  }, [nodeCount, linkCount, width, height, highlightNode, hierachyFeedback]);

  useEffect(() => {
    setTimeout(() => {
      simulation.stop();
    }, 5000);
  }, [linkCount]);

  return { refLink, refNode };
};
