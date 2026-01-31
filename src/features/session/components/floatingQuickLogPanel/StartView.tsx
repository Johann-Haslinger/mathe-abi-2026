import { Info, Minus, Plus } from 'lucide-react';
import { IoChevronBack } from 'react-icons/io5';
import { useNavigate } from 'react-router-dom';
import { useStudyStore } from '../../stores/studyStore';
import { formatExerciseStatus } from '../../viewer/viewerUtils';
import { PanelViewHeader, type DragGripProps } from './PanelViewHeader';
import { HighlightText, MutedText, PanelHeading } from './TextHighlight';
import { PrimaryViewerPanelButton, SecondaryViewerPanelButton } from './ViewerPanelButtons';

export function StartView(props: {
  assetId: string;
  pageNumber: number;
  subjectId: string;
  topicId: string;
  gripProps: DragGripProps;
  onStarted: () => void;
}) {
  const navigate = useNavigate();
  const {
    problemIdx,
    subproblemLabel,
    exerciseStatusByAssetId,
    setProblemIdx,
    setSubproblemLabel,
    startAttempt,
  } = useStudyStore();

  const exerciseStatus = exerciseStatusByAssetId[props.assetId] ?? 'unknown';

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
        gripProps={props.gripProps}
      />

      <div className="mt-2 flex items-center justify-between gap-2">
        <div className="inline-flex items-center gap-2 rounded-md bg-black/30 px-2 py-1 text-xs">
          <MutedText>Status</MutedText>
          <span className="text-white/90">{formatExerciseStatus(exerciseStatus)}</span>
        </div>
        <button
          type="button"
          className="inline-flex size-8 items-center justify-center rounded-md bg-white/5 text-white/70 hover:bg-white/10 hover:text-white/90"
          aria-label="Info"
          title="Info"
          onClick={() => {}}
        >
          <Info className="size-4" />
        </button>
      </div>

      <div className="mt-3 space-y-2">
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

      <div className="mt-3 flex items-center justify-end gap-2">
        <SecondaryViewerPanelButton
          onClick={() => navigate(`/subjects/${props.subjectId}/topics/${props.topicId}`)}
          icon={<IoChevronBack />}
        />

        <PrimaryViewerPanelButton
          onClick={() => {
            startAttempt();
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
      <MutedText className="text-xs font-semibold">{props.label}</MutedText>
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
    <div className="inline-flex items-center gap-1 rounded-md bg-white/5 p-1">
      <IconButton disabled={props.decDisabled} ariaLabel="Decrease" onClick={props.onDec}>
        <Minus className="size-4" />
      </IconButton>
      <div className="min-w-10 px-2 text-center text-sm font-semibold text-white tabular-nums">
        {props.value}
      </div>
      <IconButton disabled={props.incDisabled} ariaLabel="Increase" onClick={props.onInc}>
        <Plus className="size-4" />
      </IconButton>
    </div>
  );
}

function IconButton(props: {
  disabled?: boolean;
  ariaLabel: string;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      disabled={props.disabled}
      aria-label={props.ariaLabel}
      onClick={props.onClick}
      className="inline-flex size-8 items-center justify-center rounded-md text-white/80 hover:bg-white/10 hover:text-white disabled:opacity-40 disabled:hover:bg-transparent"
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
