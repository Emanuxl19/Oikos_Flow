'use client'

import { useRef, useEffect } from 'react'
import { Chart, registerables } from 'chart.js'

Chart.register(...registerables)

interface Props {
  labels: string[]
  data: number[]
  colors: string[]
}

export function DoughnutChart({ labels, data, colors }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const chartRef = useRef<Chart | null>(null)

  useEffect(() => {
    if (!canvasRef.current) return

    chartRef.current?.destroy()

    const isDark = document.documentElement.classList.contains('dark')
    const textColor = isDark ? '#cbd5e1' : '#475569'

    chartRef.current = new Chart(canvasRef.current, {
      type: 'doughnut',
      data: {
        labels,
        datasets: [{
          data,
          backgroundColor: colors,
          borderWidth: 0,
        }],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'bottom',
            labels: {
              color: textColor,
              usePointStyle: true,
              padding: 16,
              font: { family: 'DM Sans', size: 12 },
            },
          },
        },
      },
    })

    return () => { chartRef.current?.destroy() }
  }, [labels, data, colors])

  return <canvas ref={canvasRef} />
}
