import { Divider, CardBody, CheckboxGroup, Checkbox } from "@heroui/react"

const NodeClarificationCheckbox = ({ node, handleSelect, error, disabled = false, ariaLabel = "" }) => {
    const { nodeClarificationSelected } = node
    return (
        <>
            <Divider />
            <CardBody className="py-2">
                <div className="flex">
                    <div className="flex items-center">
                        <CheckboxGroup
                            key={node.id}
                            onValueChange={value => handleSelect({ name: node.name, value })}
                            label={<span className="[&>strong]:text-blue-600" dangerouslySetInnerHTML={{ __html: node.nodeClarificationHeading}} />}
        
                            value={nodeClarificationSelected}
                            isInvalid={error && nodeClarificationSelected.length == 0}
                        >
                            {node.nodeClarification.map((d, i) =>
                                <Checkbox
                                    key={i}
                                    value={d.itemId}>
                                    {d.item}
                                </Checkbox>)}

                        </CheckboxGroup>

                    </div>

                </div>
            </CardBody>
        </>
    )
}
export default NodeClarificationCheckbox