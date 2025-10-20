export interface Node {
  id: string;
  name: string;
  type: "positive" | "negative";
  nodeId: string;
  x: number;
  y: number;
  vx?: number;
  vy?: number;
  chosen?: boolean;
  size: number;
  xPosCat?: string;
}

export interface Link {
  source: Node;
  target: Node;
  size: number;
  display?: boolean;
}

export interface NetworkData {
  nodeCount: number;
  nodes: Node[];
  links: Link[];
  linkCount: number;
  highlightNode: string[];
  responseDirection: "incoming" | "outgoing";
  targetNodeCount?: number;
  directNodeCount?: number;
  indirectNodeCount?: number;
}

export interface NetworkVizProps {
  sliderState: any; // TODO: Define proper type
  data: NetworkData;
  dispatch: (action: any) => void; // TODO: Define proper action types
  disableClick: boolean;
  feedbackLoops?: boolean;
  feedback?: boolean;
  handleClick: (nodeId: string[]) => void;
  distance?: number;
  linkFilter?: number;
  noLinkHighlight?: boolean;
  hierachyFeedback?: boolean;
  fixedHeight?: number | null;
  fixedWidth?: number | null;
  alphaTarget?: number;
} 