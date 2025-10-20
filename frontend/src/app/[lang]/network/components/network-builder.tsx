"use client";
import { useContext } from "react";
import NetworkContext from "./reducer";
import Markdown from "markdown-to-jsx";
import {
  isNodeSelectStep,
  isNodeClarificationStep,
  isNodeRankingStep,
  isLinkRankingIntroStep,
  isLinkRankingStep,
  isSubmitStep,
} from "./utils/progress";
import NodeSelectStep from "./builder/NodeSelectStep";
import NodeClarificationStep from "./builder/NodeClarificationStep";
import NodeRankingStep from "./builder/NodeRankingStep";
import LinkRatingIntroStep from "./builder/LinkRatingIntroStep";
import LinkRatingStep from "./builder/LinkRatingStep";
import Navigation from "./builder/Navigation";

// Define basic types for props if not already defined elsewhere
interface ContentType {
  nodeSelectStep: any;
  nodeClarificationStep: any;
  nodeRankingStep: any;
  linkRankingIntroStep: any;
  linkRankingStep: any; // Add definition
  responseDirection: string; // Add definition
  submitStep: any;
  customNode: any;
  scrollIndicator: any;
  buttonBackLabel: string;
  buttonNextLabel: string;
  errorMessages: any;
}

interface StateType {
  currentProgress: number;
  nodeCount: number;
  onboarding: boolean;
  nodes: any[];
  links: any[];
  displayRequirementError?: string;
  showNodeClarificationStep?: boolean;
}

const SubmitStep = ({ data, onboarding }: { data: any, onboarding: boolean }) => {
  // Add basic type
  if(onboarding) return false
  return (
    <>
      <h2 className="font-bold text-xl">{data?.header} </h2>
      <Markdown className="rich-text" children={data?.introduction} />
    </>
  );
};
export default function NetworkBuilder({
  content,
  state,
  dispatch,
}: {
  content: ContentType;
  state: StateType;
  dispatch: (action: any) => void;
}) {
  // Apply types
  //const { dispatch } = useContext(NetworkContext)

  const { currentProgress, nodeCount, onboarding } = state;
  const {
    nodeRankingStep,
    linkRankingIntroStep,
    linkRankingStep, // Destructure linkRankingStep
    responseDirection, // Destructure responseDirection
    submitStep,
    nodeClarificationStep,
    scrollIndicator,
    nodeSelectStep,
    customNode,
    buttonBackLabel, // Destructure needed for Navigation
    buttonNextLabel, // Destructure needed for Navigation
    errorMessages, // Destructure needed for Navigation
  } = content;

  const showNodeClarificationStep =
    (nodeClarificationStep?.show && state?.showNodeClarificationStep) || false;

  return (
    <div
      id="builderDrawer"
      className="h-[calc(60dvh)] sm:h-[calc(100dvh)] w-full sm:min-w-[400px] sm:w-[400px] bg-slate-50 border-r-2 flex flex-col rounded text-gray-700 p-2 sm:p-4"
    >
      <div className="flex flex-col h-full">
        {/* <h2 className="font-bold text-xl">Network Builder</h2> */}
        {isNodeSelectStep({ currentProgress }) && (
          <NodeSelectStep
            data={state}
            dispatch={dispatch}
            onboarding={onboarding}
            header={nodeSelectStep.header}
            introduction={nodeSelectStep.introduction}
            maxNodes={nodeSelectStep.maxNodes}
            customNode={customNode}
            scrollIndicator={scrollIndicator}
          />
        )}
        {isNodeClarificationStep({
          currentProgress,
          showNodeClarificationStep,
        }) && (
          <NodeClarificationStep
            nodes={state.nodes}
            displayRequirementError={state?.displayRequirementError}
            content={nodeClarificationStep}
            dispatch={dispatch}
            onboarding={onboarding}
          />
        )}

        {isNodeRankingStep({ currentProgress, showNodeClarificationStep }) && (
          <NodeRankingStep
            data={state}
            dispatch={dispatch}
            onboarding={onboarding}
            header={nodeRankingStep.header}
            introduction={nodeRankingStep.introduction}
            sliderLabels={nodeRankingStep.sliderLabels}
            sliderColor={nodeRankingStep.sliderColor}
            sliderHideValue={nodeRankingStep.sliderHideValue}
            scrollIndicator={scrollIndicator}
          />
        )}
        {isLinkRankingIntroStep({
          currentProgress,
          showNodeClarificationStep,
        }) && (
          <LinkRatingIntroStep
            content={linkRankingIntroStep}
            dispatch={dispatch}
            onboarding={onboarding}
          />
        )}
        {isLinkRankingStep({
          currentProgress,
          nodeCount,
          showNodeClarificationStep,
        }) && (
          <LinkRatingStep
            data={state}
            dispatch={dispatch}
            onboarding={onboarding}
            responseDirection={responseDirection}
            linkRankingStep={linkRankingStep}
            scrollIndicator={scrollIndicator} // Pass scrollIndicator
          />
        )}
        {isSubmitStep({
          currentProgress,
          nodeCount,
          showNodeClarificationStep,
        }) && (
          <SubmitStep
            data={submitStep}
            dispatch={dispatch}
            onboarding={onboarding}
          />
        )}
        <Navigation
          data={state}
          // Pass individual props instead of content obj if Navigation is refactored
          // buttonBackLabel={buttonBackLabel}
          // buttonNextLabel={buttonNextLabel}
          // errorMessages={errorMessages}
          content={{ buttonBackLabel, buttonNextLabel, errorMessages }} // Or keep passing part of content if Navigation expects it
          dispatch={dispatch}
        />
      </div>
    </div>
  );
}
