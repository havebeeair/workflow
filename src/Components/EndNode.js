import { Handle, Position } from "reactflow";
import React, { memo } from "react";
import { Tag, Tooltip } from "antd";
const EndNode = () => {
  return (
    <div className="end-node">
      <Handle className="handle" type="target" position={Position.Top} />
      <Tooltip title="Automation ends here" placement="bottom">
        <Tag color="default">END</Tag>
      </Tooltip>
    </div>
  );
};

export default memo(EndNode);
