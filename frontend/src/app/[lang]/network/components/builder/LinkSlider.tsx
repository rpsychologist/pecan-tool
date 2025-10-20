import { memo, useMemo, useState } from "react"
import { Divider, CardBody, Slider } from "@heroui/react"
import classNames from "classnames"
import MoreInfo from "./MoreInfo"
import getThumbBg from "./getThumbBg"


const LinkSlider = memo(({
    sourceNode,
    targetNode,
    linkSize,
    isTouched,
    linkIndex,
    handleChange,
    labels,
    error,
    responseDirection,
    hideValue
}) => {
    // TODO: add link value
    const [value, setValue] = useState(() => isTouched ? linkSize : 50)
    const touched = isTouched
    const label = responseDirection == "incoming" ? sourceNode.causePrompt : targetNode.causePrompt
    const description = responseDirection == "incoming" ? sourceNode.description : targetNode.description
    const thumbBgClass = useMemo(() => getThumbBg(value, touched), [value, touched])
    return (
        <>
            <Divider />
            <CardBody className={classNames(
                "py-0 sm:py-0",
                { 'bg-red-50 text-red-600': !touched && error }
            )}>

                {/* <div className="hidden sm:block">
                    <small>Extra deskription</small>
                </div> */}
                <div className="flex flex-row">
                    <div className="flex-grow flex-col">
                        <Slider
                            label={<div className={classNames(
                                "flex flex-row items-center justify-between",
                                { 'text-red-700': !touched && error }
                            )}>
                                <h3 className="text-sm sm:text-lg font-medium">{label}</h3>
                                {false && description && <MoreInfo>{description} </MoreInfo>}
                            </div>}
                            classNames={{
                                base: "gap-0",
                                label: "w-full py-1",
                                filler: value > 50 ? "bg-gradient-to-r from-gray-200 to-danger-500" : "bg-gradient-to-r from-success-500 to-gray-200",
                                thumb: thumbBgClass,
                                startContent: "text-sm sm:text-md",
                                endContent: "text-sm sm:text-md",
                                track: "mb-0"
                            }}
                            onChange={newValue => setValue(newValue)}
                            onChangeEnd={endValue => handleChange({
                                value: endValue,
                                source: sourceNode.id,
                                target: targetNode.id,
                                index: linkIndex
                            })}
                            defaultValue={value}
                            step={1}
                            maxValue={100}
                            minValue={0}
                            fillOffset={50}
                            hideValue={hideValue}
                            size="lg"
                        />
                        <div className="flex justify-between text-sm sm:text-md my-2 select-none">
                            <div className="w-1/3" dangerouslySetInnerHTML={{__html:labels.minLabel }} />
                            <div className="w-1/3 text-center" dangerouslySetInnerHTML={{__html:labels.midLabel }} />
                            <div className="w-1/3 text-right" dangerouslySetInnerHTML={{__html:labels.maxLabel }} />
                        </div>
                    </div>
                </div>
            </CardBody>
        </>

    )
})

export default LinkSlider