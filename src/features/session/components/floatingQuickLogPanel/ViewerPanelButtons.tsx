export const PrimaryViewerPanelButton = (props: {
  children: React.ReactNode;
  onClick: () => void;
  icon?: React.ReactNode;
}) => {
  return (
    <button
      type="button"
      className="rounded-full bg-black dark:bg-white px-4 py-2 text-sm font-semibold text-white dark:text-black"
      onClick={props.onClick}
    >
      {props.icon && <div>{props.icon}</div>}
      {props.children}
    </button>
  );
};

export const SecondaryViewerPanelButton = (props: {
  children?: React.ReactNode;
  onClick: () => void;
  icon?: React.ReactNode;
}) => {
  return (
    <button
      type="button"
      className="rounded-full bg-white/10 px-2 py-2 text-sm font-medium text-white/80 hover:bg-white/15 hover:text-white"
      onClick={props.onClick}
    >
      {props.icon && <div> {props.icon}</div>}
      {props.children}
    </button>
  );
};

// const ViewerPanelButtonOutline = (props: {
//   children: React.ReactNode;
//   onClick: () => void;
//   icon?: React.ReactNode;
//   className?: string;
// }) => {
//   return (
//     <button
//       type="button"
//       className={`rounded-full border border-white/10 px-2 py-2 text-sm font-semibold text-white/80 hover:bg-white/15 hover:text-white ${props.className}`}
//       onClick={props.onClick}
//     >
//       {props.icon && <div>{props.icon}</div>}
//       {props.children}
//     </button>
//   );
// };
