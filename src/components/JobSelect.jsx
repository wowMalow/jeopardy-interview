import React from 'react'

export default function JobSelect({ jobs, onPick }) {
  return (
    <div className="panel">
      <h2 className="panelTitle">Выберите вакансию</h2>
      <div className="gridJobs">
        {jobs.map(job => (
          <button
            key={job.id}
            className="jobBtn"
            onClick={() => onPick(job.id)}
          >
            {job.name}
          </button>
        ))}
      </div>
    </div>
  )
}