import React from 'react'

export default function Card({ children, onClick, disabled, variant = 'cell' }) {
  const className =
    variant === 'topic'
      ? 'card cardTopic'
      : disabled
      ? 'card cardDisabled'
      : 'card cardActive'

  const Tag = onClick ? 'button' : 'div'

  return (
    <Tag
      className={className}
      onClick={disabled ? undefined : onClick}
      type={onClick ? 'button' : undefined}
      aria-disabled={disabled || undefined}
    >
      {children}
    </Tag>
  )
}