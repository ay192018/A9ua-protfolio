import { useEffect, useRef, useState } from 'react'
import { motion, useMotionValue, useSpring } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { Bold, IconArrowRight } from '@aqua/ui'

// AI tool icons for mouse trail
const TRAIL_ICONS = ['⚡', '▶', '✦', '◈', '⬡', '◇', '◆', '⬢', '◉', '◎', '▣', '🤖']

interface Particle {
  id: number
  x: number
  y: number
  icon: string
  rotation: number
  size: number
  driftX: number
  driftY: number
}

// Mouse trail effect — icons follow cursor trajectory with speed-based sizing
function MouseTrail() {
  const [particles, setParticles] = useState<Particle[]>([])
  const idCounter = useRef(0)
  const lastPos = useRef({ x: 0, y: 0 })
  const lastTime = useRef(Date.now())

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const dx = e.clientX - lastPos.current.x
      const dy = e.clientY - lastPos.current.y
      const dist = Math.sqrt(dx * dx + dy * dy)

      if (dist < 25) return

      const now = Date.now()
      const dt = now - lastTime.current
      lastTime.current = now
      lastPos.current = { x: e.clientX, y: e.clientY }

      const speed = dt > 0 ? dist / dt : 0

      const baseSize = 48
      const maxExtra = 52
      const speedFactor = Math.min(speed / 1.5, 1)
      const size = baseSize + maxExtra * speedFactor

      const icon = TRAIL_ICONS[idCounter.current % TRAIL_ICONS.length]
      const id = ++idCounter.current

      const offsetX = (Math.random() - 0.5) * 20
      const offsetY = (Math.random() - 0.5) * 20

      const particle: Particle = {
        id,
        x: e.clientX + offsetX,
        y: e.clientY + window.scrollY + offsetY,
        icon,
        rotation: Math.random() * 360,
        size: Math.round(size),
        driftX: (Math.random() - 0.5) * 60,
        driftY: -(Math.random() * 50 + 20),
      }

      setParticles((prev) => [...prev.slice(-30), particle])

      setTimeout(() => {
        setParticles((prev) => prev.filter((p) => p.id !== id))
      }, 1800)
    }

    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

  return (
    <div
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        overflow: 'hidden',
        pointerEvents: 'none',
        zIndex: 10,
      }}
    >
      {particles.map((p) => (
        <span
          key={p.id}
          style={{
            position: 'absolute',
            left: p.x,
            top: p.y,
            fontSize: `${p.size}px`,
            lineHeight: 1,
            pointerEvents: 'none',
            transform: `translate(-50%, -50%) rotate(${p.rotation}deg)`,
            animation: 'trailFade 1.8s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards',
            willChange: 'opacity, transform',
            '--drift-x': `${p.driftX}px`,
            '--drift-y': `${p.driftY}px`,
          } as React.CSSProperties}
        >
          {p.icon}
        </span>
      ))}
      <style>{`
        @keyframes trailFade {
          0% {
            opacity: 0.9;
            transform: translate(-50%, -50%) scale(1) rotate(0deg);
          }
          30% {
            opacity: 0.7;
            transform: translate(calc(-50% + var(--drift-x, 0px) * 0.3), calc(-50% + var(--drift-y, 0px) * 0.3)) scale(1.2);
          }
          100% {
            opacity: 0;
            transform: translate(calc(-50% + var(--drift-x, 0px)), calc(-50% + var(--drift-y, 0px))) scale(0.15);
          }
        }
      `}</style>
    </div>
  )
}

// Magnetic button with spring-follow effect
interface MagneticArrowProps {
  onClick: () => void
}

