import { ReactNode, useRef } from 'react'
import { useReducedMotion } from 'framer-motion'
import { cn } from '@/lib/utils'

type TiltProps = {
  children: ReactNode
  className?: string
  max?: number
}

export function Tilt({ children, className, max = 8 }: TiltProps) {
  const ref = useRef<HTMLDivElement | null>(null)
  const reduceMotion = useReducedMotion()

  function handleMove(e: React.PointerEvent<HTMLDivElement>) {
    if (reduceMotion) return
    const el = ref.current
    if (!el) return

    const rect = el.getBoundingClientRect()
    const px = (e.clientX - rect.left) / rect.width
    const py = (e.clientY - rect.top) / rect.height
    const ry = (px - 0.5) * 2 * max
    const rx = (0.5 - py) * 2 * max

    el.style.setProperty('--tilt-rx', `${rx.toFixed(2)}deg`)
    el.style.setProperty('--tilt-ry', `${ry.toFixed(2)}deg`)
  }

  function handleLeave() {
    const el = ref.current
    if (!el) return
    el.style.setProperty('--tilt-rx', '0deg')
    el.style.setProperty('--tilt-ry', '0deg')
  }

  return (
    <div
      ref={ref}
      onPointerMove={handleMove}
      onPointerLeave={handleLeave}
      className={cn(
        'transform-gpu [transform-style:preserve-3d] [perspective:1200px]',
        '[transform:rotateX(var(--tilt-rx))_rotateY(var(--tilt-ry))]',
        'transition-[transform] duration-300 ease-out',
        className
      )}
      style={{ ['--tilt-rx' as never]: '0deg', ['--tilt-ry' as never]: '0deg' }}
    >
      {children}
    </div>
  )
}

