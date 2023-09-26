import { useReactFlow, getOutgoers } from "reactflow";
import { createPlaceholderNode } from "../utils";

const useDeleteClick = () => {
  const { setEdges, setNodes, getNode, getNodes, getEdges } = useReactFlow();

  const deleteNode = (id, type) => {
    const nodeTobeDeleted = getNode(id);
    const deletedNodeParentId = nodeTobeDeleted.data.parent;
    let deletedNodeChildIds = nodeTobeDeleted.data.children;
    const parentNode = getNode(deletedNodeParentId);
    const KEEP_YES_NODES = false;
    const KEEP_NO_NODES = false;
    let conditionChildsToBeDeleted = [];
    const placeholderNode = createPlaceholderNode(parentNode);
    const placeholderEdge = {
      id: `${deletedNodeParentId}->${placeholderNode.id}`,
      source: deletedNodeParentId,
      target: placeholderNode.id,
      type: "placeholder",
      data: {
        showButton: false
      }
    };
    const getAllOutgoers = (node, nodes, edges, prevOutgoers = []) => {
      if (!node) {
        return [];
      }
      const outgoers = getOutgoers(node, nodes, edges);
      return outgoers.reduce((memo, outgoer) => {
        memo.push(outgoer);

        if (prevOutgoers.findIndex((n) => n.id == outgoer.id) == -1) {
          prevOutgoers.push(outgoer);

          getAllOutgoers(outgoer, nodes, edges, prevOutgoers).forEach(
            (foundNode) => {
              memo.push(foundNode);

              if (prevOutgoers.findIndex((n) => n.id == foundNode.id) == -1) {
                prevOutgoers.push(foundNode);
              }
            }
          );
        }
        return memo;
      }, []);
    };

    const isYesNode = (nodeId) => {
      const allEdges = getEdges();
      let itIsYesNode = false;
      allEdges.forEach((edge) => {
        if (edge.target === nodeId) {
          itIsYesNode = edge.data.text === "YES" ? true : false;
          return;
        }
      });
      return itIsYesNode;
    };

    const getYesNode = () => {
      let yesNode = {};
      deletedNodeChildIds.forEach((childId) => {
        if (isYesNode(childId)) {
          yesNode = getNode(childId);
          return;
        }
      });
      return yesNode;
    };

    const getNoNode = () => {
      let noNode = {};
      deletedNodeChildIds.forEach((childId) => {
        if (!isYesNode(childId)) {
          noNode = getNode(childId);
          return;
        }
      });
      return noNode;
    };

    const yesNode = getYesNode();
    const noNode = getNoNode();

    const getYesdescendants = () => {
      return getAllOutgoers(yesNode, getNodes(), getEdges());
    };

    const getNodescendants = () => {
      return getAllOutgoers(noNode, getNodes(), getEdges());
    };

    if (type === "trigger") {
      setNodes((nds) =>
        nds.map((node) => {
          if (node.id === id) {
            node.type = "dummytrigger";
            node.data.reactflowType = "dummytrigger";
            node.position.y = 0;
          }
          return node;
        })
      );
      return;
    }
    if (type == "condition") {
      if (KEEP_YES_NODES) {
        deletedNodeChildIds = [yesNode.id];
        conditionChildsToBeDeleted = [noNode, ...getNodescendants(noNode.id)];
      } else if (KEEP_NO_NODES) {
        deletedNodeChildIds = [noNode.id];
        conditionChildsToBeDeleted = [
          yesNode,
          ...getYesdescendants(yesNode.id)
        ];
      } else if (!KEEP_NO_NODES && !KEEP_YES_NODES) {
        deletedNodeChildIds = [];
        conditionChildsToBeDeleted = [
          ...getNodescendants(noNode.id),
          ...getYesdescendants(yesNode.id),
          noNode,
          yesNode
        ];
      }
    }
    if (parentNode.type === "condition") {
      const allNodes = getNodes();
      let afterDeleteNodes = allNodes;
      let grandChildIds = [];
      let allEdges = getEdges();
      let EdgesAfterUpdate = allEdges;
      if (isYesNode(id)) {
        let deletedNodeChild = getNode(deletedNodeChildIds[0]);
        if (!deletedNodeChild) {
          deletedNodeChild = placeholderNode;
        }
        grandChildIds = deletedNodeChild.data.children;
        afterDeleteNodes = afterDeleteNodes.map((node) => {
          if (node.id == id) {
            node = {
              ...node,
              data: {
                ...deletedNodeChild.data,
                id: node.id,
                parent: deletedNodeParentId
              },
              type: deletedNodeChild.type
            };
          }
          return node;
        });
        // Updating the grand Child nodes parent as deleted node instead of deleted node child
        if (grandChildIds.length) {
          afterDeleteNodes = afterDeleteNodes.map((node) => {
            grandChildIds.forEach((id) => {
              if (id == node.id) {
                node = {
                  ...node,
                  data: {
                    ...node.data,
                    parent: nodeTobeDeleted.id
                  }
                };
              }
            });
            return node;
          });
        }
        // Deleting the deleted Node childId
        afterDeleteNodes = afterDeleteNodes.filter(
          (node) => node.id !== deletedNodeChild.id
        );
        // keeping only the user selected childs
        afterDeleteNodes = afterDeleteNodes.filter(
          (node) => !conditionChildsToBeDeleted.find(({ id }) => node.id === id)
        );
        EdgesAfterUpdate = EdgesAfterUpdate.filter(
          (edge) =>
            !conditionChildsToBeDeleted.find(({ id }) => edge.target === id)
        );
        EdgesAfterUpdate = EdgesAfterUpdate.map((edge) => {
          if (edge.target === id) {
            edge = {
              ...edge,
              type:
                deletedNodeChild.type === "placeholder"
                  ? "placeholder"
                  : edge.type
            };
          }
          return edge;
        });
        if (grandChildIds.length) {
          EdgesAfterUpdate = EdgesAfterUpdate.map((edge) => {
            grandChildIds.forEach((child) => {
              if (edge.target === child) {
                edge = {
                  ...edge,
                  source: id
                };
              }
              return;
            });
            return edge;
          });
        }
        EdgesAfterUpdate = EdgesAfterUpdate.filter(
          (edge) => edge.source !== deletedNodeChild.id
        ).filter((edge) => edge.target !== deletedNodeChild.id);

        // if (grandChildIds.length) {
        //   EdgesAfterUpdate = EdgesAfterUpdate.map((edge) => {
        //     grandChildIds.forEach((childId) => {
        //       if (edge.target === childId) {
        //         edge = {
        //           ...edge,
        //           source: id
        //         };
        //       }
        //     });
        //     return edge;
        //   });
        // }
        // EdgesAfterUpdate = EdgesAfterUpdate.filter(
        //   (edge) =>
        //     !conditionChildsToBeDeleted.find(
        //       (childId) => edge.target === childId
        //     )
        // );
      } else {
        // afterDeleteNodes = allNodes
        //   .map((node) => {
        //     deletedNodeChildIds.forEach((deletedChildId) => {
        //       if (node.id === deletedChildId) {
        //         node.data.parent = parentNode.id;
        //       }
        //     });
        //     if (node.id === parentNode.id) {
        //       const updatedChildren = node.data.children.filter(
        //         (child) => child !== id
        //       );
        //       node.data.children = [...updatedChildren, ...deletedNodeChildIds];
        //     }
        //     return node;
        //   })
        //   .filter((node) => node.id !== id);

        // EdgesAfterUpdate = allEdges
        //   .filter((edge) => edge.source !== id)
        //   .map((edge) => {
        //     if (edge.target === id) {
        //       edge = {
        //         ...edge,
        //         target: deletedNodeChildIds[0],
        //         type: "placeholder"
        //       };
        //     }
        //     return edge;
        //   });
        let deletedNodeChild = getNode(deletedNodeChildIds[0]);
        afterDeleteNodes = afterDeleteNodes
          .map((node) => {
            if (node.id === deletedNodeChild?.id) {
              node.data.parent = deletedNodeParentId;
            }
            if (node.id === deletedNodeParentId) {
              const updatedChildren = node.data.children.filter(
                (child) => child != id
              );
              if (deletedNodeChild) {
                node.data.children = [...updatedChildren, deletedNodeChild.id];
              } else {
                node.data.children = [...updatedChildren, placeholderNode.id];
              }
            }
            return node;
          })
          .filter((node) => node.id !== id);
        afterDeleteNodes = afterDeleteNodes.filter(
          (node) => !conditionChildsToBeDeleted.find(({ id }) => node.id === id)
        );
        if (!deletedNodeChild) {
          afterDeleteNodes = afterDeleteNodes.concat([placeholderNode]);
        }
        if (deletedNodeChild) {
          EdgesAfterUpdate = EdgesAfterUpdate.map((edge) => {
            if (edge.target === id) {
              edge = {
                ...edge,
                target: deletedNodeChild.id,
                type:
                  deletedNodeChild.type === "placeholder"
                    ? "placeholder"
                    : edge.type
              };
            }
            return edge;
          });
        }
        EdgesAfterUpdate = EdgesAfterUpdate.filter(
          (edge) => edge.source !== id
        );
        EdgesAfterUpdate = EdgesAfterUpdate.filter(
          (edge) => edge.target !== id
        );
        if (!deletedNodeChild) {
          EdgesAfterUpdate = EdgesAfterUpdate.concat([
            {
              ...placeholderEdge,
              data: { ...placeholderEdge.data, text: "NO" },
              style: {
                stroke: "#CF1322"
              }
            }
          ]);
        }
      }
      setNodes(afterDeleteNodes);
      setEdges(EdgesAfterUpdate);
    } else {
      let deletedNodeChild = getNode(deletedNodeChildIds[0]);
      let allNodes = getNodes();
      let allEdges = getEdges();

      allNodes = allNodes
        .filter((node) => node.id !== id)
        .map((node) => {
          if (node.id === deletedNodeParentId) {
            const updatedChildren = node.data.children.filter(
              (child) => child !== id
            );
            if (deletedNodeChild) {
              node.data.children = [...updatedChildren, deletedNodeChild.id];
            } else {
              node.data.children = [...updatedChildren, placeholderNode.id];
            }
          }
          if (node.id === deletedNodeChild?.id) {
            node.data.parent = deletedNodeParentId;
          }
          return node;
        })
        .filter(
          (node) =>
            !conditionChildsToBeDeleted.find(
              (conditionNodes) => node.id === conditionNodes.id
            )
        );
      if (!deletedNodeChild) {
        allNodes = allNodes.concat([placeholderNode]);
      }

      allEdges = allEdges
        .filter((edge) => edge.target !== id)
        .map((edge) => {
          if (edge.source === id) {
            edge.source = deletedNodeParentId;
            edge.data.text = "";
            delete edge.style;
          }
          return edge;
        })
        .filter(
          (edge) =>
            !conditionChildsToBeDeleted.find(({ id }) => edge.target === id)
        );
      if (!deletedNodeChild) {
        allEdges = allEdges.concat([placeholderEdge]);
      }
      setNodes(allNodes);
      setEdges(allEdges);
    }
  };
  return deleteNode;
};

export default useDeleteClick;
