import React from "react";
import { Select, SelectItem } from "@heroui/react";
import DICT from "./dict"; // Assuming DICT is in the same directory or adjust path

// Basic type definitions - These might need refinement based on actual data structure
interface Node {
  nodeId: string;
  id: string; // Assuming id is needed for setTarget logic
  label: string;
  chosen: boolean;
  // Add other properties if they exist and are used
}

interface Target {
  node: Node;
  id: string;
}

interface Data {
  nodes: Node[];
  // Add other properties from the 'data' prop if needed by this component
}

// Assuming selectTarget in Feedback's content has at least a 'show' property
interface SelectTargetContent {
    show?: boolean; // Make optional if it might not exist
    // Define other properties if needed, e.g., header, body, etc.
}

interface SelectTargetNodeProps {
  data: Data;
  target: Target;
  setTarget: React.Dispatch<React.SetStateAction<Target>>;
  lang: keyof typeof DICT; // Use keyof typeof DICT for better type safety
  content: SelectTargetContent | undefined; // Assuming selectTarget might be undefined
}

const SelectTargetNode: React.FC<SelectTargetNodeProps> = ({
  data,
  target,
  setTarget,
  lang,
  content,
}) => {
  if (!content?.show) {
    return null; // Don't render if show is false or content is undefined
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
            // Find the corresponding node in the original data to get its 'id'
            // This assumes the 'id' needed for setTarget is the one associated with the node in the main data.nodes array
            const originalNode = data.nodes.find((d: Node) => d.nodeId === newNode.nodeId);
            if (originalNode) {
                setTarget({
                    node: newNode, // Use the found node object
                    id: originalNode.id, // Use the id from the original node data
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