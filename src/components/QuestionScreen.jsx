import React from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

export default function QuestionScreen({
  candidateName,
  jobName,
  question,
  alreadyAnswered,
  onLike,
  onDislike,
  onBack
}) {
  return (
    <div className="panel panelWide">
      <div className="questionTop">
        <button className="btn btnGhost" onClick={onBack}>← К полю</button>
        <div className="questionMeta">
          <div className="muted small">Вакансия: {jobName}</div>
          <div className="muted small">Кандидат: {candidateName}</div>
        </div>
        <div className="spacer" />
        <div className="pill">{question.topic}</div>
        <div className="pill pillGold">{question.value}</div>
      </div>

      <div className="questionBody markdown">
        <ReactMarkdown remarkPlugins={[remarkGfm]}>
          {question.content}
        </ReactMarkdown>
      </div>

      <div className="row">
        <button className="btn btnBad" onClick={onDislike} disabled={alreadyAnswered}>
          Дизлайк (0)
        </button>
        <button className="btn btnGood" onClick={onLike} disabled={alreadyAnswered}>
          Лайк (+{question.value})
        </button>
      </div>

      {alreadyAnswered ? (
        <div className="muted small">
          Этот вопрос уже оценён и не может быть переоценён.
        </div>
      ) : null}
    </div>
  )
}