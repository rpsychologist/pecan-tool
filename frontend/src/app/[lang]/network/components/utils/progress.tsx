const getSteps = ({
  showNodeClarificationStep,
  nodeCount = { problem: 0, positive: 0 },
  onboarding,
}: {
  showNodeClarificationStep: boolean;
  nodeCount: { problem: number; positive: number };
  onboarding: boolean;
}) => {
  const gamingTarget = onboarding !== true;
  const positiveLinkRankings =
    typeof nodeCount["positive"] === "number" && nodeCount["positive"] > 0
      ? Array(nodeCount["positive"]).fill("linkRanking")
      : [];
  return [
    "nodeSelect",
    showNodeClarificationStep && "nodeClarification",
    "nodeRanking",
    "linkRankingIntro",
    gamingTarget && "linkRanking",
    ...Array(nodeCount["problem"]).fill("linkRanking"),
    "linkRankingPositiveIntro",
    "nodeSelectPositive",
    ...positiveLinkRankings,
    "submit",
    "feedback",
  ].filter(Boolean);
};
const getStepIndex = ({
  currentProgress,
  showNodeClarificationStep,
  nodeCount,
  onboarding,
}) => {
  const steps = getSteps({ showNodeClarificationStep, nodeCount, onboarding });
  return steps[currentProgress] || null; // Returns step name or null
};
const getLinkProgress = ({
  currentProgress,
  showNodeClarificationStep,
  nodeCount,
  onboarding = false,
}: {
  currentProgress: number;
  showNodeClarificationStep: boolean;
  nodeCount: { problem: number; positive: number };
  onboarding?: boolean;
}) => {
  const steps = getSteps({ showNodeClarificationStep, nodeCount, onboarding });
  const linkRankingIntroIndex = steps.indexOf("linkRankingIntro");
  const linkRankingPositiveIntroIndex = steps.indexOf("nodeSelectPositive");

  // If we're before the positive intro step, we're dealing with problem links
  if (
    currentProgress <= linkRankingPositiveIntroIndex ||
    linkRankingPositiveIntroIndex === -1
  ) {
    // For problem links, count from linkRankingIntro
    return currentProgress - linkRankingIntroIndex - 1;
  } else {
    // For positive links, subtract 3 because we 2 extra  steps for positive links
    return currentProgress - linkRankingIntroIndex - 3;
  }
};

const isStep = (step, props) => {
  return getStepIndex(props) === step;
};

const isNodeSelectStep = (props) => isStep("nodeSelect", props);
const isNodePositiveSelectStep = (props) => isStep("nodeSelectPositive", props);

const isNodeClarificationStep = (props) => isStep("nodeClarification", props);
const isNodeRankingStep = (props) => isStep("nodeRanking", props);
const isLinkRankingIntroStep = (props) => isStep("linkRankingIntro", props);
const isLinkRankingIntroPositiveStep = (props) =>
  isStep("linkRankingPositiveIntro", props);
const isLinkRankingStep = (props) => isStep("linkRanking", props);
const isSubmitStep = (props) => isStep("submit", props);
const isFeedbackStep = (props) => {
  if (props.currentProgress === "feedback") {
    return true;
  } else {
    return isStep("feedback", props);
  }
};

const updateCompletedSteps = ({
  nodes,
  links,
  currentProgress,
  nodeCount,
  completedSteps,
  showNodeClarificationStep,
  responseDirection = "incoming",
  responsesRequired,
  errorMessages,
}) => {
  let completed;
  let errorMessage;
  switch (true) {
    case isNodeSelectStep({
      currentProgress,
      showNodeClarificationStep,
      nodeCount,
    }): {
      completed = nodeCount["problem"] > 1;
      if (!completed) errorMessage = errorMessages?.mustChooseTwoProblems;
      break;
    }
    case isNodeClarificationStep({
      currentProgress,
      showNodeClarificationStep,
    }): {
      if (responsesRequired) {
        completed = nodes
          .filter((d) => d.chosen && d.nodeClarification.length > 0)
          .every((v) => v.nodeClarificationSelected.length > 0);

        if (!completed) errorMessage = errorMessages?.allQuestionsRequired;
      } else completed = true;
      break;
    }
    case isNodePositiveSelectStep({
      currentProgress,
      showNodeClarificationStep,
      nodeCount,
    }): {
      completed = true;
      if (!completed) errorMessage = errorMessages?.mustChooseTwoProblems;
      break;
    }
    case isNodeRankingStep({
      currentProgress,
      showNodeClarificationStep,
      nodeCount,
    }): {
      if (responsesRequired) {
        completed = nodes
          .filter((d) => d.chosen && d.nodeId !== "gaming" && d.type !== "positive")
          .every((v) => typeof v.size == "number");

        if (!completed) errorMessage = errorMessages?.allQuestionsRequired;
      } else completed = true;
      break;
    }
    case isLinkRankingIntroStep({
      currentProgress,
      nodeCount,
      showNodeClarificationStep,
    }):
    case isLinkRankingIntroPositiveStep({
      currentProgress,
      nodeCount,
      showNodeClarificationStep,
    }): {
      completed = true;
      break;
    }
    case isLinkRankingStep({
      currentProgress,
      nodeCount,
      showNodeClarificationStep,
    }): {
      if (responsesRequired) {
        let linksFiltered;
        let problemNodes, positiveNodes;
        // TODO: fix
        problemNodes = nodes.filter((d) => d.chosen && d.type !== "positive");
        if (responseDirection == "incoming") {
          const targetNode =
            nodes[
              getLinkProgress({
                currentProgress,
                showNodeClarificationStep,
                nodeCount,
              })
            ];
          const sourceNodesIds = problemNodes
            .filter((node) => node.id != targetNode.id)
            .map((node) => node.id);
          linksFiltered = links.filter((d) => {
            return (
              d.target.id == targetNode.id &&
              sourceNodesIds.includes(d.source.id)
            );
          });
        } else {
          const sourceNode = nodes.filter((d) => d.chosen)[
            getLinkProgress({
              currentProgress,
              showNodeClarificationStep,
              nodeCount,
            })
          ];
          const targetNodesIds = problemNodes
            .filter((node) => node.id != sourceNode.id)
            .map((node) => node.id);
          linksFiltered = links.filter((d) => {
            return (
              d.source.id == sourceNode.id &&
              targetNodesIds.includes(d.target.id)
            );
          });
        }
        completed = linksFiltered.length == problemNodes.length - 1;
        if (!completed) errorMessage = errorMessages?.allQuestionsRequired;
      } else completed = true;
      break;
    }
    case isSubmitStep({
      currentProgress,
      nodeCount,
      showNodeClarificationStep,
    }): {
      completed = true;
      break;
    }
  }
  const index = completedSteps.findIndex((d) => d.id == currentProgress);
  if (index > -1) {
    return completedSteps.map((d, i) => {
      if (i === index) {
        return {
          ...d,
          completed,
          errorMessage,
        };
      } else return d;
    });
  } else {
    return [
      ...completedSteps,
      {
        id: currentProgress,
        completed,
        errorMessage,
      },
    ];
  }
};

export {
  isNodeSelectStep,
  isNodePositiveSelectStep,
  isNodeClarificationStep,
  isNodeRankingStep,
  isLinkRankingIntroStep,
  isLinkRankingIntroPositiveStep,
  isLinkRankingStep,
  isSubmitStep,
  updateCompletedSteps,
  getLinkProgress,
  getSteps,
  isFeedbackStep,
};
