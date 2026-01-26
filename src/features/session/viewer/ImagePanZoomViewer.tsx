import { ZoomIn, ZoomOut } from 'lucide-react'
import { useState } from 'react'

type Pan = { x: number; y: number }

export function ImagePanZoomViewer(props: { src: string; alt: string }) {
  const [scale, setScale] = useState(1)
  const [pan, setPan] = useState<Pan>({ x: 0, y: 0 })
  const [drag, setDrag] = useState<{ active: boolean; startX: number; startY: number; base: Pan }>(
    { active: false, startX: 0, startY: 0, base: { x: 0, y: 0 } },
  )

  function onPointerDown(e: React.PointerEvent) {
    if (e.button !== 0) return
    ;(e.currentTarget as HTMLElement).setPointerCapture(e.pointerId)
    setDrag({ active: true, startX: e.clientX, startY: e.clientY, base: pan })
  }

  function onPointerMove(e: React.PointerEvent) {
    if (!drag.active) return
    const dx = e.clientX - drag.startX
    const dy = e.clientY - drag.startY
    setPan({ x: drag.base.x + dx, y: drag.base.y + dy })
  }

  function onPointerUp(e: React.PointerEvent) {
    if (!drag.active) return
    try {
      ;(e.currentTarget as HTMLElement).releasePointerCapture(e.pointerId)
    } catch {
      // HINT: This can be ignored
    }
    setDrag((d) => ({ ...d, active: false }))
  }

  return (
    <div>
      <div className="mb-3 flex items-center gap-2">
        <button
          type="button"
          onClick={() => {
            setScale((s) => Math.max(0.5, Math.round((s - 0.25) * 100) / 100))
            setPan({ x: 0, y: 0 })
          }}
          className="inline-flex items-center gap-2 rounded-md bg-slate-800 px-3 py-2 text-sm font-semibold text-slate-50 hover:bg-slate-700"
        >
          <ZoomOut className="h-4 w-4" />
          Zoom
        </button>
        <button
          type="button"
          onClick={() => {
            setScale((s) => Math.min(4, Math.round((s + 0.25) * 100) / 100))
            setPan({ x: 0, y: 0 })
          }}
          className="inline-flex items-center gap-2 rounded-md bg-slate-800 px-3 py-2 text-sm font-semibold text-slate-50 hover:bg-slate-700"
        >
          <ZoomIn className="h-4 w-4" />
          Zoom
        </button>
        <div className="rounded-md bg-slate-900 px-3 py-2 text-sm text-slate-200">
          {Math.round(scale * 100)}%
        </div>
      </div>

      <div
        className="relative h-[70vh] overflow-hidden rounded-xl border border-slate-800 bg-slate-950"
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
        style={{ touchAction: 'none', cursor: drag.active ? 'grabbing' : 'grab' }}
      >
        <img
          src={props.src}
          alt={props.alt}
          className="absolute left-0 top-0 max-w-none select-none"
          draggable={false}
          style={{ transform: `translate(${pan.x}px, ${pan.y}px) scale(${scale})`, transformOrigin: '0 0' }}
        />
      </div>
    </div>
  )
}

