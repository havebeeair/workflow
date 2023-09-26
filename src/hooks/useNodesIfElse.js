import { useCallback } from "react";
import { useReactFlow, getOutgoers } from "reactflow";
import { createPlaceholderNode } from "../utils";

function useNodesIfClick() {
  const { setEdges, setNodes, getNodes, getEdges, getNode } = useReactFlow();
  const onClick = useCallback(
    (nodeDetails) => {
      const {
        type,
        id,
        title = null,
        description = null,
        configurationParameters = null,
        icon = null,
        configurationName = null,
        reactflowType = null
      } = nodeDetails;

      const currentNode = getNode(id);

      if (!currentNode) {
        return;
      }

      const childPlaceholderNode1 = createPlaceholderNode(currentNode);

      const childPlaceholderNode2 = createPlaceholderNode(currentNode);

      const childPlaceholderEdge1 = {
        id: `${id}->${childPlaceholderNode1.id}`,
        source: id,
        target: childPlaceholderNode1.id,
        type: "placeholder",
        style: {
          stroke: "#13C2C2"
        },
        data: {
          text: "YES",
          showButton: false
        }
      };

      const childPlaceholderEdge2 = {
        id: `${id}->${childPlaceholderNode2.id}`,
        source: id,
        target: childPlaceholderNode2.id,
        type: "placeholder",
        style: {
          stroke: "#CF1322"
        },
        data: {
          text: "NO",
          showButton: false
        }
      };

      setNodes((nodes) =>
        nodes
          .map((node) => {
            if (node.id === id) {
              node = {
                ...node,
                type: type.toLowerCase(),
                data: {
                  ...node.data,
                  title_detail: {
                    title_text: title,
                    icon: icon
                  },
                  data: {
                    description: {
                      html: description
                    },
                    configuration_name: configurationName,
                    configuration_parameters: configurationParameters
                  },
                  type: type.toLowerCase(),
                  reactflowType: type.toLowerCase(),
                  children: [childPlaceholderNode1.id, childPlaceholderNode2.id]
                }
              };
            }
            return node;
          })
          .concat([childPlaceholderNode1, childPlaceholderNode2])
      );

      setEdges((edges) =>
        edges
          .map((edge) => {
            if (edge.target === id) {
              edge.type = "buttonedge";
            }
            return edge;
          })
          .concat([childPlaceholderEdge1, childPlaceholderEdge2])
      );
    },
    [getEdges, getNode, getNodes, setEdges, setNodes]
  );
  return onClick;
}

export default useNodesIfClick;
