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
    const textColor = isDark ? '#c7c0b2' : '#5b544b'
    const gridColor = isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(23, 19, 16, 0.08)'

    chartRef.current = new Chart(canvasRef.current, {
      type: 'bar',
      data: {
        labels,
        datasets: [
          {
            label: 'Atividades',
            data,
            backgroundColor: colors,
            borderRadius: 999,
            borderSkipped: false,
            borderWidth: 0,
            barThickness: 28,
            maxBarThickness: 36,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          tooltip: {
            backgroundColor: isDark ? '#171c1f' : '#fffaf3',
            titleColor: isDark ? '#f6f3ed' : '#171310',
            bodyColor: isDark ? '#c7c0b2' : '#5b544b',
            borderColor: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(23,19,16,0.08)',
            borderWidth: 1,
            padding: 12,
          },
        },
        scales: {
          x: {
            ticks: {
              color: textColor,
              font: { family: 'Manrope', size: 12, weight: 600 },
            },
            grid: {
              color: gridColor,
            },
            border: { display: false },
          },
          y: {
            beginAtZero: true,
            ticks: {
              precision: 0,
              color: textColor,
              font: { family: 'Manrope', size: 11 },
            },
            grid: {
              color: gridColor,
            },
            border: { display: false },
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
