import { Link } from 'react-router-dom'

const FEATURES = [
  { icon: '🧩', title: 'Puzzle Mode', desc: 'Fill in the blanks. Build your muscle memory one block at a time.' },
  { icon: '⚔️', title: 'Battle Mode', desc: 'Race the clock. The faster you solve it, the more XP you earn.' },
  { icon: '🗺️', title: 'Quest Mode', desc: 'Story-driven challenges with real-world context.' },
  { icon: '🐛', title: 'Debug Hunt', desc: 'Find and fix the bug. The skill every senior dev needs.' },
  { icon: '👾', title: 'Boss Fights', desc: 'Capstone challenges that gate your level progression.' },
  { icon: '🏆', title: 'Leaderboard', desc: 'Compete weekly. Climb the global rankings.' },
]

const LANGUAGES = [
  { icon: '🐍', name: 'Python', color: '#3b82f6', challenges: '12+' },
  { icon: '⚡', name: 'JavaScript', color: '#f59e0b', challenges: '8+' },
  { icon: '⚙️', name: 'C++', color: '#a78bfa', challenges: '6+' },
  { icon: '☕', name: 'Java', color: '#f97316', challenges: '5+' },
]

const STATS = [['4+', 'Languages'], ['5', 'Game Modes'], ['20', 'Levels'], ['29+', 'Challenges']]

export default function Landing() {
  return (
    <div style={{ minHeight: '100vh', overflowX: 'hidden' }}>
      {/* Background */}
      <div style={{
        position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 0,
        background: 'radial-gradient(ellipse 80% 50% at 50% -10%, rgba(124,58,237,0.15), transparent)',
      }} />

      {/* Hero */}
      <section style={{ position: 'relative', zIndex: 1, padding: '100px 24px 80px', textAlign: 'center', maxWidth: 760, margin: '0 auto', animation: 'fadeInUp 0.5s ease' }}>
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: 8,
          background: 'rgba(124,58,237,0.1)', border: '1px solid rgba(124,58,237,0.3)',
          borderRadius: 'var(--r-full)', padding: '6px 16px',
          fontSize: 12, color: 'var(--purple-light)', fontFamily: 'var(--mono)',
          marginBottom: 32, letterSpacing: 1,
        }}>
          ✦ Learn by Playing — Not by Watching
        </div>

        <h1 style={{ fontSize: 'clamp(36px, 6vw, 68px)', fontWeight: 800, lineHeight: 1.05, marginBottom: 24, letterSpacing: '-1.5px' }}>
          Level Up Your{' '}
          <span style={{
            background: 'linear-gradient(135deg, var(--purple-light), var(--orange))',
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
          }}>
            Coding Skills
          </span>
          {' '}Through Games
        </h1>

        <p style={{ fontSize: 18, color: 'var(--text-2)', lineHeight: 1.7, marginBottom: 40, maxWidth: 520, margin: '0 auto 40px' }}>
          Master programming through puzzles, boss fights, and timed battles. Earn XP, climb ranks, and unlock new challenges.
        </p>

        <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap', marginBottom: 64 }}>
          <Link to="/register">
            <button className="btn btn-primary btn-lg" style={{
              background: 'linear-gradient(135deg, var(--purple), var(--purple-2))',
              boxShadow: '0 0 30px rgba(124,58,237,0.35)',
            }}>
              Start for Free →
            </button>
          </Link>
          <Link to="/login">
            <button className="btn btn-secondary btn-lg">Sign In</button>
          </Link>
        </div>

        {/* Stats */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: 48, flexWrap: 'wrap' }}>
          {STATS.map(([num, label]) => (
            <div key={label} style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 32, fontWeight: 800, color: 'var(--purple-light)', fontFamily: 'var(--mono)' }}>{num}</div>
              <div style={{ fontSize: 12, color: 'var(--text-3)', marginTop: 2 }}>{label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Languages */}
      <section style={{ position: 'relative', zIndex: 1, padding: '60px 24px', maxWidth: 900, margin: '0 auto' }}>
        <h2 style={{ textAlign: 'center', marginBottom: 32, color: 'var(--text-2)', fontSize: 14, fontWeight: 500, letterSpacing: 2, textTransform: 'uppercase' }}>
          Four Languages. One Platform.
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: 12 }}>
          {LANGUAGES.map(lang => (
            <div key={lang.name} className="card" style={{ padding: '20px', textAlign: 'center', cursor: 'default' }}>
              <div style={{ fontSize: 32, marginBottom: 10 }}>{lang.icon}</div>
              <div style={{ fontWeight: 700, fontSize: 15, color: lang.color, marginBottom: 4 }}>{lang.name}</div>
              <div style={{ fontSize: 11, color: 'var(--text-3)', fontFamily: 'var(--mono)' }}>{lang.challenges} challenges</div>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section style={{ position: 'relative', zIndex: 1, padding: '60px 24px', maxWidth: 960, margin: '0 auto' }}>
        <h2 style={{ textAlign: 'center', marginBottom: 12 }}>Five Ways to Learn</h2>
        <p style={{ textAlign: 'center', color: 'var(--text-3)', marginBottom: 40, fontSize: 15 }}>
          Every game mode targets a different skill. You'll never get bored.
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(270px, 1fr))', gap: 14 }}>
          {FEATURES.map(f => (
            <div key={f.title} className="card" style={{ padding: '22px' }}>
              <div style={{ fontSize: 28, marginBottom: 12 }}>{f.icon}</div>
              <h3 style={{ fontSize: 15, marginBottom: 8 }}>{f.title}</h3>
              <p style={{ fontSize: 13, color: 'var(--text-2)', lineHeight: 1.65 }}>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section style={{ position: 'relative', zIndex: 1, padding: '80px 24px 100px', textAlign: 'center' }}>
        <div style={{
          maxWidth: 560, margin: '0 auto', padding: '48px',
          background: 'linear-gradient(135deg, rgba(124,58,237,0.1), rgba(249,115,22,0.05))',
          border: '1px solid rgba(124,58,237,0.2)', borderRadius: 24,
        }}>
          <h2 style={{ marginBottom: 12 }}>Ready to level up?</h2>
          <p style={{ color: 'var(--text-3)', marginBottom: 28, fontSize: 15 }}>
            Free forever. No credit card. Start coding in 60 seconds.
          </p>
          <Link to="/register">
            <button className="btn btn-primary btn-lg">Create Free Account →</button>
          </Link>
        </div>
      </section>
    </div>
  )
}
