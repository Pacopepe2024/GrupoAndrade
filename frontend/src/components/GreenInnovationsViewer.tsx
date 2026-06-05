'use client'

import { useState, useEffect, useCallback, useRef } from 'react'

const TOTAL_PAGES = 72

function pageUrl(n: number) {
  return `/green-innovations/page_${String(n).padStart(2, '0')}.jpg`
}

export function GreenInnovationsViewer() {
  const [current, setCurrent] = useState(1)
  const [inputVal, setInputVal] = useState('1')
  const [loaded, setLoaded] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const imgRef = useRef<HTMLImageElement>(null)

  const goTo = useCallback((page: number) => {
    const p = Math.max(1, Math.min(TOTAL_PAGES, page))
    setCurrent(p)
    setInputVal(String(p))
    setLoaded(false)
  }, [])

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.target === inputRef.current) return
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') goTo(current + 1)
      if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') goTo(current - 1)
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [current, goTo])

  // Handle already-cached images that won't fire onLoad
  useEffect(() => {
    if (imgRef.current?.complete) {
      setLoaded(true)
    }
  }, [current])

  // Preload adjacent pages
  useEffect(() => {
    const next = current + 1
    const prev = current - 1
    if (next <= TOTAL_PAGES) { const img = new Image(); img.src = pageUrl(next) }
    if (prev >= 1) { const img = new Image(); img.src = pageUrl(prev) }
  }, [current])

  const handleInputCommit = () => {
    const n = parseInt(inputVal, 10)
    if (!isNaN(n)) goTo(n)
    else setInputVal(String(current))
  }

  return (
    <div className="min-h-screen bg-neutral-900 flex flex-col select-none">

      {/* Top bar */}
      <div className="bg-neutral-900 border-b border-neutral-800 px-4 lg:px-8 py-3 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-3 h-3 rounded-full bg-brand-500" />
          <span className="text-white text-xs font-bold uppercase tracking-widest hidden sm:block">
            Green Innovations · Schüco PWS Italia
          </span>
          <span className="text-white text-xs font-bold uppercase tracking-widest sm:hidden">
            Green Innovations
          </span>
        </div>

        <div className="flex items-center gap-2 text-neutral-400 text-sm">
          <button
            onClick={() => goTo(current - 1)}
            disabled={current === 1}
            className="p-1.5 rounded hover:bg-neutral-700 disabled:opacity-30 disabled:cursor-not-allowed text-white transition-colors"
            aria-label="Página anterior"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
            </svg>
          </button>

          <div className="flex items-center gap-1.5">
            <input
              ref={inputRef}
              value={inputVal}
              onChange={e => setInputVal(e.target.value)}
              onBlur={handleInputCommit}
              onKeyDown={e => { if (e.key === 'Enter') { handleInputCommit(); inputRef.current?.blur() } }}
              className="w-10 text-center bg-neutral-800 border border-neutral-600 rounded text-white text-sm py-0.5 focus:outline-none focus:border-brand-500"
            />
            <span className="text-neutral-500 text-xs">/ {TOTAL_PAGES}</span>
          </div>

          <button
            onClick={() => goTo(current + 1)}
            disabled={current === TOTAL_PAGES}
            className="p-1.5 rounded hover:bg-neutral-700 disabled:opacity-30 disabled:cursor-not-allowed text-white transition-colors"
            aria-label="Página siguiente"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
            </svg>
          </button>
        </div>
      </div>

      {/* Page viewer */}
      <div className="flex-1 flex items-center justify-center p-4 lg:p-8 overflow-hidden">
        <div className="relative flex items-center gap-4 lg:gap-8 max-h-full">

          {/* Prev arrow */}
          <button
            onClick={() => goTo(current - 1)}
            disabled={current === 1}
            className="shrink-0 w-10 h-10 lg:w-12 lg:h-12 rounded-full bg-neutral-800 border border-neutral-700 flex items-center justify-center text-white hover:bg-neutral-700 hover:border-brand-500 disabled:opacity-20 disabled:cursor-not-allowed transition-all"
            aria-label="Página anterior"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
            </svg>
          </button>

          {/* Page image */}
          <div
            className="relative bg-white shadow-2xl overflow-hidden flex items-center justify-center"
            style={{ height: 'calc(100vh - 140px)', maxWidth: 'calc((100vh - 140px) * 210 / 297)' }}
          >
            {!loaded && (
              <div className="absolute inset-0 flex items-center justify-center bg-neutral-800">
                <div className="w-8 h-8 border-2 border-brand-500 border-t-transparent rounded-full animate-spin" />
              </div>
            )}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              ref={imgRef}
              key={current}
              src={pageUrl(current)}
              alt={`Página ${current} de ${TOTAL_PAGES}`}
              onLoad={() => setLoaded(true)}
              className={`block max-h-full max-w-full object-contain transition-opacity duration-200 ${loaded ? 'opacity-100' : 'opacity-0'}`}
              draggable={false}
            />
          </div>

          {/* Next arrow */}
          <button
            onClick={() => goTo(current + 1)}
            disabled={current === TOTAL_PAGES}
            className="shrink-0 w-10 h-10 lg:w-12 lg:h-12 rounded-full bg-neutral-800 border border-neutral-700 flex items-center justify-center text-white hover:bg-neutral-700 hover:border-brand-500 disabled:opacity-20 disabled:cursor-not-allowed transition-all"
            aria-label="Página siguiente"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
            </svg>
          </button>
        </div>
      </div>

      {/* Progress bar */}
      <div className="h-0.5 bg-neutral-800 shrink-0">
        <div
          className="h-0.5 bg-brand-500 transition-all duration-300"
          style={{ width: `${(current / TOTAL_PAGES) * 100}%` }}
        />
      </div>

      {/* Thumbnail strip */}
      <ThumbnailStrip current={current} goTo={goTo} />
    </div>
  )
}

function ThumbnailStrip({ current, goTo }: { current: number; goTo: (n: number) => void }) {
  const stripRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = stripRef.current?.querySelector(`[data-page="${current}"]`) as HTMLElement | null
    el?.scrollIntoView({ inline: 'center', behavior: 'smooth', block: 'nearest' })
  }, [current])

  return (
    <div className="bg-neutral-950 border-t border-neutral-800 py-2 shrink-0">
      <div
        ref={stripRef}
        className="flex gap-1.5 overflow-x-auto px-4 scrollbar-none"
        style={{ scrollbarWidth: 'none' }}
      >
        {Array.from({ length: TOTAL_PAGES }, (_, i) => i + 1).map(n => (
          <button
            key={n}
            data-page={n}
            onClick={() => goTo(n)}
            className={`shrink-0 relative border-2 transition-all ${
              n === current
                ? 'border-brand-500'
                : 'border-transparent hover:border-neutral-600'
            }`}
            style={{ width: 36, height: 51 }}
            title={`Página ${n}`}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={pageUrl(n)}
              alt={`Miniatura ${n}`}
              className="w-full h-full object-cover"
              loading="lazy"
            />
            <span className="absolute bottom-0 left-0 right-0 text-center text-white text-[8px] bg-black/50 leading-tight py-px">
              {n}
            </span>
          </button>
        ))}
      </div>
    </div>
  )
}
