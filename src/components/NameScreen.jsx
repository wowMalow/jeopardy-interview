import React, { useMemo, useState } from 'react'

export default function NameScreen({ jobName, onBack, onStart }) {
  const [name, setName] = useState('')

  const canStart = useMemo(() => name.trim().length > 0, [name])

  return (
    <div className="panel">
      <h2 className="panelTitle">Кандидат на “{jobName}”</h2>

      <label className="label">Имя кандидата</label>
      <input
        className="input"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Например: Иван Петров"
        autoFocus
      />

      <div className="row">
        <button className="btn btnGhost" onClick={onBack}>Назад</button>
        <button className="btn" disabled={!canStart} onClick={() => onStart(name.trim())}>
          Начать
        </button>
      </div>
    </div>
  )
}