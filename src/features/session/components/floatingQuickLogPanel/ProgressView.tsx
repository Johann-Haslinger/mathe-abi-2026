import { IoCheckmark } from 'react-icons/io5';
import { GhostButton, PrimaryButton } from '../../../../components/Button';
import { type DragGripProps } from './PanelViewHeader';

export function ProgressView(props: {
  gripProps: DragGripProps;
  onOpenDetails: () => void;
  onFinish: () => void;
}) {
  return (
    <div className="h-full">
      <div className="flex items-center gap-2">
        <GhostButton onClick={props.onOpenDetails}>Öffnen</GhostButton>
        <PrimaryButton icon={<IoCheckmark />} onClick={props.onFinish}></PrimaryButton>
      </div>
    </div>
  );
}
