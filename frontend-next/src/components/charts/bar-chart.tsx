'use client'

import { useRef, useEffect } from 'react'
import { Chart, registerables } from 'chart.js'

Chart.register(...registerables)

interface Props {
  labels: string[]
  data: number[]
  colors: string[]
}

export function BarChart({ labels, data, colors }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const chartRef = useRef<Chart | null>(null)

  useEffect(() => {
    if (!canvasRef.current) return

    chartRef.current?.destroy()

    const isDark = document.documentElement.classList.contains('dark')
    const textColor = isDark ? '#cbd5e1' : '#475569'
    const gridColor = isDark ? 'rgba(148, 163, 184, 0.12)' : 'rgba(0, 0, 0, 0.06)'

    chartRef.current = new Chart(canvasRef.current, {
      type: 'bar',
      data: {
        labels,
        datasets: [{
          label: 'Atividades',
          data,
          backgroundColor: colors,
          borderRadius: 6,
          borderWidth: 0,
        }],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: false } },
        scales: {
          x: {
            ticks: { color: textColor, font: { family: 'DM Sans' } },
            grid: { color: gridColor },
          },
          y: {
            beginAtZero: true,
            ticks: { precision: 0, color: textColor, font: { family: 'DM Sans' } },
            grid: { color: gridColor },
          },
        },
      },
    })

    return () => { chartRef.current?.destroy() }
  }, [labels, data, colors])

  return <canvas ref={canvasRef} />
}
