import { useEffect, useState, useRef } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import Editor from '@monaco-editor/react'
import toast from 'react-hot-toast'
import api from '../api/client'
import useStore from '../store/useStore'
import LevelUpModal from '../components/LevelUpModal'

const MODE_ICONS = { puzzle: '🧩', battle: '⚔️', quest: '🗺️', debug: '🐛', boss: '👾' }
const LANG_MAP = { python: 'python', javascript: 'javascript', cpp: 'cpp', java: 'java' }

export default function GamePlay() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { addXP } = useStore()
  const [ch, setCh] = useState(null)
  const [code, setCode] = useState('')
  const [timeLeft, setTimeLeft] = useState(0)
  const [hintsUsed, setHintsUsed] = useState(0)
  const [hintText, setHintText] = useState(null)
  const [submitting, setSubmitting] = useState(false)
  const [result, setResult] = useState(null)
  const [levelUp, setLevelUp] = useState(null)
  const [xpFloat, setXpFloat] = useState(null)
  const [tab, setTab] = useState('problem')
  const startTime = useRef(Date.now())
  const timerRef = useRef(null)

  useEffect(() => {
    api.get(`/challenges/${id}`).then(r => {
      setCh(r.data)
      setCode(r.data.starter_code)
      setTimeLeft(r.data.time_limit)
      startTime.current = Date.now()
    }).catch(() => navigate('/play'))
  }, [id])

  useEffect(() => {
    if (!ch) return
    timerRef.current = setInterval(() => {
      setTimeLeft(t => {
        if (t <= 1) { clearInterval(timerRef.current); toast.error("Time's up!"); return 0 }
        return t - 1
      })
    }, 1000)
    return () => clearInterval(timerRef.current)
  }, [ch])

  const fmt = (s) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`
  const timerClass = timeLeft < 60 ? 'timer danger' : timeLeft < 120 ? 'timer warning' : 'timer normal'

  const showHint = () => {
    if (!ch || hintsUsed >= ch.hints.length) return
    setHintText(ch.hints[hintsUsed])
    setHintsUsed(h => h + 1)
    toast(`Hint used — 10 XP penalty`, { icon: '💡' })
  }

  const submit = async () => {
    if (!ch || submitting || timeLeft === 0) return
    setSubmitting(true)
    clearInterval(timerRef.current)
    const timeTaken = (Date.now() - startTime.current) / 1000
    try {
      const { data } = await api.post('/challenges/submit', { challenge_id: parseInt(id), code, time_taken: timeTaken, hints_used: hintsUsed })
      setResult(data)
      if (data.passed) {
        setXpFloat(`+${data.xp_earned} XP`)
        setTimeout(() => setXpFloat(null), 2500)
        addXP(data.xp_earned, data.level_up ? data.new_level : null)
        if (data.level_up) {
          setTimeout(() => setLevelUp(data.new_level), 600)
        } else {
          toast.success(`+${data.xp_earned} XP${data.streak_bonus ? ' · 🔥 Streak bonus!' : ''}`)
        }
      } else {
        toast.error(data.message)
      }
    } catch (err) {
      toast.error(err.response?.data?.detail || 'Submission failed')
    } finally {
      setSubmitting(false)
    }
  }

  if (!ch) return (
    <div style={{ height: 'calc(100vh - 60px)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-3)', fontFamily: 'var(--mono)' }}>
      Loading challenge...
    </div>
  )

  return (
    <div style={{ height: 'calc(100vh - 60px)', display: 'flex', flexDirection: 'column', background: 'var(--bg-0)' }}>
      {/* Top Bar */}
      <div style={{
        background: 'var(--bg-1)', borderBottom: '1px solid var(--border)',
        padding: '10px 20px', display: 'flex', alignItems: 'center', gap: 14, flexShrink: 0,
      }}>
        <button className="btn btn-secondary btn-sm" onClick={() => navigate('/play')}>← Back</button>

        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ fontSize: 15, fontWeight: 700 }}>{ch.title}</span>
            <span className={`pill pill-${ch.difficulty}`}>{ch.difficulty}</span>
            <span className="mode-badge">{MODE_ICONS[ch.game_mode]} {ch.game_mode}</span>
          </div>
          <div style={{ fontSize: 11, color: 'var(--text-3)', fontFamily: 'var(--mono)', marginTop: 2 }}>
            {ch.language} · +{ch.xp_reward} XP base reward
          </div>
        </div>

        <div className={timerClass}>{fmt(timeLeft)}</div>

        <button className="btn btn-secondary btn-sm" onClick={showHint} disabled={hintsUsed >= ch.hints.length}>
          💡 Hint ({ch.hints.length - hintsUsed})
        </button>

        <button
          className="btn btn-primary"
          style={{ padding: '9px 22px', fontSize: 13 }}
          onClick={submit}
          disabled={submitting || timeLeft === 0}
        >
          {submitting ? 'Running...' : '▶ Submit'}
        </button>
      </div>

      {/* Split Layout */}
      <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
        {/* Left Panel */}
        <div style={{
          width: 360, flexShrink: 0,
          background: 'var(--bg-1)', borderRight: '1px solid var(--border)',
          display: 'flex', flexDirection: 'column', overflow: 'hidden',
        }}>
          {/* Tabs */}
          <div style={{ display: 'flex', borderBottom: '1px solid var(--border)', padding: '0 16px' }}>
            {['problem', 'hints'].map(t => (
              <button key={t} onClick={() => setTab(t)} style={{
                padding: '12px 14px', fontSize: 12, fontWeight: 600, cursor: 'pointer',
                background: 'none', border: 'none', textTransform: 'capitalize',
                color: tab === t ? 'var(--purple-light)' : 'var(--text-3)',
                borderBottom: `2px solid ${tab === t ? 'var(--purple)' : 'transparent'}`,
                transition: 'all 0.15s',
              }}>{t}</button>
            ))}
          </div>

          <div style={{ flex: 1, overflowY: 'auto', padding: 20 }}>
            {tab === 'problem' && (
              <>
                {ch.story && (
                  <div style={{
                    background: 'rgba(124,58,237,0.08)', border: '1px solid rgba(124,58,237,0.2)',
                    borderRadius: 10, padding: '12px 14px', marginBottom: 18,
                    fontSize: 12, color: 'var(--purple-light)', lineHeight: 1.7, fontStyle: 'italic',
                  }}>
                    {ch.story}
                  </div>
                )}
                <h3 style={{ fontSize: 16, marginBottom: 12 }}>{ch.title}</h3>
                <p style={{ fontSize: 13, color: 'var(--text-2)', lineHeight: 1.75, marginBottom: 20 }}>{ch.description}</p>

                {result && (
                  <div style={{
                    background: result.passed ? 'rgba(16,185,129,0.08)' : 'rgba(239,68,68,0.08)',
                    border: `1px solid ${result.passed ? 'rgba(16,185,129,0.3)' : 'rgba(239,68,68,0.3)'}`,
                    borderRadius: 10, padding: 16, animation: 'fadeInUp 0.3s ease',
                  }}>
                    <div style={{ fontWeight: 700, color: result.passed ? 'var(--green)' : 'var(--red)', marginBottom: 8, fontSize: 14 }}>
                      {result.passed ? '✅ All tests passed!' : '❌ Tests failed'}
                    </div>
                    <div style={{ fontSize: 12, color: 'var(--text-2)', lineHeight: 1.6, marginBottom: result.passed ? 12 : 0 }}>
                      {result.message}
                    </div>
                    {result.passed && (
                      <>
                        <div style={{ fontSize: 14, color: 'var(--orange)', fontWeight: 700, fontFamily: 'var(--mono)' }}>
                          +{result.xp_earned} XP earned
                        </div>
                        {result.streak_bonus && <div style={{ fontSize: 11, color: 'var(--amber)', marginTop: 4 }}>🔥 Streak bonus applied!</div>}
                        <button className="btn btn-secondary btn-sm" style={{ marginTop: 14, width: '100%' }} onClick={() => navigate('/play')}>
                          Back to Challenges
                        </button>
                      </>
                    )}
                  </div>
                )}
              </>
            )}

            {tab === 'hints' && (
              <div>
                <p style={{ fontSize: 13, color: 'var(--text-3)', marginBottom: 16 }}>
                  Each hint costs 10 XP. Use wisely.
                </p>
                {hintsUsed === 0 ? (
                  <button className="btn btn-secondary" style={{ width: '100%' }} onClick={showHint}>
                    Reveal Hint 1
                  </button>
                ) : (
                  ch.hints.slice(0, hintsUsed).map((h, i) => (
                    <div key={i} style={{
                      background: 'rgba(245,158,11,0.07)', border: '1px solid rgba(245,158,11,0.2)',
                      borderRadius: 8, padding: '10px 14px', marginBottom: 10,
                      fontSize: 12, color: 'var(--amber)', lineHeight: 1.65,
                    }}>
                      💡 Hint {i + 1}: {h}
                    </div>
                  ))
                )}
                {hintsUsed > 0 && hintsUsed < ch.hints.length && (
                  <button className="btn btn-secondary btn-sm" style={{ marginTop: 8, width: '100%' }} onClick={showHint}>
                    Reveal Hint {hintsUsed + 1}
                  </button>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Editor */}
        <div style={{ flex: 1, position: 'relative' }}>
          <Editor
            height="100%"
            language={LANG_MAP[ch.language]}
            value={code}
            onChange={val => setCode(val || '')}
            theme="vs-dark"
            options={{
              fontSize: 14,
              fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
              minimap: { enabled: false },
              scrollBeyondLastLine: false,
              lineNumbers: 'on',
              renderLineHighlight: 'all',
              cursorBlinking: 'smooth',
              padding: { top: 20, bottom: 20 },
              tabSize: 4,
              wordWrap: 'on',
              bracketPairColorization: { enabled: true },
            }}
          />

          {/* Floating XP */}
          {xpFloat && (
            <div style={{
              position: 'absolute', top: 20, right: 20,
              background: 'var(--orange)', color: '#fff',
              fontWeight: 800, fontSize: 20, padding: '10px 20px',
              borderRadius: 12, fontFamily: 'var(--mono)',
              animation: 'floatXP 2.5s ease forwards', pointerEvents: 'none',
            }}>
              {xpFloat}
            </div>
          )}
        </div>
      </div>

      {levelUp && (
        <LevelUpModal newLevel={levelUp} onClose={() => { setLevelUp(null); navigate('/dashboard') }} />
      )}
    </div>
  )
}
