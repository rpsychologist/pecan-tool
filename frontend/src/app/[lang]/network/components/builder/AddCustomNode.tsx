import { useState, useRef, useEffect } from "react";
import { Divider, CardBody, Input, Button } from "@heroui/react";

const AddCustomNode = ({ dispatch, content, maxNodes, disabled = false }) => {
    const {
        buttonLabel,
        inputPlaceholder,
        inputLabel,
        submitButtonLabel,
        questionPrompt,
        causePrompt
    } = content
    const [showInput, setShowInput] = useState(false)
    const [value, setValue] = useState("")
    const [count, setCount] = useState(0)
    const bottomRef = useRef(null);
    const inputRef = useRef(null)
    useEffect(() => {
        if (bottomRef?.current) {
            bottomRef.current.scrollIntoView({  behavior: "auto" });
            inputRef.current?.focus()
        }
    }, [showInput, count])

    async function handleSubmit(e) {
        e.preventDefault();
        dispatch({
            type: "add_custom_node",
            name: value,
            questionPrompt: questionPrompt.replace("{{ nodeName }}", value),
            causePrompt: causePrompt.replace("{{ nodeName }}", value),
            maxNodes

        })
        setValue("")
        setCount((prevCount) => prevCount + 1)
    }
    return (
        <>
            <Divider />
            <CardBody className="py-2">
                <div className="flex">
                    <div className="w-full">
                        {showInput ? (
                            <>
                                <form onSubmit={handleSubmit} autoComplete="off" className="flex w-full flex-col md:flex-nowrap gap-4">
                                    <Input
                                        ref={inputRef}
                                        type="text"
                                        name="customNode"
                                        label={inputLabel}
                                        fullWidth={true}
                                        placeholder={inputPlaceholder}
                                        value={value}
                                        onValueChange={setValue}
                                    />
                                    <Button
                                        type="submit"
                                        fullWidth={true}
                                        isDisabled={value === ""}
                                    >
                                        {submitButtonLabel}
                                    </Button>
                                </form>
                                <div ref={bottomRef}></div>
                            </>

                        ) : (
                            <Button
                                onPress={() => {
                                    setShowInput(true)
                                    // setTimeout(() => {
                                    //     if (bottomRef.current) {
                                    //         bottomRef.current.scrollIntoView({ behavior: "smooth" });
                                    //         inputRef.current?.focus();
                                    //     }
                                    // }, 0)
                                }}
                                color="primary"
                                variant="bordered"
                                size="lg"
                                fullWidth={true}
                                isDisabled={disabled && true}
                            >
                                {buttonLabel}
                            </Button>
                        )}
                    </div>
                </div>
            </CardBody>
        </>
    )
}

export default AddCustomNode