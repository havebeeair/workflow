import React, { memo, useEffect, useState } from "react";
import { Handle, Position } from "reactflow";
import { PlusIcon } from "../assets/PlusIcon";
import { ConditionIcon } from "../assets/ConditionIcon";
import { ActionIcon } from "../assets/ActionIcon";
import useAddNode from "../hooks/useAddNode";
import useNodesIfClick from "../hooks/useNodesIfElse.js";

const PlaceholderNode = ({ currentNode }) => {
  const [showdropdown, setShowdropdown] = useState(false);
  const AddNode = useAddNode();
  const AddIfNode = useNodesIfClick();
  const AddOperations = (type) => {
    // console.log(type);
    setShowdropdown(false);
    type === "ifelse"
      ? AddIfNode({ type: "condition", id: currentNode.id })
      : AddNode({ type: type, id: currentNode.id });
  };

  return (
    <div className="dummy-container">
      <div className={"placeholder-node"}>
        <div onClick={() => setShowdropdown(!showdropdown)}>
          <PlusIcon size={12} />
          {currentNode.id}
        </div>
        <Handle
          className="handle"
          type="target"
          position={Position.Top}
          isConnectable={false}
        />
        <Handle
          className="handle"
          type="source"
          position={Position.Bottom}
          isConnectable={false}
        />
      </div>
      {showdropdown && (
        <div className="select-node-type">
          <p onClick={() => AddOperations("condition")}>
            <ConditionIcon />
            Condition
          </p>
          <p onClick={() => AddOperations("action")}>
            <ActionIcon />
            Action
          </p>
          <p onClick={() => AddOperations("ifelse")}>
            <ConditionIcon />
            If/Else
          </p>
        </div>
      )}
    </div>
  );
};

export default memo(PlaceholderNode);
