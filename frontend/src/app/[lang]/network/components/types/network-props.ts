import * as d3 from 'd3';
import { Node, Link } from '../types';

export interface NetworkProps {
  nodes: Node[];
  links: Link[];
  refNode: React.RefObject<SVGGElement>;
  refLink: React.RefObject<SVGGElement>;
  size: d3.ScalePower<number, number>;
  lineThickness: d3.ScalePower<number, number>;
  highlightNode: string[];
  responseDirection: "incoming" | "outgoing";
  feedback: boolean;
  linkFilter: number;
  noLinkHighlight: boolean;
  hierachyFeedback: boolean;
  simulation: d3.Simulation<Node, Link>;
  distance: number;
  width: number;
  alphaTarget: number;
  linkColor: string;
  linkCount: number;
} 