import Link from "next/link";
import Image from "next/image";
import HighlightedText from "./HighlightedText";
import { getStrapiMedia } from "../utils/api-helpers";
import { renderButtonStyle } from "../utils/render-button-style";
import DemoNetwork from "../network/components/feedback/DemoNetwork";
import { Button } from "@heroui/react";
import { FaEye } from "react-icons/fa";
import TargetNodeIncomingFeedbackDemo from "../network/components/feedback/TargetNodeIncomingFeedbackDemo";
interface Button {
  id: string;
  url: string;
  text: string;
  type: string;
  newTab: boolean;
}

interface Picture {
  data: {
    id: string;
    attributes: {
      url: string;
      name: string;
      alternativeText: string;
    };
  };
}

interface HeroProps {
  data: {
    id: string;
    title: string;
    description: string;
    picture: Picture;
    buttons: Button[];
  };
}


export default function Hero({ data }: HeroProps) {
  const imgUrl = getStrapiMedia(data.picture.data.attributes.url);

  const demoNetwork = {
    "nodes": [
      {
        "nodeId": "negativeEmotions",
        "label": "Negative emotions",
        "questionPrompt": "<strong>Negative emotions</strong> leads to ...",
        "causePrompt": "... Negative emotions",
        "shortLabel": null,
        "description": null,
        "createdAt": "2024-10-14T06:59:27.399Z",
        "updatedAt": "2024-11-01T17:36:51.594Z",
        "locale": "en",
        "required": true,
        "initialIndex": 0,
        "id": 24,
        "name": "Negative<br />emotions",
        "highlight": false,
        "chosen": true,
        "size": 60,
        "nodeClarificationSelected": [
          "anxiety"
        ],
        "index": 0,
        "x": 14.009497932327069,
        "y": -48.123168561117716,
        "vy": -0.0314487643479727,
        "vx": -0.020622869766588826,
        "fx": null,
        "fy": null
      },
      {
        "nodeId": "procrastination",
        "label": "Procrastination",
        "questionPrompt": "<strong>Procrastination</strong> leads to ...",
        "causePrompt": "... Procrastination",
        "shortLabel": null,
        "description": null,
        "createdAt": "2024-10-14T06:59:27.399Z",
        "updatedAt": "2024-11-01T14:12:37.391Z",
        "locale": "en",
        "required": null,
        "overrides": [],
        "initialIndex": 2,
        "id": 26,
        "name": "Procrastination",
        "highlight": false,
        "chosen": true,
        "size": 60,
        "nodeClarificationSelected": [
          "school"
        ],
        "index": 1,
        "x": -241.0108514099486,
        "y": -63.89960896880468,
        "vy": -0.03071697364470318,
        "vx": -0.019135743312175768,
        "fx": null,
        "fy": null
      },
      {
        "nodeId": "workOrStudyProblems",
        "label": "Work or Study problems",
        "questionPrompt": "<strong>Work or study problems</strong> leads to ...",
        "causePrompt": "... Work or study problems",
        "shortLabel": null,
        "description": null,
        "createdAt": "2024-10-14T06:59:27.399Z",
        "updatedAt": "2024-11-01T17:36:05.520Z",
        "locale": "en",
        "required": null,
        "nodeClarificationHeading": null,
        "nodeClarification": [],
        "overrides": [],
        "initialIndex": 7,
        "id": 31,
        "name": "Work or<br />Study problems",
        "highlight": false,
        "chosen": true,
        "size": 62,
        "nodeClarificationSelected": [],
        "index": 2,
        "x": -259.24109752813335,
        "y": -123.48830278850485,
        "vy": 0.18966214730523345,
        "vx": 0.20658268126591653,
        "fx": null,
        "fy": null
      },
      {
        "nodeId": "substanceUse",
        "label": "Substance use",
        "questionPrompt": "<strong>Substance use</strong> leads to ...",
        "causePrompt": "... Substance use",
        "shortLabel": null,
        "description": null,
        "createdAt": "2024-10-14T06:59:27.399Z",
        "updatedAt": "2024-10-14T07:05:49.205Z",
        "locale": "en",
        "required": null,
        "nodeClarificationHeading": null,
        "nodeClarification": [],
        "overrides": [],
        "initialIndex": 16,
        "id": 40,
        "name": "Substance use",
        "highlight": false,
        "chosen": true,
        "size": 63,
        "nodeClarificationSelected": [],
        "index": 3,
        "x": 164.97871153469742,
        "y": -148.04436089313225,
        "vy": 0.11723623325275799,
        "vx": 0.04289415903175953
      },
      {
        "nodeId": "sleepProblems",
        "label": "Sleep problems",
        "questionPrompt": "<strong>Sleep problems</strong> leads to ...",
        "causePrompt": "... Sleep problems",
        "shortLabel": null,
        "description": null,
        "createdAt": "2024-10-14T06:59:27.399Z",
        "updatedAt": "2024-10-14T07:06:45.582Z",
        "locale": "en",
        "required": null,
        "nodeClarificationHeading": null,
        "nodeClarification": [],
        "overrides": [],
        "initialIndex": 18,
        "id": 42,
        "name": "Sleep problems",
        "highlight": false,
        "chosen": true,
        "size": 66,
        "nodeClarificationSelected": [],
        "index": 4,
        "x": 144.40943285230833,
        "y": 103.75979274756044,
        "vy": -0.05755358573139023,
        "vx": 0.04156730511242579,
        "fx": null,
        "fy": null
      }
    ],
    "nodeCount": 5,
    "links": [
      {
        "target": {
          "nodeId": "substanceUse",
          "id": 40
        },
        "source": {
          "nodeId": "negativeEmotions",
          "id": 24
        },
        "size": 85,
        "display": true,
        "index": 0
      },
      {
        "target": {
          "nodeId": "sleepProblems",
          "id": 42
        },
        "source": {
          "nodeId": "negativeEmotions",
          "id": 24
        },
        "size": 82,
        "display": true,
        "index": 1
      },
      {
        "target": {
          "nodeId": "procrastination",
          "id": 26
        },
        "source": {
          "nodeId": "negativeEmotions",
          "id": 24
        },
        "size": 50,
        "display": true,
        "index": 2
      },
      {
        "target": {
          "nodeId": "workOrStudyProblems",
          "id": 31
        },
        "source": {
          "nodeId": "negativeEmotions",
          "id": 24
        },
        "size": 50,
        "display": true,
        "index": 3
      },
      {
        "target": {
          "nodeId": "workOrStudyProblems",
          "id": 31
        },
        "source": {
          "nodeId": "procrastination",
          "id": 26
        },
        "size": 88,
        "display": true,
        "index": 4
      },
      {
        "target": {
          "nodeId": "negativeEmotions",
          "id": 24
        },
        "source": {
          "nodeId": "procrastination",
          "id": 26
        },
        "size": 7,
        "display": true,
        "index": 5
      },
      {
        "target": {
          "nodeId": "substanceUse",
          "id": 40
        },
        "source": {
          "nodeId": "procrastination",
          "id": 26
        },
        "size": 7,
        "display": true,
        "index": 6
      },
      {
        "target": {
          "nodeId": "sleepProblems",
          "id": 42
        },
        "source": {
          "nodeId": "procrastination",
          "id": 26
        },
        "size": 7,
        "display": true,
        "index": 7
      },
      {
        "target": {
          "nodeId": "negativeEmotions",
          "id": 24
        },
        "source": {
          "nodeId": "workOrStudyProblems",
          "id": 31
        },
        "size": 85,
        "display": true,
        "index": 8
      },
      {
        "target": {
          "nodeId": "sleepProblems",
          "id": 42
        },
        "source": {
          "nodeId": "workOrStudyProblems",
          "id": 31
        },
        "size": 8,
        "display": true,
        "index": 9
      },
      {
        "target": {
          "nodeId": "substanceUse",
          "id": 40
        },
        "source": {
          "nodeId": "workOrStudyProblems",
          "id": 31
        },
        "size": 14,
        "display": true,
        "index": 10
      },
      {
        "target": {
          "nodeId": "procrastination",
          "id": 26
        },
        "source": {
          "nodeId": "workOrStudyProblems",
          "id": 31
        },
        "size": 14,
        "display": true,
        "index": 11
      },
      {
        "target": {
          "nodeId": "negativeEmotions",
          "id": 24
        },
        "source": {
          "nodeId": "substanceUse",
          "id": 40
        },
        "size": 90,
        "display": true,
        "index": 12
      },
      {
        "target": {
          "nodeId": "sleepProblems",
          "id": 42
        },
        "source": {
          "nodeId": "substanceUse",
          "id": 40
        },
        "size": 91,
        "display": true,
        "index": 13
      },
      {
        "target": {
          "nodeId": "workOrStudyProblems",
          "id": 31
        },
        "source": {
          "nodeId": "substanceUse",
          "id": 40
        },
        "size": 6,
        "display": true,
        "index": 14
      },
      {
        "target": {
          "nodeId": "procrastination",
          "id": 26
        },
        "source": {
          "nodeId": "substanceUse",
          "id": 40
        },
        "size": 8,
        "display": true,
        "index": 15
      },
      {
        "target": {
          "nodeId": "negativeEmotions",
          "id": 24
        },
        "source": {
          "nodeId": "sleepProblems",
          "id": 42
        },
        "size": 90,
        "display": true,
        "index": 16
      },
      {
        "target": {
          "nodeId": "workOrStudyProblems",
          "id": 31
        },
        "source": {
          "nodeId": "sleepProblems",
          "id": 42
        },
        "size": 89,
        "display": true,
        "index": 17
      },
      {
        "target": {
          "nodeId": "substanceUse",
          "id": 40
        },
        "source": {
          "nodeId": "sleepProblems",
          "id": 42
        },
        "size": 8,
        "display": true,
        "index": 18
      },
      {
        "target": {
          "nodeId": "procrastination",
          "id": 26
        },
        "source": {
          "nodeId": "sleepProblems",
          "id": 42
        },
        "size": 5,
        "display": true,
        "index": 19
      }
    ],
    "linkCount": 20,
    "responseDirection": "outgoing",
    "locale": "en",
    "highlightNode": []
  }

  return (
    <section className="dark:bg-black dark:text-gray-100">
      <div className="container flex flex-col justify-center items-center p-6 mx-auto sm:py-12 lg:py-24 lg:flex-row lg:justify-between">
        <div className="flex flex-col justify-center p-6 text-center rounded-lg lg:max-w-md xl:max-w-lg lg:text-left">
          <HighlightedText
            text={data.title}
            tag="h1"
            className="text-5xl font-bold leading-none sm:text-6xl mb-8"
            color="dark:text-violet-400"
          />

          <HighlightedText
            text={data.description}
            tag="p"
            className="tmt-6 mb-8 text-lg sm:mb-12"
            color="dark:text-violet-400"
          />
          <div className="flex flex-col space-y-4 sm:items-center sm:justify-center sm:flex-row sm:space-y-0 sm:space-x-4 lg:justify-start">
            {data.buttons.map((button: Button, index: number) => (
              <Button
                key={index}
                href={button.url}
                target={button.newTab ? "_blank" : "_self"}
                size="lg"
                as={Link}
                color={button.type}
              >
                {button.text}
              </Button>
            ))}
          </div>
        </div>
        <div className="flex flex-col items-center justify-center p-6 mt-8 lg:mt-0 h-72 sm:h-[24rem] lg:h-[32rem] w-full" >
          {/* <Image
            src={imgUrl || ""}
            alt={
              data.picture.data.attributes.alternativeText || "none provided"
            }
            className="object-contain h-72 sm:h-80 lg:h-96 xl:h-112 2xl:h-128 "
            width={600}
            height={600}
          /> */}
          <TargetNodeIncomingFeedbackDemo data={demoNetwork} targetId={24}/>
        </div>
      </div>
    </section>
  );
}
