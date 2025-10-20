import { Slider, Button } from "@heroui/react"
import { useMemo, useState } from "react"
import NetworkViz from "../network-viz"
import DICT from "./dict"
import { RadioGroup, Radio } from "@heroui/radio";
const NEXT_DEMO_MODE = process.env.NEXT_PUBLIC_DEMO_MODE

const FullNetwork = ({ data }) => {

    const lang = data.locale
    const [weightNode, setWeightNode] = useState("source");

    //const [weight, setWeight] = useState(false)
    const nodes = useMemo(() => data.nodes
        .filter(d => d.chosen)
        .map((d) => ({ ...d })), [])
    const links = useMemo(() => data.links
        .filter(d => d.display)
        .map((d) => {
            return ({ ...d, size: d.size })
        }), [])

    const [state, setState] = useState(
        {
            nodes,
            links,
            nodeCount: {problem: nodes.length},
            linkCount: links.length,
            highlightNode: [],
            responseDirection: data.responseDirection || "incoming",
            weight: false
        }
    )
    const [distance, setDistance] = useState(100)
    const [linkFilter, setLinkFilter] = useState(51)
    const handleClick = (value) => {
        setState((prev) => {
            const newHighlightNode = prev.highlightNode[0] === value[0] ? [] : value
            return (
                { ...prev, highlightNode: newHighlightNode }
            )
        })
    }
    const handleToggleWeight = (weight) => {

        const newLinks = data.links
            .filter(d => d.display)
            .map((d) => {
                return ({ ...d, size: weight ? d.size * d[weightNode].size / 100 : d.size })
            })

        setState({
            ...state,
            links: newLinks.map(m => {
                const newTarget = state.nodes.filter(f => f.id == m.target.id)[0]
                const newSource = state.nodes.filter(f => f.id == m.source.id)[0]
                // TODO: this avoids breaking the app, but links are still shown
                if (typeof newSource !== "undefined" && typeof newTarget !== "undefined") {
                    m.source = newSource
                    m.target = newTarget
                    return m;
                } else {
                    return m
                }
            }).filter(d => d),
            weight
        })
    }
    const handleLinkFilter = (value) => {
        setLinkFilter(value)
    }
    return (
        <div className="flex flex-col-reverse md:flex-row items-center">
            <div className="print:hidden flex flex-col w-full md:w-3/12 gap-2 ">
                <h3 className="font-bold">{DICT[lang].settings}</h3>
                <div className="flex flex-col md:flex-col gap-2">
                    <div className="flex flex-col md:flex-col gap-2">

                        <Slider
                            ariaLabel={DICT[lang].change_distance}
                            label={DICT[lang].change_distance}
                            color="primary"
                            onChange={value => setDistance(value)}
                            value={distance}
                            step={1}
                            maxValue={1000}
                            minValue={-1000}
                            className=""
                        />
                        <Slider
                            ariaLabel={DICT[lang].filter_arrows}
                            label={DICT[lang].filter_arrows}
                            color="primary"
                            onChange={handleLinkFilter}
                            value={linkFilter}
                            step={1}
                            maxValue={100}
                            minValue={0}
                            className=""
                        />
                    </div>
                    {NEXT_DEMO_MODE && (
                        <div className="flex flex-col md:flex-col gap-2">
                            <Button onPress={() => handleToggleWeight(!state.weight)}>
                                {state.weight ? DICT[lang].weighting_button_label_on : DICT[lang].weighting_button_label_off}
                            </Button>
                            <RadioGroup
                                label={DICT[lang].weight_option}
                                value={weightNode}
                                onValueChange={(value) => {
                                    setWeightNode(value)
                                    handleToggleWeight(state.weight)

                                }}
                            >
                                <Radio value="target">{DICT[lang].weight_option_target}</Radio>
                                <Radio value="source">{DICT[lang].weight_option_source}</Radio>
                            </RadioGroup>
                        </div>
                    )}

                </div>
            </div>
            <div className="flex-grow container mx-auto h-[80vh]">
                <NetworkViz
                    componentId="feedback-full-network"
                    sliderState={null}
                    data={state}
                    feedback={true}
                    handleClick={handleClick}
                    distance={distance}
                    linkFilter={linkFilter}
                    showLegend={true}
                />
            </div>
        </div>
    )
}
export default FullNetwork