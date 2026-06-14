"use client"
import { useState, useEffect } from 'react'

export default function CountdownTimer({ endDate }) {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 })

  useEffect(() => {
    const calc = () => {
      const diff = new Date(endDate).getTime() - Date.now()
      if (diff <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0 }
      return {
        days: Math.floor(diff / (1000 * 60 * 60 * 24)),
        hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((diff / (1000 * 60)) % 60),
        seconds: Math.floor((diff / 1000) % 60),
      }
    }
    setTimeLeft(calc())
    const timer = setInterval(() => setTimeLeft(calc()), 1000)
    return () => clearInterval(timer)
  }, [endDate])

  const blocks = [
    { label: 'يوم', value: timeLeft.days },
    { label: 'ساعة', value: timeLeft.hours },
    { label: 'دقيقة', value: timeLeft.minutes },
    { label: 'ثانية', value: timeLeft.seconds },
  ]

  return (
    <div className="flex justify-center gap-2 sm:gap-3">
      {blocks.map((b, i) => (
        <div key={i} className="flex flex-col items-center">
          <div className="w-14 h-14 sm:w-16 sm:h-16 bg-white rounded-xl flex items-center justify-center shadow-lg border border-tertiary/20">
            <span className="text-primary-deep text-xl sm:text-2xl font-bold tabular-nums">{String(b.value).padStart(2, '0')}</span>
          </div>
          <span className="text-[10px] sm:text-xs text-white/70 mt-1">{b.label}</span>
        </div>
      ))}
    </div>
  )
}
