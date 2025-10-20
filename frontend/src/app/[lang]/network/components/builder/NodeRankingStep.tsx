import { useCallback, useState } from "react";
import { Card, CardHeader, Divider, Progress } from "@heroui/react";
import Markdown from "markdown-to-jsx";
import NodeSeveritySlider from "./NodeSeveritySlider";
import useTrackDisplayTime from "../hooks/useTrackDisplayTime";
import CustomScrollShadow from "./CustomScrollShadow";

const NodeRankingStep = ({
  data,
  dispatch,
  onboarding,
  header,
  introduction,
  sliderLabels,
  sliderColor,
  sliderHideValue,
  scrollIndicator,
}) => {
  useTrackDisplayTime(`${onboarding ? "onboarding-" : ""}nodeRankingStep`);
  const [scrollVisibility, setScrollVisibility] = useState<
    "top" | "bottom" | "both" | "none"
  >("none");

  const { nodes, displayRequirementError } = data;

  const handleSize = useCallback(
    ({ value, id }) => {
      dispatch({
        type: "change_node_size",
        id,
        size: value,
      });
    },
    [dispatch]
  );
  const problemNodes = nodes.filter(node => node.chosen && node.nodeId !== "gaming" && node.type !== "positive")

  return (
    <Card className="nodeRankingStep">
      <CardHeader className="flex flex-col py-1 sm:py-3 gap-0 sm:gap-3 bg-white">
        <h2 className="font-bold text-md sm:text-xl">
          {header} (
          {`${problemNodes.filter((d) => d.size !== null).length}/${
            problemNodes.length
          }`}
          )
        </h2>
        <Markdown children={introduction} />
      </CardHeader>
      <Divider />
      <CustomScrollShadow
        scrollVisibility={scrollVisibility}
        setScrollVisibility={setScrollVisibility}
        scrollIndicator={scrollIndicator}
      >
        {problemNodes
          .map((node, index) => (
            <NodeSeveritySlider
              key={index}
              node={node}
              labels={sliderLabels}
              handleChange={handleSize}
              error={displayRequirementError}
              color={sliderColor}
              hideValue={sliderHideValue}
            />
          ))}
      </CustomScrollShadow>
      {/* <Progress
                radius="none"
                aria-label="Loading..."
                value={(nodes.filter(d => d.size !== null).length / nodes.filter(d => d.chosen).length) * 100}
                className=""
            /> */}
    </Card>
  );
};

export default NodeRankingStep;
