import React, { createContext, useReducer } from "react";
import { NetworkState, Node, Link } from "./types/state";
import { NetworkAction } from "./types/actions";
import {
  updateCompletedSteps,
  isLinkRankingStep,
  getLinkProgress,
} from "./utils/progress";
import saveSession from "./utils/save-session";
const NEXT_DEMO_MODE = process.env.NEXT_PUBLIC_DEMO_MODE;

export function reducer(
  state: NetworkState,
  action: NetworkAction
): NetworkState {
  switch (action.type) {
    case "show_builder":
      return {
        ...state,
        showBuilder: true,
      };
    case "show_onboarding":
      return {
        ...state,
        onboarding: {
          ...state.onboarding,
          show: true,
        },
      };
    case "hide_onboarding":
      return {
        ...state,
        onboarding: {
          ...state.onboarding,
          show: false,
        },
      };
    case "load_data": {
      return action.data;
    }
    case "add_custom_node": {
      const newNode: Node = {
        questionPrompt: action.questionPrompt,
        causePrompt: action.causePrompt,
        label: action.name,
        id: `custom-${state.nodes.length}`,
        nodeId: `custom-${state.nodes.length}`,
        name: action.name,
        highlight: false,
        size: action.nodeType === "positive" ? 50 : undefined,
        custom: true,
        nodeClarification: [],
        chosen: state.nodeCount[action.nodeType || "problem"] < action.maxNodes,
        type: action.nodeType || undefined,
      };

      let links = [...state.links];
      if (action.nodeType === "positive") {
        const gamingNode = state.nodes.find((node) => node.nodeId === "gaming");
        if (gamingNode) {
          const defaultEdge = links.findIndex(
            (d) => d.target.id === newNode.id && d.source.id === gamingNode.id
          );
          if (defaultEdge === -1) {
            const defaultLink: Link = {
              target: newNode,
              source: gamingNode,
              size: 66,
              display: true,
            };
            links = [...links, defaultLink];
          }
        }
      }

      const nodeType = action.nodeType || "problem";
      const newState: NetworkState = {
        ...state,
        // TODO: This is a hack to sort the nodes by type,
        // we should find a better way to do this
        // if would be better to track linkProgress per type instead
        nodes: [...state.nodes, newNode].sort((a, b) => {
          if (!a.type && !b.type) return 0;
          if (!a.type) return -1;
          if (!b.type) return 1;
          if (a.type === "positive" && b.type === "positive") return 0;
          if (a.type === "positive") return 1;
          if (b.type === "positive") return -1;
          return 0;
        }),
        links,
        ...(newNode.chosen && {
          nodeCount: {
            ...state.nodeCount,
            [nodeType]: (state.nodeCount[nodeType] || 0) + 1,
          },
        }),
      };
      saveSession(newState);
      return newState;
    }
    case "select_node": {
      let nodeCount = { ...state.nodeCount };
      let updatedLinks = [...state.links];

      const nodeIndex = state.nodes.findIndex((node) => node.id === action.id);
      if (nodeIndex === -1) {
        console.warn(`Node with id ${action.id} not found during select_node.`);
        return state;
      }

      const originalNode = state.nodes[nodeIndex];
      const nodeType = originalNode.type || "problem";
      const newChosenState = !originalNode.chosen;

      nodeCount[nodeType] = newChosenState
        ? (nodeCount[nodeType] || 0) + 1
        : (nodeCount[nodeType] || 0) - 1;

      updatedLinks = state.links.map((link) => {
        if (link.target.id === action.id || link.source.id === action.id) {
          return {
            ...link,
            display: newChosenState,
          };
        }
        return link;
      });

      if (originalNode.type === "positive") {
        const gamingNode = state.nodes.find((node) => node.nodeId === "gaming");
        if (gamingNode) {
          const defaultEdgeIndex = updatedLinks.findIndex(
            (d) => d.target.id === originalNode.id && d.source.id === gamingNode.id
          );

          if (defaultEdgeIndex === -1) {
            const defaultLink: Link = {
              target: originalNode,
              source: gamingNode,
              size: 66,
              display: true,
            };
            updatedLinks = [...updatedLinks, defaultLink];
          }
        }
      }

      const updatedNodes = state.nodes.map((node) => {
        if (node.id === action.id) {
          return {
            ...node,
            chosen: newChosenState,
          };
        }
        return node;
      });

      const newState: NetworkState = {
        ...state,
        nodeCount,
        links: updatedLinks,
        nodes: updatedNodes,
        showNodeClarificationStep:
          updatedNodes
            .filter((node) => node.chosen)
            .filter((node) => node.nodeClarification.length > 0).length > 0,
      };
      saveSession(newState);
      return newState;
    }
    case "change_node_clarification": {
      const nodes = state.nodes.map((node) => {
        if (node.name === action.name) {
          return {
            ...node,
            nodeClarificationSelected: action.value,
          };
        } else {
          return node;
        }
      });
      const newState: NetworkState = {
        ...state,
        nodes,
      };
      saveSession(newState);
      return newState;
    }
    case "change_node_size": {
      const nodes = state.nodes.map((d) => {
        if (d.id === action.id) {
          return {
            ...d,
            size: Number(action.size),
          };
        } else {
          return d;
        }
      });
      const newState: NetworkState = {
        ...state,
        nodes,
      };
      saveSession(newState);
      return newState;
    }
    case "change_link_size": {
      const links = state.links;
      const linkIndex = links.findIndex(
        d => d.target.id === action.target && d.source.id === action.source
      )
      const newSize = Number(action.size)
      if (linkIndex !== -1 && links[linkIndex].size === newSize) {
        return state;
      }
      const newLinkData = {
        target: action.target,
        source: action.source,
        size: newSize,
        display: true
      }
      let newState
      if (linkIndex == -1) {
        // add new link
        newState = {
          ...state,
          linkCount: state.linkCount + 1,
          links: [...links, newLinkData],
        };
      } else {
        newState = {
          ...state,
          links: links.map((d, i) => {
            if (i === linkIndex) {
              return {
                ...d,
                size: Number(action.size),
              };
            } else {
              return d;
            }
          }),
        };
      }
      saveSession(newState);
      return newState;
    }
    case "highlight_node": {
      return {
        ...state,
        highlightNode: action.value,
      };
    }
    case "progress_increase": {
      const { currentProgress, showNodeClarificationStep } = state;
      const completedSteps = updateCompletedSteps({
        nodes: state.nodes,
        links: state.links,
        nodeCount: state.nodeCount,
        completedSteps: state.completedSteps,
        responseDirection: state.responseDirection,
        responsesRequired: state.responsesRequired,
        showNodeClarificationStep: state.showNodeClarificationStep,
        currentProgress,
        errorMessages: action.errorMessages,
      });
      if (completedSteps[currentProgress]?.completed) {
        const newProgress = state.currentProgress + 1;

        let highlightNode: string[] = [];
        if (
          isLinkRankingStep({
            currentProgress: newProgress,
            nodeCount: state.nodeCount,
            showNodeClarificationStep,
          })
        ) {
          const linkProgress = getLinkProgress({
            currentProgress: newProgress,
            showNodeClarificationStep,
            nodeCount: state.nodeCount,
            onboarding: false,
          });
          highlightNode = [
            state.nodes.filter((d) => d.chosen)[linkProgress].id,
          ];
        }
        const newState: NetworkState = {
          ...state,
          highlightNode,
          completedSteps,
          currentProgress: newProgress,
          displayRequirementError: false,
        };
        saveSession(newState);
        return newState;
      } else {
        return {
          ...state,
          completedSteps,
          displayRequirementError:
            completedSteps[currentProgress]?.errorMessage,
        };
      }
    }
    case "progress_set": {
      const newProgress = action.value - 1;
      let highlightNode: string[] = [];
      const totalNodeCount = Object.values(state.nodeCount).reduce(
        (a, b) => a + b,
        0
      );
      if (newProgress > 1 && newProgress <= totalNodeCount + 1) {
        highlightNode = [
          state.nodes.filter((d) => d.chosen)[newProgress - 2].id,
        ];
      }
      const newState: NetworkState = {
        ...state,
        highlightNode,
        currentProgress: newProgress,
      };
      saveSession(newState);
      return newState;
    }
    case "progress_decrease": {
      const newProgress = state.currentProgress - 1;
      const showNodeClarificationStep = state.showNodeClarificationStep;
      let highlightNode: string[] = [];
      if (
        isLinkRankingStep({
          currentProgress: newProgress,
          nodeCount: state.nodeCount,
          showNodeClarificationStep,
        })
      ) {
        highlightNode = [
          state.nodes.filter((d) => d.chosen)[
            getLinkProgress({
              currentProgress: newProgress,
              showNodeClarificationStep,
              nodeCount: state.nodeCount,
              onboarding: false,
            })
          ].id,
        ];
      }
      const newState: NetworkState = {
        ...state,
        highlightNode,
        currentProgress: newProgress,
      };
      saveSession(newState);
      return newState;
    }
    case "track_display_time":
      const { componentName, time } = action.payload;
      const telemetry = state?.telemetry || {};
      const newTelemetry = {
        ...telemetry,
        [componentName]: (telemetry[componentName] || 0) + time,
      };
      const newState: NetworkState = {
        ...state,
        telemetry: newTelemetry,
      };
      saveSession(newState);
      return newState;
    case "submit_success": {
      const newState: NetworkState = {
        ...state,
        currentProgress: state.currentProgress + 1,
        url: action.url,
      };
      saveSession(newState);
      return newState;
    }
  }
  throw Error("Unknown action: " + action.type);
}

const NetworkContext = createContext<{
  state: NetworkState;
  dispatch: React.Dispatch<NetworkAction>;
} | null>(null);

export function NetworkContextProvider({
  children,
  initialState,
}: {
  children: React.ReactNode;
  initialState: NetworkState;
}) {
  const [state, dispatch] = useReducer(reducer, initialState);

  return (
    <NetworkContext.Provider value={{ state, dispatch }}>
      {children}
    </NetworkContext.Provider>
  );
}

export default NetworkContext;
