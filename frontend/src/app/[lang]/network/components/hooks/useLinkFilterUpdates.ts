import { useEffect } from 'react';
import * as d3 from 'd3';
import { Link } from '../types';
import { setLinkOpacity } from '../utils/viz-utils';
import { NetworkProps } from '../types/network-props';

interface UseLinkFilterUpdatesProps {
  networkProps: NetworkProps;
}

export const useLinkFilterUpdates = ({
  networkProps: {
    links,
    refLink,
    linkFilter,
    highlightNode,
    responseDirection,
    feedback,
    noLinkHighlight,
    hierachyFeedback,
    lineThickness,
    linkColor,
    linkCount,
  },
}: UseLinkFilterUpdatesProps) => {
  useEffect(() => {
    if (!refLink.current) return;

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
        })
      )
      .attr("stroke", (d: Link) => {
        if (d.source.type === "positive") {
          return "#27ae60";
        } else return linkColor;
      })
      .style("stroke-width", (d: Link) => lineThickness(d.size));


    d3.select(refLink.current)
      .selectAll("text.link-text")
      .data(
        links.filter((d: Link) => d.source.type === "positive")
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
      })
    );
  }, [linkFilter]);
}; 