import { useEffect } from "react";
import * as d3 from "d3";
import { Link } from "../types";
import { NetworkProps } from "../types/network-props";
import {
  setLinkOpacity,
  calcDistance,
  lineOpacity,
} from "../utils/viz-utils";

interface UseLinkSizeUpdatesProps {
  networkProps: NetworkProps;
}

export const useLinkSizeUpdates = ({
  networkProps: {
    componentId,
    links,
    nodes,
    refLink,
    refNode,
    lineThickness,
    linkFilter,
    highlightNode,
    responseDirection,
    feedback,
    noLinkHighlight,
    hierachyFeedback,
    simulation,
    distance,
    width,
    alphaTarget,
  },
}: UseLinkSizeUpdatesProps) => {
  useEffect(() => {
    if (!refLink.current || !refNode.current) return;
    let isHighlightedPositive = false;
    if (highlightNode.length === 1) {
      isHighlightedPositive =
        nodes.filter((d) => d.id === highlightNode[0])[0]?.type === "positive";
    }

    d3.select(refNode.current)
      .selectAll("circle")
      .data(nodes, (d: Node) => d.id)
      .attr('opacity', (d: Node) => {
        if (feedback) return 1
        const link = links
            .filter(link => link.target.id == d.id && link.source.id == highlightNode[0])
        if (link.length > 0) {
            return lineOpacity(link[0].size)
        } else return 1

    })
    d3.select(refLink.current)
      .selectAll("path")
      .data(links, (d: Link) => `${d.target.id}_${d.source.id}`)
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
      .style("stroke-width", (d: Link) => lineThickness(d.size));

    d3.select(refLink.current)
      .selectAll("text.link-text")
      .data(
        links.filter((d: Link) => d.source.type === "positive"),
        (d: Link) => `text-${componentId}-${d.source.id}-${d.target.id}`
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
      );

    simulation
      .force("link")
      .links(links)
      .distance(calcDistance({ distance, width }));
    simulation.alphaTarget(alphaTarget).restart();

    const timer = setTimeout(() => {
      simulation.stop();
    }, 2000);

    return () => clearTimeout(timer);
  }, [links.map((n) => n.size).join(","), highlightNode]);
};
