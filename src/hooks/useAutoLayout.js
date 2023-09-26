import { useEffect, useRef } from "react";
import { useReactFlow, useStore, useNodesInitialized } from "reactflow";
import { stratify } from "d3-hierarchy";
import { flextree } from "d3-flextree";
import { timer } from "d3-timer";

const useAutoLayout = () => {
  const layout = flextree()
    .nodeSize((node) => [node.data.width, node.data.height + 50])
    .spacing(() => 1);

  const options = { duration: 300 };

  function layoutNodes(nodes, edges) {
    const hierarchy = stratify()
      .id((d) => d.id)
      .parentId((d) => edges.find((e) => e.target === d.id)?.source)(nodes);

    const root = layout(hierarchy);

    return root
      .descendants()
      .map((d) => ({ ...d.data, position: { x: d.x, y: d.y } }));
  }

  const nodeCountSelector = (state) => state.nodeInternals.size;
  function Layout() {
    const initial = useRef(true);

    const nodeCount = useStore(nodeCountSelector);

    const nodesInitialized = useNodesInitialized();

    const {
      getNodes,
      getNode,
      setNodes,
      setEdges,
      getEdges,
      fitView
    } = useReactFlow();

    const allNodes = getNodes();

    useEffect(() => {
      const nodes = getNodes();
      const edges = getEdges();

      if (nodeCount >= 2 && nodesInitialized) {
        const targetNodes = layoutNodes(nodes, edges);

        return setNodes(targetNodes);

        const transitions = targetNodes.map((node) => {
          return {
            id: node.id,
            from: getNode(node.id)?.position || node.position,
            to: node.position,
            node
          };
        });

        const t = timer((elapsed) => {
          const s = elapsed / options.duration;

          const currNodes = transitions.map(({ node, from, to }) => {
            return {
              id: node.id,
              position: {
                x: from.x + (to.x - from.x) * s,
                y: from.y + (to.y - from.y) * s
              },
              data: { ...node.data },
              type: node.type
            };
          });

          setNodes(currNodes);

          if (elapsed > options.duration) {
            const finalNodes = transitions.map(({ node, to }) => {
              return {
                id: node.id,
                position: {
                  x: to.x,
                  y: to.y
                },
                data: { ...node.data },
                type: node.type
              };
            });

            setNodes(finalNodes);

            t.stop();
            if (!initial.current) {
              fitView({ duration: 200, padding: 0.2 });
            }
            initial.current = false;
          }
        });

        return () => {
          t.stop();
        };
      }
    }, [nodeCount, nodesInitialized]);
  }
  return Layout;
};

export default useAutoLayout;

// import { useEffect } from "react";
// import {
//   Node,
//   Edge,
//   Position,
//   ReactFlowState,
//   useStore,
//   useReactFlow,
// } from "reactflow";
// import dagre from "dagre";

// const nodeCountSelector = (state) => state.nodeInternals.size;
// const nodesInitializedSelector = (state) =>
// Array.from(state.nodeInternals.values()).every(
//   (node) => node.width && node.height
//   );

//   function useAutoLayout(direction = "TB") {
//     const nodeCount = useStore(nodeCountSelector);
//     const nodesInitialized = useStore(nodesInitializedSelector);
//     const { getNodes, getEdges, setNodes, setEdges, fitView } = useReactFlow();

//     useEffect(() => {
//       // if (!nodeCount || !nodesInitialized) {
//       //   return;
//       // }

//     const dagreGraph = new dagre.graphlib.Graph();
//     dagreGraph.setDefaultEdgeLabel(() => ({}));
//     dagreGraph.setGraph({ rankdir: direction });

//     const nodes = getNodes();
//     const edges = getEdges();

//     nodes.forEach((node) => {
//       dagreGraph.setNode(node.id, {
//         width: node.width,
//         height: node.height,
//       });
//     });

//     edges.forEach((edge) => {
//       dagreGraph.setEdge(edge.source, edge.target);
//     });

//     dagre.layout(dagreGraph);

//     setNodes((nodes) =>
//       nodes.map((node) => {
//         const nodeWithPosition = dagreGraph.node(node.id);
//         node = {
//           ...node,
//           position: {
//             x: nodeWithPosition.x - node.width / 2,
//             y: nodeWithPosition.y - node.height / 2,
//           },
//           style: { ...node.style, opacity: 1 },
//         };
//         return node;
//       })
//     );
//   }, [
//     nodeCount,
//     nodesInitialized,
//     getNodes,
//     getEdges,
//     setNodes,
//     setEdges,
//     fitView,
//   ]);
// }

// export default useAutoLayout;
