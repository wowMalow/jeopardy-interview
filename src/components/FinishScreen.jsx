import React, { useMemo, useState } from 'react'
import { computeTotals, formatResultText } from '../app/state'

export default function FinishScreen({ job, candidateName, answers, onRestart, onBack }) {
  const totals = useMemo(() => computeTotals({ job, answers }), [job, answers])
  const text = useMemo(() => formatResultText({
    candidateName,
    jobName: job.name,
    totals
  }), [candidateName, job.name, totals])

  const [copied, setCopied] = useState(false)

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      setTimeout(() => setCopied(false), 1200)
    } catch {
      // fallback
      const ta = document.createElement('textarea')
      ta.value = text
      document.body.appendChild(ta)
      ta.select()
      document.execCommand('copy')
      document.body.removeChild(ta)
      setCopied(true)
      setTimeout(() => setCopied(false), 1200)
    }
  }

  return (
    <div className="panel">
      <h2 className="panelTitle">Результат</h2>

      <pre className="resultBox">{text}</pre>

      <div className="row">
        <button className="btn btnGhost" onClick={onBack}>Назад к полю</button>
        <button className="btn" onClick={copy}>
          {copied ? 'Скопировано' : 'Копировать'}
        </button>
        <button className="btn btnGhost" onClick={onRestart}>Новая игра</button>
      </div>
    </div>
  )
}