import React, { useState, useEffect, useRef } from "react";
import ReactFlow, {
  Controls,
  Background,
  useNodesState,
  useEdgesState
} from "reactflow";
import "reactflow/dist/style.css";
import { initialNodes } from "./InitialNodes";
import { nodeTypes } from "./NodeTypes";
import { edgeTypes } from "./EdgeTypes";
import useAutoLayout from "../hooks/useAutoLayout";
import "../styles.css";
import useMouseTracker from "../hooks/useMouseTracker";

const Flow = (props) => {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [rfInstance, setRfInstance] = useState(null);
  const detectHoveronEdge = useMouseTracker();
  const initial_load = useRef(null);

  const layout = useAutoLayout();
  layout();

  useEffect(() => {
    if (props.id) {
      CollectDataFromBackend(props?.editable);
    }
  }, [props.id, props.nodes, props.edges]);

  useEffect(() => {
    if (!initial_load.current && rfInstance) {
      rfInstance?.zoomTo(1);
      initial_load.current = true;
    }
  }, [rfInstance]);

  const proOptions = { hideAttribution: true };
  const fitViewOptions = {
    padding: 0.95
  };

  const CollectDataFromBackend = (isEdit) => {
    const nodesFromBackend = props?.nodes;
    let nodesForFrontend = [];
    if (nodesFromBackend) {
      for (let key in nodesFromBackend) {
        nodesForFrontend.push(nodesFromBackend[key]);
      }
      if (!isEdit) {
        nodesForFrontend = nodesForFrontend.filter(
          (node) => node.reactflowType?.toLowerCase() != "placeholder"
        );
      }
      const modifiedNodes = nodesForFrontend.map((node) => ({
        position: { x: 0, y: 0 }, // AutoLayout hook helps in positioning of the nodes
        data: node,
        type: node.reactflowType?.toLowerCase(),
        id: node.id
      }));
      setNodes(modifiedNodes);
      setEdges(props.edges);
    }
  };

  const trackMouseEnter = (event, edge) => {
    detectHoveronEdge(edge.id, true);
  };
  const trackMouseLeave = (event, edge) => {
    detectHoveronEdge(edge.id, false);
  };

  const onInit = (instance) => {
    setRfInstance(instance);
    setTimeout(() => instance.fitView(), 0);
  };

  return (
    <>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        onInit={onInit}
        fitView
        proOptions={proOptions}
        minZoom={0.2}
        fitViewOptions={fitViewOptions}
        nodesDraggable={false}
        nodesConnectable={false}
        zoomOnDoubleClick={false}
        onEdgeMouseEnter={(event, id) => trackMouseEnter(event, id)}
        onEdgeMouseLeave={(event, id) => trackMouseLeave(event, id)}
        // fitbounds={{ x: 500, y: 0, width: 300, height: 300 }}
      >
        {/* <div className="save__controls">
          <button onClick={() => console.log(rfInstance?.getZoom())}>
            Get Zoom
          </button>
          <button onClick={() => rfInstance?.zoomTo(1, { duration: 400 })}>
            Set Zoom
          </button>
        </div> */}
        <Background />
        <Controls showInteractive={false} />
      </ReactFlow>
    </>
  );
};

export default Flow;