function MagneticArrow({ onClick }: MagneticArrowProps) {
  const ref = useRef<HTMLDivElement>(null)
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const springX = useSpring(x, { stiffness: 150, damping: 15 })
  const springY = useSpring(y, { stiffness: 150, damping: 15 })

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!ref.current) return
    const rect = ref.current.getBoundingClientRect()
    const centerX = rect.left + rect.width / 2
    const centerY = rect.top + rect.height / 2
    x.set((e.clientX - centerX) * 0.5)
    y.set((e.clientY - centerY) * 0.5)
  }

  const handleMouseLeave = () => {
    x.set(0)
    y.set(0)
  }

  return (
    <motion.div
      ref={ref}
      style={{
        marginTop: '20px',
        marginBottom: '20px',
        cursor: 'pointer',
        display: 'flex',
        width: 'fit-content',
        x: springX,
        y: springY,
      }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
    >
      <IconArrowRight size={30} />
    </motion.div>
  )
}

// Stagger animation variants
const containerVariants = {
  hidden: {
    transition: { staggerChildren: 0.1 },
  },
  visible: {
    transition: { staggerChildren: 0.1 },
  },
}

const itemVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
}

export default function Beebits() {
  const navigate = useNavigate()

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  return (
    <div
      style={{
        width: '100%',
        overflowX: 'hidden',
        minHeight: '100vh',
        fontFamily: "'Greycliff', system-ui, sans-serif",
        position: 'relative',
      }}
    >
      <MouseTrail />

      <div
        className="w-[92%] md:w-[80%] mx-auto min-h-[calc(100vh-120px)] flex flex-col relative pt-[80px] md:pt-[60px] pb-10"
      >

        <div style={{ fontSize: '16px', fontWeight: 900, display: 'flex', alignItems: 'center' }}>
          THE THINKING OF AI
        </div>
        <div
          style={{
            fontStyle: 'italic',
            fontSize: '14px',
            lineHeight: '22px',
            marginTop: '10px',
            marginBottom: '30px',
          }}
        >
          谈谈关于 AI 的思考吧～
        </div>

        <div
          className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-5"
        >

          {/* Left column */}
          <div>
            <motion.div initial="hidden" animate="visible" variants={containerVariants}>
              <motion.div variants={itemVariants} style={{ marginTop: '32px' }}>
                <div style={{ fontSize: '15px', fontWeight: 900, marginTop: '12px' }}>Open</div>
                <div style={{ fontSize: '14px', lineHeight: '22px', marginTop: '10px', opacity: 0.8 }}>
                  <div style={{ lineHeight: '1.6', marginLeft: '8px', fontStyle: 'italic', fontWeight: 900 }}>
                    开发范式的转变
                  </div>
                  <div style={{ lineHeight: '1.6', marginLeft: '8px', marginBottom: '12px', fontStyle: 'italic' }}>
                    Siloed，传统工作流程往往让团队成员各自局限在专业领域内，沉浸在自己的{' '}
                    <Bold>bubble </Bold> 。
                    <div>
                      跨职能的协作成本变得高昂且耗时，
                      <Bold>(设计嫌弃你一堆的走查问题，前端嫌弃你一堆的逻辑不严谨)。</Bold>
                    </div>
                  </div>
                  <div style={{ lineHeight: '1.6', marginLeft: '8px', marginBottom: '12px', fontStyle: 'italic', marginTop: '10px' }}>
                    嵌入了 <Bold>Rules</Bold>、<Bold>Skills</Bold>{' '}
                    的 AI 智能体让每个人都能突破角色限制，成为构建者，
                    <div>
                      直接从问题定义开始原型设计，而不是从 <Bold>Figma</Bold>{' '}
                      原型图或冗长的需求文档开始。
                    </div>
                  </div>
                  <div style={{ lineHeight: '1.6', marginLeft: '8px', fontStyle: 'italic', marginTop: '10px' }}>
                    这种方法支持快速探索边界场景，从微观和宏观两个视角进行细致迭代，
                    <div>
                      并能灵活定义默认值的同时保持自定义选项的开放性——
                      这些能力在传统的设计到开发交接流程中很难协调实现。
                    </div>
                  </div>
                </div>
              </motion.div>

              <motion.div variants={itemVariants} style={{ marginTop: '32px' }}>
                <div style={{ fontSize: '15px', fontWeight: 900 }}>
                  Mindset / Habit / Skill
                </div>
                <div style={{ fontSize: '14px', lineHeight: '22px', marginTop: '10px', opacity: 0.8 }}>
                  <div style={{ lineHeight: '1.6', marginLeft: '8px', fontStyle: 'italic', fontWeight: 900 }}>
                    "心态 → 习惯 → 技能"
                  </div>
                  <div style={{ lineHeight: '1.6', marginLeft: '8px', fontStyle: 'italic' }}>
                    "好的心态养成好的习惯，好的习惯提升自身技能"
                  </div>
                  <div style={{ lineHeight: '1.6', marginLeft: '8px', fontStyle: 'italic' }}>
                    "热情驱动持续投入，揭示更深层的洞察。在物理世界中，我们使用生物和物理概念；在软件世界中，我们设计自己的概念框架。"
                  </div>
                  <div style={{ lineHeight: '1.6', marginLeft: '8px', fontStyle: 'italic' }}>
                    "强化你的 <Bold>speciallize</Bold>
                    ，做一些以前不会做的事情，通过做这些事情不断解决{' '}
                    <Bold>edge case</Bold>，并扩大你的 <Bold>speciallize</Bold>"
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </div>

          {/* Right column */}
          <div>
            <motion.div initial="hidden" animate="visible" variants={containerVariants}>
              <motion.div variants={itemVariants} style={{ marginTop: '32px' }}>
                <div style={{ fontSize: '15px', fontWeight: 900 }}>AI Slop</div>
                <div style={{ fontSize: '14px', lineHeight: '22px', marginTop: '10px', opacity: 0.8 }}>
                  <p style={{ lineHeight: '1.6', marginLeft: '8px', fontStyle: 'italic' }}>
                    "审美是主观的，也需要有共性的。<Bold>vibe design</Bold>"
                  </p>
                  <p style={{ lineHeight: '1.6', marginLeft: '8px', fontStyle: 'italic' }}>
                    "越简单的审美，越容易被接受，并且存活的时间也越久。"
                  </p>
                  <p style={{ lineHeight: '1.6', marginLeft: '8px', fontStyle: 'italic' }}>
                    "细腻的交互，目前无法实现"
                  </p>
                </div>
              </motion.div>

              <motion.div variants={itemVariants} style={{ marginTop: '32px' }}>
                <div style={{ fontSize: '15px', fontWeight: 900 }}>UX Enginner</div>
                <div style={{ fontSize: '14px', lineHeight: '22px', marginTop: '10px', opacity: 0.8 }}>
                  <p style={{ lineHeight: '1.6', marginLeft: '8px', fontStyle: 'italic' }}>
                    "<Bold>Perfect Match</Bold>。 <Bold>UI</Bold>{' '}
                    开发介入到设计流程中，往往比设计师介入到开发流程中更简单。"
                  </p>
                </div>
              </motion.div>

              <motion.div variants={itemVariants} style={{ marginTop: '32px' }}>
                <div style={{ fontSize: '15px', fontWeight: 900 }}>Innovation</div>
                <div style={{ fontSize: '14px', lineHeight: '22px', marginTop: '10px', opacity: 0.8 }}>
                  <p style={{ lineHeight: '1.6', marginLeft: '8px', fontStyle: 'italic' }}>
                    "所有请求大模型接口工具应用，都能找到平替。"
                  </p>
                  <p style={{ lineHeight: '1.6', marginLeft: '8px', fontStyle: 'italic' }}>
                    "真正创新只存在模型底层。"
                  </p>
                </div>
              </motion.div>

              <motion.div variants={itemVariants} style={{ marginTop: '32px' }}>
                <div style={{ fontSize: '15px', fontWeight: 900 }}>Openion</div>
                <div style={{ fontSize: '14px', lineHeight: '22px', marginTop: '10px', opacity: 0.8 }}>
                  <p style={{ lineHeight: '1.6', marginLeft: '8px', fontStyle: 'italic' }}>
                    "<Bold>Stick with it</Bold>
                    。要坚持下去。不要因为别人一句话，否定你做了很久的事情。"
                  </p>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>

        <MagneticArrow onClick={() => navigate('/')} />
      </div>
    </div>
  )
}
