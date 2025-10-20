import Joyride, { ACTIONS, STATUS, EVENTS } from "react-joyride";
import useTrackDisplayTime from "./hooks/useTrackDisplayTime";
import Markdown from "markdown-to-jsx";
import { ScrollShadow } from "@heroui/react";

const LastStep = ({ content }) => {
  useTrackDisplayTime("onboarding-lastStep");
  return (
    <ScrollShadow className="max-h-[250px]">
      <Markdown className="rich-text" children={content} />
    </ScrollShadow>
  );
};

const stepKeys = [
  "first",
  "nodeSelectStep",
  "nodeRankingtep",
  "linkRatingStepOne",
  "linkRatingStepTwo",
  "last",
];

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
        content: (
          <ScrollShadow className="max-h-[150px]">
            <Markdown
              className="rich-text"
              children={obj.content}
            />
          </ScrollShadow>
        ),
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
        case 0:
          dispatch({
            type: "load_data",
            data: {
              ...state,
              onboarding: {
                ...onboarding,
                stepIndex: nextStepIndex,
              },
            },
          });
          break;
        case 1:
          dispatch({
            type: "load_data",
            data: {
              ...state,
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
              currentProgress: 1,
              nodeCount: 2,
              onboarding: {
                ...onboarding,
                stepIndex: nextStepIndex,
              },
            },
          });
          break;
        case 3:
          dispatch({
            type: "load_data",
            data: {
              ...state,
              nodes: state.nodes.map((node) => ({
                ...node,
                size: node.size || 50,
              })),
              currentProgress: nextStepIndex,
              highlightNode: [0],
              onboarding: {
                ...onboarding,
                stepIndex: nextStepIndex,
              },
            },
          });
          break;
        case 4:
          dispatch({
            type: "load_data",
            data: {
              ...state,
              currentProgress: 4,
              highlightNode: [1],
              onboarding: {
                ...onboarding,
                stepIndex: nextStepIndex,
              },
            },
          });
          break;
        case 5:
          dispatch({
            type: "load_data",
            data: {
              ...state,
              currentProgress: 5,
              highlightNode: [],
              onboarding: {
                ...onboarding,
                stepIndex: nextStepIndex,
              },
            },
          });
          break;
        case 6:
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
        tooltipContent: {
            paddingBottom: "0px",
            paddingLeft: "0px",
            paddingRight: "0px"
        }
      }}
    />
  );
}
