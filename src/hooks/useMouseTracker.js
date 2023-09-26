import { useReactFlow } from "reactflow";

const useMouseTracker = () => {
  const { setEdges } = useReactFlow();
  const detectHovevOnEdge = (id, state) => {
    setEdges((edges) =>
      edges.map((edge) => {
        if (edge.id === id) {
          edge.data = { ...edge.data, showButton: state };
        }
        return edge;
      })
    );
  };
  return detectHovevOnEdge;
};

export default useMouseTracker;
