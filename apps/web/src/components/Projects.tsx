import { useRef, useEffect, useCallback, useState } from 'react'
import { IconLock } from '@aqua/ui'

interface ProjectData {
  img: string
  name: string
  year: string
}

const originalProjects: ProjectData[] = [
  { img: '/image/g-1.webp', name: 'Aethel Unit - 07', year: 'September' },
  { img: '/image/g-2.webp', name: 'ニッカボニー', year: 'August' },
  { img: '/image/g-3.webp', name: 'ニッカボニー', year: 'October' },
  { img: '/image/g-4.webp', name: 'うちはマダラ 宇智波斑', year: 'December' },
  { img: '/image/g-16.webp', name: 'うずまきナルト 漩涡鸣人', year: '2025' },
  { img: '/image/g-5.webp', name: 'Aethel Unit - 07', year: 'July' },
  { img: '/image/g-6.png', name: 'Pressure Suit', year: 'June' },
  { img: '/image/g-10-1.webp', name: 'Music Time', year: 'December' },
  { img: '/image/g-11.webp', name: 'Follow Me', year: 'November' },
  { img: '/image/g-12.webp', name: 'Summer', year: 'November' },
  { img: '/image/g-7.webp', name: 'Aethel Unit - 07', year: 'July' },
  { img: '/image/g-8.webp', name: 'ニッカボニー', year: 'July' },
  { img: '/image/g-9.webp', name: 'UnAethel Unit - 07', year: 'October' },
  { img: '/image/g-13.webp', name: 'Ready For Hight', year: 'February' },
  { img: '/image/g-14.webp', name: 'Terminate', year: 'February' },
  { img: '/image/g-15.webp', name: 'Train', year: 'December' },
  { img: '/image/g-17.webp', name: 'Gundam SEED', year: 'December' },
]

const ITEMS_PER_ROW = 9
const ROW_COUNT = 10

interface ProjectCardProps {
  img: string
  name: string
  year: string
}

function ProjectCard({ img, name, year }: ProjectCardProps) {
  const [loaded, setLoaded] = useState(false)

  return (
    <div className="project">
      <div className="project-img relative cursor-pointer hover:[--children-opacity:1]">
        {/* Hover overlay */}
        <div
          className="flex items-center text-[#fff] gap-2.5 absolute left-0 top-0 z-10 w-full h-full items-center justify-center bg-[rgba(0,0,0,.6)] transition"
          style={{ opacity: 'var(--children-opacity, 0)' as any }}
        >
          <IconLock size={14} color="currentColor" />
          <div>Prompt Later</div>
        </div>
        {/* Loading skeleton */}
        {!loaded && (
          <div className="absolute inset-0 bg-gradient-to-r from-[#fafafb] to-[#f1f2f6] animate-pulse" />
        )}
        <img
          alt={name}
          src={img}
          loading="lazy"
          onLoad={() => setLoaded(true)}
          style={{ opacity: loaded ? 1 : 0, transition: 'opacity 0.3s' }}
        />
      </div>
      <div className="project-info">
        <p>{name}</p>
        <p>{year}</p>
      </div>
    </div>
  )
}

export default function Projects() {
  const containerRef = useRef<HTMLElement>(null)
  const rowRefs = useRef<HTMLDivElement[]>([])

  const rows: ProjectData[][] = []
  let idx = 0
  for (let r = 0; r < ROW_COUNT; r++) {
    const row: ProjectData[] = []
    for (let c = 0; c < ITEMS_PER_ROW; c++) {
      row.push(originalProjects[idx % originalProjects.length])
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
    const isMobile = window.innerWidth < 1000
    minWidth.current = isMobile ? 250 : 125
    maxWidth.current = isMobile ? 750 : 500

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
    function loop() {
      onScroll()
      rafId = requestAnimationFrame(loop)
    }
    rafId = requestAnimationFrame(loop)

    const handleResize = () => updateLayout()
    window.addEventListener('resize', handleResize)

    return () => {
      cancelAnimationFrame(rafId)
      window.removeEventListener('resize', handleResize)
    }
  }, [updateLayout])

  return (
    <section ref={containerRef} className="projects">
      {rows.map((rowData, i) => (
        <div
          key={i}
          className="projects-row"
          ref={(el) => { if (el) rowRefs.current[i] = el }}
        >
          {rowData.map((item, j) => (
            <ProjectCard
              key={`${i}-${j}`}
              img={item.img}
              name={item.name}
              year={item.year}
            />
          ))}
        </div>
      ))}
    </section>
  )
}
