import { useRef } from 'react'
import { motion, useScroll, useTransform, useMotionValue, useSpring, type MotionValue } from 'framer-motion'
import { IconArrowDown } from '@aqua/ui'

interface ScrollLetterProps {
  char: string
  scrollYProgress: MotionValue<number>
  startDelay?: number
  index: number
  big?: boolean
}

function ScrollLetter({ char, scrollYProgress, startDelay = 0, index, big = false }: ScrollLetterProps) {
  const h = (startDelay + index * 0.1) / 100
  const d = (startDelay + index * 0.1 + 3) / 100

  const y = useTransform(scrollYProgress, [0, h, (h + d) / 2, 1], big ? [0, 0, -80, -30] : [0, 0, -60, -20])
  const opacity = useTransform(scrollYProgress, [0, h, d, 0.2], [1, 1, 0, 0])
  const scale = useTransform(scrollYProgress, [0, h, (h + d) / 2, d], [1, 1, 1.6, 0.9])
  const rotate = useTransform(scrollYProgress, [0, h, (h + d) / 2, d], [0, 0, -10, 10])

  return (
    <motion.span
      className="inline-block"
      style={{ y, opacity, scale, rotate, willChange: 'transform, opacity' }}
      transition={{ type: 'spring', stiffness: 300, damping: 20, mass: 1 }}
    >
      {char === ' ' ? '\u00A0' : char}
    </motion.span>
  )
}

interface AnimatedTextProps {
  text: string
  startDelay?: number
  big?: boolean
  className?: string
}

function AnimatedText({ text, startDelay = 0, big = false, className = '' }: AnimatedTextProps) {
  const { scrollYProgress } = useScroll()
  return (
    <span className={className}>
      {text.split('').map((char, i) => (
        <ScrollLetter
          key={i}
          char={char}
          scrollYProgress={scrollYProgress}
          startDelay={startDelay}
          index={i}
          big={big}
        />
      ))}
    </span>
  )
}

function ScrollIndicator() {
  const { scrollYProgress } = useScroll()
  const textY = useTransform(scrollYProgress, [0, 0.04, 0.05], [0, -60, -40])
  const textOpacity = useTransform(scrollYProgress, [0, 0.05], [1, 0])
  const btnScale = useTransform(scrollYProgress, [0, 0.03, 0.08], [1, 0.2, 0])
  const btnY = useTransform(scrollYProgress, [0, 0.04, 0.05], [0, -50, -20])
  const wrapOpacity = useTransform(scrollYProgress, [0, 0.02], [1, 0])

  const btnRef = useRef<HTMLDivElement>(null)
  const magnetX = useMotionValue(0)
  const magnetY = useMotionValue(0)
  const springX = useSpring(magnetX, { stiffness: 800, damping: 15 })
  const springY = useSpring(magnetY, { stiffness: 800, damping: 15 })

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!btnRef.current) return
    const rect = btnRef.current.getBoundingClientRect()
    const centerX = rect.left + rect.width / 2
    const centerY = rect.top + rect.height / 2
    magnetX.set((e.clientX - centerX) * 0.5)
    magnetY.set((e.clientY - centerY) * 0.5)
  }

  const handleMouseLeave = () => {
    magnetX.set(0)
    magnetY.set(0)
  }

  return (
    <motion.div
      className="fixed left-[50%] bottom-[30px] -translate-x-[50%] flex flex-col gap-14 justify-center items-center"
      style={{ opacity: wrapOpacity }}
    >
      <motion.div
        style={{ y: textY, opacity: textOpacity }}
        transition={{ type: 'spring', stiffness: 300, damping: 25 }}
      >
        Scroll to discover
      </motion.div>
      <motion.div
        ref={btnRef}
        className="w-[clamp(30px,4vw,60px)] h-[clamp(30px,5vw,60px)] rounded-full flex justify-center items-center bg-black cursor-pointer"
        style={{ scale: btnScale, y: btnY, x: springX, translateY: springY }}
        transition={{ type: 'spring', stiffness: 300, damping: 25 }}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        onClick={() => { window.scrollTo({ top: window.innerHeight, behavior: 'smooth' }) }}
      >
        <IconArrowDown size={24} color="white" />
      </motion.div>
    </motion.div>
  )
}

export default function Intro() {
  return (
    <section className="intro flex flex-col">
      <p className="font-[500] text-[clamp(12px,4vw,100px)]">
        <AnimatedText text="Hey, I Build Things" startDelay={0} big={true} />
      </p>
      <p className="font-[500] text-[clamp(14px,2vw,60px)]">
        <AnimatedText text="Creative FullStack Engineer" startDelay={1} />
      </p>
      <p className="font-[500] text-[clamp(14px,2vw,60px)]">
        <AnimatedText text="Pixel Perfect & Code Driven" startDelay={3} />
      </p>
      <ScrollIndicator />
    </section>
  )
}
