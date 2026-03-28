import { useNavigate } from 'react-router-dom'

const ICONS = { easy: '🟢', medium: '🟡', hard: '🔴', boss: '👾' }
const MODE_ICONS = { puzzle: '🧩', battle: '⚔️', quest: '🗺️', debug: '🐛', boss: '💀' }
const MODE_LABELS = { puzzle: 'Puzzle', battle: 'Battle', quest: 'Quest', debug: 'Debug', boss: 'Boss' }
const LANG_LABELS = { python: 'Python', javascript: 'JavaScript', cpp: 'C++', java: 'Java' }

export default function ChallengeCard({ challenge, completed, userLevel }) {
  const navigate = useNavigate()
  const locked = challenge.level_req > userLevel

  return (
    <div
      className={`challenge-card ${challenge.difficulty} ${locked ? 'locked' : ''}`}
      onClick={() => !locked && navigate(`/play/${challenge.id}`)}
    >
      {/* Icon */}
      <div style={{
        width: 44, height: 44, borderRadius: 10, flexShrink: 0,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: 20,
        background: challenge.difficulty === 'boss' ? 'rgba(236,72,153,0.1)' :
                    challenge.difficulty === 'hard' ? 'rgba(239,68,68,0.1)' :
                    challenge.difficulty === 'medium' ? 'rgba(245,158,11,0.1)' : 'rgba(16,185,129,0.1)',
        border: `1px solid ${
          challenge.difficulty === 'boss' ? 'rgba(236,72,153,0.25)' :
          challenge.difficulty === 'hard' ? 'rgba(239,68,68,0.25)' :
          challenge.difficulty === 'medium' ? 'rgba(245,158,11,0.25)' : 'rgba(16,185,129,0.25)'
        }`,
      }}>
        {completed ? '✅' : ICONS[challenge.difficulty]}
      </div>

      {/* Info */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 5, flexWrap: 'wrap' }}>
          <span style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-1)' }}>{challenge.title}</span>
          <span className={`pill pill-${challenge.difficulty}`}>{challenge.difficulty}</span>
          {locked && (
            <span style={{ fontSize: 10, color: 'var(--orange)', fontFamily: 'var(--mono)' }}>
              🔒 Unlock at Lvl {challenge.level_req}
            </span>
          )}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span className="mode-badge">{MODE_ICONS[challenge.game_mode]} {MODE_LABELS[challenge.game_mode]}</span>
          <span style={{ fontSize: 11, color: 'var(--text-3)', fontFamily: 'var(--mono)' }}>
            {LANG_LABELS[challenge.language]} · {Math.floor(challenge.time_limit / 60)}m
          </span>
        </div>
      </div>

      {/* XP */}
      <div style={{ textAlign: 'right', flexShrink: 0 }}>
        <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--orange)', fontFamily: 'var(--mono)' }}>
          +{challenge.xp_reward}
        </div>
        <div style={{ fontSize: 10, color: 'var(--text-3)' }}>
          {completed ? <span style={{ color: 'var(--green)' }}>Done ✓</span> : 'XP'}
        </div>
      </div>
    </div>
  )
}
