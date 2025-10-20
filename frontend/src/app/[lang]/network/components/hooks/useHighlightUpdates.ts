import { useEffect } from 'react';
import * as d3 from 'd3';
import { Node, Link } from '../types';
import { NetworkProps } from '../types/network-props';
import { setLinkOpacity, getNodeFill, getLinkClass } from '../utils/viz-utils';

interface UseHighlightUpdatesProps {
  networkProps: NetworkProps;
}

export const useHighlightUpdates = ({
  networkProps: {
    nodes,
    links,
    refNode,
    refLink,
    highlightNode,
    responseDirection,
    feedback,
    linkFilter,
    noLinkHighlight,
    hierachyFeedback,
    lineThickness,
    linkColor,
    linkCount,
  },
}: UseHighlightUpdatesProps) => {
  let isHighlightedPositive = false
  if(highlightNode.length === 1) { 
    isHighlightedPositive = nodes.filter(d => d.id === highlightNode[0])[0]?.type === "positive"
  }

  useEffect(() => {
    if (!refNode.current || !refLink.current) return;

    // Update node highlights
    d3.select(refNode.current)
      .selectAll("circle")
      .data(nodes, (d: Node) => d.id)
      .attr("fill", (d: Node) => 
        getNodeFill({
          d,
          highlightNode,
          links,
          hierachyFeedback,
          responseDirection,
        })
      );

    // Update link highlights
    d3.select(refLink.current)
      .selectAll("path")
      .data(links, (d: Link) => `${d.target.id}_${d.source.id}`)
      .attr("class", (d: Link) => 
        getLinkClass({
          d,
          highlightNode,
          links,
          feedback,
          hierachyFeedback,
          responseDirection,
          positive: isHighlightedPositive
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
          positive: isHighlightedPositive
        })
      )
      .attr("stroke", (d: Link) => {
        if (d.source.type === "positive") {
          return "#27ae60";
        } else return linkColor;
      })
      .style("stroke-width", (d: Link) => lineThickness(d.size));
  }, [highlightNode, linkCount]);
}; 