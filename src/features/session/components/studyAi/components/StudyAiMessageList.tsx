import type { StudyAiMessage } from '../../../stores/studyAiChatStore';

export function StudyAiMessageList(props: { messages: StudyAiMessage[]; compact?: boolean }) {
  if (props.messages.length === 0) {
    return (
      <div className="text-sm text-slate-200/80">
        Stell eine Frage zur Aufgabe. Ich nutze die PDF und deinen bisherigen Verlauf als Kontext.
      </div>
    );
  }

  return (
    <div className="space-y-3 w-full max-w-full">
      {props.messages.map((m) => (
        <div key={m.id} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
          <div
            className={[
              'rounded-2xl px-3 py-2 text-sm',
              props.compact ? 'text-[13px]' : '',
              'whitespace-pre-wrap break-words [overflow-wrap:anywhere]',
              m.role === 'user' ? 'bg-white/10 text-white max-w-[60%]' : 'mt-2',
            ].join(' ')}
          >
            {m.content}
          </div>
        </div>
      ))}
    </div>
  );
}
