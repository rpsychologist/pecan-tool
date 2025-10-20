


const getLinkProgress = ({currentProgress, showNodeClarificationStep}) => {
  return currentProgress - (showNodeClarificationStep ? 4 : 3)

}
const getNodeRankIndex= (showNodeClarificationStep) => {
  return (showNodeClarificationStep ? 2 : 1)
}
const isNodeSelectStep = ({ currentProgress }) => {
  return currentProgress == 0
}
const isNodeClarificationStep = ({ currentProgress, showNodeClarificationStep }) => {
  return showNodeClarificationStep && currentProgress == 1
}
const isNodeRankingStep = ({ currentProgress, showNodeClarificationStep }) => {
  return currentProgress == getNodeRankIndex(showNodeClarificationStep)
}
const isLinkRankingIntroStep = ({ currentProgress, nodeCount, showNodeClarificationStep }) => {
  return currentProgress == getNodeRankIndex(showNodeClarificationStep) + 1
}
const isLinkRankingStep = ({ currentProgress, nodeCount, showNodeClarificationStep }) => {
  return currentProgress > getNodeRankIndex(showNodeClarificationStep) + 1 &&
    currentProgress <= nodeCount + getNodeRankIndex(showNodeClarificationStep) + 1
}
const isSubmitStep = ({ currentProgress, nodeCount, showNodeClarificationStep }) => {
  return currentProgress == nodeCount + getNodeRankIndex(showNodeClarificationStep) + 2
}
const isFeedbackStep = ({currentProgress, nodeCount, showNodeClarificationStep }) => {
  return currentProgress > nodeCount + getNodeRankIndex(showNodeClarificationStep) + 2
}
const updateCompletedSteps = ({
  nodes,
  links,
  currentProgress,
  nodeCount,
  completedSteps,
  showNodeClarificationStep,
  responseDirection = "incoming",
  responsesRequired,
  errorMessages
}) => {

  let completed
  let errorMessage
  switch (true) {
    case isNodeSelectStep({ currentProgress }): {
      completed = nodeCount > 1
      if (!completed) errorMessage = errorMessages?.mustChooseTwoProblems
      break;
    };
    case isNodeClarificationStep({ currentProgress, showNodeClarificationStep }): {

      if (responsesRequired) {
        completed = nodes
          .filter(d => d.chosen && d.nodeClarification.length > 0)
          .every(v => v.nodeClarificationSelected.length > 0)

        if (!completed) errorMessage = errorMessages?.allQuestionsRequired
      } else completed = true
      break;
    }
    case isNodeRankingStep({ currentProgress, showNodeClarificationStep }): {
      if (responsesRequired) {
        completed = nodes.filter(d => d.chosen).every(v => typeof v.size == 'number')
        if (!completed) errorMessage = errorMessages?.allQuestionsRequired
      } else completed = true
      break;
    };
    case isLinkRankingIntroStep({ currentProgress, nodeCount, showNodeClarificationStep }): {
      completed = true
      break;
    }
    case isLinkRankingStep({ currentProgress, nodeCount, showNodeClarificationStep }): {
      if (responsesRequired) {
        let linksFiltered
        if (responseDirection == "incoming") {
          const selectedNodes = nodes.filter(d => d.chosen)
          const targetNode = selectedNodes[getLinkProgress({currentProgress, showNodeClarificationStep})]
          const sourceNodesIds = selectedNodes
            .filter(node => node.id != targetNode.id)
            .map(node => node.id)
          linksFiltered = links.filter(
            d => {
              return d.target.id == targetNode.id && sourceNodesIds.includes(d.source.id)
            }
          )
        } else {
          const selectedNodes = nodes.filter(d => d.chosen)
          const sourceNode = selectedNodes[getLinkProgress({currentProgress, showNodeClarificationStep}) ]
          const targetNodesIds = selectedNodes
            .filter(node => node.id != sourceNode.id)
            .map(node => node.id)
          linksFiltered = links.filter(
            d => {
              return d.source.id == sourceNode.id && targetNodesIds.includes(d.target.id)
            }
          )
        }
        completed = linksFiltered.length == nodeCount - 1
        if (!completed) errorMessage = errorMessages?.allQuestionsRequired
      } else completed = true
      break;
    }
    case isSubmitStep({ currentProgress, nodeCount, showNodeClarificationStep }): {
      completed = true
      break;
    }
  }
  const index = completedSteps.findIndex(d => d.id == currentProgress)
  if (index > -1) {
    return completedSteps.map((d, i) => {
      if (i === index) {
        return {
          ...d,
          completed,
          errorMessage
        }
      } else return d
    })
  } else {
    return [
      ...completedSteps,
      {
        id: currentProgress,
        completed,
        errorMessage
      }
    ]
  }
}

export {
  isNodeSelectStep,
  isNodeClarificationStep,
  isNodeRankingStep,
  isLinkRankingIntroStep,
  isLinkRankingStep,
  isSubmitStep,
  updateCompletedSteps,
  getLinkProgress,
  isFeedbackStep
}