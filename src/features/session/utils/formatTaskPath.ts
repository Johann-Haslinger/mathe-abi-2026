export function formatTaskPath(
  input:
    | {
        problemIdx: number;
        subproblemLabel?: string | null;
        subsubproblemLabel?: string | null;
      }
    | null
    | undefined,
  taskDepth?: 1 | 2 | 3,
) {
  if (!input) return '';
  const p = Number.isFinite(input.problemIdx) ? String(input.problemIdx) : '';
  const s1 = ((input as { subproblemLabel?: string | null }).subproblemLabel ?? '').trim();
  const s2 = ((input as { subsubproblemLabel?: string | null }).subsubproblemLabel ?? '').trim();

  const includeS1 = taskDepth ? taskDepth >= 2 : Boolean(s1);
  const includeS2 = taskDepth ? taskDepth >= 3 : Boolean(s2);

  return [p, includeS1 ? s1 : '', includeS2 ? s2 : ''].filter(Boolean).join('.');
}
