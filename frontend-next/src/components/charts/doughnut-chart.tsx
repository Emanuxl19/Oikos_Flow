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
    const textColor = isDark ? '#c7c0b2' : '#5b544b'

    chartRef.current = new Chart(canvasRef.current, {
      type: 'doughnut',
      data: {
        labels,
        datasets: [
          {
            data,
            backgroundColor: colors,
            borderWidth: 0,
            hoverOffset: 8,
            spacing: 4,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        cutout: '68%',
        plugins: {
          legend: {
            position: 'bottom',
            labels: {
              color: textColor,
              usePointStyle: true,
              pointStyle: 'circle',
              padding: 18,
              font: { family: 'Manrope', size: 12, weight: 600 },
            },
          },
          tooltip: {
            backgroundColor: isDark ? '#171c1f' : '#fffaf3',
            titleColor: isDark ? '#f6f3ed' : '#171310',
            bodyColor: isDark ? '#c7c0b2' : '#5b544b',
            borderColor: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(23,19,16,0.08)',
            borderWidth: 1,
            padding: 12,
          },
        },
      },
    })

    return () => {
      chartRef.current?.destroy()
    }
  }, [labels, data, colors])

  return <canvas ref={canvasRef} />
}
