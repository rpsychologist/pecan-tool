import React from "react";
import { Select, SelectItem } from "@heroui/react";
import DICT from "./dict"; 

// Basic type definitions 
interface Node {
  nodeId: string;
  id: string; 
  label: string;
  chosen: boolean;
}

interface Target {
  node: Node;
  id: string;
}

interface Data {
  nodes: Node[];
}
interface SelectTargetContent {
    show?: boolean; 
}
interface SelectTargetNodeProps {
  data: Data;
  target: Target;
  setTarget: React.Dispatch<React.SetStateAction<Target>>;
  lang: keyof typeof DICT; 
  content: SelectTargetContent | undefined; 
}

const SelectTargetNode: React.FC<SelectTargetNodeProps> = ({
  data,
  target,
  setTarget,
  lang,
  content,
}) => {
  if (!content?.show) {
    return null; 
  }

  return (
    <div className="print:hidden max-w-lg mx-auto  py-6 flex w-full flex-wrap md:flex-nowrap gap-4">
      <Select
        label={DICT[lang].select_target_node}
        className="max-w-xs"
        selectedKeys={[target.node.nodeId]}
        onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
          const id = e.target.value;
          if (id === "") return;
          const newNode = data.nodes.find((d: Node) => d.nodeId === id);
          if (newNode) {
            const originalNode = data.nodes.find((d: Node) => d.nodeId === newNode.nodeId);
            if (originalNode) {
                setTarget({
                    node: newNode, 
                    id: originalNode.id, 
                });
            } else {
                console.error("Original node not found for id:", newNode.nodeId);
            }
          } else {
              console.error("Node not found for id:", id);
          }
        }}
      >
        {data.nodes
          .filter((node: Node) => node.chosen)
          .map((node: Node) => (
            <SelectItem key={node.nodeId} value={node.nodeId}>{node.label}</SelectItem>
          ))}
      </Select>
    </div>
  );
};

export default SelectTargetNode; 