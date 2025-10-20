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
  return (
    <Card className="nodeRankingStep">
      <CardHeader className="flex flex-col py-1 sm:py-3 gap-1 sm:gap-3 bg-white">
        <h2 className="font-bold text-xl">
          {header} (
          {`${nodes.filter((d) => d.size !== null).length}/${
            nodes.filter((d) => d.chosen).length
          }`}
          )
        </h2>
        <Markdown children={introduction} />
      </CardHeader>
      <Divider />
      <CustomScrollShadow
        scrollIndicator={scrollIndicator}
      >
        {nodes
          .filter((node) => node.chosen)
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
