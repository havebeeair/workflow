export const initialNodes = [
  {
    id: "1677",
    position: { x: 0, y: 0 },
    data: {
      title_detail: {
        title_text: "First Node",
        icon: "icon"
      },
      data: {
        nature: "AND",
        rules: [
          {
            description: {
              html: "First Node"
            },
            configuration_name: "string",
            configuration_parameters: {
              tag_id: "",
              operator: "equals"
            }
          }
        ]
      },
      type: "trigger",
      reactflowType: "dummytrigger",
      id: "1677",
      parent: null,
      children: [],
      is_root: true,
      is_leaf: false,
      is_valid: true,
      is_deleted: false,
      errors: {}
    },
    type: "dummytrigger"
  }
];

export const placeholderNode = {
  id: "1234",
  data: {
    title_detail: {
      title_text: "First Node",
      icon: "icon"
    },
    data: {
      description: {
        html: "First Node"
      },
      configuration_name: "string",
      configuration_parameters: {
        tag_id: ""
      }
    },
    type: "trigger",
    reactflowType: "placeholder",
    id: "1234",
    parent: "1677",
    children: [],
    is_root: false,
    is_leaf: true,
    is_valid: true,
    is_deleted: false,
    errors: {}
  },
  position: { x: 0, y: 150 },
  type: "placeholder"
};
