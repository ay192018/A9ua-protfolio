import { useRef, useEffect, useCallback, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface ProjectData {
  img: string
  name: string
  year: string
}

const base = import.meta.env.BASE_URL

const originalProjects: ProjectData[] = [
  { img: `${base}image/g-1.webp`, name: 'Aethel Unit - 07', year: 'September' },
  { img: `${base}image/g-2.webp`, name: 'ニッカボニー', year: 'August' },
  { img: `${base}image/g-3.webp`, name: 'ニッカボニー', year: 'October' },
  { img: `${base}image/g-16.webp`, name: 'うずまきナルト 漩涡鸣人', year: '2025' },
  { img: `${base}image/g-4.webp`, name: 'うちはマダラ 宇智波斑', year: 'December' },
  { img: `${base}image/g-5.webp`, name: 'Aethel Unit - 07', year: 'July' },
  { img: `${base}image/g-6.png`, name: 'Pressure Suit', year: 'June' },
  { img: `${base}image/g-10-1.webp`, name: 'Music Time', year: 'December' },
  { img: `${base}image/g-11.webp`, name: 'Follow Me', year: 'November' },
  { img: `${base}image/g-12.webp`, name: 'Summer', year: 'November' },
  { img: `${base}image/g-7.webp`, name: 'Aethel Unit - 07', year: 'July' },
  { img: `${base}image/g-8.webp`, name: 'ニッカボニー', year: 'July' },
  { img: `${base}image/g-9.webp`, name: 'UnAethel Unit - 07', year: 'October' },
  { img: `${base}image/g-13.webp`, name: 'Ready For Hight', year: 'February' },
  { img: `${base}image/g-14.webp`, name: 'Terminate', year: 'February' },
  { img: `${base}image/g-15.webp`, name: 'Train', year: 'December' },
  { img: `${base}image/g-17.webp`, name: 'Gundam SEED', year: 'December' },
]

function getLayoutConfig() {
  if (typeof window === 'undefined') return { itemsPerRow: 9, rowCount: 10 }
  const w = window.innerWidth
  if (w < 768) return { itemsPerRow: 3, rowCount: 15 }
  return { itemsPerRow: 9, rowCount: 10 }
}

interface Selected {
  img: string
  name: string
  year: string
  layoutId: string
}

function EyeIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  )
}

interface ProjectCardProps extends ProjectData {
  layoutId: string
  onOpen: (s: Selected) => void
}

