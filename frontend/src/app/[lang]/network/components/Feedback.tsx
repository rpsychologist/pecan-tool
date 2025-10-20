"use client";
import { useMemo, useState } from "react";
import Markdown from "markdown-to-jsx";
import BarChart from "./BarChart";
import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Divider,
  Button,
  Link,
  Input,
  Form,
} from "@heroui/react";
import RichText from "./feedback/RichText";
import NetworkUrl from "./feedback/NetworkUrl";
import FullNetwork from "./feedback/FullNetwork";
import TargetNodeOutgoingFeedback from "./feedback/TargetNodeOutgoingFeedback";
import TargetNodeIncomingFeedback from "./feedback/TargetNodeIncomingFeedback";
import InviteDyad from "./feedback/InviteDyad";
import SelectTargetNode from "./feedback/SelectTargetNode";
import {
  FaSave,
  FaFileDownload,
  FaClipboardList,
  FaRegStar,
} from "react-icons/fa";
import { useSearchParams } from "next/navigation";
import DICT from "./feedback/dict";

const NEXT_DEMO_MODE = process.env.NEXT_PUBLIC_DEMO_MODE;
let IGNORE_NODES = process.env.NEXT_PUBLIC_IGNORE_NODES === "true";
import { Select, SelectItem } from "@heroui/react";

interface Node {
  nodeId: string;
  id: string;
  label: string;
  chosen: boolean;
}

interface LinkData {
    source: { id: string; nodeId: string };
    target: { id: string; nodeId: string };
    size: number;
    display?: any;
    index?: number;
}

interface Target {
  node: Node;
  id: string;
}

interface FeedbackData {
  locale: keyof typeof DICT;
  role: string;
  pid: string;
  invited: any;
  nodes: Node[];
  links: LinkData[];
  url?: string;
}

interface FeedbackContentSection {
    show?: boolean;
    header?: string;
    body?: any;
}

interface EvaluationSurveyData extends FeedbackContentSection {
    url?: string;
    buttonLabel?: string;
    footer?: string;
}

interface DownloadDataContent extends FeedbackContentSection {
    buttonLabel?: string;
    inputLabel?: string;
    inputDefaultValue?: string;
}

interface FeedbackContent {
    introduction: FeedbackContentSection;
    dyadInvite?: FeedbackContentSection;
    centrality?: FeedbackContentSection & { figureHeader?: string };
    targetNodeOutgoing?: FeedbackContentSection;
    targetNodeIncoming?: FeedbackContentSection;
    fullNetwork?: FeedbackContentSection;
    shareUrl?: FeedbackContentSection;
    evaluationSurvey?: EvaluationSurveyData;
    participantThanks?: FeedbackContentSection;
    downloadData?: DownloadDataContent;
    selectTarget?: FeedbackContentSection;
    targetNode?: { data: { attributes: Node } } | null;
}

const EvaluationSurveyInvite = ({ data, role, pid }: { data: EvaluationSurveyData, role: string, pid: string }) => {
  const { header, body, url, buttonLabel, footer } = data;

  if (!url) return null;

  const fullUrl = new URL(url);
  const params = {
    role,
    global_pid: pid,
  };
  Object.entries(params).forEach(([key, value]) => {
    if (value !== null && value !== undefined) {
      fullUrl.searchParams.append(key, value);
    }
  });

  return (
    <div className="print:hidden max-w-2xl mx-auto prose-lg py-6">
      <Card>
        <CardHeader className="flex gap-3 text-2xl font-bold">
          <FaClipboardList className="w-5 h-5 fill-primary-500" />
          <h2>{header}</h2>
        </CardHeader>
        <Divider />
        <CardBody className="gap-3">
          <Markdown className="space-y-3" children={body} />
          <Button
            href={fullUrl.toString()}
            size="lg"
            as={Link}
            showAnchorIcon={true}
            color="primary"
            isExternal={true}
          >
            {buttonLabel}
          </Button>
        </CardBody>
        <Divider />
        <CardFooter>
          <p className="text-small italic">{footer}</p>
        </CardFooter>
      </Card>
    </div>
  );
};

