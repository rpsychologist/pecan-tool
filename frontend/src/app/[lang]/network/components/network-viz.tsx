"use client";
import { useState, useEffect, useCallback, useMemo, useReducer, useRef } from "react";
import useChartDimensions from "./hooks/useChartDimensions";
import * as d3 from "d3";
const arrowTypes = [1, 2, 3, 4];
const linkColor = 'black';
const therapyNodeColor = '#0070f0';
const highlightNodeColor = "#e74c3c"
const grayNodecolor = "#C0C0C0"

const drag = (simulation) => {
    function dragstarted(d) {
        if (!d3.event.active) simulation.alphaTarget(0.3).restart();
        d.fx = d.x;
        d.fy = d.y;
    }

    function dragged(d) {
        d.fx = d3.event.x;
        d.fy = d3.event.y;
    }

    function dragended(d) {
        if (!d3.event.active) simulation.alphaTarget(0);
        d.fx = null;
        d.fy = null;
    }

    return d3
        .drag()
        .on('start', dragstarted)
        .on('drag', dragged)
        .on('end', dragended);
};
function linkArc(d, hierachyFeedback) {
    if (hierachyFeedback) return `M ${d.source.x},${d.source.y}L ${d.target.x},${d.target.y}`;

    const dx = d.target.x - d.source.x;
    const dy = d.target.y - d.source.y;
    const dr = Math.sqrt(dx * dx + dy * dy);
    return `M ${d.source.x},${d.source.y}A${dr},${dr} 0 0,1 ${d.target.x},${d.target.y}`;

}

const linkStrength = d3
    .scalePow()
    .domain([0, 100])
    .range([0, 0.05])
    .exponent(3);


const lineOpacity = d3
    .scalePow()
    .domain([
        0, 100
    ])
    .range([0.1, 1])
    .exponent(2);

const nodeOpacity = d3
    .scaleLinear()
    .domain([
        0, 100
    ])
    .range([0.1, 1]);

const setNodeOpacity = ({
    d,
    data,
    feedback,
    highlightNode,
    linkFilter,
    responseDirection
}) => {
    if (d.size >= linkFilter) {
        if (feedback) {
            const targetId = highlightNode[0]
            // TODO: no need to this for every value of d?
            const gamingOutgoing = data.links.filter(d => d.source.id == targetId && d.display).map(d => d.source.id)
            return (highlightNode.length == 0 || highlightNode.includes(d.target.id) || gamingOutgoing.includes(d.source.id)) ? lineOpacity(d.size) : 0.01
        } else {
            return (highlightNode.length == 0 || highlightNode.includes(responseDirection == "incoming" ? d.target.id : d.source.id)) ? lineOpacity(d.size) : 0.01
        }

    } else return 0
}
const setLinkOpacity = ({
    d,
    linkFilter,
    highlightNode,
    responseDirection,
    feedback,
    links,
    noLinkHighlight,
    hierachyFeedback
}) => {

    if (d.size >= linkFilter) {
        if (noLinkHighlight || hierachyFeedback) return lineOpacity(d.size)
        if (feedback) {
            const targetId = highlightNode[0]
            const gamingOutgoing = links.filter(d => d.source.id == targetId && d.display).map(d => d.source.id)

            return (highlightNode.length == 0 || highlightNode.includes(responseDirection == "incoming" ? d.source.id : d.target.id) || gamingOutgoing.includes(d.source.id)) ? lineOpacity(d.size) : 0.01
        } else {
            return (highlightNode.length == 0 || highlightNode.includes(responseDirection == "incoming" ? d.target.id : d.source.id)) ? lineOpacity(d.size) : 0.01
        }
    } else {
        return 0
    }
}

const getHierarchFill = ({ cat, direction }) => {
    if (direction == "incoming") {
        switch (cat) {
            case "direct":
                return highlightNodeColor;
            case "indirect":
                return therapyNodeColor;
            case "target":
                return grayNodecolor;
        }
    } else {
        switch (cat) {
            case "direct":
                return highlightNodeColor;
            case "indirect":
                return grayNodecolor;
            case "target":
                return therapyNodeColor;
        }
    }

}
const calcDistance = ({ distance, width }) => {
    if (distance === "responsive") {
        switch (true) {
            case width < 450:
                return -400
                break;
            case width >= 450:
                return 100
                break;
        }
    } else {
        return distance
    }
}
const color = d3
    .scaleOrdinal()
    .domain([1, 2, 3, 4])
    .range(['#000', '#e53935', '#fdd835', '#43a047']);
