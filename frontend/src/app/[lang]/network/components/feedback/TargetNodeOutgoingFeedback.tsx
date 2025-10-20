import { useMemo, useState, useEffect } from "react"
import useChartDimensions from "../hooks/useChartDimensions"
import NetworkViz from "../network-viz"
import RichText from "./RichText"
import TargetNode from "./TargetNode"
import TopThreeSources from "./TopThreeSources"
import * as d3 from "d3";

const Viz = ({ data, dispatch, componentId }) => {

    const nodesMax = d3.max([data.data.directNodeCount, data.data.indirectNodeCount])
    const [ref, dms] = useChartDimensions({
        marginTop: 10,
        marginBottom: 10,
        marginLeft: 10,
        marginRight: 10
    });
    const width = dms.width;
    const height = `${nodesMax * Math.sqrt(width) * 4}px`

    return (
        <div className="print-fixed-width container mx-auto" ref={ref} style={{ height }}>
            <NetworkViz
                sliderState={null}
                noLinkHighlight={true}
                disableClick={true}
                data={data.data}
                distance={1}
                hierachyFeedback="outgoing"
                dispatch={dispatch}
                componentId={componentId}
            />
        </div>
    )
}

const TargetNodeOutgoingFeedback = ({ data, content, targetNode, targetId, dispatch }) => {
    const newData = useMemo(() => {
        const linksDirect = data.links
            .filter(d => d.source.id == targetId && d.display && d.size > 50)
            .map((d) => ({ ...d }))
        const gamingOutgoing = linksDirect.map(d => d.target.id)
        const nodesTarget = data.nodes
            .filter(d => targetId == d.id)
            .map((d, index) => ({ ...d, xPosCat: "target", xPosCatIndex: index }))
        const nodesDirect = data.nodes
            .filter(d => [...gamingOutgoing].includes(d.id))
            .map((d, index) => ({ ...d, xPosCat: "direct", xPosCatIndex: index }))
        // include children 2 levels deep, gaming -> x -> y
        // exclude edges going back to gaming
        const indirectLinks = data.links
            .filter(
                d =>
                    d.display &&
                    d.source.id !== targetId &&
                    ([...gamingOutgoing].includes(d.source.id) && [...gamingOutgoing].includes(d.target.id) === false) &&
                    d.target.id !== targetId &&
                    d.size > 50
            ).map((d) => ({ ...d }))
        const indirectLinksIds = indirectLinks
            .filter(d => [...gamingOutgoing, targetId].includes(d.target.id) == false)
            .map(d => d.target.id)
        const nodesIndirect = data.nodes
            .filter(d => [...indirectLinksIds].includes(d.id))
            .map((d, index) => ({ ...d, xPosCat: "indirect", xPosCatIndex: index }))
        const nodes = [...nodesDirect, ...nodesIndirect, ...nodesTarget]
        const links = [...linksDirect, ...indirectLinks]

        const sourceNodes = linksDirect
            .filter(d => d.source.id == targetId)
            .sort((a, b) => b.size - a.size)
            .map(d => ({ size: d.size, label: nodesDirect.filter(node => node.id === d.target.id)[0]?.label }))
            .slice(0, 3);

        return {
            sourceNodes,
            data: {
                nodes,
                links,
                highlightNode: gamingOutgoing,
                nodeCount: nodes.length,
                indirectNodeCount: nodesIndirect.length,
                directNodeCount: nodesDirect.length,
                targetNodeCount: 1,
                linkCount: links.length,
                responseDirection: "outgoing"
            }
        }
    }, [targetNode])

    
    return (
        <>
            <h2 className="text-2xl font-bold text-center">{content?.header?.replace("{{ targetNode }}", targetNode.label)}</h2>
            {newData.sourceNodes.length > 0 ? (
                <>
                    <RichText
                        content={content?.body}
                        optionsOverrides={{
                            TargetNode: {
                                component: TargetNode,
                                props: {
                                    label: targetNode.label,
                                    variant: "source"
                                }
                            },
                            TopThreeSources: {
                                component: TopThreeSources,
                                props: {
                                    sourceNodes: newData.sourceNodes,
                                    variant: "target"
                                }
                            }

                        }}
                    />
                    <Viz data={newData} dispatch={dispatch} componentId="target-node-outgoing-feedback" />
                </>
            ) : (
                <RichText
                    content={content?.zeroLinks}
                    optionsOverrides={{
                        TargetNode: {
                            component: TargetNode,
                            props: {
                                label: targetNode.label,
                                variant: "source"
                            }
                        }
                    }}
                />
            )}

        </>

    )
}

export default TargetNodeOutgoingFeedback