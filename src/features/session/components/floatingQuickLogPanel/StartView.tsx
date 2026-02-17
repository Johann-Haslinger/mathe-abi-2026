import { Info, Minus, Plus } from 'lucide-react';
import { useStudyStore } from '../../stores/studyStore';
import { PanelViewHeader, type DragGripProps } from './PanelViewHeader';
import { HighlightText, MutedText, PanelHeading } from './TextHighlight';
import { PrimaryViewerPanelButton } from './ViewerPanelButtons';

export function StartView(props: {
  assetId: string;
  pageNumber: number;
  subjectId: string;
  topicId: string;
  gripProps: DragGripProps;
  onStarted: () => void;
}) {
  const { problemIdx, subproblemLabel, setProblemIdx, setSubproblemLabel, startAttempt } =
    useStudyStore();

  const subLabel = normalizeLabel(subproblemLabel);
  const canDecProblem = problemIdx > 1;
  const canIncProblem = problemIdx < 999;

  const canDecSub = subLabel !== 'a';
  const canIncSub = subLabel !== 'z';

  return (
    <>
      <PanelViewHeader
        left={
          <PanelHeading>
            <MutedText>Diese Aufgabe </MutedText>
            <HighlightText>Starten?</HighlightText>
          </PanelHeading>
        }
        right={
          <button
            type="button"
            className="inline-flex size-8 items-center justify-center rounded-full bg-white/5 text-white/70 hover:bg-white/10 hover:text-white/90"
            aria-label="Info"
            title="Info"
            onClick={() => {}}
          >
            <Info className="size-4" />
          </button>
        }
      />

      <div className="mt-5 space-y-2">
        <Row
          label="Aufgabe"
          right={
            <Stepper
              value={String(problemIdx)}
              decDisabled={!canDecProblem}
              incDisabled={!canIncProblem}
              onDec={() => setProblemIdx(Math.max(1, problemIdx - 1))}
              onInc={() => setProblemIdx(Math.min(999, problemIdx + 1))}
            />
          }
        />

        <Row
          label="Teilaufgabe"
          right={
            <Stepper
              value={subLabel}
              decDisabled={!canDecSub}
              incDisabled={!canIncSub}
              onDec={() => setSubproblemLabel(prevLabel(subLabel))}
              onInc={() => setSubproblemLabel(nextLabel(subLabel))}
            />
          }
        />
      </div>

      <div className="mt-8 flex items-center justify-end gap-2">
        <PrimaryViewerPanelButton
          onClick={() => {
            startAttempt({ assetId: props.assetId });
            props.onStarted();
          }}
        >
          Starten
        </PrimaryViewerPanelButton>
      </div>
    </>
  );
}

function Row(props: { label: string; right: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between gap-3">
      <MutedText className="text-sm font.medium">{props.label}</MutedText>
      {props.right}
    </div>
  );
}

function Stepper(props: {
  value: string;
  decDisabled: boolean;
  incDisabled: boolean;
  onDec: () => void;
  onInc: () => void;
}) {
  return (
    <div className="inline-flex items-center gap-1 rounded-full p-1">
      <div className="min-w-10 px-2 text-center text-sm font-semibold text-white tabular-nums">
        {props.value}
      </div>
      <div>
        <IconButton
          disabled={props.decDisabled}
          ariaLabel="Decrease"
          onClick={props.onDec}
          className="w-8"
        >
          <Minus className="size-4" />
        </IconButton>
      </div>
      <div>
        <IconButton
          disabled={props.incDisabled}
          ariaLabel="Increase"
          onClick={props.onInc}
          className="w-8"
        >
          <Plus className="size-4" />
        </IconButton>
      </div>
    </div>
  );
}

function IconButton(props: {
  disabled?: boolean;
  ariaLabel: string;
  onClick: () => void;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <button
      type="button"
      disabled={props.disabled}
      aria-label={props.ariaLabel}
      onClick={props.onClick}
      className={`${props.className} inline-flex size-7 bg-white/5 border-[0.5px] hover:scale-105 active:scale-95 border-white/5 active:bg-white/2 transition-all duration-100 items-center justify-center rounded-full text-white/80 hover:bg-white/10 hover:text-white disabled:opacity-40 disabled:hover:bg-transparent`}
    >
      {props.children}
    </button>
  );
}

function normalizeLabel(label: string) {
  const l = label.trim().toLowerCase();
  if (l.length !== 1) return l || 'a';
  const c = l.charCodeAt(0);
  if (c < 97 || c > 122) return l;
  return l;
}

function nextLabel(label: string) {
  const l = normalizeLabel(label);
  const c = l.charCodeAt(0);
  if (c < 97 || c > 122) return l;
  if (c === 122) return 'z';
  return String.fromCharCode(c + 1);
}

function prevLabel(label: string) {
  const l = normalizeLabel(label);
  const c = l.charCodeAt(0);
  if (c < 97 || c > 122) return l;
  if (c === 97) return 'a';
  return String.fromCharCode(c - 1);
}
