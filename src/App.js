import Flow from "./Components/Flow";
import { ReactFlowProvider } from "reactflow";

export default function App() {
  return (
    <div className="App">
      <ReactFlowProvider>
        <div style={{ width: "100%", height: "100vh" }}>
          <Flow />
        </div>
      </ReactFlowProvider>
    </div>
  );
}
