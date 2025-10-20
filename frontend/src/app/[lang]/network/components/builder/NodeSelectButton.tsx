import { memo } from "react"
import { Divider, CardBody, Checkbox } from "@heroui/react"
import MoreInfo from "./MoreInfo"

const NodeSelectButton = memo(({ node, nodeCount, handleSelect, disabled = false, ariaLabel = "", maxSelected }) => {

    const { description } = node
    return (
        <>
            <Divider />
            <CardBody className="py-2">
                <div className="flex">
                    <div className="flex flex-row items-center justify-between w-full">
                        <Checkbox
                        classNames={{
                            base: "w-full",
                            label: "w-full"
                        }}
                            id={node.id}
                            onValueChange={() => handleSelect(node)}
                            isSelected={node.chosen}
                            isDisabled={node.required || maxSelected && !node.chosen}
                        >
                            <div className="">
                                <div className="text-md sm:text-lg">{node.label}</div>
                            </div>
                        </Checkbox>
                        {description && <MoreInfo>{description} </MoreInfo>}
                    </div>
                    {/* <div className="ms-2">
                        {node?.custom && ('Custom node')}
                    </div> */}
                </div>
            </CardBody>
        </>
    )
})
export default NodeSelectButton