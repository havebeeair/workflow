export const PlusIcon = (props) => {
  return (
    <svg
      width={props.size || "14"}
      height={props.size || "14"}
      viewBox="0 0 14 14"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M7 1V7M7 7V13M7 7H1M7 7H13"
        stroke="black"
        strokeOpacity="0.88"
        strokeWidth="1.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};
