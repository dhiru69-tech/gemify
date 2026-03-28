import { useEffect, useState } from 'react'
import Confetti from 'react-confetti'

export default function LevelUpModal({ newLevel, onClose }) {
  const [size, setSize] = useState({ w: window.innerWidth, h: window.innerHeight })

  useEffect(() => {
    const resize = () => setSize({ w: window.innerWidth, h: window.innerHeight })
    window.addEventListener('resize', resize)
    const t = setTimeout(onClose, 6000)
    return () => { window.removeEventListener('resize', resize); clearTimeout(t) }
  }, [onClose])

  return (
    <div onClick={onClose} style={{
      position: 'fixed', inset: 0, zIndex: 9999,
      background: 'rgba(6,6,16,0.9)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      animation: 'fadeIn 0.3s ease',
    }}>
      <Confetti
        width={size.w} height={size.h}
        colors={['#7c3aed','#f97316','#a78bfa','#ec4899','#10b981','#fbbf24']}
        numberOfPieces={350} recycle={false}
      />
      <div style={{ textAlign: 'center', animation: 'levelUpPop 0.5s cubic-bezier(.22,1,.36,1) both' }}>
        <div style={{ fontSize: 80, marginBottom: 16 }}>🏆</div>
        <div style={{
          fontSize: 12, letterSpacing: 4, textTransform: 'uppercase',
          color: 'var(--purple-light)', fontFamily: 'var(--mono)', marginBottom: 12,
        }}>Level Up!</div>
        <div style={{
          fontSize: 96, fontWeight: 800, lineHeight: 1,
          background: 'linear-gradient(135deg, var(--purple-light), var(--orange))',
          WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
          marginBottom: 20,
        }}>{newLevel}</div>
        <div style={{ fontSize: 18, color: 'var(--text-2)', marginBottom: 8 }}>
          You reached Level {newLevel}!
        </div>
        <div style={{ fontSize: 13, color: 'var(--text-3)', fontFamily: 'var(--mono)' }}>
          New challenges unlocked. Keep grinding.
        </div>
        <div style={{ marginTop: 28, fontSize: 11, color: 'var(--text-4)' }}>
          Click anywhere to continue
        </div>
      </div>
    </div>
  )
}
