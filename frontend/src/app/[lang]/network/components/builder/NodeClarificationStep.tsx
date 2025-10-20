import { Card, CardHeader, Divider, ScrollShadow, Progress } from "@heroui/react"
import Markdown from "react-markdown"
import NodeClarificationCheckbox from "./NodeClarificationCheckbox"
import useTrackDisplayTime from "../hooks/useTrackDisplayTime"
const NodeClarificationStep = ({ nodes, displayRequirementError, content, dispatch, onboarding }) => {
    useTrackDisplayTime(`${onboarding ? "onboarding-":""}nodeClarificationStep`)
    const {
        introduction,
        title
    } = content
    
    const nodesFiltered = nodes
        .filter(node => node.chosen && node.nodeClarification.length > 0)
    const handleNodeClarification = ({ value, name }) => {
        dispatch({
            type: "change_node_clarification",
            name: name,
            value: value
        })
    }
    return (
        <Card>
            <CardHeader className="flex flex-col gap-3 bg-white">
                <h2 className="font-bold text-xl">{title}</h2>
                {introduction &&
                    <Markdown
                        children={introduction}
                    />
                }
            </CardHeader>
            <Divider />
            <ScrollShadow hideScrollBar={false} size="60">
                {
                    nodesFiltered
                        .map(
                            (node, index) =>
                                <NodeClarificationCheckbox
                                    key={index}
                                    node={node}
                                    handleSelect={handleNodeClarification}
                                    error={displayRequirementError}
                                />
                        )
                }
            </ScrollShadow>
            {/* <Progress
                radius="none"
                aria-label="Loading..."
                value={(nodes.filter(d => d.size !== null).length / nodes.filter(d => d.chosen).length) * 100}
                className=""
            /> */}
        </Card>
    )
}

export default NodeClarificationStep