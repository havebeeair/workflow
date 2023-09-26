import React from "react";
import TriggerNode from "./TriggerNode";
import ConditionNode from "./ConditionNode";
import ActionNode from "./ActionNode";
import PlaceholderNode from "./PlaceholderNode";
import { DummyTriggerNode } from "./DummyTriggerNode";
import EndNode from "./EndNode";

export const nodeTypes = {
  trigger: (trigger) => <TriggerNode currentNode={trigger} />,
  condition: (condition) => <ConditionNode currentNode={condition} />,
  action: (action) => <ActionNode currentNode={action} />,
  placeholder: (placeholder) => <PlaceholderNode currentNode={placeholder} />,
  dummytrigger: (dummytrigger) => (
    <DummyTriggerNode currentNode={dummytrigger} />
  ),
  endNode: (endNode) => <EndNode currentNode={endNode} />
};
