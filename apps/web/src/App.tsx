import { useEffect, useRef } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Lenis from 'lenis'
import Navbar from './components/Navbar'
import Intro from './components/Intro'
import Projects from './components/Projects'
import Outro from './components/Outro'
import Beebits from './components/Beebits'

// Gear / ratchet tick sound using Web Audio API
function createGearSound() {
  let audioCtx: AudioContext | null = null
  let lastTick = 0
  const MIN_INTERVAL = 60

  function getCtx(): AudioContext {
    if (!audioCtx) {
      audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)()
    }
    return audioCtx
  }

  function tick(velocity = 1) {
    const now = Date.now()
    if (now - lastTick < MIN_INTERVAL) return
    lastTick = now

    const ctx = getCtx()
    const t = ctx.currentTime

    const vol = Math.min(0.06 + Math.abs(velocity) * 0.015, 0.15)

    const bufferSize = Math.floor(ctx.sampleRate * 0.012)
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate)
    const data = buffer.getChannelData(0)
    for (let i = 0; i < bufferSize; i++) {
      const env = Math.exp(-i / (bufferSize * 0.15))
      data[i] = (Math.random() * 2 - 1) * env
    }

    const source = ctx.createBufferSource()
    source.buffer = buffer

    const filter = ctx.createBiquadFilter()
    filter.type = 'bandpass'
    filter.frequency.value = 2800 + Math.random() * 800
    filter.Q.value = 3

    const gain = ctx.createGain()
    gain.gain.setValueAtTime(vol, t)
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.04)

    source.connect(filter)
    filter.connect(gain)
    gain.connect(ctx.destination)
    source.start(t)
    source.stop(t + 0.05)
  }

  function destroy() {
    if (audioCtx) {
      audioCtx.close()
      audioCtx = null
    }
  }

  return { tick, destroy }
}

function HomePage() {
  const gearRef = useRef<ReturnType<typeof createGearSound> | null>(null)

  useEffect(() => {
    const lenis = new Lenis({
      autoRaf: false,
      lerp: 0.07,
      smoothWheel: true,
      touchMultiplier: 1,
      wheelMultiplier: 1,
      infinite: false,
    })

    const gear = createGearSound()
    gearRef.current = gear

    let accum = 0
    const TICK_EVERY = 35

    lenis.on('scroll', ({ velocity }: { velocity: number }) => {
      const absV = Math.abs(velocity)
      if (absV < 0.5) return
      accum += absV
      while (accum >= TICK_EVERY) {
        gear.tick(velocity)
        accum -= TICK_EVERY
      }
    })

    function raf(time: number) {
      lenis.raf(time)
      requestAnimationFrame(raf)
    }
    requestAnimationFrame(raf)

    return () => {
      lenis.destroy()
      gear.destroy()
    }
  }, [])

  return (
    <>
      <Intro />
      <Projects />
      <Outro />
    </>
  )
}

function App() {
  return (
    <BrowserRouter basename={import.meta.env.BASE_URL}>
      <div className="min-h-screen">
        <Navbar />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/beebits" element={<Beebits />} />
        </Routes>
      </div>
    </BrowserRouter>
  )
}

export default App
