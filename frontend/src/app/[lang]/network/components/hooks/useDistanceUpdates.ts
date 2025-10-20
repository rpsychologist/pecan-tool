import { useEffect } from "react";
import * as d3 from "d3";
import { calcDistance } from "../utils/viz-utils";
import { NetworkProps } from "../types/network-props";

interface UseLinkFilterUpdatesProps {
  networkProps: NetworkProps;
}

export const useDistanceUpdates = ({
  networkProps: { links, simulation, distance, width, alphaTarget },
}: UseLinkFilterUpdatesProps) => {
  useEffect(() => {
    if (!simulation) return;

    simulation
      .force("link")
      .links(links)
      .distance(calcDistance({ distance, width }));
    simulation.alpha(1).restart();
  
  }, [distance, alphaTarget]);
};
