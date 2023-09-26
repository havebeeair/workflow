import React, { useState } from "react";
import { PlusIcon } from "../assets/PlusIcon";
import { ConditionIcon } from "../assets/ConditionIcon";
import { ActionIcon } from "../assets/ActionIcon";
import useEdgeClick from "../hooks/useEdgeClick";

export const TypeSelectionModal = (props) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [nodeType, setNodeType] = useState("");
  const addNodebetweenNodes = useEdgeClick();

  const showModal = (event) => {
    event.stopPropagation();
    setIsModalOpen(!isModalOpen);
  };

  const AddOperations = (nodeDetails) => {
    setIsModalOpen(false);
    addNodebetweenNodes(nodeDetails, props.id);
  };

  return (
    <>
      <button className="edgebutton" onClick={showModal}>
        <PlusIcon size={10} />
      </button>
      {isModalOpen && (
        <div
          className="select-node-type"
          style={{ display: "flex", flexDirection: "column" }}
        >
          <p onClick={() => AddOperations({ type: "condition" })}>
            <ConditionIcon />
            Condition
          </p>
          <p onClick={() => AddOperations({ type: "action" })}>
            <ActionIcon />
            Action
          </p>
          <p onClick={() => AddOperations({ type: "condition" })}>
            <ConditionIcon />
            If/Else
          </p>
        </div>
      )}
    </>
  );
};
