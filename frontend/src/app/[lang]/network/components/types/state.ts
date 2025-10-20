import * as d3 from 'd3';

export interface Node {
  id: string;
  nodeId: string;
  name: string;
  label: string;
  type?: string;
  size?: number;
  chosen: boolean;
  highlight: boolean;
  custom?: boolean;
  nodeClarification: any[];
  nodeClarificationSelected?: string;
  questionPrompt?: string;
  causePrompt?: string;
}

export interface Link {
  target: Node;
  source: Node;
  size: number;
  display: boolean;
}

export interface NetworkState {
  nodes: Node[];
  links: Link[];
  nodeCounts: {
    [key: string]: number;
  };
  linkCount: number;
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
  showBuilder: boolean;
  onboarding: {
    show: boolean;
  };
  currentProgress: number;
  completedSteps: any[];
  displayRequirementError: boolean;
  showNodeClarificationStep: boolean;
  telemetry?: {
    [key: string]: number;
  };
  url?: string;
  responsesRequired: number;
} 