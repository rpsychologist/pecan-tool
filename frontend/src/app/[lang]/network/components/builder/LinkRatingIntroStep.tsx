import { Card, CardHeader, CardBody, Divider } from "@heroui/react";
import Markdown from "markdown-to-jsx";
import { FaInfoCircle } from "react-icons/fa";
import useTrackDisplayTime from "../hooks/useTrackDisplayTime";

const LinkRatingIntroStep = ({ content, onboarding, type }) => {
  useTrackDisplayTime(`${onboarding ? "onboarding-" : ""}linkRatingIntroStep`);

  const { header, introduction } = content;
  const isPositive = type === "positive";
  return (
    <Card>
      <div
        className={`text-xs sm:text-sm text-center font-bold ${
          isPositive ? "bg-success-200" : "bg-danger-200"
        }`}
      >
        {isPositive ? "Positiva konsekvenser" : "Problemorsaker"}
      </div>
      <Divider />
      <CardHeader className="py-1 gap-2 sm:py-3 justify-center">
        <FaInfoCircle />
        <h2 className="text-md sm:text-xl">{header}</h2>
      </CardHeader>
      <Divider />
      <CardBody>
        <Markdown className="rich-text" children={introduction} />
      </CardBody>
    </Card>
  );
};
export default LinkRatingIntroStep;
