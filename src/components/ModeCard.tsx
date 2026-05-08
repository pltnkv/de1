import { Link } from 'react-router-dom'

interface ModeCardProps {
  to: string
  title: string
  subtitle?: string
  count?: number
  emoji?: string
  emphasis?: boolean
}

export function ModeCard({ to, title, subtitle, count, emoji, emphasis }: ModeCardProps) {
  return (
    <Link to={to} className={`mode-card${emphasis ? ' mode-card--emphasis' : ''}`}>
      {emoji && (
        <span className="mode-card__emoji" aria-hidden="true">{emoji}</span>
      )}
      <span className="mode-card__body">
        <span className="mode-card__title">{title}</span>
        {subtitle && <span className="mode-card__subtitle">{subtitle}</span>}
      </span>
      {typeof count === 'number' && (
        <span className="mode-card__count" aria-label={`${count} questions`}>
          {count}
        </span>
      )}
    </Link>
  )
}
