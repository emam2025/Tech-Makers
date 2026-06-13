"use client"
import React, { useState, useEffect } from 'react'

export default function HeroWithHalo() {
  const [seed, setSeed] = useState(12345)
  useEffect(() => setSeed(Math.floor(Math.random() * 90000) + 1000), [])

  return (
    <div className="halo-wrapper reveal mx-auto md:col-start-2 md:row-span-3">
      <svg className="halo-svg-inner" viewBox="0 0 300 300" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
        <defs>
          <filter id={`turb-${seed}`} x="-20%" y="-20%" width="140%" height="140%">
            <feTurbulence baseFrequency="0.009" numOctaves="3" seed={seed} result="turb" />
            <feDisplacementMap in="SourceGraphic" in2="turb" scale="26" xChannelSelector="R" yChannelSelector="G" />
          </filter>
        </defs>
        <circle cx="150" cy="150" r="150" fill="#FFDD57" filter={`url(#turb-${seed})`} />
      </svg>

      <img src="/tech-1.png" alt="طفل يتعلم البرمجة" loading="lazy" className="halo-image-inner hero-img" />

      <div className="orbit-inner" aria-hidden="true">
        <div className="orb spin" style={{ ['--r']: '140px', ['--size']: '40px', ['--d']: '10s' }}>
          <div className="emoji">🚀</div>
        </div>
        <div className="orb spin-rev" style={{ ['--r']: '120px', ['--size']: '36px', ['--d']: '7s' }}>
          <div className="emoji">🤖</div>
        </div>
        <div className="orb spin" style={{ ['--r']: '160px', ['--size']: '32px', ['--d']: '13s' }}>
          <div className="emoji">🔬</div>
        </div>
      </div>
    </div>
  )
}
