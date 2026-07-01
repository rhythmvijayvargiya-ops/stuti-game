import { useState, useEffect, useRef, useCallback } from 'react'

// ─── 33 Names of Lingabhairavi Devi ───────────────────────────────────────────
// Filenames in /images/ (without extension) are the answer keys.
// Replace/add images as: /images/{name}.jpg
const DEVI_NAMES: string[] = [
  'nageshwari',
  'bhairavi',
  'maheswari',
  'kaumari',
  'vaishnavi',
  'varahi',
  'indrani',
  'chamunda',
  'brahmi',
  'tripura',
  'durga',
  'kali',
  'saraswati',
  'lakshmi',
  'parvati',
  'gauri',
  'ambika',
  'chandika',
  'pratyangira',
  'bhuvaneshwari',
  'tara',
  'chinnamasta',
  'dhumavati',
  'bagalamukhi',
  'matangi',
  'kamala',
  'rajarajeshwari',
  'lalitha',
  'shodashi',
  'tripurasundari',
  'sarvamangala',
  'mahakali',
  'annapurna',
]

const ROUND_SECONDS = 11
const POINTS_PER_CORRECT = 11
const MAX_SCORE = DEVI_NAMES.length * POINTS_PER_CORRECT

type Screen = 'landing' | 'game' | 'results'
type Tab = 'results' | 'leaderboard'

interface LeaderboardEntry {
  name: string
  score: number
  correct: number
  date: string
}

