import React from 'react'

const planetColors = [
  ['#ff2d78', '#7b2fff'],
  ['#00e5ff', '#0044ff'],
  ['#ff6b35', '#ff2d78'],
  ['#7b2fff', '#00e5ff'],
  ['#00ff88', '#00e5ff'],
]

export default function PlanetAvatar({ name = '', size = 40, online = false, showRing = true }) {
  const idx = name.charCodeAt(0) % planetColors.length
  const [c1, c2] = planetColors[idx]
  const letter = name.charAt(0).toUpperCase()

  return (
    <div className="relative flex-shrink-0" style={{ width: size, height: size }}>
      {/* Ring */}
      {showRing && (
        <div
          className="absolute inset-0 rounded-full"
          style={{
            background: `conic-gradient(from 0deg, ${c1}, ${c2}, ${c1})`,
            padding: 2,
            animation: 'orbit-ring 4s linear infinite',
          }}
        >
          <div className="w-full h-full rounded-full bg-nebula-bg" />
        </div>
      )}

      {/* Planet body */}
      <div
        className="absolute rounded-full flex items-center justify-center font-display font-bold"
        style={{
          inset: showRing ? 3 : 0,
          background: `radial-gradient(circle at 35% 35%, ${c1}88, ${c2}cc)`,
          fontSize: size * 0.35,
          color: '#fff',
          boxShadow: `0 0 ${size * 0.4}px ${c1}66`,
        }}
      >
        {letter}
      </div>

      {/* Online indicator */}
      {online && (
        <div
          className="absolute bottom-0 right-0 rounded-full border-2 border-nebula-bg status-online"
          style={{ width: size * 0.28, height: size * 0.28 }}
        />
      )}
    </div>
  )
}
