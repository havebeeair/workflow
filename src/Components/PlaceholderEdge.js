import React from "react";
import { getSmoothStepPath, EdgeLabelRenderer } from "reactflow";

export default function PlaceholderEdge({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  style,
  markerEnd,
  data
}) {
  const [edgePath, labelX, labelY] = getSmoothStepPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition
  });
  return (
    <path
      id={id}
      style={style}
      className="react-flow__edge-path"
      d={edgePath}
      markerEnd={markerEnd}
    >
      {data?.text && (
        <EdgeLabelRenderer>
          <div
            style={{
              position: "absolute",
              transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px)`,
              background: "#eee",
              padding: "2px 8px",
              borderRadius: 5,
              fontSize: 16,
              fontWeight: 600,
              color: style.stroke
            }}
            className="nodrag nopan"
          >
            {data?.text}
          </div>
        </EdgeLabelRenderer>
      )}
    </path>
  );
}
