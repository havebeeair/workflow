import { Handle, Position, useReactFlow } from "reactflow";
import React, { memo, useEffect, useState } from "react";
import { EditIcon } from "../assets/EditIcon";
import { DeleteIcon } from "../assets/DeleteIcon";
import { ActionIcon } from "../assets/ActionIcon";
import { TagIcon } from "../assets/TagIcon";
import useDeleteClick from "../hooks/useDeleteClick";
import useAutoLayout from "../hooks/useAutoLayout";

const CustomOutputNodes = ({ currentNode }) => {
  const deleteNode = useDeleteClick();
  const { setNodes } = useReactFlow();
  const modifyNodeData = () => {
    setNodes((nodes) =>
      nodes.map((node) => {
        if (node.id === currentNode.id) {
          const html = node?.data?.description?.html ?? "";
          node.data = {
            ...node.data,
            description: {
              html:
                "Now the node is edited and node height is increasing " + html
            }
          };
        }
        return node;
      })
    );
  };
  return (
    <div className={"node-" + currentNode.data.type + "-container"}>
      <div className="node-body">
        <p className="node-type">
          <ActionIcon />
          {currentNode.data.type}
        </p>
        <div className="custom-node">
          <div className="title-btns">
            <p className="node-title">
              <TagIcon />
              {currentNode.data.label}
            </p>
            <div className="btns-box">
              <button className="edit-button" onClick={() => modifyNodeData()}>
                <EditIcon />
              </button>
              <button
                className="delete-button"
                onClick={() =>
                  deleteNode(currentNode.id, currentNode.data.type)
                }
              >
                <DeleteIcon />
              </button>
            </div>
          </div>
          <Handle className="handle" type="target" position={Position.Top} />
          <div className="node-info">
            {currentNode.id}
            {currentNode?.data?.description?.html}
          </div>
          <Handle className="handle" type="source" position={Position.Bottom} />
        </div>
      </div>
    </div>
  );
};

export default memo(CustomOutputNodes);