function ProjectCard({ img, name, year, layoutId, onOpen }: ProjectCardProps) {
  const [loaded, setLoaded] = useState(false)

  return (
    <div className="project">
        <motion.div
          layoutId={layoutId}
          transition={{ type: 'spring', stiffness: 280, damping: 28 }}
          className="project-img relative cursor-pointer hover:[--hover-op:1]"
          onClick={() => onOpen({ img, name, year, layoutId })}
          style={{ borderRadius: 4 }}
        >
          <div
            className="absolute inset-0 z-10 flex items-center justify-center gap-2 bg-[rgba(0,0,0,.55)] transition-opacity duration-300 text-white text-[clamp(10px,1vw,13px)] tracking-widest uppercase"
            style={{ opacity: 'var(--hover-op, 0)' as any }}
          >
            <EyeIcon />
            <span>View</span>
          </div>
          {!loaded && (
            <div className="absolute inset-0 animate-pulse" style={{ background: 'linear-gradient(to right, var(--skeleton-from), var(--skeleton-to))' }} />
          )}
          <img
            alt={name}
            src={img}
            loading="lazy"
            onLoad={() => setLoaded(true)}
            style={{ opacity: loaded ? 1 : 0, transition: 'opacity 0.3s', width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
          />
        </motion.div>
      <div className="project-info">
        <p>{name}</p>
        <p>{year}</p>
      </div>
    </div>
  )
}

function Lightbox({ selected, onClose }: { selected: Selected | null; onClose: () => void }) {
  useEffect(() => {
    if (!selected) return
    window.dispatchEvent(new Event('lenis:lock'))
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', handler)
    return () => {
      window.dispatchEvent(new Event('lenis:unlock'))
      window.removeEventListener('keydown', handler)
    }
  }, [selected, onClose])

  return (
    <AnimatePresence>
      {selected && (
        <>
          <motion.div
            className="fixed inset-0 z-[200] bg-black/70 cursor-pointer"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          <div className="fixed inset-0 z-[200] flex items-center justify-center pointer-events-none">
            <motion.div
              className="pointer-events-auto flex flex-col"
              style={{ width: 'min(90vw, 900px)' }}
            >
              <motion.div
                layoutId={selected.layoutId}
                transition={{ type: 'spring', stiffness: 280, damping: 28 }}
                style={{ width: '100%', borderRadius: 8, overflow: 'hidden', cursor: 'default' }}
                onClick={(e) => e.stopPropagation()}
              >
                <img
                  src={selected.img}
                  alt={selected.name}
                  style={{ width: '100%', maxHeight: '80vh', objectFit: 'contain', display: 'block' }}
                />
              </motion.div>
              <motion.div
                className="flex justify-between mt-3 text-white text-sm px-1 opacity-80"
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 6 }}
                transition={{ delay: 0.15 }}
              >
                <span>{selected.name}</span>
                <span>{selected.year}</span>
              </motion.div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  )
}

export default function Projects() {
  const containerRef = useRef<HTMLElement>(null)
  const rowRefs = useRef<HTMLDivElement[]>([])
  const [selected, setSelected] = useState<Selected | null>(null)
  const [layout, setLayout] = useState(getLayoutConfig)

  useEffect(() => {
    function onResize() { setLayout(getLayoutConfig()) }
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])

  const rows: (ProjectData & { layoutId: string })[][] = []
  let idx = 0
  for (let r = 0; r < layout.rowCount; r++) {
    const row = []
    for (let c = 0; c < layout.itemsPerRow; c++) {
      row.push({ ...originalProjects[idx % originalProjects.length], layoutId: `proj-${idx}` })
      idx++
    }
    rows.push(row)
  }

  const minWidth = useRef(125)
  const maxWidth = useRef(500)

  const updateLayout = useCallback(() => {
    const container = containerRef.current
    if (!container) return
    const rowEls = rowRefs.current
    const mobile = window.innerWidth < 768
    minWidth.current = mobile ? 100 : 125
    maxWidth.current = mobile ? 250 : 500

    const firstRow = rowEls[0]
    if (!firstRow) return
    firstRow.style.width = `${maxWidth.current}%`
    const rowHeight = firstRow.offsetHeight
    firstRow.style.width = ''

    const gap = parseFloat(getComputedStyle(container).gap) || 0
    const paddingTop = parseFloat(getComputedStyle(container).paddingTop) || 0
    const totalHeight = rowHeight * rowEls.length + gap * (rowEls.length - 1) + paddingTop * 2
    container.style.height = `${totalHeight}px`
  }, [])

  useEffect(() => {
    const container = containerRef.current
    if (!container) return
    const rowEls = rowRefs.current
    updateLayout()

         function onScroll() {
      const scrollY = window.scrollY
      const viewportH = window.innerHeight
      rowEls.forEach((row) => {
        if (!row) return
        const rect = row.getBoundingClientRect()
        const rowTop = rect.top + scrollY
        const rowBottom = rowTop + rect.height
        const rangeStart = rowTop - viewportH
        const rangeEnd = rowBottom
        let progress = (scrollY - rangeStart) / (rangeEnd - rangeStart)
        progress = Math.max(0, Math.min(1, progress))
        const width = minWidth.current + (maxWidth.current - minWidth.current) * progress
        row.style.width = `${width}%`
      })
    }


    let rafId: number
    function loop() { onScroll(); rafId = requestAnimationFrame(loop) }
    rafId = requestAnimationFrame(loop)
    window.addEventListener('resize', updateLayout)
    return () => { cancelAnimationFrame(rafId); window.removeEventListener('resize', updateLayout) }
  }, [updateLayout])

  return (
    <>
      <Lightbox selected={selected} onClose={() => setSelected(null)} />
      <section ref={containerRef} className="projects">
        {rows.map((rowData, i) => (
          <div
            key={i}
            className="projects-row"
            ref={(el) => { if (el) rowRefs.current[i] = el }}
          >
            {rowData.map((item) => (
              <ProjectCard
                key={item.layoutId}
                {...item}
                onOpen={setSelected}
              />
            ))}
          </div>
        ))}
      </section>
    </>
  )
}
