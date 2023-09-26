import { Handle, Position } from "reactflow";
import { PlusIcon } from "../assets/PlusIcon";
import { useReactFlow } from "reactflow";
import { placeholderNode } from "./InitialNodes";
import { initialEdges } from "./InitialEdges";

export const DummyTriggerNode = ({ currentNode }) => {
  const { setNodes, setEdges } = useReactFlow();
  const addTrigger = () => {
    setNodes((nodes) =>
      nodes
        .map((node) => {
          if (node.id === currentNode.id) {
            node.type = "trigger";
          }
          return node;
        })
        .concat([placeholderNode])
    );
    setEdges((edges) => edges.concat(initialEdges));
  };
  return (
    <div className="dummy-container">
      <p className="automation-info">Your automation starts here</p>
      <div className="Dummy-trigger-node">
        <button onClick={() => addTrigger()}>
          <PlusIcon /> Add trigger
        </button>
        <Handle className="handle" type="source" position={Position.Bottom} />
      </div>
    </div>
  );
};
