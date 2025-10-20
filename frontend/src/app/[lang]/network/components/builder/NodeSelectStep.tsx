import { useState, useCallback } from "react";
import {
  Card,
  CardHeader,
  Divider,
  ScrollShadow,
  Progress,
} from "@heroui/react";
import Markdown from "react-markdown";
import AddCustomNode from "./AddCustomNode";
import NodeSelectButton from "./NodeSelectButton";
import CustomScrollShadow from "./CustomScrollShadow";
import useTrackDisplayTime from "../hooks/useTrackDisplayTime";

const NodeSelectStep = ({ 
    data,
    dispatch,
    onboarding,
    header,
    introduction,
    maxNodes = 10, // Provide default here or ensure parent passes it
    customNode,
    scrollIndicator,
 }) => {
  useTrackDisplayTime(`${onboarding ? "onboarding-" : ""}nodeSelectStep`);

  const { nodes, nodeCount } = data;

  const handleSelect = useCallback(
    (node) => {
      dispatch({
        type: "select_node",
        id: node.id,
      });
    },
    [dispatch]
  );
  return (
    <Card className="nodeSelectStep">
      <CardHeader className="flex flex-col gap-0 sm:gap-3 py-1 sm:py-3">
        <h2 className="font-bold text-xl">
          {header} {`(${nodeCount} / ${maxNodes})`}
        </h2>
        {!onboarding && <Markdown children={introduction} />}
      </CardHeader>
      <Divider />
      <CustomScrollShadow
        scrollIndicator={scrollIndicator}
      >
        <>
          {nodes.map((node, i) => (
            <NodeSelectButton
              key={i}
              node={node}
              handleSelect={handleSelect}
              nodeCount={data.nodeCount}
              maxSelected={nodeCount >= maxNodes}
            />
          ))}
          {!onboarding && customNode?.enabled && (
            <AddCustomNode
              dispatch={dispatch}
              content={customNode}
              maxNodes={maxNodes}
              disabled={onboarding}
            />
          )}
          <div className="h-5"></div>
        </>
      </CustomScrollShadow>
    </Card>
  );
};
export default NodeSelectStep;
