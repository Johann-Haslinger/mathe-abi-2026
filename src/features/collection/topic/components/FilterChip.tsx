export function FilterChip(props: { active: boolean; label: string; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={props.onClick}
      className={
        props.active
          ? 'rounded-md bg-black dark:bg-white px-3 py-2 text-xs font-semibold text-white dark:text-black'
          : 'rounded-md bg-black/5 dark:bg-white/5 px-3 py-2 text-xs font-semibold text-black dark:text-white hover:bg-slate-900 hover:text-slate-50'
      }
    >
      {props.label}
    </button>
  );
}
