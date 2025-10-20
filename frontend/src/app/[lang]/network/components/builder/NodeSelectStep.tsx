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
  const [scrollVisibility, setScrollVisibility] = useState("none");

  const nodeCount = data.nodeCount["problem"] || 0
  const nodes = data.nodes.filter(node => node.type !== "positive")

  const handleSelect = useCallback(
    (node) => {
      dispatch({
        type: "select_node",
        id: node.id,
      });
    },
    [dispatch]
  );
  const targetNodes = nodes.filter(node => node.nodeId === "gaming")
  const problemNodes = nodes.filter(node => node.nodeId !== "gaming")
  return (
    <Card className="nodeSelectStep">
      <CardHeader className="flex flex-col gap-0 sm:gap-3 py-1 sm:py-3">
        <h2 className="font-bold text-md sm:text-xl">
          {header} {`(${nodeCount} / ${maxNodes})`}
        </h2>
        {!onboarding && <Markdown children={introduction} />}
      </CardHeader>
      <Divider />
      <CustomScrollShadow
        scrollVisibility={scrollVisibility}
        setScrollVisibility={setScrollVisibility}
        scrollIndicator={scrollIndicator}
      >
        <>
          {problemNodes.map((node, i) => (
            <NodeSelectButton
              key={i}
              node={node}
              handleSelect={handleSelect}
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
