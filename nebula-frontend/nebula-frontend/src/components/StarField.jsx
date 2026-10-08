import React, { useEffect, useRef } from 'react'

export default function StarField() {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    let animId

    const resize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    resize()
    window.addEventListener('resize', resize)

    // Generate stars
    const stars = Array.from({ length: 200 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      r: Math.random() * 1.5 + 0.3,
      alpha: Math.random(),
      speed: Math.random() * 0.005 + 0.002,
      color: Math.random() > 0.7 ? '#00e5ff' : Math.random() > 0.5 ? '#ff2d78' : '#ffffff',
    }))

    // Constellation connections (random pairs)
    const connections = []
    for (let i = 0; i < 15; i++) {
      const a = Math.floor(Math.random() * stars.length)
      const b = Math.floor(Math.random() * stars.length)
      const dx = stars[a].x - stars[b].x
      const dy = stars[a].y - stars[b].y
      if (Math.sqrt(dx * dx + dy * dy) < 150) connections.push([a, b])
    }

    // Shooting star
    let shootingStar = null
    const spawnShooting = () => {
      shootingStar = {
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height * 0.5,
        len: 80 + Math.random() * 80,
        speed: 6 + Math.random() * 4,
        alpha: 1,
      }
      setTimeout(spawnShooting, 4000 + Math.random() * 6000)
    }
    setTimeout(spawnShooting, 2000)

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // Draw constellation lines
      connections.forEach(([a, b]) => {
        ctx.beginPath()
        ctx.moveTo(stars[a].x, stars[a].y)
        ctx.lineTo(stars[b].x, stars[b].y)
        ctx.strokeStyle = '#00e5ff18'
        ctx.lineWidth = 0.8
        ctx.setLineDash([3, 6])
        ctx.stroke()
        ctx.setLineDash([])
      })

      // Draw stars
      stars.forEach((s) => {
        s.alpha += s.speed * (Math.random() > 0.5 ? 1 : -1)
        s.alpha = Math.max(0.1, Math.min(1, s.alpha))

        ctx.beginPath()
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2)
        ctx.fillStyle = s.color + Math.floor(s.alpha * 255).toString(16).padStart(2, '0')
        ctx.fill()

        // Glow for colored stars
        if (s.color !== '#ffffff') {
          ctx.beginPath()
          ctx.arc(s.x, s.y, s.r * 3, 0, Math.PI * 2)
          const grad = ctx.createRadialGradient(s.x, s.y, 0, s.x, s.y, s.r * 3)
          grad.addColorStop(0, s.color + '44')
          grad.addColorStop(1, 'transparent')
          ctx.fillStyle = grad
          ctx.fill()
        }
      })

      // Draw shooting star
      if (shootingStar) {
        ctx.beginPath()
        ctx.moveTo(shootingStar.x, shootingStar.y)
        ctx.lineTo(shootingStar.x + shootingStar.len, shootingStar.y + shootingStar.len * 0.4)
        const grad = ctx.createLinearGradient(
          shootingStar.x, shootingStar.y,
          shootingStar.x + shootingStar.len, shootingStar.y + shootingStar.len * 0.4
        )
        grad.addColorStop(0, `rgba(255,255,255,${shootingStar.alpha})`)
        grad.addColorStop(1, 'transparent')
        ctx.strokeStyle = grad
        ctx.lineWidth = 1.5
        ctx.stroke()

        shootingStar.x += shootingStar.speed * 2
        shootingStar.y += shootingStar.speed
        shootingStar.alpha -= 0.02
        if (shootingStar.alpha <= 0) shootingStar = null
      }

      animId = requestAnimationFrame(draw)
    }

    draw()

    return () => {
      cancelAnimationFrame(animId)
      window.removeEventListener('resize', resize)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0"
      style={{ background: 'radial-gradient(ellipse at center, #0d1b3e 0%, #050a1a 70%)' }}
    />
  )
}
