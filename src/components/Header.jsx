import React from 'react'

export default function Header({ title, subtitle }) {
  return (
    <div className="header">
      <div className="brand">
        <div className="brandTitle">{title}</div>
        {subtitle ? <div className="brandSub">{subtitle}</div> : null}
      </div>
    </div>
  )
}