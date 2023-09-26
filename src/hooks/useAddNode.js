import { useReactFlow } from "reactflow";
import { createPlaceholderNode } from "../utils";

const useAddNode = () => {
  const { setEdges, setNodes, getNode, getNodes } = useReactFlow();

  const onClick = (nodeDetails) => {
    const {
      type,
      id,
      title = null,
      description = null,
      configurationParameters = null,
      icon = null,
      configurationName = null,
      reactflowType = null,
      nature = null
    } = nodeDetails;

    const parent = getNode(id);
    const newPlaceholderNode = createPlaceholderNode(parent);

    const newPlaceholderEdge = {
      id: `${id}->${newPlaceholderNode.id}`,
      source: id,
      target: newPlaceholderNode.id,
      type: "placeholder",
      data: {
        showButton: false
      }
    };
    let currentNodeIndex = "";
    const allNodes = getNodes().map((node, index) => {
      if (node.id === id) {
        currentNodeIndex = index;
        node = {
          ...node,
          type: type?.toLowerCase(),
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
            reactflowType: type?.toLowerCase(),
            children: [newPlaceholderNode.id],
            is_leaf: false
          }
        };
      }
      return node;
    });

    const nodesWithPlaceholder = [
      ...allNodes.slice(0, currentNodeIndex + 1),
      newPlaceholderNode,
      ...allNodes.slice(currentNodeIndex + 1, allNodes.length)
    ];

    setNodes(nodesWithPlaceholder);

    setEdges((edges) =>
      edges
        .map((edge) => {
          if (edge.target === id) {
            return {
              ...edge,
              type: "buttonedge"
            };
          }
          return edge;
        })
        .concat([newPlaceholderEdge])
    );
  };
  return onClick;
};

export default useAddNode;
