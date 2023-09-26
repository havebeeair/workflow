import _ from "lodash";

export const generateUniqueId = () => {
  const timestamp = Date.now();
  const random = _.uniqueId();
  const uniqueId = timestamp.toString() + random.toString();
  return uniqueId;
};

export const createPlaceholderNode = (parent) => {
  const newPlaceholderId = generateUniqueId();
  return {
    id: newPlaceholderId,
    data: {
      title_detail: {
        title_text: "placeholder",
        icon: "icon"
      },
      data: {
        description: {
          html: "placeholder"
        },
        configuration_name: "placeholder",
        configuration_parameters: {
          tag_id: ""
        }
      },
      type: "placeholder",
      id: newPlaceholderId,
      parent: parent.id,
      children: [],
      is_root: false,
      is_leaf: true,
      is_valid: true,
      is_deleted: false,
      errors: {},
      reactflowType: "placeholder"
    },
    position: {
      x: parent.position.x,
      y: parent.position.y + 50
    },
    type: "placeholder"
  };
};

export const NameGenerator = () => {
  const date = new Date();
  const options = {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit"
  };
  const dateString = date.toLocaleDateString("en-US", options);
  return dateString;
};
