import { useMemo, useState } from "react"
import useChartDimensions from "../hooks/useChartDimensions"

import NetworkViz from "../network-viz"
import RichText from "./RichText"
import TargetNode from "./TargetNode"
import TopThreeSources from "./TopThreeSources"
import * as d3 from "d3";


const Viz = ({data, dispatch}) => {

    const nodesMax = d3.max([data.data.targetNodeCount, data.data.directNodeCount, data.data.indirectNodeCount])
    const [ref, dms] = useChartDimensions({
        marginTop: 10,
        marginBottom: 10,
        marginLeft: 10,
        marginRight: 10
    });
    const width = dms.width;
    const height = `${nodesMax * Math.sqrt(width)*4}px`
    return (
        <div className="container mx-auto" ref={ref} style={{ height }}>
        <NetworkViz
            sliderState={null}
            noLinkHighlight={true}
            disableClick={true}
            data={data.data}
            distance={1}
            hierachyFeedback="incoming"
            dispatch={dispatch}
        />
    </div>
    )
}

const TargetNodeIncomingFeedback = ({ data, content, targetNode, targetId, dispatch }) => {
    const newData = useMemo(() => {
        const linksDirect = data.links
            .filter(d => d.target.id == targetId && d.display && d.size > 50).map((d) => ({ ...d }))
        const gamingOutgoing = linksDirect.map(d => d.source.id)
        const nodesDirect = data.nodes
            .filter(d => [...gamingOutgoing].includes(d.id))
            .map((d, index) => ({ ...d, xPosCat: "direct", xPosCatIndex: index }))
        const nodesIndirect = data.nodes
            .filter(d => targetId == d.id)
            // TODO: seperate to create unique indix for indirect and direct
            .map((d, index) => ({ ...d, xPosCat: "indirect", xPosCatIndex: index }))
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
            .map((d, index) => ({ ...d, xPosCat: "target", xPosCatIndex: index }))
        const nodes = [...nodesDirect, ...nodesIndirect, ...nodesTarget]
        const links = [...linksDirect, ...indirectLinks]


        const sourceNodes = linksDirect
            .filter(d => d.target.id == targetId)
            .sort((a, b) => b.size - a.size)
            .map(d => ({ size: d.size, label: nodesDirect.filter(node => node.id === d.source.id)[0]?.label}))
            .slice(0, 3);
        return {
            sourceNodes,
            data: {
                nodes,
                links,
                highlightNode: [targetId],
                nodeCount: nodes.length,
                linkCount: links.length,
                targetNodeCount: nodesTarget.length,
                indirectNodeCount: 1,
                directNodeCount: nodesDirect.length,
                responseDirection: data.responseDirection || "incoming"
            }
        }
    }, [targetNode])
    // const [state, setState] = useState(newData.data)


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
                  <Viz data={newData} dispatch={dispatch} />
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

export default TargetNodeIncomingFeedback