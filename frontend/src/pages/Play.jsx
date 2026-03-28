import { useEffect, useState } from 'react'
import api from '../api/client'
import useStore from '../store/useStore'
import ChallengeCard from '../components/ChallengeCard'

const LANG_FILTERS = [
  { key: 'all', label: 'All Languages' },
  { key: 'python', label: '🐍 Python' },
  { key: 'javascript', label: '⚡ JavaScript' },
  { key: 'cpp', label: '⚙️ C++' },
  { key: 'java', label: '☕ Java' },
]

const DIFF_FILTERS = [
  { key: 'all', label: 'All' },
  { key: 'easy', label: 'Easy' },
  { key: 'medium', label: 'Medium' },
  { key: 'hard', label: 'Hard' },
  { key: 'boss', label: '👾 Boss' },
]

export default function Play() {
  const { user } = useStore()
  const [challenges, setChallenges] = useState([])
  const [progress, setProgress] = useState([])
  const [lang, setLang] = useState('all')
  const [diff, setDiff] = useState('all')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([api.get('/challenges/'), api.get('/progress/my-challenges')])
      .then(([c, p]) => { setChallenges(c.data); setProgress(p.data) })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const completedIds = new Set(progress.filter(p => p.completed).map(p => p.challenge_id))
  const filtered = challenges.filter(c => (lang === 'all' || c.language === lang) && (diff === 'all' || c.difficulty === diff))

  const FilterBtn = ({ val, label, active, onClick }) => (
    <button onClick={onClick} style={{
      padding: '6px 14px', borderRadius: 8,
      fontSize: 12, fontWeight: 600, cursor: 'pointer',
      border: `1px solid ${active ? 'rgba(124,58,237,0.5)' : 'var(--border)'}`,
      background: active ? 'var(--purple-dim)' : 'transparent',
      color: active ? 'var(--purple-light)' : 'var(--text-3)',
      transition: 'all 0.15s',
    }}>{label}</button>
  )

  return (
    <div className="container page-enter">
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ marginBottom: 6 }}>Choose Your Battle</h1>
        <p style={{ fontSize: 13, color: 'var(--text-3)', fontFamily: 'var(--mono)' }}>
          // {challenges.length} challenges available · {completedIds.size} completed
        </p>
      </div>

      {/* Filters */}
      <div style={{ marginBottom: 24 }}>
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 10 }}>
          {LANG_FILTERS.map(f => (
            <FilterBtn key={f.key} val={f.key} label={f.label} active={lang === f.key} onClick={() => setLang(f.key)} />
          ))}
        </div>
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
          {DIFF_FILTERS.map(f => (
            <FilterBtn key={f.key} val={f.key} label={f.label} active={diff === f.key} onClick={() => setDiff(f.key)} />
          ))}
        </div>
      </div>

      {/* Challenge List */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: 60, color: 'var(--text-3)', fontFamily: 'var(--mono)' }}>
          Loading challenges...
        </div>
      ) : filtered.length === 0 ? (
        <div style={{ textAlign: 'center', padding: 60 }}>
          <div style={{ fontSize: 40, marginBottom: 12 }}>🤔</div>
          <div style={{ color: 'var(--text-3)', fontSize: 15 }}>No challenges match this filter</div>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {filtered.map(c => (
            <ChallengeCard key={c.id} challenge={c} completed={completedIds.has(c.id)} userLevel={user?.level || 1} />
          ))}
        </div>
      )}
    </div>
  )
}
