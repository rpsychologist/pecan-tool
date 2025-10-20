import { useContext } from "react";
import OnboardingContext from "../onboarding/reducer";

import NetworkOnboarding from "../network-onboarding";
import NetworkBuilder from "../network-builder";
import NetworkViz from "../network-viz";
import useTrackDisplayTime from "../hooks/useTrackDisplayTime";
import { Button, Input } from "@heroui/react";
import Markdown from "markdown-to-jsx";
import { FaFileUpload } from "react-icons/fa";
import addNodesToLinks from "../utils/readd-nodes";

const FileUploadButton = ({ dispatch, label }) => {
  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file && file.type === "application/json") {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const parsedJson = JSON.parse(e.target.result);
          dispatch({
            type: "load_data",
            data: addNodesToLinks(parsedJson),
          });
        } catch (error) {
          console.error("Error parsing JSON:", error);
        }
      };
      reader.readAsText(file);
    } else {
      console.error("Please upload a valid JSON file.");
    }
  };
  return (
    <>
      <input
        className="hidden"
        type="file"
        accept=".json"
        onChange={handleFileUpload}
        id="button-load-json"
      />
      <label htmlFor="button-load-json">
        <Button
          color="default"
          variant="bordered"
          startContent={<FaFileUpload className="w-5 h-5 fill-default-500" />}
          as="span"
          fullWidth
        >
          {label}
        </Button>
      </label>
    </>
  );
};

const Onboarding = ({ data, state, dispatch }) => {
  return (
    <>
      <NetworkBuilder content={data} state={state} dispatch={dispatch} />
      <div
        className="flex-grow h-[calc(30dvh)] sm:h-[calc(100dvh)]"
        id="visualization"
      >
        <NetworkViz
          componentId="intro"
          dispatch={dispatch}
          data={state}
          sliderState={40}
        />
      </div>
    </>
  );
};

const Intro = ({ data, globaDispatch, handleShowBuilder }) => {
  useTrackDisplayTime("startStep");
  const { state, dispatch } = useContext(OnboardingContext);
  const { onboarding } = state;
  const onboardingEnabled = data?.onboarding?.show;
  const loadDataEnabled = data?.introStep?.showButtonLoadNetwork;
  return (
    <>
      {onboardingEnabled && (
        <NetworkOnboarding
          content={data?.onboarding}
          dispatch={dispatch}
          state={state}
          globaDispatch={globaDispatch}
        />
      )}
      {onboarding?.show === false ? (
        <div className="flex flex-col w-full min-h-dvh">
          {loadDataEnabled && (
            <div className="flex justify-end p-2">
              <FileUploadButton
                dispatch={globaDispatch}
                label={data?.introStep?.buttonLoadNetworkLabel}
              />
            </div>
          )}
          <div className="p-4 flex flex-col flex-grow w-full justify-center items-center">
            <h2 className="text-2xl font-bold">{data?.introStep?.header}</h2>
            <div className="max-w-lg mx-auto rich-text py-6 prose-lg dark:bg-black dark:text-gray-50 ">
              <Markdown children={data?.introStep?.intro} />
            </div>
            <Button
              onPress={() => {
                onboardingEnabled
                  ? dispatch({ type: "show_onboarding" })
                  : globaDispatch({ type: "show_builder" });
              }}
              color="primary"
              size="lg"
            >
              {data?.introStep?.buttonStartLabel}
            </Button>
          </div>
        </div>
      ) : (
        <Onboarding data={data} state={state} dispatch={dispatch} />
      )}
    </>
  );
};

export default Intro;
