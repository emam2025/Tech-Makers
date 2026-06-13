"use client"
import React from 'react'
import Image from 'next/image'

export default function HeroWithHalo() {
  return (
    <div className="halo-wrapper reveal mx-auto md:col-start-2 md:row-span-3">
      <div className="halo-svg-inner" style={{ background: 'radial-gradient(circle, #FFDD57 0%, #FFE680 40%, transparent 70%)' }} aria-hidden="true" />

      <div className="halo-image-inner hero-img">
        <Image
          src="/tech-1.png"
          alt="طفل يتعلم البرمجة"
          fill
          sizes="(max-width: 480px) 192px, (max-width: 768px) 256px, 384px"
          priority
          style={{ objectFit: 'cover' }}
        />
      </div>

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
