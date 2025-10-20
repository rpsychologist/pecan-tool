import React, { createContext, useReducer } from 'react';

import { updateCompletedSteps, isLinkRankingStep, getLinkProgress } from "./utils/progress"
import saveSession from "./utils/save-session"
const NEXT_DEMO_MODE = process.env.NEXT_PUBLIC_DEMO_MODE

export function reducer(state, action) {
  switch (action.type) {
    case 'show_builder':
      return {
        ...state,
        showBuilder: true
      }
    case 'show_onboarding':
      return {
        ...state,
        onboarding: {
          ...state.onboarding,
          show: true
        }
      }
    case 'hide_onboarding':
      return {
        ...state,
        onboarding: {
          ...state.onboarding,
          show: false
        }
      }
    case 'load_data': {
      return action.data
    }
    case 'add_custom_node': {
      const newNode = {
        // TODO: read this from backend, string replace {{action.name}}
        "questionPrompt": action.questionPrompt,
        "causePrompt": action.causePrompt,
        "label": action.name,
        "id": `custom-${state.nodes.length}`,
        "nodeId": `custom-${state.nodes.length}`,
        "name": action.name,
        "highlight": false,
        "size": null,
        "custom": true,
        "nodeClarification": [],
        "chosen": state.nodeCount < action.maxNodes ? true : false
      }
      const newState = {
        ...state,
        nodes: [...state.nodes, newNode],
        ...(newNode.chosen && {nodeCount: state.nodeCount + 1})
      }
      saveSession(newState)
      return newState
    }
    case 'select_node': {
      let nodeCount
      let links
      const nodes = state.nodes.map(node => {
        if (node.id == action.id) {
          links = state.links.map(link => {
            if (link?.target.id == action.id || link.source.id == action.id) {
              // TODO: also check that target and source nodes are displayed
              return {
                ...link,
                display: !node.chosen
              }
            } else return link
          })
          // remove links when a node is de-selected
          if (node.chosen == true) {
            nodeCount = state.nodeCount - 1
          } else {
            nodeCount = state.nodeCount + 1
          }
          return {
            ...node,
            chosen: !node.chosen
          }
        } else {
          return node
        }
      })
      const newState = {
        ...state,
        nodeCount,
        links,
        nodes,
        showNodeClarificationStep: nodes
          .filter(node => node.chosen)
          .filter(node => node.nodeClarification.length > 0)
          .length > 0
      }
      saveSession(newState)
      return newState
    };
    case 'change_node_clarification': {
      const nodes = state.nodes.map(node => {
        if (node.name == action.name) {
          return {
            ...node,
            nodeClarificationSelected: action.value
          }
        } else {
          return node
        }
      })
      const newState = {
        ...state,
        nodes
      }
      saveSession(newState)
      return newState
    };
    case 'change_node_size': {
      const nodes = state.nodes
      const updatedNodes = nodes.map(d => {
        if (d.id == action.id) {
          return {
            ...d,
            size: Number(action.size)
          }
        } else {
          return d
        }
      })
      const newState = {
        ...state,
        nodes: updatedNodes
      }
      saveSession(newState)
      return newState
    };
    case 'change_link_size': {
      const links = state.links
      const linkIndex = links.findIndex(
        d => d.target.id == action.target && d.source.id == action.source
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
          links: [...links, newLinkData]
        }
      } else {
        newState = {
          ...state,
          links: links.map((d, i) => {
            if (i == linkIndex) {
              return {
                ...d,
                size: Number(action.size)
              }
            } else {
              return d
            }
          })
        }
      }
      saveSession(newState)
      return newState;
    };
    case 'highlight_node': {
      return {
        ...state,
        highlightNode: action.value
      }
    };
    case 'progress_increase': {
      const {
        currentProgress,
        showNodeClarificationStep,
        nodeCount } = state
      const completedSteps = updateCompletedSteps({
        nodes: state.nodes,
        links: state.links,
        nodeCount,
        completedSteps: state.completedSteps,
        responseDirection: state.responseDirection,
        responsesRequired: state.responsesRequired,
        showNodeClarificationStep: state.showNodeClarificationStep,
        currentProgress,
        errorMessages: action.errorMessages
      })
      if (completedSteps[currentProgress]?.completed) {

        const newProgress = state.currentProgress + 1
        let highlightNode = []
        if (isLinkRankingStep({currentProgress: newProgress, nodeCount: state.nodeCount, showNodeClarificationStep})) {
          highlightNode = [state.nodes.filter(d => d.chosen)[getLinkProgress({currentProgress: newProgress, showNodeClarificationStep})].id]
        }
        const newState = {
          ...state,
          // TODO: if the node is updated the previous links break
          highlightNode,
          completedSteps,
          currentProgress: newProgress,
          displayRequirementError: false

        }
        saveSession(newState)
        return newState
      } else {
        return {
          ...state,
          completedSteps,
          displayRequirementError: completedSteps[currentProgress]?.errorMessage
        }
      }
    }
    case 'progress_set': {
      const newProgress = action.value - 1
      let highlightNode = []
      if (newProgress > 1 && newProgress <= state.nodeCount + 1) {
        highlightNode = [state.nodes.filter(d => d.chosen)
        [newProgress - 2].id]
      }
      const newState = {
        ...state,
        highlightNode,
        currentProgress: newProgress
      }
      saveSession(newState)
      return newState
    }
    case 'progress_decrease': {
      const newProgress = state.currentProgress - 1
      const showNodeClarificationStep = state.showNodeClarificationStep
      let highlightNode = []
      if (isLinkRankingStep({currentProgress: newProgress, nodeCount: state.nodeCount, showNodeClarificationStep})) {
        highlightNode = [state.nodes.filter(d => d.chosen)[getLinkProgress({currentProgress: newProgress, showNodeClarificationStep})].id]
      }
      const newState = {
        ...state,
        highlightNode,
        currentProgress: newProgress
      }
      saveSession(newState)
      return newState
    }
    case 'track_display_time':
      const { componentName, time } = action.payload;
      const telemetry = state?.telemetry || {}
      const newTelemetry = {...telemetry, [componentName]: (telemetry[componentName] || 0) + time}
      const newState = {
        ...state,
        telemetry: newTelemetry
      };

      saveSession(newState)
      return newState
    case 'submit_success': {
      //sessionStorage.removeItem("state");
      const newState = {
        ...state,
        currentProgress: state.currentProgress + 1,
        url: action.url,
      }
      saveSession(newState)
      return newState
    }
  }
  throw Error('Unknown action: ' + action.type);
}


const NetworkContext = createContext();
export function NetworkContextProvider({ children, initialState }) {
    const [state, dispatch] = useReducer(reducer, initialState);
  
    return (
      <NetworkContext.Provider value={{ state, dispatch }}>
        {children}
      </NetworkContext.Provider>
    );
  }
  
  export default NetworkContext;