const downloadJSON = (jsonData: FeedbackData, filename: string) => {
  const jsonString = JSON.stringify(
    {
      ...jsonData,
      nodes: jsonData.nodes.filter((d: Node) => d.chosen),
      links: jsonData.links.map((d: LinkData) => ({
        target: {
          nodeId: d.target.nodeId,
          id: d.target.id,
        },
        source: {
          nodeId: d.source.nodeId,
          id: d.source.id,
        },
        size: d.size,
        display: d.display,
        index: d.index,
      })),
    },
    null,
    2
  );

  const blob = new Blob([jsonString], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `${filename}.json` || "pecan-data-default.json";
  link.click();

  URL.revokeObjectURL(url);
};

const DownloadData = ({ data, content }: { data: FeedbackData, content: DownloadDataContent }) => {
  const { header, body, buttonLabel, inputLabel, inputDefaultValue } = content;
  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const filename = formData.get("filename") as string;
    if (filename && filename.trim() !== "") {
        downloadJSON(data, filename);
    } else {
        console.error("Filename cannot be empty");
    }
  };
  return (
    <div className="print:hidden max-w-2xl mx-auto prose-lg py-6">
      <Card>
        <CardHeader className="flex gap-3 text-2xl font-bold">
          <FaFileDownload className="w-5 h-5 fill-primary-500" />
          <h2>{header}</h2>
        </CardHeader>
        <Divider />
        <CardBody className="gap-3">
          <Markdown className="space-y-3" children={body} />
          <Form validationBehavior="native" onSubmit={onSubmit}>
            <Input
              isRequired
              label={inputLabel}
              name="filename"
              type="text"
              defaultValue={inputDefaultValue}
              endContent={
                <div className="pointer-events-none flex items-center">
                  <span className="text-default-400 text-small">.json</span>
                </div>
              }
            />
            <Button
              size="lg"
              type="submit"
              variant="bordered"
              color="primary"
              startContent={<FaFileDownload />}
            >
              {buttonLabel}
            </Button>
          </Form>
        </CardBody>
        <Divider />
      </Card>
    </div>
  );
};

