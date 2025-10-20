import { useEffect } from 'react';
import * as d3 from 'd3';
import { Node } from '../types';
import { NetworkProps } from '../types/network-props';

interface UseNodeSizeUpdatesProps {
  networkProps: NetworkProps;
}

export const useNodeSizeUpdates = ({
  networkProps: { nodes, refNode, size },
}: UseNodeSizeUpdatesProps) => {
  useEffect(() => {
    if (!refNode.current) return;
    d3.select(refNode.current)
      .selectAll("circle")
      .data(nodes, (d: Node) => d.id)
      .attr("r", (d: Node) => size(d.size));
  }, [nodes.map((n) => n.size)]);
}; 