import { ChevronLeft, ChevronRight, ZoomIn, ZoomOut } from 'lucide-react'
import {
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from 'react'
import { pdfjs } from './pdfjs'
import type { PDFDocumentProxy } from 'pdfjs-dist'

type PdfCanvasViewerProps = {
  data: Uint8Array
  pageNumber: number
  onPageNumberChange: (next: number) => void
  className?: string
}

type Pan = { x: number; y: number }

export function PdfCanvasViewer(props: PdfCanvasViewerProps) {
  const { data, pageNumber, onPageNumberChange } = props

  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const containerRef = useRef<HTMLDivElement | null>(null)

  const [doc, setDoc] = useState<PDFDocumentProxy | null>(null)
  const [numPages, setNumPages] = useState<number | null>(null)
  const [scale, setScale] = useState(1.25)
  const [pan, setPan] = useState<Pan>({ x: 0, y: 0 })
  const [drag, setDrag] = useState<{ active: boolean; startX: number; startY: number; base: Pan }>(
    { active: false, startX: 0, startY: 0, base: { x: 0, y: 0 } },
  )
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false
    const dataCopy = data.slice(0) 
    const task = pdfjs.getDocument({ data: dataCopy })
    setLoading(true)
    setError(null)
    setNumPages(null)
    setDoc(null)
    task.promise
      .then((doc) => {
        if (cancelled) return
        setDoc(doc)
        setNumPages(doc.numPages)
      })
      .catch((e) => {
        if (cancelled) return
        setError(e instanceof Error ? e.message : 'PDF Fehler')
      })
      .finally(() => {
        if (cancelled) return
        setLoading(false)
      })

    return () => {
      cancelled = true
    }
  }, [data])

  useEffect(() => {
    setPan({ x: 0, y: 0 })
  }, [pageNumber, scale])

  useLayoutEffect(() => {
    let cancelled = false
    async function render() {
      if (!canvasRef.current) return
      if (!doc) return
      setLoading(true)
      setError(null)
      try {
        const safePage = clamp(pageNumber, 1, doc.numPages)
        if (safePage !== pageNumber) onPageNumberChange(safePage)
        const page = await doc.getPage(safePage)
        if (cancelled) return

        const viewport = page.getViewport({ scale })
        const canvas = canvasRef.current
        const ctx = canvas.getContext('2d')
        if (!ctx) throw new Error('Canvas context missing')

        const dpr = window.devicePixelRatio || 1
        canvas.width = Math.floor(viewport.width * dpr)
        canvas.height = Math.floor(viewport.height * dpr)
        canvas.style.width = `${Math.floor(viewport.width)}px`
        canvas.style.height = `${Math.floor(viewport.height)}px`

        ctx.setTransform(dpr, 0, 0, dpr, 0, 0)

        const renderTask = page.render({ canvasContext: ctx, viewport, canvas })
        await renderTask.promise
      } catch (e) {
        if (!cancelled) setError(e instanceof Error ? e.message : 'PDF Render Fehler')
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    void render()
    return () => {
      cancelled = true
    }
  }, [doc, pageNumber, scale, onPageNumberChange])

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
    <div className={props.className}>
      <div className="mb-3 flex flex-wrap items-center gap-2">
        <div className="inline-flex items-center gap-2 rounded-md bg-slate-900 px-3 py-2 text-sm text-slate-200">
          Seite
          <strong className="text-slate-50">{pageNumber}</strong>
          <span className="text-slate-400">/</span>
          <span className="text-slate-300">{numPages ?? '—'}</span>
        </div>

        <button
          type="button"
          onClick={() => onPageNumberChange(Math.max(1, pageNumber - 1))}
          className="inline-flex items-center gap-2 rounded-md bg-slate-800 px-3 py-2 text-sm font-semibold text-slate-50 hover:bg-slate-700 disabled:opacity-40"
          disabled={pageNumber <= 1}
        >
          <ChevronLeft className="h-4 w-4" />
          Zurück
        </button>
        <button
          type="button"
          onClick={() => onPageNumberChange(pageNumber + 1)}
          className="inline-flex items-center gap-2 rounded-md bg-slate-800 px-3 py-2 text-sm font-semibold text-slate-50 hover:bg-slate-700 disabled:opacity-40"
          disabled={numPages !== null && pageNumber >= numPages}
        >
          Weiter
          <ChevronRight className="h-4 w-4" />
        </button>

        <div className="ml-auto inline-flex items-center gap-2">
          <button
            type="button"
            onClick={() => setScale((s) => Math.max(0.5, round2(s - 0.25)))}
            className="inline-flex items-center gap-2 rounded-md bg-slate-800 px-3 py-2 text-sm font-semibold text-slate-50 hover:bg-slate-700"
          >
            <ZoomOut className="h-4 w-4" />
            Zoom
          </button>
          <button
            type="button"
            onClick={() => setScale((s) => Math.min(3, round2(s + 0.25)))}
            className="inline-flex items-center gap-2 rounded-md bg-slate-800 px-3 py-2 text-sm font-semibold text-slate-50 hover:bg-slate-700"
          >
            <ZoomIn className="h-4 w-4" />
            Zoom
          </button>
          <div className="rounded-md bg-slate-900 px-3 py-2 text-sm text-slate-200">
            {Math.round(scale * 100)}%
          </div>
        </div>
      </div>

      {error ? (
        <div className="mb-3 rounded-md border border-rose-900/60 bg-rose-950/30 px-3 py-2 text-sm text-rose-200">
          {error}
        </div>
      ) : null}

      <div
        ref={containerRef}
        className="relative h-[70vh] overflow-hidden rounded-xl border border-slate-800 bg-slate-950"
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
        style={{ touchAction: 'none', cursor: drag.active ? 'grabbing' : 'grab' }}
      >
        <div
          className="absolute left-0 top-0"
          style={{ transform: `translate(${pan.x}px, ${pan.y}px)` }}
        >
          <canvas ref={canvasRef} />
        </div>

        {loading ? (
          <div className="absolute inset-0 grid place-items-center text-sm text-slate-400">
            PDF lädt…
          </div>
        ) : null}
      </div>
    </div>
  )
}

function clamp(n: number, min: number, max: number) {
  return Math.min(max, Math.max(min, n))
}

function round2(n: number) {
  return Math.round(n * 100) / 100
}

