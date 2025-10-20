import Joyride, { ACTIONS, STATUS, EVENTS } from "react-joyride";
import useTrackDisplayTime from "./hooks/useTrackDisplayTime";
import Markdown from "markdown-to-jsx";
import { getSteps } from "./utils/progress";
const LastStep = ({ content }) => {
  useTrackDisplayTime("onboarding-lastStep");
  return <Markdown className="rich-text" children={content} />;
};

const stepKeys = [
  "first",
  "nodeSelectStep",
  "nodeRankingtep",
  "linkRatingStepOne",
  "linkRatingStepTwo",
  "nodeSelectPositive",
  "linkRankingPositive",
  "last",
];

const positiveNode = {
  type: "positive",
  nodeId: "positive",
  name: "Vinterdäck",
  label: "Vinterdäck",
  questionPrompt:
    "<strong>Vinterdäck</strong> på vintern, <em>minskar</em> följande problem ...",
  causePrompt: "... vinterdäck",
  shortLabel: "Vinterdäck",
  locale: "sv",
  required: null,
  nodeClarificationHeading: null,
  nodeClarification: [],
  nodeClarificationSelected: [],
  node_dimensions: {
    data: [],
  },
  overrides: [],
  id: 14,
  highlight: false,
  chosen: false,
  index: 20,
  size: 50,
};

export default function NetworkOnboarding({
  content,
  state,
  dispatch,
  globaDispatch,
}) {
  const { onboarding } = state;
  const {
    buttonLabelNext,
    buttonLabelBack,
    buttonLabelLast,
    buttonLabelSkip,
    showSkipButton,
  } = content;

  const builderSteps = getSteps({
    showNodeClarificationStep: false,
    nodeCount: { problem: 2, positive: 1 },
    onboarding: true
  });

  const steps = stepKeys.map((key) => {
    const obj = content[key];
    if (key == "last") {
      return {
        ...obj,
        content: <LastStep content={obj.content} />,
      };
    } else {
      return {
        ...obj,
        content: <Markdown className="rich-text text-sm md:text-base" children={obj.content} />,
      };
    }
  });
  const handleJoyrideCallback = (data) => {
    const { action, index, status, type } = data;
    if ([STATUS.FINISHED, STATUS.SKIPPED].includes(status)) {
      // Need to set our running state to false, so we can restart if we click start again.
      globaDispatch({ type: "show_builder" });
    } else if ([EVENTS.STEP_AFTER, EVENTS.TARGET_NOT_FOUND].includes(type)) {
      const nextStepIndex = index + (action === ACTIONS.PREV ? -1 : 1);
      switch (nextStepIndex) {
        case 0: // Intro
          dispatch({
            type: "load_data",
            data: {
              ...state,
              currentProgress: builderSteps.indexOf("nodeSelect"),
              onboarding: {
                ...onboarding,
                stepIndex: nextStepIndex,
              },
            },
          });
          break;
        case 1: // Node select
          dispatch({
            type: "load_data",
            data: {
              ...state,
              currentProgress: builderSteps.indexOf("nodeSelect"),
              onboarding: {
                ...onboarding,
                stepIndex: nextStepIndex,
              },
            },
          });
          break;
        case 2:
          dispatch({
            type: "load_data",
            data: {
              ...state,
              nodes: state.nodes.map((node) => ({
                ...node,
                chosen: true,
              })),
              currentProgress: builderSteps.indexOf("nodeRanking"),
              nodeCount: { problem: 2, positive: 0 },
              onboarding: {
                ...onboarding,
                stepIndex: nextStepIndex,
              },
            },
          });
          break;
        case 3: // Link rating
          dispatch({
            type: "load_data",
            data: {
              ...state,
              nodes: state.nodes.map(node => ({
                  ...node,
                  size: node.size || 50,
              })),
              currentProgress: builderSteps.indexOf("linkRanking"),
              highlightNode: [0],
              onboarding: {
                ...onboarding,
                stepIndex: nextStepIndex,
              },
            },
          });
          break;
        case 4: // Link rating 2
          dispatch({
            type: "load_data",
            data: {
              ...state,
              currentProgress: builderSteps.indexOf("linkRanking") + 1,
              highlightNode: [1],
              onboarding: {
                ...onboarding,
                stepIndex: nextStepIndex,
              },
            },
          });
          break;
        case 5: // nodeSelectPositive
          dispatch({
            type: "load_data",
            data: {
              ...state,
              nodes: state.nodes.some((node) => node.id === positiveNode.id)
                ? state.nodes
                : [...state.nodes, positiveNode],
              currentProgress: builderSteps.indexOf("nodeSelectPositive"),
              highlightNode: [14],
              onboarding: {
                ...onboarding,
                stepIndex: nextStepIndex,
              },
            },
          });
          break;
        case 6: // Positive link rating
          dispatch({
            type: "load_data",
            data: {
              ...state,
              nodes: state.nodes.map((node) => ({
                ...node,
                chosen: true,
              })),
              nodeCount: { problem: 2, positive: 1 },
              currentProgress: builderSteps.indexOf("nodeSelectPositive") + 1,
              highlightNode: [14],
              onboarding: {
                ...onboarding,
                stepIndex: nextStepIndex,
              },
            },
          });
          break;
        case 7: // Submit
          dispatch({
            type: "load_data",
            data: {
              ...state,
              highlightNode: [],
              currentProgress: builderSteps.indexOf("submit"),
              onboarding: {
                ...onboarding,
                stepIndex: nextStepIndex,
              },
            },
          });
          break;
        case 8: // Quit onboarding
          globaDispatch({ type: "show_builder" });
          break;
      }
    }
  };

  return (
    <Joyride
      continuous
      callback={handleJoyrideCallback}
      locale={{
        back: buttonLabelBack,
        close: "Close",
        last: buttonLabelLast,
        next: buttonLabelNext,
        nextLabelWithProgress: "Next (Step {step} of {steps})",
        open: "Open the dialog",
        skip: buttonLabelSkip,
      }}
      stepIndex={onboarding.stepIndex}
      run={onboarding?.show}
      scrollToFirstStep={false}
      showProgress
      disableCloseOnEsc={true}
      showSkipButton={showSkipButton}
      steps={steps}
      disableOverlayClose
      spotlightClicks
      hideCloseButton
      disableOverlay
      styles={{
        options: {
          primaryColor: "#006FEE",
          arrowColor: "#f31260",
        },
        tooltip: {
          borderColor: "#f31260",
          borderWidth: "5px",
          fontWeight: 500,
        },
      }}
    />
  );
}
