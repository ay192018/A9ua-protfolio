import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'

export default function Navbar() {
  const location = useLocation()
  const isHome = location.pathname === '/'
  const [logoError, setLogoError] = useState(false)

  return (
    <>
      {/* Logo — rendered outside the difference blend container so it displays normally */}
      <Link
        to="/"
        className="fixed left-4 md:left-[60px] top-0 h-[60px] md:h-[88px] z-[101] flex items-center cursor-pointer hover:opacity-80 transition-opacity px-2"
      >
        {!logoError ? (
          <img
            src="/logo.png"
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
        </div>
      </div>
    </>
  )
}
