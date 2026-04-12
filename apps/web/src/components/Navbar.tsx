import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'

// Read initial theme synchronously to avoid flash
function getInitialDark() {
  const stored = localStorage.getItem('theme')
  if (stored) return stored === 'dark'
  return window.matchMedia('(prefers-color-scheme: dark)').matches
}

// Apply theme directly to DOM — no React state involved
function applyTheme(dark: boolean) {
  const html = document.documentElement
  html.classList.toggle('dark', dark)
  html.classList.toggle('light', !dark)
  localStorage.setItem('theme', dark ? 'dark' : 'light')
}

// Initialize on load
if (typeof window !== 'undefined') {
  applyTheme(getInitialDark())
}

async function toggleTheme(event: MouseEvent, currentDark: boolean): Promise<boolean> {
  const nextDark = !currentDark
  const x = event.clientX
  const y = event.clientY
  const endRadius = Math.hypot(
    Math.max(x, window.innerWidth - x),
    Math.max(y, window.innerHeight - y)
  )

  if (!document.startViewTransition) {
    applyTheme(nextDark)
    return nextDark
  }

  // Mark direction so CSS can set correct z-index on pseudo-elements
  document.documentElement.dataset.themeTo = nextDark ? 'dark' : 'light'
  document.documentElement.classList.add('theme-transitioning')

  const transition = document.startViewTransition(() => applyTheme(nextDark))
  await transition.ready

  const clip0 = `circle(0px at ${x}px ${y}px)`
  const clipFull = `circle(${endRadius}px at ${x}px ${y}px)`

  if (nextDark) {
    // dark expanding in over light
    document.documentElement.animate(
      { clipPath: [clip0, clipFull] },
      { duration: 550, easing: 'ease-in-out', pseudoElement: '::view-transition-new(root)' }
    )
  } else {
    // dark shrinking away, revealing light underneath
    document.documentElement.animate(
      { clipPath: [clipFull, clip0] },
      { duration: 550, easing: 'ease-in-out', pseudoElement: '::view-transition-old(root)' }
    )
  }

  transition.finished.then(() => {
    delete document.documentElement.dataset.themeTo
    document.documentElement.classList.remove('theme-transitioning')
  })

  return nextDark
}

export default function Navbar() {
  const location = useLocation()
  const isHome = location.pathname === '/'
  const [logoError, setLogoError] = useState(false)
  const [dark, setDark] = useState(getInitialDark)

  const handleThemeToggle = async (e: React.MouseEvent) => {
    const next = await toggleTheme(e.nativeEvent, dark)
    setDark(next)
  }

  return (
    <>
      {/* Logo — rendered outside the difference blend container so it displays normally */}
      <Link
        to="/"
        className="fixed left-4 md:left-[60px] top-0 h-[60px] md:h-[88px] z-[101] flex items-center cursor-pointer hover:opacity-80 transition-opacity px-2"
      >
        {!logoError ? (
          <img
            src={`${import.meta.env.BASE_URL}logo.png`}
            alt="Logo"
            onError={() => setLogoError(true)}
            style={{
              height: '32px',
              width: 'auto',
              objectFit: 'contain',
            }}
          />
        ) : null}
      </Link>

      {/* Navbar text — with difference blend mode */}
      <div
        className="flex fixed items-center justify-between left-4 right-4 md:left-[60px] md:right-[60px] top-0 h-[60px] md:h-[88px] z-[100] px-2"
        style={{ mixBlendMode: 'difference' }}
      >
        <Link
          to="/"
          className="flex gap-2 text-[#ffffff] items-center font-['Greycliff'] text-[16px] md:text-[20px] font-[900] cursor-pointer hover:opacity-80 transition-opacity"
        >
          {logoError ? (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="md:w-6 md:h-6">
              <circle cx="12" cy="12" r="10" stroke="white" strokeWidth="2" />
              <path d="M8 12L11 15L16 9" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          ) : (
            <span style={{ display: 'inline-block', width: '32px' }} />
          )}
          <span>Aqua</span>
        </Link>
        <div className="flex items-center text-[12px] md:text-[14px] gap-4 md:gap-10">
          <Link
            to="/"
            className={`text-white font-[600] transition-opacity ${isHome ? 'opacity-100' : 'opacity-70 hover:opacity-100'}`}
          >
            HOME
          </Link>
          <Link
            to="/beebits"
            className={`text-white font-[600] transition-opacity ${!isHome ? 'opacity-100' : 'opacity-70 hover:opacity-100'}`}
          >
            ABOUT
          </Link>
          <button
            onClick={handleThemeToggle}
            aria-label={dark ? 'Switch to light mode' : 'Switch to dark mode'}
            className="w-7 h-7 flex items-center justify-center hover:opacity-70 transition-opacity text-white"
          >
            {dark ? (
              <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="5" /><line x1="12" y1="1" x2="12" y2="3" /><line x1="12" y1="21" x2="12" y2="23" />
                <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" /><line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
                <line x1="1" y1="12" x2="3" y2="12" /><line x1="21" y1="12" x2="23" y2="12" />
                <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" /><line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
              </svg>
            ) : (
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
              </svg>
            )}
          </button>
        </div>
      </div>
    </>
  )
}