interface RoundResult {
  name: string
  correct: boolean
  guessed: string | null
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

function getLeaderboard(): LeaderboardEntry[] {
  try {
    return JSON.parse(localStorage.getItem('devi_leaderboard') || '[]')
  } catch {
    return []
  }
}

function saveLeaderboard(entries: LeaderboardEntry[]) {
  localStorage.setItem('devi_leaderboard', JSON.stringify(entries))
}

// ─── Arc Timer SVG ────────────────────────────────────────────────────────────
function ArcTimer({ progress }: { progress: number }) {
  const R = 54
  const C = 2 * Math.PI * R
  const dashOffset = C * (1 - progress)

  const hue = Math.round(progress * 45) // gold at full, red near zero
  const color = progress > 0.3 ? `hsl(${40 + hue}, 85%, 55%)` : '#c0392b'

  return (
    <svg viewBox="0 0 120 120" className="devi-timer-svg" aria-hidden>
      <circle cx="60" cy="60" r={R} fill="none" stroke="rgba(255,200,100,0.08)" strokeWidth="6" />
      <circle
        cx="60"
        cy="60"
        r={R}
        fill="none"
        stroke={color}
        strokeWidth="6"
        strokeLinecap="round"
        strokeDasharray={C}
        strokeDashoffset={dashOffset}
        transform="rotate(-90 60 60)"
        style={{ transition: 'stroke-dashoffset 0.4s ease, stroke 0.4s ease' }}
      />
      <text x="60" y="68" textAnchor="middle" className="devi-timer-text" fill={color}>
        {Math.ceil(progress * ROUND_SECONDS)}
      </text>
    </svg>
  )
}

// ─── Leaderboard ──────────────────────────────────────────────────────────────
function Leaderboard() {
  const entries = getLeaderboard()
    .sort((a, b) => b.score - a.score)
    .slice(0, 20)

  if (entries.length === 0) {
    return (
      <div className="devi-empty-board">
        <p>No scores yet. Be the first to play.</p>
      </div>
    )
  }

  return (
    <div className="devi-leaderboard">
      <table className="devi-lb-table">
        <thead>
          <tr>
            <th>#</th>
            <th>Devotee</th>
            <th>Score</th>
            <th>Date</th>
          </tr>
        </thead>
        <tbody>
          {entries.map((e, i) => (
            <tr key={i} className={i === 0 ? 'devi-lb-gold' : ''}>
              <td>{i + 1}</td>
              <td>{e.name}</td>
              <td>
                {e.score} / {MAX_SCORE}
              </td>
              <td>{e.date}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

// ─── Landing Screen ───────────────────────────────────────────────────────────
function LandingScreen({
  onBegin,
  initialName,
}: {
  onBegin: (name: string) => void
  initialName: string
}) {
  const [name, setName] = useState(initialName)
  const [showBoard, setShowBoard] = useState(false)
  const [error, setError] = useState('')

  const handleBegin = () => {
    if (!name.trim()) {
      setError('Please enter your name to begin.')
      return
    }
    onBegin(name.trim())
  }

  return (
    <div className="devi-screen devi-landing">
      <div className="devi-mandala-bg" aria-hidden />

      <div className="devi-landing-inner">
        <div className="devi-halo-wrap">
          <img
            src="/images/nageshwari.jpg"
            alt="Lingabhairavi Devi"
            className="devi-landing-img"
            onError={(e) => {
              ;(e.target as HTMLImageElement).style.display = 'none'
            }}
          />
          <div className="devi-halo" aria-hidden />
        </div>

        <h1 className="devi-title">How well do you know Devi?</h1>
        <p className="devi-subtitle">33 forms. 33 names. One Devi.</p>

        {!showBoard ? (
          <>
            <div className="devi-input-wrap">
              <input
                className="devi-input"
                type="text"
                placeholder="Enter your name…"
                value={name}
                onChange={(e) => {
                  setName(e.target.value)
                  setError('')
                }}
                onKeyDown={(e) => e.key === 'Enter' && handleBegin()}
              />
              {error && <p className="devi-error">{error}</p>}
            </div>

            <button className="devi-btn" onClick={handleBegin}>
              <span className="devi-btn-inner">Begin</span>
            </button>

            <button className="devi-link" onClick={() => setShowBoard(true)}>
              View Leaderboard
            </button>
          </>
        ) : (
          <>
            <div className="devi-section-title">Leaderboard</div>
            <Leaderboard />
            <button className="devi-link" onClick={() => setShowBoard(false)}>
              ← Back
            </button>
          </>
        )}
      </div>
    </div>
  )
}

// ─── Game Screen ──────────────────────────────────────────────────────────────
function GameScreen({
  playerName,
  onComplete,
}: {
  playerName: string
  onComplete: (results: RoundResult[], score: number) => void
}) {
  const order = useRef(shuffle(DEVI_NAMES))
  const [roundIdx, setRoundIdx] = useState(0)
  const [selected, setSelected] = useState<string>('')
  const [feedback, setFeedback] = useState<'correct' | 'wrong' | 'timeout' | null>(null)
  const [timeLeft, setTimeLeft] = useState(ROUND_SECONDS)
  const [score, setScore] = useState(0)
  const [results, setResults] = useState<RoundResult[]>([])
  const [fading, setFading] = useState(false)
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const lockedRef = useRef(false)

  const currentName = order.current[roundIdx]

  const advanceRound = useCallback(
    (result: RoundResult, addedScore: number) => {
      if (timerRef.current) clearInterval(timerRef.current)
      lockedRef.current = true

      const newResults = [...results, result]
      const newScore = score + addedScore

      setTimeout(() => {
        setFading(true)
        setTimeout(() => {
          if (roundIdx + 1 >= DEVI_NAMES.length) {
            onComplete(newResults, newScore)
          } else {
            setResults(newResults)
            setScore(newScore)
            setRoundIdx((i) => i + 1)
            setSelected('')
            setFeedback(null)
            setTimeLeft(ROUND_SECONDS)
            setFading(false)
            lockedRef.current = false
          }
        }, 350)
      }, 900)
    },
    [results, score, roundIdx, onComplete]
  )

  // Timer
  useEffect(() => {
    lockedRef.current = false
    timerRef.current = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          if (timerRef.current) clearInterval(timerRef.current)
          if (!lockedRef.current) {
            lockedRef.current = true
            setFeedback('timeout')
            advanceRound({ name: currentName, correct: false, guessed: null }, 0)
          }
          return 0
        }
        return t - 1
      })
    }, 1000)
    return () => {
      if (timerRef.current) clearInterval(timerRef.current)
    }
  }, [roundIdx]) // eslint-disable-line react-hooks/exhaustive-deps

  const handleSubmit = () => {
    if (lockedRef.current || !selected) return
    const isCorrect = selected === currentName
    setFeedback(isCorrect ? 'correct' : 'wrong')
    advanceRound(
      { name: currentName, correct: isCorrect, guessed: selected },
      isCorrect ? POINTS_PER_CORRECT : 0
    )
  }

  const progress = timeLeft / ROUND_SECONDS
  const sortedNames = [...DEVI_NAMES].sort()

  return (
    <div className={`devi-screen devi-game${fading ? ' devi-fade-out' : ''}`}>
      <div className="devi-game-header">
        <span className="devi-round-label">
          Round {roundIdx + 1} / {DEVI_NAMES.length}
        </span>
        <span className="devi-score-label">Score: {score}</span>
        <span className="devi-player-label">{playerName}</span>
      </div>

      <div className="devi-game-body">
        <div className="devi-img-wrap">
          <div className="devi-halo devi-halo-game" aria-hidden />
          <img
            src={`/images/${currentName}.jpg`}
            alt="Devi form"
            className="devi-game-img"
            onError={(e) => {
              const el = e.target as HTMLImageElement
              el.style.display = 'none'
              const parent = el.parentElement
              if (parent && !parent.querySelector('.devi-placeholder')) {
                const ph = document.createElement('div')
                ph.className = 'devi-placeholder'
                ph.innerHTML = `<span>🕉</span><small>${currentName}</small>`
                parent.appendChild(ph)
              }
            }}
          />

          {feedback && (
            <div className={`devi-feedback devi-feedback-${feedback}`}>
              {feedback === 'correct' && '✓'}
              {feedback === 'wrong' && '✗'}
              {feedback === 'timeout' && (
                <span className="devi-timeout-label">
                  <small>Time's up</small>
                  <br />
                  {formatName(currentName)}
                </span>
              )}
            </div>
          )}
        </div>

        <div className="devi-timer-wrap">
          <ArcTimer progress={progress} />
        </div>

        <div className="devi-controls">
          <div className="devi-scroll-wrap">
            <div className="devi-scroll-top-deco" aria-hidden>
              <span>⌘</span>
            </div>
            <select
              className="devi-scroll-select"
              value={selected}
              onChange={(e) => setSelected(e.target.value)}
              disabled={!!feedback}
            >
              <option value="">— Choose her name —</option>
              {sortedNames.map((n) => (
                <option key={n} value={n}>
                  {formatName(n)}
                </option>
              ))}
            </select>
            <div className="devi-scroll-btm-deco" aria-hidden>
              <span>⌘</span>
            </div>
          </div>

          <button
            className={`devi-btn devi-submit-btn${!selected || !!feedback ? ' devi-btn-dim' : ''}`}
            onClick={handleSubmit}
            disabled={!selected || !!feedback}
          >
            <span className="devi-btn-inner">Offer Answer</span>
          </button>
        </div>
      </div>
    </div>
  )
}

// ─── Results Screen ───────────────────────────────────────────────────────────
function ResultsScreen({
  playerName,
  score,
  results,
  onPlayAgain,
}: {
  playerName: string
  score: number
  results: RoundResult[]
  onPlayAgain: () => void
}) {
  const [tab, setTab] = useState<Tab>('results')
  const [showCorrect, setShowCorrect] = useState(false)
  const [showWrong, setShowWrong] = useState(false)

  const correct = results.filter((r) => r.correct)
  const wrong = results.filter((r) => !r.correct)
  const pct = Math.round((score / MAX_SCORE) * 100)

  const blessing =
    pct >= 90
      ? 'Devi smiles upon you. You know her well.'
      : pct >= 60
        ? 'The Devi acknowledges your devotion.'
        : 'Keep gazing upon her forms. She will reveal herself.'

  return (
    <div className="devi-screen devi-results">
      <div className="devi-mandala-bg" aria-hidden />

      <div className="devi-results-inner">
        <div className="devi-tab-bar">
          <button
            className={`devi-tab${tab === 'results' ? ' devi-tab-active' : ''}`}
            onClick={() => setTab('results')}
          >
            Your Results
          </button>
          <button
            className={`devi-tab${tab === 'leaderboard' ? ' devi-tab-active' : ''}`}
            onClick={() => setTab('leaderboard')}
          >
            Leaderboard
          </button>
        </div>

        {tab === 'results' ? (
          <>
            <h2 className="devi-title devi-result-name">{playerName}</h2>

            <div className="devi-score-display">
              <span className="devi-score-big">{score}</span>
              <span className="devi-score-denom">/ {MAX_SCORE}</span>
            </div>

            <p className="devi-blessing">{blessing}</p>

            <div className="devi-stat-row">
              <div className="devi-stat">
                <span className="devi-stat-num correct">{correct.length}</span>
                <span className="devi-stat-label">Recognized</span>
              </div>
              <div className="devi-stat-divider">·</div>
              <div className="devi-stat">
                <span className="devi-stat-num wrong">{wrong.length}</span>
                <span className="devi-stat-label">Missed</span>
              </div>
            </div>

            <div className="devi-collapsibles">
              <button className="devi-collapse-btn" onClick={() => setShowCorrect((v) => !v)}>
                ✓ Names You Recognized ({correct.length})
                <span>{showCorrect ? '▲' : '▼'}</span>
              </button>
              {showCorrect && (
                <ul className="devi-name-list devi-name-list-correct">
                  {correct.map((r) => (
                    <li key={r.name}>{formatName(r.name)}</li>
                  ))}
                </ul>
              )}

              <button className="devi-collapse-btn" onClick={() => setShowWrong((v) => !v)}>
                ✗ Names You Missed ({wrong.length})
                <span>{showWrong ? '▲' : '▼'}</span>
              </button>
              {showWrong && (
                <ul className="devi-name-list devi-name-list-wrong">
                  {wrong.map((r) => (
                    <li key={r.name}>
                      <span className="devi-miss-correct">{formatName(r.name)}</span>
                      {r.guessed && (
                        <span className="devi-miss-guess"> — you chose: {formatName(r.guessed)}</span>
                      )}
                      {!r.guessed && <span className="devi-miss-guess"> — time ran out</span>}
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <div className="devi-result-actions">
              <button className="devi-btn" onClick={onPlayAgain}>
                <span className="devi-btn-inner">Play Again</span>
              </button>
            </div>
          </>
        ) : (
          <>
            <h2 className="devi-title">Hall of Devotees</h2>
            <Leaderboard />
          </>
        )}
      </div>
    </div>
  )
}

// ─── Utility ──────────────────────────────────────────────────────────────────
function formatName(n: string): string {
  return n
    .split(/[-_]/)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ')
}

// ─── Root Orchestrator ────────────────────────────────────────────────────────
export function DeviGame() {
  const [screen, setScreen] = useState<Screen>('landing')
  const [playerName, setPlayerName] = useState('')
  const [finalScore, setFinalScore] = useState(0)
  const [finalResults, setFinalResults] = useState<RoundResult[]>([])

  const handleBegin = (name: string) => {
    setPlayerName(name)
    setScreen('game')
  }

  const handleComplete = (results: RoundResult[], score: number) => {
    setFinalResults(results)
    setFinalScore(score)

    // Save to leaderboard
    const board = getLeaderboard()
    board.push({
      name: playerName,
      score,
      correct: results.filter((r) => r.correct).length,
      date: new Date().toLocaleDateString(),
    })
    saveLeaderboard(board)

    setScreen('results')
  }

  const handlePlayAgain = () => {
    setFinalResults([])
    setFinalScore(0)
    setScreen('landing')
  }

  return (
    <div className="devi-root">
      {screen === 'landing' && <LandingScreen onBegin={handleBegin} initialName={playerName} />}
      {screen === 'game' && <GameScreen playerName={playerName} onComplete={handleComplete} />}
      {screen === 'results' && (
        <ResultsScreen
          playerName={playerName}
          score={finalScore}
          results={finalResults}
          onPlayAgain={handlePlayAgain}
        />
      )}
    </div>
  )
}
