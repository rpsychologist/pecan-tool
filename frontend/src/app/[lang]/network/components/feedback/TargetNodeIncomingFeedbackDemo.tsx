"use client";
import { useMemo, useState } from "react"
import useChartDimensions from "../hooks/useChartDimensions"
import { Button, ButtonGroup } from "@heroui/react";
import NetworkViz from "../network-viz"
import RichText from "./RichText"
import TargetNode from "./TargetNode"
import TopThreeSources from "./TopThreeSources"
import * as d3 from "d3";
import {Card, CardHeader, CardBody, CardFooter, Divider, Link, Image} from "@heroui/react";

const Viz = ({ data, dispatch, hierarchy = true, componentId }) => {

    // TODO:
    // const handleClick = (value) => {
    //     setState((prev) => {
    //         const newHighlightNode = prev.highlightNode[0] === value[0] ? [] : value
    //         return (
    //             { ...prev, highlightNode: newHighlightNode }
    //         )
    //     })
    // }

    return (
            <div className="w-full h-full container mx-auto">
                <NetworkViz
                    sliderState={null}
                    noLinkHighlight={hierarchy}
                    disableClick={true}
                    data={data.data}
                    distance={200}
                    hierachyFeedback={hierarchy ? "incoming" : false}
                    feedback={!hierarchy}
                    dispatch={dispatch}
                    alphaTarget={0}
                    componentId={componentId}
                />
            </div>

    )
}

const TargetNodeIncomingFeedbackDemo = ({ data, content, targetNode, targetId, dispatch }) => {
    const [hierarchy, setHierarchy] = useState(false)
    const newData = useMemo(() => {
        const linksDirect = data.links
            .filter(d => d.target.id == targetId && d.display && d.size > 50).map((d) => ({ ...d }))
        const gamingOutgoing = linksDirect.map(d => d.source.id)
        const nodesDirect = data.nodes
            .filter(d => [...gamingOutgoing].includes(d.id))
            .map((d, index) => ({ ...d, xPosCat: hierarchy ? "direct" : undefined, xPosCatIndex: index }))
        const nodesIndirect = data.nodes
            .filter(d => targetId == d.id)
            // TODO: seperate to create unique indix for indirect and direct
            .map((d, index) => ({ ...d, xPosCat: hierarchy ? "indirect" : undefined, xPosCatIndex: index }))
        // include children 2 levels deep, gaming -> x -> y
        // exclude edges going back to gaming
        const indirectLinks = data.links
            .filter(
                d =>
                    d.display &&
                    d.source.id !== targetId &&
                    ([...gamingOutgoing].includes(d.target.id) && [...gamingOutgoing].includes(d.source.id) === false) &&
                    d.target.id !== targetId &&
                    d.size > 50
            ).map((d) => ({ ...d }))
        const indirectLinksIds = indirectLinks
            // .filter(d => [...gamingOutgoing, targetId].includes(d.source.id) == false)
            .map(d => d.source.id)

        const nodesTarget = data.nodes
            .filter(d => [...indirectLinksIds].includes(d.id))
            .map((d, index) => ({ ...d, xPosCat: hierarchy ? "target" : undefined, xPosCatIndex: index }))
        const nodes = [...nodesDirect, ...nodesIndirect, ...nodesTarget]
        const links = [...linksDirect, ...indirectLinks]

        const sourceNodes = linksDirect
            .filter(d => d.target.id == targetId)
            .sort((a, b) => b.size - a.size)
            .map(d => ({ size: d.size, label: d.source.label }))
            .slice(0, 3);
        return {
            sourceNodes,
            data: {
                nodes,
                links,
                highlightNode: hierarchy ? [targetId] : [],
                nodeCount: nodes.length,
                linkCount: links.length,
                targetNodeCount: nodesTarget.length,
                indirectNodeCount: 1,
                directNodeCount: nodesDirect.length,
                responseDirection: data.responseDirection || "incoming"
            }
        }
    }, [targetNode, hierarchy])
    // const [state, setState] = useState(newData.data)


    return (
        <>
            <Viz data={hierarchy ? newData : { data: data }} dispatch={dispatch} hierarchy={hierarchy} componentId="target-node-incoming-feedback-demo" />
            <div className="flex flex-row justify-center items-center gap-4">
                <p>View</p>
            <ButtonGroup>
                <Button onPress={() => setHierarchy(false)} color={hierarchy ? "default" : "primary"} variant="light">Network</Button>
                <Button onPress={() => setHierarchy(true)} color={hierarchy ? "primary" : "default"} variant="light">Target</Button>
            </ButtonGroup>

            </div>
            {/* <Viz data={newData} dispatch={dispatch} hierarchy={hierarchy} /> */}

        </>
    )
}

export default TargetNodeIncomingFeedbackDemo