import { memo } from "react";
import { CardBody, Slider, Divider } from "@heroui/react";
import classNames from "classnames";
import MoreInfo from "./MoreInfo";

const getColor = (color) => {
    switch (color) {
        case "red":
            return "danger"
        case "green":
            return "success"
    }
}

const NodeSeveritySlider = memo(({ node, handleChange, labels, error, color, hideValue }) => {
    const touched = node.size !== null
    return (
        <>
            <Divider />
            <CardBody
                className={classNames(
                    "flex flex-grow bg-white py-0",
                    { 'bg-red-50 text-red-600': !touched && error }
                )}
            >
                {/* <div>
                    <small>Extra deskription</small>
                </div> */}
                <div className="flex flex-row">
                    <div className="flex-grow flex-col">
                        <Slider
                            label={
                                <div className="flex flex-row items-center justify-between w-full">
                                    <h3 className="text-sm sm:text-lg font-medium">{node.label}</h3>
                                    {node?.description && <MoreInfo>{node.description} </MoreInfo>}
                                </div>
                            }
   
                            onChange={value => handleChange({ value, id: node.id })}
                            onChangeEnd={value => handleChange({ value, id: node.id })}
                            value={touched ? node.size : -1}
                            hideValue={hideValue}
                            step={1}
                            maxValue={100}
                            minValue={0}
                            size="lg"
                            classNames={{
                                base: "gap-0",
                                label: "w-full py-1",
                                track: "border-s-gray-100 mb-0 data-[fill-start=true]:border-s-none",
                                thumb: touched ? classNames(
                                    { "bg-success-600": color === "green" },
                                    { "bg-danger-600": color === "red" },
                                ) : "bg-gray-300",
                                filler: classNames(
                                    "bg-gradient-to-r from-gray-100",
                                    { "to-success-500": color === "green" },
                                    { "to-danger-500": color === "red" },
                                )
                            }}
                        />
                        <div className="flex justify-between text-sm sm:text-md my-2 select-none">
                            <div className="w-1/3" dangerouslySetInnerHTML={{ __html: labels.minLabel }} />
                            <div className="w-1/3 text-center" dangerouslySetInnerHTML={{ __html: labels.midLabel }} />
                            <div className="w-1/3 text-right" dangerouslySetInnerHTML={{ __html: labels.maxLabel }} />
                        </div>
                    </div>
                </div>
            </CardBody >
        </>
    )
})
export default NodeSeveritySlider