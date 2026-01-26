import * as pdfjs from 'pdfjs-dist'

// Vite-friendly worker setup for pdfjs-dist (ESM build).
// This makes the viewer upgradeable later without changing the rest of the code.
pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/build/pdf.worker.min.mjs',
  import.meta.url,
).toString()

export { pdfjs }

