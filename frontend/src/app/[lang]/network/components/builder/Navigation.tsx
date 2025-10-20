const NEXT_DEMO_MODE = process.env.NEXT_PUBLIC_DEMO_MODE
import { useState } from "react";
import { Pagination, Button } from "@heroui/react";
import handleSubmit from "./handle-submit";
import { isSubmitStep } from "../utils/progress";
import useTrackDisplayTime from "../hooks/useTrackDisplayTime";

const SubmitButton = ({ dispatch, buttonNextLabel, data, isDisabled }) => {
    const [isSubmitting, setSubmitting] = useState(false)
    const {onboarding} = data
    const getCurrentDisplayTime = useTrackDisplayTime(`${onboarding ? "onboarding-":""}submitStep`)

    const handleClick = async () => {
        // TODO: 
        // - handle error or just continue?
        if (NEXT_DEMO_MODE) {
            dispatch({ type: "submit_success", url: null });
        } else {
            setSubmitting(true)
            // need to add display time as data will be submitted before component is unmounted
            const url = await handleSubmit(
                {
                    ...data,
                    telemetry: {
                        ...data?.telemetry,
                        submitStep: (data?.telemetry?.submitStep || 0) + getCurrentDisplayTime()
                    }
                }
            )
            setSubmitting(false)
            dispatch({ type: "submit_success", url });
        }
    }
    return (
        <Button
            fullWidth
            onPress={handleClick}
            color="primary"
            size="lg"
            variant="solid"
            isDisabled={isSubmitting || isDisabled}
            isLoading={isSubmitting}
            spinnerPlacement={"end"}
        >
            {buttonNextLabel}
        </Button>
    )
}

const Navigation = ({ data, content, dispatch }) => {

    const {
        currentProgress,
        nodeCount,
        displayRequirementError,
        responsesRequired,
        onboarding
    } = data

    if(onboarding) return
    const { buttonBackLabel, buttonNextLabel, errorMessages } = content
    const showNodeClarificationStep = data.showNodeClarificationStep || false
    const handleProgress = (action) => {
        if (action == "back" && currentProgress > 0) {
            dispatch({
                type: "progress_decrease",
            })
        }
        if (action == "next") {
            dispatch({
                type: "progress_increase",
                errorMessages: errorMessages
            })
        }
    }
    return (
        <div>
            {displayRequirementError && (
                <div className="flex flex-row justify-end">
                    <p className="text-danger">
                        {displayRequirementError}
                    </p>
                </div>
            )}
            <div className="mt-2 flex flex-row gap-2 flex-row items-center justify-center">
                <Button
                    onPress={() => handleProgress("back")}
                    color="primary"
                    variant="bordered"
                    size="lg"
                    isDisabled={currentProgress == 0 || onboarding && true}
                >
                    {buttonBackLabel}
                </Button>
                {isSubmitStep({ currentProgress, nodeCount, showNodeClarificationStep }) ? (
                    <SubmitButton
                        buttonNextLabel={buttonNextLabel}
                        dispatch={dispatch}
                        data={data}
                        isDisabled={onboarding && true}

                    />
                ) : (
                    <Button
                        fullWidth
                        onPress={() => handleProgress("next")}
                        color="primary"
                        size="lg"
                        variant="solid"
                        isDisabled={onboarding && true}
                    >
                        {buttonNextLabel}
                    </Button>
                )}

            </div>
            <div className="hidden sm:mt-2 sm:flex flex-row justify-center">
                <Pagination
                    total={nodeCount + (showNodeClarificationStep ? 5 : 4)}
                    color="primary"
                    page={currentProgress + 1}
                    onChange={value => dispatch({
                        type: "progress_set",
                        value
                    })
                    }
                    color="primary"
                    isDisabled={responsesRequired || onboarding && true}
                    classNames={{
                        item: "bg-white",
                    }}
                />
            </div>
        </div>
    )
}

export default Navigation