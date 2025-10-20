import { Card, CardHeader, CardBody, Divider } from "@heroui/react";
import Markdown from "markdown-to-jsx";
import { FaInfoCircle } from "react-icons/fa";
import useTrackDisplayTime from "../hooks/useTrackDisplayTime";
import React from 'react';

interface Chip2Props {
  children: React.ReactNode;
  className?: string;
}

const Chip: React.FC<Chip2Props> = ({ children, className }) => {
  return (
    <span className={`relative max-w-fit min-w-min inline-flex items-center justify-between box-border whitespace-nowrap px-1 h-7 text-small rounded-full text-default-foreground ${className}`}>
      <span className="flex-1 text-inherit font-normal px-2">{children}</span>
    </span>
  )
}

const GamerIntro = () => {
  return (
    <>
      <p>
        Nu har du ritat en problemkarta, nu är vi intresserad av om du tycker
        att <strong>gaming hjälper</strong> dig hantera dina problem. Det kan
        till exempel vara <Chip className="bg-gray-200">Gaming</Chip>{" "}
        <span className="text-extrabold text-lg">→</span>{" "}
        <Chip className="bg-success-200">Avkoppling</Chip>
        <span className="text-extrabold text-lg text-success-500"> → </span>
        <Chip className="bg-danger-200">Stress</Chip>. Vilket betyder att gaming
        är avkopplande och hjälper dig hantera stress.
      </p>
      <p>
        I nästa steg kommer du att få välja ut maximalt 3 aspekter av gaming som
        du tycker hjälper dig hantera dina problem, sedan kommer du att få svara
        på vilka problem det hälper mot.
      </p>
    </>
  );
};
const ParentIntro = () => {
  return (
    <>
      <p>
        Nu har du ritat en problemkarta, nu är vi intresserad av om du tycker
        att <strong>gaming hjälper</strong> ditt barn hantera sina problem. Det kan
        till exempel vara <Chip className="bg-gray-200">Gaming</Chip>{" "}
        <span className="text-extrabold text-lg">→</span>{" "}
        <Chip className="bg-success-200">Avkoppling</Chip>
        <span className="text-extrabold text-lg text-success-500"> → </span>
        <Chip className="bg-danger-200">Stress</Chip>. Vilket betyder att gaming
        är avkopplande och hjälper ditt barn hantera stress.
      </p>
      <p>
        I nästa steg kommer du att få välja ut maximalt 3 aspekter av gaming som
        du tycker hjälper ditt barn hantera sina problem, sedan kommer du att få svara
        på vilka problem det hjälper mot.
      </p>
    </>
  );
};
const PositiveLinksIntroStep = ({ role, content, onboarding, type }) => {
  useTrackDisplayTime(`${onboarding ? "onboarding-" : ""}linkRatingIntroStep`);

  const { header, introduction } = content;
  const isPositive = type === "positive";

  return (
    <Card>
      <div
        className={` text-xs sm:text-sm text-center font-bold ${
          isPositive ? "bg-success-200" : "bg-danger-200"
        }`}
      >
        {isPositive ? "Hjälpande faktorer" : "Problemorsaker"}
      </div>
      <Divider />
      <CardHeader className="py-1 gap-2 sm:py-3 justify-center">
        <FaInfoCircle />
        <h2 className="text-md sm:text-xl">Gamings positiva effekter</h2>
      </CardHeader>
      <Divider />
      <CardBody className="rich-text">
        {role === "parent" ? <ParentIntro /> : <GamerIntro />}
      </CardBody>
    </Card>
  );
};
export default PositiveLinksIntroStep;
