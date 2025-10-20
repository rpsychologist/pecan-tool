import { useEffect, useRef, useCallback, useState, useMemo, memo } from "react";
import { Card, CardHeader, ScrollShadow, Divider } from "@heroui/react";
import LinkSlider from "./LinkSlider";
import Markdown from "markdown-to-jsx";
import { getLinkProgress } from "../utils/progress";
import useTrackDisplayTime from "../hooks/useTrackDisplayTime";
import CustomScrollShadow from "./CustomScrollShadow";
import type { ScrollVisibility } from "@heroui/react";

// Helper function to create a consistent key for the map
const createLinkKey = (sourceId: string | number, targetId: string | number) => `${sourceId}->${targetId}`;

// Define props for LinkRatingItem (basic types)
interface LinkRatingItemProps {
  node: any;
  focusedNode: any;
  responseDirection: string;
  linksLookup: Map<string, { index: number; size: any }>;
  linkRankingStep: any;
  handleLinkSize: (args: any) => void;
  displayRequirementError: any;
}

const LinkRatingItem = memo(
  ({
    node,
    focusedNode,
    responseDirection,
    linksLookup,
    linkRankingStep,
    handleLinkSize,
    displayRequirementError,
  }: LinkRatingItemProps) => {
    const currentSourceNode =
      responseDirection === "incoming" ? node : focusedNode;
    const currentTargetNode =
      responseDirection === "incoming" ? focusedNode : node;

    const linkKey = createLinkKey(currentSourceNode.id, currentTargetNode.id);
    const linkInfo = linksLookup.get(linkKey);

    const linkIndex = linkInfo ? linkInfo.index : -1;
    const isTouched = linkInfo !== undefined;
    const currentLinkSize = linkInfo?.size;

    return (
      <LinkSlider
        key={`${focusedNode.id}-${node.id}`}
        sourceNode={currentSourceNode}
        targetNode={currentTargetNode}
        linkSize={currentLinkSize}
        isTouched={isTouched}
        linkIndex={linkIndex}
        labels={linkRankingStep?.sliderLabels}
        handleChange={handleLinkSize}
        error={displayRequirementError}
        responseDirection={responseDirection}
        hideValue={linkRankingStep?.sliderHideValue}
      />
    );
  }
);
LinkRatingItem.displayName = "LinkRatingItem";

// Define props for LinkRatingStep (basic types)
interface LinkRatingStepProps {
    data: any;
    dispatch: (action: any) => void;
    onboarding: boolean;
    responseDirection: string;
    linkRankingStep: any;
    scrollIndicator: any;
}

const LinkRatingStep = ({
    data,
    dispatch,
    onboarding,
    responseDirection,
    linkRankingStep,
    scrollIndicator
}: LinkRatingStepProps) => {
  const [scrollVisibility, setScrollVisibility] = useState<ScrollVisibility>("none");
  const {
    nodes,
    links,
    currentProgress,
    showNodeClarificationStep,
    displayRequirementError,
    nodeCount,

  } = data;

  const linkProgress = getLinkProgress({
    currentProgress,
    showNodeClarificationStep,
    nodeCount,
    onboarding: onboarding ? true : false,
  });

  const topRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    topRef.current?.scrollTo({ top: 0, behavior: "smooth" });
  }, [linkProgress]);

  const selectedNodes = useMemo(() => nodes.filter((d: any) => d.chosen), [nodes]);

  const linksLookup = useMemo(() => {
    const map = new Map<string, { index: number; size: any }>();
    links.forEach((link: any, index: number) => {
      const key = createLinkKey(link.source.id, link.target.id);
      map.set(key, { index, size: link.size });
    });
    return map;
  }, [links]);

  const handleLinkSize = useCallback(
    ({ value, target, source, index }: { value: any; target: any; source: any; index: number }) => {
      dispatch({
        type: "change_link_size",
        target,
        source,
        index,
        size: value,
      });
    },
    [dispatch]
  );
  useTrackDisplayTime(
    `${onboarding ? "onboarding-" : ""}linkRatingStep-${
      selectedNodes[linkProgress]?.nodeId
    }`
  );

  const focusedNode = selectedNodes[linkProgress];
  if (!focusedNode) return null;

  let nodesFiltered;
  const isPositive = focusedNode.type === "positive"
  if (isPositive) {
    nodesFiltered = nodes.filter(
      (node) =>
        node.chosen &&
        node.id != focusedNode.id &&
        node.type !== "positive" &&
        node.nodeId !== "gaming"
    );
  } else {
    nodesFiltered = nodes.filter(
      (node) =>
        node.chosen &&
        node.id != focusedNode.id &&
        node.type !== "positive"
    );
  }
  let questionPrompt = selectedNodes[linkProgress].questionPrompt
  if(isPositive) {
    questionPrompt = questionPrompt.replace("leder till", "<em>hjälper</em> med")
  }

  return (
    <Card className="linkRatingStep">
      {isPositive ?
      <div className="bg-success-200 text-xs sm:text-sm text-center font-bold"> Hjälpande faktorer</div> :
      <div className="bg-danger-200 text-xs sm:text-sm text-center font-bold"> Problemorsaker</div>
       }
      <CardHeader className="flex flex-col gap-0 py-1 sm:py-3">
        {/* <h2 className="font-bold text-xl">{selectedNodes[linkProgress].questionPrompt}</h2> */}
        {linkRankingStep?.itemHeader && (
          <Markdown children={linkRankingStep?.itemHeader} />
        )}
        <h2
          className={isPositive ? "text-md sm:text-xl [&>strong]:text-success-600": "text-md sm:text-xl [&>strong]:text-danger-600"}
          dangerouslySetInnerHTML={{
            __html: questionPrompt,
          }}
        />
      </CardHeader>

      <Divider />
      <CustomScrollShadow
        ref={topRef}
        scrollVisibility={scrollVisibility}
        setScrollVisibility={setScrollVisibility}
        scrollIndicator={scrollIndicator}
      >
        {nodesFiltered.map((node, index) => (
          <LinkRatingItem
          key={node.id}
          node={node}
          focusedNode={focusedNode}
          responseDirection={responseDirection}
          linksLookup={linksLookup}
          linkRankingStep={linkRankingStep}
          handleLinkSize={handleLinkSize}
          displayRequirementError={displayRequirementError}
        />
        ))}
      </CustomScrollShadow>
    </Card>
  );
};
export default LinkRatingStep
