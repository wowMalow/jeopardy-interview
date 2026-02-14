export function makeQuizRuntime(quiz) {
  // Добавим стабильные id, чтобы хранить "отыгранность"
  return quiz.map((job, jobIndex) => ({
    ...job,
    id: `job-${jobIndex}`,
    themes: job.themes.map((t, themeIndex) => ({
      ...t,
      id: `job-${jobIndex}-theme-${themeIndex}`,
      questions: t.questions.map((q, qIndex) => ({
        ...q,
        id: `job-${jobIndex}-theme-${themeIndex}-q-${qIndex}`
      }))
    }))
  }))
}

export function computeTotals({ job, answers }) {
  // answers: { [questionId]: 'like' | 'dislike' }
  const perTopic = {}
  let total = 0

  for (const theme of job.themes) {
    let sum = 0
    for (const q of theme.questions) {
      if (answers[q.id] === 'like') sum += q.value
    }
    perTopic[theme.topic] = sum
    total += sum
  }

  return { total, perTopic }
}

export function formatResultText({ candidateName, jobName, totals }) {
  const lines = []
  lines.push(`Кандидат: ${candidateName}`)
  lines.push(`Вакансия: ${jobName}`)
  lines.push(`Итого баллов: ${totals.total}`)
  lines.push('')
  lines.push('Баллы по категориям:')
  for (const [topic, value] of Object.entries(totals.perTopic)) {
    lines.push(`- ${topic}: ${value}`)
  }
  return lines.join('\n')
}