const NetworkViz = ({
    sliderState,
    data,
    dispatch,
    disableClick,
    feedbackLoops = false,
    feedback = false,
    handleClick,
    distance = 100,
    linkFilter = 0,
    noLinkHighlight = false,
    hierachyFeedback = false,
    fixedHeight = null,
    fixedWidth = null,
    alphaTarget = 0.15
}
) => {
    const [ref, dms] = useChartDimensions({
        marginTop: 10,
        marginBottom: 10,
        marginLeft: 10,
        marginRight: 10,
        width: fixedWidth,
        height: fixedHeight
    });
    const width = dms.width;
    const height = dms.height;
    const {
        nodeCount,
        nodes: nodeData,
        links: linkData,
        linkCount,
        highlightNode = [],
        responseDirection } = data
    let nodes = [...nodeData.filter(d => d.chosen)]
    let links = [...linkData.filter(d => d.display)];
    const markerSize = width > 450 ? 20 : 15;
    const refSvg = useRef()
    const refLink = useRef()
    const refNode = useRef()
    const lineThickness = useMemo(() =>
        d3
            .scalePow()
            .domain([
                0, 100
            ])
            .range([1, width < 450 ? 7 : 10])
            .exponent(3)
        ,
        [width])
    const size = useMemo(() => d3
        .scaleLinear()
        .domain([0, 100])
        .range([Math.sqrt(width) * 0.15, Math.sqrt(width)]),
        [width]
    )
    const simulation = useMemo(() => {
        let k
        if (typeof nodeCount == "undefined" || width == 0 || height == 0) {
            k = 0.02
        } else {
            k = nodeCount / width;
            if (width > 600) k = k / 2
        }
        const sim = d3
            .forceSimulation()
            .force(
                'link',
                d3
                    .forceLink()
                    .id((d) => {
                        return d.id
                    })
                    .distance(calcDistance({ distance, width }))
                    .strength((d) => {
                        if (hierachyFeedback) return null
                        return linkStrength(d.size)
                    })
            )
            //.force('charge', d3.forceManyBody())
            .force('x', d3.forceX()
                .x(function (d) {
                    if (typeof d.xPosCat !== "undefined") {
                        if (width > 450) {
                            switch (d.xPosCat) {
                                case "target":
                                    return -width / 4
                                    break;
                                case "direct":

                                    return 0
                                    break;
                                case "indirect":
                                    return width / 4
                                    break;
                            }
                        } else {
                            switch (d.xPosCat) {
                                case "target":
                                    return -width / 3
                                    break;
                                case "direct":

                                    return 0
                                    break;
                                case "indirect":
                                    return width / 3
                                    break;
                            }
                        }

                    } else return 0
                }
                )
            )
            .force('y', d3.forceY()
                .y(function (d) {
                    if (typeof d.xPosCat !== "undefined") {
                        switch (d.xPosCat) {
                            case "target":
                                return (d.xPosCatIndex - (data?.targetNodeCount - 1) / 2) * Math.sqrt(width) * 2 * 2
                                break;
                            case "direct":
                                return (d.xPosCatIndex - (data?.directNodeCount - 1) / 2) * Math.sqrt(width) * 2 * 2
                                break;
                            case "indirect":
                                return (d.xPosCatIndex - (data?.indirectNodeCount - 1) / 2) * Math.sqrt(width) * 2 * 2
                                break;
                        }
                    } else return 0;
                }
                )
            )
            .alphaDecay(0.0228)
            .alphaMin(0.1)
        if (hierachyFeedback) return sim
        return sim.force('charge', d3.forceManyBody().strength(-5 / k))
    }, [width, height, nodeCount, hierachyFeedback && highlightNode])

    useEffect(() => {
        const linkElements = d3.select(refLink.current)
            .selectAll('path')
            .data(links, d => `${d.target.id}_${d.source.id}`)

        const linkEnter = linkElements.join("path")
            .attr('opacity', (d) => setLinkOpacity({
                d,
                linkFilter,
                highlightNode,
                responseDirection,
                feedback,
                links,
                noLinkHighlight,
                hierachyFeedback
            }))
            .attr('stroke', (d) => linkColor)
            .style('stroke-width', (d) => lineThickness(d.size))
            .attr('marker-end', 'url(#arrow-1)')
        function reLinkToEdge(d) {
            // length of current path
            const pathLength = this.getTotalLength();
            // radius of target and markerhead
            const offset = size(d.target.size) + markerSize + 5;
            const m = this.getPointAtLength(pathLength - offset);
            const dx = m.x - d.source.x
            const dy = m.y - d.source.y
            const dr = Math.sqrt(dx * dx + dy * dy);
            if (hierachyFeedback) return `M${d.source.x},${d.source.y} L${m.x},${m.y}`;
            return `M${d.source.x},${d.source.y}A${dr},${dr} 0 0,1 ${m.x},${m.y}`;
        }
        //links = links.map((link) => Object.assign(link, prevLinks?.get(link.id)))
        //nodes = nodes.map((node) => Object.assign(node, prev?.get(node.id)))
        const nodeElements = d3
            .select(refNode.current)
            .selectAll('g')
            .data(nodes, d => d.id)
        const nodeEnter = nodeElements
            .join(enter => {
                const root = enter.append("g")
                const circles = root.append("circle")
                    .attr('fill', (d) => d.highlight ? "red" : therapyNodeColor)
                    .attr('stroke', 'white')
                    .attr('stroke-width', 1.5)
                    .attr('r', (d) => size(0))
                root.on('click', d => {
                    if (disableClick) return null
                    if (feedback) {
                        const nodeId = nodeData
                            .filter(node => node.name === d.name)
                            .map(d => d.id)
                        return handleClick(nodeId)
                    } else {
                        // TODO: only enable when all respones aren't required?
                        // const nodeIndex = nodeData
                        //     .filter(d => d.chosen)
                        //     .findIndex(node => node.name === d.name)
                        // const newProgress = nodeIndex + 3
                        // return dispatch({
                        //     type: "progress_set",
                        //     value: newProgress
                        // })
                    }
                })
                const text = root.append('text')
                    .attr('x', 0)
                    .attr('y', '0em')
                    .attr("class", "text-xs font-medium md:text-xl select-none ")
                    .attr("text-anchor", "right")
                    .attr("dominant-baseline", "middle")
                    .attr("stroke-linejoin", "round")

                const tSpan = text.selectAll("tspan")
                    .data(d => d.name.split("<br />"))
                    .enter()
                    .append("tspan")
                    .attr("x", 0)    // Reset x position for each line
                    .attr("dy", (d, i) => i > 0 ? "1.2em" : 0) // Set line spacing; "1.2em" gives spacing relative to font size
                    .text(d => d)
                text.clone(true)
                    .lower()
                    .attr('fill', 'none')
                    .attr('stroke', 'white')
                    .attr('stroke-width', 7.5)
                return root
            },
                //exit => exit.select("g").transition().duration(1000).attr("opacity", 0)
            ).call(drag(simulation))
        //nodeElements.selectAll("circle").lower()
        if (nodes.length > 0) {
            simulation.nodes(nodes).on('tick', () => {
                linkEnter.attr('d', (d) => linkArc(d, hierachyFeedback));
                linkEnter.attr('d', reLinkToEdge);
                nodeEnter.attr('transform', (d) => {
                    return `translate(${d.x},${d.y})`
                });
                nodeEnter.attr('cx', (d) => d.x).attr('cy', (d) => d.y);
            });
            // TODO: need to re-add the node to source and target
            // there's no need to update all links here
            if (links.length > 0) {
                links = links.map(m => {
                    const newTarget = nodes.filter(f => f.id == m.target.id)[0]
                    const newSource = nodes.filter(f => f.id == m.source.id)[0]
                    // TODO: this avoids breaking the app, but links are still shown
                    if (typeof newSource !== "undefined" && typeof newTarget !== "undefined") {
                        m.source = newSource
                        m.target = newTarget
                        return m;
                    } else {
                        return m
                    }
                }).filter(d => d)
            }
            simulation
                .force('link')
                .links(links)
                .distance(calcDistance({ distance, width }))
            simulation
                .alphaTarget(alphaTarget)
                .restart()

        }
        nodeEnter.selectAll("circle").lower()
        setTimeout(() => {
            simulation.stop()
        }, 2000)
        return () => simulation.stop();
    }, [nodeCount, linkCount, width, height, hierachyFeedback && highlightNode])

    useEffect(() => {
        simulation
            .force('link')
            .links(links)
            .distance(calcDistance({ distance, width }))
        simulation
            .alpha(1)
            .restart()
    }, [distance])

    useEffect(() => {
        setTimeout(() => {
            simulation.stop()
        }, 5000);
    }, [linkCount])

    useEffect(() => {
        const nodeElements = d3
            .select(refNode.current)
            .selectAll('circle')
            .data(nodes, d => d.id)
            .attr('r', (d) => {
                return size(d.size)
            })
            .attr('fill', (d) => {
                if (hierachyFeedback) return getHierarchFill({ cat: d.xPosCat, direction: hierachyFeedback })
                const sources = links
                    .filter(link => highlightNode.includes(responseDirection == "incoming" ? link.target.id : link.source.id))
                    .map(node => responseDirection == "incoming" ? node.source.id : node.target.id)
                if (highlightNode.length === 0) return therapyNodeColor
                if (highlightNode.includes(d.id)) return highlightNodeColor
                if (sources.includes(d.id)) return therapyNodeColor; else return grayNodecolor;
            })

    }, [nodeData, width])

    useEffect(() => {
        const link = d3.select(refLink.current)
            .selectAll('path')
        const nodeElements = d3
            .select(refNode.current)
            .selectAll('circle')
            .transition()
            .attr('stroke', (d) => highlightNode.includes(d.id) ? "black" : "white")
            .attr('opacity', (d) => {
                //if (feedback) return nodeOpacity(d.size)
                return 1

            })
            .attr('stroke-width', (d) => highlightNode.includes(d.id) ? 3 : 1)
            .attr('fill', (d) => {
                const sources = links
                    .filter(link => highlightNode.includes(responseDirection == "incoming" ? link.target.id : link.source.id))
                    .map(node => responseDirection == "incoming" ? node.source.id : node.target.id)
                if (highlightNode.length === 0) return therapyNodeColor
                if (highlightNode.includes(d.id)) return highlightNodeColor
                if (sources.includes(d.id)) return therapyNodeColor; else return grayNodecolor;
            })

        link
            .attr('class', (d) => {
                if (feedback) {
                    const targetId = highlightNode[0]
                    // TODO: no need to this for every value of d?
                    const gamingOutgoing = data.links
                        .filter(d => d.source.id == targetId && d.display)
                        .map(d => d.source.id)
                    return (highlightNode.includes(d.target.id) || gamingOutgoing.includes(d.source.id)) ? 'linkHighlight' : null
                } else {
                    return highlightNode.includes(responseDirection == "incoming" ? d.target.id : d.source.id) ? 'linkHighlight' : null
                }
            })
            .attr('opacity', (d) => setLinkOpacity({
                d,
                linkFilter,
                highlightNode,
                responseDirection,
                feedback,
                links,
                hierachyFeedback
            }))

    }, [highlightNode])
    useEffect(() => {
        const nodeElements = d3
            .select(refNode.current)
            .selectAll('circle')
            .transition()
            .attr('fill', (d) => {
                // TODO: fix colors on window resize
                if (hierachyFeedback) return getHierarchFill({ cat: d.xPosCat, direction: hierachyFeedback })
                const sources = links
                    .filter(
                        link => highlightNode
                            .includes(responseDirection == "incoming" ? link.target.id : link.source.id)
                    )
                    .map(node => responseDirection == "incoming" ? node.source.id : node.target.id)

                if (highlightNode.length === 0) return therapyNodeColor
                if (highlightNode.includes(d.id)) return highlightNodeColor
                if (sources.includes(d.id)) return therapyNodeColor; else return grayNodecolor;
            })
            .attr('opacity', (d) => {
                //if (feedback) return nodeOpacity(d.size)
                const link = links
                    .filter(link => link.target.id == d.id && link.source.id == highlightNode[0])
                if (link.length > 0) {
                    return lineOpacity(link[0].size)
                } else return 1

            })

        d3.select(refLink.current)
            .selectAll('path')
            .data(links, d => `${d.target.id}_${d.source.id}`)
            .attr('class', (d) => {
                if (hierachyFeedback) return 'linkHighlight'
                if (noLinkHighlight) return null
                return highlightNode.includes(responseDirection == "incoming" ? d.target.id : d.source.id) ? 'linkHighlight' : null
            }
            )
            .attr('opacity', (d) => setLinkOpacity({
                d,
                linkFilter,
                highlightNode,
                responseDirection,
                feedback,
                links,
                hierachyFeedback
            }))
            .style('stroke-width', (d) => {
                const value = lineThickness(d.size)
                return value
            })
        simulation
            .force('link')
            .links(links)
            .distance(calcDistance({ distance, width }))
        simulation
            .alphaTarget(alphaTarget)
            .restart()
    }, [linkData])
    useEffect(() => {
        d3.select(refLink.current)
            .selectAll('path')
            .data(links, d => `${d.target.id}_${d.source.id}`)
            .transition()
            .attr('opacity', (d) => setLinkOpacity({
                d,
                linkFilter,
                highlightNode,
                responseDirection,
                feedback,
                links,
                hierachyFeedback
            }))
            .style('stroke-width', (d) => lineThickness(d.size))
    }, [linkFilter])

    return (
        <div
            ref={ref}
            style={{
                height: "100%",
                width: "100%"
            }} 
            className="container"
        >
            <svg
                ref={refSvg}
                id="visualizationSvg"
                width={width}
                height={height}
                viewBox={`${-width / 2},${-height / 2},${width},${height}`}
            >
                <defs>
                    {arrowTypes.map((d, id) => {
                        return (
                            <marker
                                key={id}
                                id={`arrow-${d}`}
                                viewBox="0 0 10 10"
                                refX="0"
                                refY="5"
                                markerUnits="userSpaceOnUse"
                                markerWidth={markerSize}
                                markerHeight={markerSize}
                                orient="auto"
                            >
                                <path fill={color(d)} d="M 0 0 L 10 5 L 0 10 z" />
                            </marker>
                        )
                    })}

                </defs>
                <g ref={refLink} fill="none" />
                <g ref={refNode} id="nodes" fill='currentColor' />
            </svg>
        </div>
    )
}

export default NetworkViz