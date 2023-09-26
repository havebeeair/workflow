import { Handle, Position, useReactFlow } from "reactflow";
import React, { memo, useState, useEffect } from "react";
import { EditIcon } from "../assets/EditIcon";
import { DeleteIcon } from "../assets/DeleteIcon";
import { TriggerIcon } from "../assets/TriggerIcon";
import { TagIcon } from "../assets/TagIcon";
import useDeleteClick from "../hooks/useDeleteClick";
import { Tooltip } from "antd";

const CustomInputNodes = ({ currentNode }) => {
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
      <p
        style={{
          textAlign: "center",
          margin: "0 0 24px",
          textTransform: "uppercase",
          fontSize: "12px",
          lineHeight: "20px",
          color: "rgba(0, 0, 0, 0.44)"
        }}
      >
        Your automation starts here
      </p>
      <div className="node-body">
        <p className="node-type">
          <TriggerIcon />
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
          <div className="node-info">
            <TagIcon />
            <Tooltip title={currentNode.id} placement={"top"}>
              {currentNode.id}
              {currentNode?.data?.description?.html}
            </Tooltip>
            is the id of this node
          </div>
          <Handle className="handle" type="source" position={Position.Bottom} />
        </div>
      </div>
    </div>
  );
};

export default memo(CustomInputNodes);
