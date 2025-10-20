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
import useTrackDisplayTime from "../hooks/useTrackDisplayTime";
import CustomScrollShadow from "./CustomScrollShadow";
const customNode = {
  id: 2,
  questionPrompt:
    "<strong>{{ nodeName }}</strong>, <em>minskar</em> följande problem",
  causePrompt: "... {{ nodeName }}",
  enabled: true,
  buttonLabel: "Lägg till annat",
  inputPlaceholder: "Skriv...",
  inputLabel: "Hjälpande faktor",
  submitButtonLabel: "Lägg till",
};


const IntroGamer = () => {
  return (
    <p>
      Välj maximalt 3 saker kopplat till <strong>gaming</strong> som{" "}
      <strong>hjälper dig</strong> hantera dina problem. Listan nedan är ett förslag, men du kan lägga till egna faktorer om du vill.
    </p>
  );
};
const IntroParent = () => {
  return (
    <p>
      Välj maximalt 3 saker kopplat till <strong>gaming</strong> som{" "}
      <strong>hjälper ditt barn</strong> hantera sina problem. Listan nedan är ett förslag, men du kan lägga till egna faktorer om du vill.
    </p>
  );
};
const NodeSelectPositiveStep = ({ data, content, dispatch, onboarding }) => {
  useTrackDisplayTime(
    `${onboarding ? "onboarding-" : ""}nodeSelectPositiveStep`
  );
  const [scrollVisibility, setScrollVisibility] = useState("none");

  //const { nodes, nodeCount } = data
  const nodes = data.nodes.filter((node) => node.type === "positive");
  const { role } = data;

  const {
    // nodeSelectStep: { header, introduction },
    //customNode
  } = content;

  const maxNodes = 3;
  const nodeCount = data.nodeCount["positive"] || 0

  const handleSelect = useCallback((node) => {
    dispatch({
      type: "select_node",
      id: node.id,
    });
  }, [dispatch]);
  const targetNodes = nodes.filter((node) => node.nodeId === "gaming");
  const problemNodes = nodes.filter((node) => node.nodeId !== "gaming");
  return (
    <Card className="nodeSelectPositiveStep">
      <div className="bg-success-200 text-center font-bold text-xs sm:text-sm">
        {" "}
        Hjälpande faktorer {`(${nodeCount} / ${maxNodes})`}
      </div>

      <CardHeader className="flex flex-col gap-0 sm:gap-3 py-1 sm:py-3">
        {!onboarding ? (
         role === "parent" ? <IntroParent /> : <IntroGamer />
        ) : (
          <p>
            Välj faktorer som hjälper mot bilolyckor på vintern
          </p>
        )}
      </CardHeader>
      <Divider />
      <CustomScrollShadow
        scrollVisibility={scrollVisibility}
        setScrollVisibility={setScrollVisibility}
        scrollIndicator={content?.scrollIndicator}
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
              nodeType={"positive"}
              disabled={onboarding}
            />
          )}
        </>
      </CustomScrollShadow>
    </Card>
  );
};
export default NodeSelectPositiveStep;
