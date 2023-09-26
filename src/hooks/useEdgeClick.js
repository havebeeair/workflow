import { useReactFlow } from "reactflow";
import { createPlaceholderNode, generateUniqueId } from "../utils";

const useEdgeClick = () => {
  const { setEdges, setNodes, getNode, getEdge, getNodes } = useReactFlow();

  const addNodeBetweenNodes = (nodeDetails, edgeId) => {
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

    const edge = getEdge(edgeId);
    const sourceNode = getNode(edge.source);
    const targetNode = getNode(edge.target);

    if (!edge) {
      return;
    }

    if (!targetNode) {
      return;
    }

    const insertNodeId = generateUniqueId();
    let placeholderNode = [];
    let placeholderEdge = [];

    let insertNode = {
      id: insertNodeId,
      position: { x: targetNode.position.x, y: targetNode.position.y },
      data: {
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
        is_root: false,
        is_leaf: false,
        is_valid: true,
        is_deleted: false,
        errors: {},
        type: type?.toLowerCase(),
        reactflowType: reactflowType?.toLowerCase(),
        id: insertNodeId,
        parent: edge?.source,
        children: [edge.target]
      },
      type: type?.toLowerCase()
    };

    const sourceEdge = {
      ...getEdge(edgeId),
      id: `${edge.source}->${insertNodeId}`,
      source: edge.source,
      target: insertNodeId
    };

    const targetEdge = {
      id: `${insertNodeId}->${edge.target}`,
      source: insertNodeId,
      target: edge.target,
      type: "buttonedge",
      data: {
        showButton: false
      }
    };

    if (type === "condition") {
      placeholderNode = createPlaceholderNode(insertNode);
      insertNode.data.children.push(placeholderNode.id);
      placeholderEdge = {
        id: `${insertNodeId}->${placeholderNode.id}`,
        source: insertNodeId,
        target: placeholderNode.id,
        type: "placeholder",
        data: {
          showButton: false,
          text: "NO"
        },
        style: {
          stroke: "#CF1322"
        }
      };
      targetEdge["style"] = {
        stroke: "#13C2C2"
      };
      targetEdge["data"]["text"] = "YES";
    }

    setEdges((edges) =>
      edges
        .filter((e) => e.id !== edgeId)
        .concat([sourceEdge, targetEdge])
        .concat(placeholderEdge)
    );

    sourceNode.data.children = sourceNode.data.children.filter(
      (child) => child != targetNode.id
    );
    sourceNode.data.children.push(insertNodeId);
    targetNode.data.parent = insertNodeId;
    let allNodes = getNodes();
    allNodes = allNodes.map((node) => {
      if (node.id === edge.source) {
        node.data.children = sourceNode.data.children;
      }
      if (node.id === edge.target) {
        node.data.parent = insertNodeId;
      }
      return node;
    });
    let dataToSwap = {};
    if (edge.data.text === "YES") {
      allNodes = allNodes.map((node) => {
        if (node.id === edge.target) {
          dataToSwap = node;
          node = insertNode;
        }
        return node;
      });
      insertNode = dataToSwap;
    }
    allNodes = allNodes.concat(insertNode);
    if (type == "condition") {
      allNodes = allNodes.concat(placeholderNode);
    }
    setNodes(allNodes);
  };
  return addNodeBetweenNodes;
};

export default useEdgeClick;
