import React, { useMemo } from 'react'
import Card from './Card'
import { computeTotals } from '../app/state'

export default function Board({
  job,
  candidateName,
  answers,
  onOpenQuestion,
  onFinish,
  onRestart
}) {
  // Максимальное количество вопросов в теме, чтобы выровнять таблицу
  const maxQ = useMemo(() => {
    return Math.max(...job.themes.map(t => t.questions.length))
  }, [job])

  const totals = useMemo(() => computeTotals({ job, answers }), [job, answers])

  return (
    <div className="panel panelWide">
      <div className="boardTop">
        <div className="scoreBox">
          <div className="scoreLabel">Кандидат</div>
          <div className="scoreValue">{candidateName}</div>
        </div>
        <div className="scoreBox">
          <div className="scoreLabel">Счёт</div>
          <div className="scoreValue">{totals.total}</div>
        </div>

        <div className="spacer" />

        <button className="btn btnGhost" onClick={onRestart} title="Сбросить игру">
          Сброс
        </button>
        <button className="btn" onClick={onFinish}>Завершить</button>
      </div>

      <div className="board">
        {job.themes.map(theme => {
          return (
            <div key={theme.id} className="boardRow">
              <Card variant="topic">
                <div className="topicText">{theme.topic}</div>
              </Card>

              {Array.from({ length: maxQ }).map((_, idx) => {
                const q = theme.questions[idx]
                if (!q) {
                  return (
                    <div key={`${theme.id}-empty-${idx}`} className="card cardEmpty" />
                  )
                }

                const wasAnswered = Boolean(answers[q.id])
                return (
                  <Card
                    key={q.id}
                    disabled={wasAnswered}
                    onClick={() => onOpenQuestion(q.id)}
                  >
                    <div className="valueText">
                      {wasAnswered ? '' : q.value}
                    </div>
                  </Card>
                )
              })}
            </div>
          )
        })}
      </div>
    </div>
  )
}