import React, { useEffect, useMemo, useState } from 'react'
import { makeQuizRuntime } from './state'
import Header from '../components/Header'
import JobSelect from '../components/JobSelect'
import NameScreen from '../components/NameScreen'
import Board from '../components/Board'
import QuestionScreen from '../components/QuestionScreen'
import FinishScreen from '../components/FinishScreen'

export default function App() {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [quiz, setQuiz] = useState([])

  const [screen, setScreen] = useState('job') 
  // job -> name -> board -> question -> finish

  const [selectedJobId, setSelectedJobId] = useState(null)
  const [candidateName, setCandidateName] = useState('')

  // ответы: { [questionId]: 'like' | 'dislike' }
  const [answers, setAnswers] = useState({})
  const [activeQuestionId, setActiveQuestionId] = useState(null)

  useEffect(() => {
    let ignore = false
    async function load() {
      try {
        setLoading(true)
        setError(null)
        const res = await fetch('./quiz.json', { cache: 'no-store' })
        if (!res.ok) throw new Error(`Не удалось загрузить quiz.json (${res.status})`)
        const data = await res.json()
        if (!Array.isArray(data)) throw new Error('quiz.json должен быть массивом вакансий')
        const runtime = makeQuizRuntime(data)
        if (!ignore) setQuiz(runtime)
      } catch (e) {
        if (!ignore) setError(e?.message || String(e))
      } finally {
        if (!ignore) setLoading(false)
      }
    }
    load()
    return () => { ignore = true }
  }, [])

  const selectedJob = useMemo(() => {
    return quiz.find(j => j.id === selectedJobId) || null
  }, [quiz, selectedJobId])

  const activeQuestion = useMemo(() => {
    if (!selectedJob || !activeQuestionId) return null
    for (const theme of selectedJob.themes) {
      const q = theme.questions.find(x => x.id === activeQuestionId)
      if (q) return { ...q, topic: theme.topic }
    }
    return null
  }, [selectedJob, activeQuestionId])

  const resetToStart = () => {
    setScreen('job')
    setSelectedJobId(null)
    setCandidateName('')
    setAnswers({})
    setActiveQuestionId(null)
  }

  const onPickJob = (jobId) => {
    setSelectedJobId(jobId)
    setScreen('name')
  }

  const onStart = (name) => {
    setCandidateName(name)
    setScreen('board')
  }

  const onOpenQuestion = (questionId) => {
    setActiveQuestionId(questionId)
    setScreen('question')
  }

  const onRate = (questionId, rate) => {
    setAnswers(prev => ({ ...prev, [questionId]: rate }))
    setActiveQuestionId(null)
    setScreen('board')
  }

  const onFinish = () => {
    setScreen('finish')
  }

  if (loading) {
    return (
      <div className="page">
        <Header title="Своя игра — интервью" />
        <div className="panel">Загрузка вопросов…</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="page">
        <Header title="Своя игра — интервью" />
        <div className="panel">
          <h2 className="panelTitle">Ошибка</h2>
          <pre className="errorBox">{error}</pre>
          <div className="row">
            <button className="btn" onClick={resetToStart}>Сбросить</button>
          </div>
          <p className="muted">
            Проверьте, что файл <code>public/quiz.json</code> существует и содержит валидный JSON.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="page">
      <Header title="Своя игра — интервью" subtitle={selectedJob?.name || ''} />

      {screen === 'job' && (
        <JobSelect
          jobs={quiz}
          onPick={onPickJob}
        />
      )}

      {screen === 'name' && selectedJob && (
        <NameScreen
          jobName={selectedJob.name}
          onBack={() => setScreen('job')}
          onStart={onStart}
        />
      )}

      {screen === 'board' && selectedJob && (
        <Board
          job={selectedJob}
          candidateName={candidateName}
          answers={answers}
          onOpenQuestion={onOpenQuestion}
          onFinish={onFinish}
          onRestart={resetToStart}
        />
      )}

      {screen === 'question' && activeQuestion && (
        <QuestionScreen
          candidateName={candidateName}
          jobName={selectedJob?.name}
          question={activeQuestion}
          alreadyAnswered={Boolean(answers[activeQuestion.id])}
          onLike={() => onRate(activeQuestion.id, 'like')}
          onDislike={() => onRate(activeQuestion.id, 'dislike')}
          onBack={() => { setActiveQuestionId(null); setScreen('board') }}
        />
      )}

      {screen === 'finish' && selectedJob && (
        <FinishScreen
          job={selectedJob}
          candidateName={candidateName}
          answers={answers}
          onRestart={resetToStart}
          onBack={() => setScreen('board')}
        />
      )}
    </div>
  )
}