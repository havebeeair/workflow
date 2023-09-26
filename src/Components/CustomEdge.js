import React from "react";
import { getSmoothStepPath, EdgeLabelRenderer } from "reactflow";
import { TypeSelectionModal } from "./TypeSelectionmodal";
const foreignObjectSize = 42;

export const CustomEdge = ({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  style = {},
  markerEnd,
  source,
  target,
  data
}) => {
  const [edgePath, labelX, labelY] = getSmoothStepPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition
  });

  const FOREIGNOBJECTSIZE = 42;

  const rotateAngle = () => {
    const myPath = document.getElementById(id);
    const pathLength = myPath.getTotalLength();
    const centre = pathLength / 2;
    const p1 = myPath.getPointAtLength(centre - 10);
    const p2 = myPath.getPointAtLength(centre - 10);
    const angle = (Math.atan2(p2.y - p1.y, p2.x - p1.x) * 180) / Math.PI;
    return angle;
  };

  const AddOperations = (type) => {
    data.addNodeBetweenNodes(source, target, id, type);
  };
  const getPosition = (labelX, labelY) => {
    let transform = `translate(-50%, -50%) translate(${labelX}px,${labelY}px)`;
    let x = labelX - FOREIGNOBJECTSIZE / 2;
    let y = labelY - FOREIGNOBJECTSIZE / 2;
    if (data?.text === "YES") {
      transform = `translate(-50%, -60%) translate(${labelX + 45}px,${
        labelY - 10
      }px)`;
      // x = labelX - 1.75 * FOREIGNOBJECTSIZE;
      // y = labelY - FOREIGNOBJECTSIZE / 8;
    } else if (data?.text === "NO") {
      transform = `translate(-50%, -60%) translate(${labelX - 45}px,${
        labelY - 10
      }px)`;
      // x = labelX + FOREIGNOBJECTSIZE / 1.3;
      // y = labelY - FOREIGNOBJECTSIZE / 8;
    }
    return { transform, x, y };
  };
  return (
    <>
      <path
        style={style}
        className="react-flow__edge-path-selector"
        d={edgePath}
        markerEnd={markerEnd}
      />
      <path
        id={id}
        style={style}
        className="react-flow__edge-path"
        d={edgePath}
        markerEnd={markerEnd}
      />
      <foreignObject
        width={600}
        height={200}
        x={getPosition(labelX, labelY).x}
        y={getPosition(labelX, labelY).y}
        className="edgebutton-foreignobject"
        requiredExtensions="http://www.w3.org/1999/xhtml"
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
                zIndex: 1,
                color: style.stroke
              }}
              className="nodrag nopan"
            >
              {data?.text}
            </div>
          </EdgeLabelRenderer>
        )}
        <div className="custom-edge-button">
          <TypeSelectionModal id={id} source={source} />
        </div>
      </foreignObject>
    </>
  );
};
