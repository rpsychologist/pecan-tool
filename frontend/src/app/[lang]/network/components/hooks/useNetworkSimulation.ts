import { useEffect, useMemo } from 'react';
import * as d3 from 'd3';
import { Node, Link } from '../types';
import {
  calcDistance,
  linkStrength,
  calcNodeXPosition,
  calcNodeYPosition,
} from '../utils/viz-utils';

interface UseNetworkSimulationProps {
  nodes: Node[];
  links: Link[];
  width: number;
  height: number;
  nodeCount: number;
  distance: number;
  hierachyFeedback: boolean;
  alphaTarget: number;
  targetNodeCount?: number;
  directNodeCount?: number;
  indirectNodeCount?: number;
}

export const useNetworkSimulation = ({
  nodes,
  links,
  width,
  height,
  nodeCount,
  distance,
  hierachyFeedback,
  alphaTarget,
  targetNodeCount,
  directNodeCount,
  indirectNodeCount
}: UseNetworkSimulationProps) => {
  const totalNodeCount = Object.values(nodeCount).reduce((a, b) => a + b, 0);
  const simulation = useMemo(() => {
    let k;
    if (typeof nodeCount === "undefined" || width === 0 || height === 0) {
      k = 0.02;
    } else {
      k = totalNodeCount / width * 0.8;
      if (width < 450) k = k / 2;
    }

    const sim = d3
      .forceSimulation()
      .force(
        "link",
        d3
          .forceLink()
          .id((d: Node) => d.id)
          .distance(calcDistance({ distance, width }))
          .strength((d: Link) => {
            if (hierachyFeedback) return null;
            return linkStrength(d.size);
          })
      )
      .force(
        "x",
        d3.forceX().x((d: Node) => calcNodeXPosition(d, width))
      )
      .force(
        "y",
        d3.forceY().y((d: Node) =>
          calcNodeYPosition({
            d,
            width,
            targetNodeCount,
            directNodeCount,
            indirectNodeCount,
          })
        )
      )
      .alphaDecay(0.0228)
      .alphaMin(0.1);

    if (hierachyFeedback) return sim;
   
    return sim.force("charge", d3.forceManyBody().strength(-5 / k));
  }, [width, height, nodeCount, hierachyFeedback, targetNodeCount, directNodeCount, indirectNodeCount]);

  return simulation;
}; 