const Feedback = ({ data, dispatch, content }: { data: FeedbackData, dispatch: React.Dispatch<any>, content: FeedbackContent }) => {
  const { locale: lang, role, pid, invited } = data;

  const {
    introduction,
    dyadInvite,
    centrality,
    targetNodeOutgoing,
    targetNodeIncoming,
    fullNetwork,
    shareUrl,
    evaluationSurvey,
    participantThanks,
    downloadData,
    selectTarget,
  } = content;
  const searchParams = useSearchParams();
  const ignoreNodesUrlParam = searchParams.get("ignoreNodes");

  const nodeCentrality = useMemo(
    () =>
      data.nodes
        .filter((node: Node) => node.chosen)
        .map((node: Node) => {
          const sum = data.links
            .filter((link: LinkData) => link.source.id == node.id)
            .map((link: LinkData) => link.size)
            .reduce((acc: number, curr: number) => acc + curr, 0);
          return { label: node.label, sum, nodeId: node.nodeId };
        })
        .sort((a, b) => b.sum - a.sum),
    [data.nodes, data.links]
  );
  let defaultTargetNode: Node | undefined;

  const highestCentralityNodeId = nodeCentrality.length > 0 ? nodeCentrality[0].nodeId : undefined;

  if (
    IGNORE_NODES ||
    content?.targetNode?.data === null ||
    ignoreNodesUrlParam === "true"
  ) {
    if (highestCentralityNodeId) {
        defaultTargetNode = data.nodes.find(
          (d: Node) => d.nodeId === highestCentralityNodeId
        );
    }
  } else if (content?.targetNode?.data?.attributes) {
    defaultTargetNode = content.targetNode.data.attributes;
  }

  const initialTargetId = defaultTargetNode ? data.nodes.find((d: Node) => d.nodeId === defaultTargetNode!.nodeId)?.id : undefined;

  const fallbackNode = data.nodes.find((n: Node) => n.chosen);
  const fallbackTarget: Target = {
      node: fallbackNode || data.nodes[0],
      id: fallbackNode ? fallbackNode.id : data.nodes[0]?.id || ""
  }

  const [target, setTarget] = useState<Target>(
    defaultTargetNode && initialTargetId
      ? { node: defaultTargetNode, id: initialTargetId }
      : fallbackTarget
  );

  if (!data || data.nodes.length === 0) {
      return <div>Loading data or no data available...</div>;
  }

  return (
    <div className="pdf-content w-full">
      <div className="p-4">
        <h1 className="text-3xl font-bold text-center">
          {introduction.header}
        </h1>
        <RichText content={introduction.body} />
        {dyadInvite && (
          <InviteDyad
            content={dyadInvite}
            pid={pid}
            invited={invited}
            role={role}
            lang={lang}
          />
        )}
        <h2 className="text-2xl font-bold text-center">{centrality?.header}</h2>
        <RichText content={centrality?.body} />
        {centrality?.figureHeader && (
          <div className="text-center">
            <h3 className="text-lg font-bold">{centrality?.figureHeader}</h3>
          </div>
        )}
        <div className="container mx-auto" style={{ height: "100%" }}>
          <BarChart data={nodeCentrality} heading={true} />
        </div>
        <SelectTargetNode
            data={data}
            target={target}
            setTarget={setTarget}
            lang={lang}
            content={content.selectTarget}
         />
        {targetNodeOutgoing?.show && (
          <TargetNodeOutgoingFeedback
            data={data}
            content={targetNodeOutgoing}
            targetNode={target.node}
            targetId={target.id}
            dispatch={dispatch}
          />
        )}
        {targetNodeIncoming?.show && (
          <TargetNodeIncomingFeedback
            data={data}
            content={targetNodeIncoming}
            targetNode={target.node}
            targetId={target.id}
            dispatch={dispatch}
          />
        )}
        <div>
          <h2 className="text-2xl font-bold text-center">
            {fullNetwork?.header}
          </h2>
          <RichText content={fullNetwork?.body} />
          <FullNetwork data={data} />
        </div>
        {participantThanks?.show && NEXT_DEMO_MODE !== "true" && (
          <>
            <div className="flex items-center my-4">
              <div className="flex-grow border-t border-gray-300"></div>
              <FaRegStar className="text-3xl mx-4" />
              <h2 className="text-3xl font-bold text-center">
                {participantThanks.header}{" "}
              </h2>
              <FaRegStar className="text-3xl mx-4" />
              <div className="flex-grow border-t border-gray-300"></div>
            </div>
            <div>
              <RichText content={participantThanks.body} />
            </div>
          </>
        )}
        {evaluationSurvey?.show && NEXT_DEMO_MODE !== "true" && (
          <EvaluationSurveyInvite
            data={evaluationSurvey}
            role={role}
            pid={pid}
          />
        )}
        {shareUrl?.show && (
          <div className="print:hidden max-w-2xl mx-auto prose-lg py-6">
            <Card>
              <CardHeader className="flex gap-3 text-2xl font-bold">
                <FaSave className="c fill-zinc-500" />
                <h2>{shareUrl?.header}</h2>
              </CardHeader>
              <Divider />
              <CardBody className="gap-3">
                <Markdown className="space-y-3" children={shareUrl?.body} />
                <NetworkUrl
                  url={
                    NEXT_DEMO_MODE
                      ? "URL is not generated in demo mode"
                      : data.url
                  }
                  lang={lang}
                />
              </CardBody>
              <Divider />
            </Card>
          </div>
        )}
        {downloadData?.show && (
          <DownloadData data={data} content={downloadData} />
        )}
      </div>
    </div>
  );
};

export default Feedback;
