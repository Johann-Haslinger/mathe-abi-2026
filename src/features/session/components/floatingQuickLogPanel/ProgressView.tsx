import { IoCheckmark } from 'react-icons/io5';
import { PrimaryButton, SecondaryButton } from '../../../../components/Button';
import { type DragGripProps } from './PanelViewHeader';

export function ProgressView(props: {
  gripProps: DragGripProps;
  onOpenDetails: () => void;
  onFinish: () => void;
}) {
  return (
    <div className="h-full">
      <div className="flex items-center gap-2">
        <SecondaryButton onClick={props.onOpenDetails}>Öffnen</SecondaryButton>
        <PrimaryButton icon={<IoCheckmark />} onClick={props.onFinish}></PrimaryButton>
      </div>
    </div>
  );
}
