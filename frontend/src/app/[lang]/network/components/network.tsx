"use client";

import { useState, useEffect, useContext, createContext, useReducer, useRef } from "react";
import Loader from "../../components/Loader";
import NetworkContext, { NetworkContextProvider } from "./reducer";
import NetworkBuilder from "./network-builder";
import NetworkViz from "./network-viz";
import * as d3 from "d3";

import { isFeedbackStep } from "./utils/progress"
import { useSearchParams } from 'next/navigation'

import useWindowSize from "./hooks/useWindowSize";
import Feedback from "./Feedback";
import { OnboardingContextProvider } from "./onboarding/reducer";
import Intro from "./builder/Intro";
import addNodesToLinks from "./utils/readd-nodes";
const IGNORE_NODES = process.env.NEXT_PUBLIC_IGNORE_NODES === "true"

const removeNull = (obj) => {
  if (!obj) return undefined
  const x = Object.fromEntries(
    Object.entries(obj)
      .filter(([key, value]) => value !== null && value !== undefined && value !== "")
  )
  return (x)
}

function deepMerge(target, source) {
  const filteredSource = removeNull(source)
  for (const key in filteredSource) {
    // Check if the property is an object, and exists in both target and source
    if (filteredSource[key] instanceof Object && key in target) {
      // Recursively merge both objects
      Object.assign(filteredSource[key], deepMerge(target[key], filteredSource[key]));
    }
  }
  // Merge source into target
  return Object.assign(target || {}, filteredSource);
}


const formatNodeData = ({node, id}) => {
  return (
    {
      ...node,
      "label": node.label.replaceAll("<br />", " "),
      "name": node.label,
      nodeClarification: [],
      id: id,
      size: null
    }
  )
}

const NetworkApp = ({ feedback, networkBuilder }) => {
  const [isClient, setIsClient] = useState(false);
  const { width: windowWidth, height: windowHeight } = useWindowSize(isClient);
  const { state, dispatch } = useContext(NetworkContext)
  const onboardingState = {
    nodes: [
      formatNodeData({node: networkBuilder?.onboarding?.demoNodeOne, id: 0}),
      formatNodeData({node: networkBuilder?.onboarding?.demoNodeTwo, id: 1}),
    ],
    nodeCount: 0,
    showNodeClarificationStep: false,
    links: [],
    linkCount: 0,
    highlightNode: [],
    currentProgress: 0,
    responseDirection: "outgoing",
    responsesRequired: false,
    completedSteps: [],
    telemetry: {},
    showBuilder: true,
    onboarding: { show: false, stepIndex: 0 }
  }

  useEffect(() => {
    const sessionState = JSON.parse(sessionStorage.getItem("state"));
    if (sessionState) {
      dispatch({
        type: "load_data",
        data: sessionState
      })
    }
    setIsClient(true);
  }, [])
  const [sliderState, setSlider] = useState(40);
  const { nodeCount, currentProgress, showNodeClarificationStep, showBuilder } = state
  if (!isClient) return <Loader />;
  return (
    <div>
      <div className="flex flex-col-reverse sm:flex-row">
        {showBuilder ? (
          <>
            {
              isFeedbackStep({ currentProgress, nodeCount, showNodeClarificationStep }) ?
                (
                  <Feedback data={state} dispatch={dispatch} content={feedback} />
                ) : (
                  <>
                    <NetworkBuilder content={networkBuilder} state={state} dispatch={dispatch} />
                    <div className="flex-grow h-[calc(40dvh)] sm:h-[calc(100dvh)]" id="visualization">
                      <NetworkViz
                        componentId="network-builder"
                        dispatch={dispatch}
                        data={state}
                        sliderState={sliderState}
                        distance={0}
                        fixedWidth={windowWidth > 640 ? windowWidth - 400 : windowWidth}
                        showLegend={true}
                      />
                    </div>
                  </>
                )
            }
          </>
        ) : (
          <OnboardingContextProvider initialState={onboardingState}>
            <Intro data={networkBuilder} globaDispatch={dispatch} />
          </OnboardingContextProvider>
        )}
      </div>
    </div>
  )

}

