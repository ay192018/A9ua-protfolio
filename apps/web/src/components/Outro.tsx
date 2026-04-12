import { useRef } from 'react'
import { motion, useScroll, useTransform, type MotionValue } from 'framer-motion'

interface OutroLetterProps {
  char: string
  scrollYProgress: MotionValue<number>
  startDelay?: number
  index: number
  big?: boolean
}

function OutroLetter({ char, scrollYProgress, startDelay = 0, index, big = false }: OutroLetterProps) {
  const h = (startDelay + index * 1) / 100
  const d = (startDelay + index * 1 + 15) / 100

  const y = useTransform(scrollYProgress, [h, (h + d) / 2, d], big ? [0, -40, 0] : [0, -25, 0])
  const opacity = useTransform(scrollYProgress, [h, d], [0, 1])
  const scale = useTransform(scrollYProgress, [h, (h + d) / 2, d], [1, 1.5, 1])
  const rotate = useTransform(scrollYProgress, [h, (h + d) / 2, d], [-30, 30, 0])

  return (
    <motion.span
      className="inline-block"
      style={{ y, opacity, scale, rotate }}
      transition={{ type: 'spring', stiffness: 300, damping: 20, mass: 0.8 }}
    >
      {char === ' ' ? '\u00A0' : char}
    </motion.span>
  )
}

interface OutroTextProps {
  text: string
  startDelay?: number
  big?: boolean
}

function OutroText({ text, startDelay = 0, big = false }: OutroTextProps) {
  const ref = useRef<HTMLSpanElement>(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: big ? ['start 1', 'end -1.1'] : ['start 1', 'end -0.18'],
  })

  return (
    <span ref={ref}>
      {text.split('').map((char, i) => (
        <OutroLetter
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

export default function Outro() {
  return (
    <section
      className="outro flex flex-col gap-10 pb-[100px]"
      style={{ height: 'calc(100svh - 18px)' }}
    >
      <p className="font-[500] text-[clamp(14px,3vw,80px)]">
        <OutroText text="Stick with it" startDelay={0} big={true} />
      </p>
      <a
        href="mailto:ayy192018@gmail.com"
        target="_blank"
        className="font-[500] text-[clamp(14px,1vw,40px)]"
      >
        <OutroText text="mail: ayy192018@gmail.com" startDelay={0} />
      </a>
      <p className="font-[500] text-[clamp(14px,1vw,40px)]">
        <OutroText text="weChat: Pinia2018" startDelay={0} />
      </p>
      <div className="absolute left-[50%] bottom-[20px] -translate-x-[50%] text-[14px]" style={{ color: 'var(--copyright)' }}>
        Copyright &copy; {new Date().getFullYear()} [ Studio Portfolio ] . All rights reserved.
      </div>
    </section>
  )
}