export default function Network({ nodes, savedNetwork, lang, config, }) {

  const searchParams = useSearchParams()
  const pid = searchParams.get('pid')
  const ignoreNodesUrlParam = searchParams.get('ignoreNodes')
  let role
  const invited = searchParams.get('invited')
  const surveyPid = searchParams.get('surveyPid')
  let initialState
  if (typeof savedNetwork === "undefined" || savedNetwork === null) {
    role = searchParams.get('role')
    if (IGNORE_NODES || ignoreNodesUrlParam === "true") {
      initialState = {
        nodes: [],
        nodeCount: 0,
        showNodeClarificationStep: false,
        links: [],
        linkCount: 0,
        currentProgress: 0,
        responseDirection: config?.networkBuilder?.responseDirection || "incoming",
        responsesRequired: config?.networkBuilder?.responsesRequired || false,
        completedSteps: [],
        telemetry: {},
        locale: lang,
        role,
        invited,
        pid,
        surveyPid,
        showBuilder: false
      }

    } else {
      const nodesUpdated = nodes.map((d, i) => {
        let questionPrompt
        let causePrompt
        if (d.attributes.overrides.length > 0) {
          questionPrompt = d.attributes.overrides[0].questionPrompt
          causePrompt = d.attributes.overrides[0].causePrompt
        } else {
          questionPrompt = d.attributes.questionPrompt
          causePrompt = d.attributes.causePrompt
        }

        return (
          {
            ...d.attributes,
            "label": d.attributes.label.replaceAll("<br />", " "),
            questionPrompt,
            causePrompt,
            "initialIndex": i,
            "id": d.id,
            "name": d.attributes.label,
            "highlight": false,
            "chosen": d.attributes.required || false,
            "size": null,
            "nodeClarificationSelected": []
          }
        )
      }
      )
      initialState = {
        // randomize order by separating empty type and positive type nodes
        nodes: [
          ...d3.shuffle(nodesUpdated.filter(node => !node.type || node.type === "")),
          ...d3.shuffle(nodesUpdated.filter(node => node.type === "positive"))
        ],
        // TODO:
        //nodeCount: nodes.filter(node => node.attributes.required).length,
        nodeCount: 1,
        showNodeClarificationStep: (config?.networkBuilder?.nodeClarificationStep?.show && nodes.filter(node => node.attributes.nodeClarification.length > 0).length > 0) || false,
        //showNodeClarificationStep: false,
        links: [],
        linkCount: 0,
        currentProgress: 0,
        responseDirection: config?.networkBuilder?.responseDirection || "incoming",
        responsesRequired: config?.networkBuilder?.responsesRequired || false,
        completedSteps: [],
        telemetry: {},
        locale: lang,
        role,
        invited,
        pid,
        surveyPid,
        startTimestamp: Date.now(),
        timezoneOffset: new Date().getTimezoneOffset(),
        showBuilder: false
      }
    }
  } else {
    role = savedNetwork.data.role
    const savedData = savedNetwork.data
    savedData.currentProgress = "feedback"
    initialState = { ...savedNetwork.data, showBuilder: true, url: savedNetwork.url }
    // readd nodes to links
    initialState = addNodesToLinks(initialState)
  }
  // TODO: merge nested
  const roleCustomization = config.roleCustomization.filter(d => d.customRole.data.attributes.roleId === role)[0]
  const networkBuilder = deepMerge(config.networkBuilder, roleCustomization?.networkBuilder)
  //const networkBuilder = config.networkBuilder
  const feedback = deepMerge(config.feedback, roleCustomization?.feedback)
  return (
    <NetworkContextProvider initialState={initialState}>
      <NetworkApp networkBuilder={networkBuilder} feedback={feedback} />
    </NetworkContextProvider>
  );
}


