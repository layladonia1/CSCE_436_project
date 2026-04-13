import { useEffect, useMemo, useRef, useState } from 'react'
import './index.css'

const tasks = [
  {
    id: 1,
    title: 'Review lecture notes',
    course: 'Artificial Intelligence',
    due: 'Due tomorrow',
    duration: 2,
    type: 'Reading',
    energy: 'medium',
  },
  {
    id: 2,
    title: 'Homework 5',
    course: 'Data Stuctures and Algorithms',
    due: 'Due tonight',
    duration: 3,
    type: 'Homework',
    energy: 'high',
  },
  {
    id: 3,
    title: 'Discussion post',
    course: 'Pols 207',
    due: 'Due tonight',
    duration: 1,
    type: 'Writing',
    energy: 'low',
  },
]

const spots = [
  {
    id: 1,
    name: 'Evans Library Quiet Floor',
    vibe: 'Silent focus',
    noise: 'Low',
    outlet: true,
    groupFriendly: false,
    indoor: true,
    nearCoffee: false,
    lateHours: true,
    comfort: 'High',
    reason: 'Best for distraction-free reading and solo studying.',
  },
  {
    id: 2,
    name: 'MSC Lounge',
    vibe: 'Casual and flexible',
    noise: 'Medium',
    outlet: true,
    groupFriendly: true,
    indoor: true,
    nearCoffee: true,
    lateHours: false,
    comfort: 'High',
    reason: 'Great if you want an easy, comfortable place with food nearby.',
  },
  {
    id: 3,
    name: 'Zachry Collaboration Zone',
    vibe: 'Productive buzz',
    noise: 'Medium',
    outlet: true,
    groupFriendly: true,
    indoor: true,
    nearCoffee: true,
    lateHours: true,
    comfort: 'Medium',
    reason: 'Useful for team work, quick transitions, and longer campus sessions.',
  },
  {
    id: 4,
    name: 'Academic Plaza Outdoor Tables',
    vibe: 'Fresh air reset',
    noise: 'Medium',
    outlet: false,
    groupFriendly: true,
    indoor: false,
    nearCoffee: false,
    lateHours: false,
    comfort: 'Medium',
    reason: 'Best when you want sunlight, open space, and a lighter study session.',
  },
]

const preferenceGroups = [
  {
    key: 'noise',
    title: 'Noise level',
    options: ['Low', 'Medium'],
  },
  {
    key: 'setting',
    title: 'Setting',
    options: ['Indoor', 'Outdoor'],
  },
]

function getGreeting() {
  const hour = new Date().getHours()
  if (hour < 12) return 'Good morning'
  if (hour < 18) return 'Good afternoon'
  return 'Good evening'
}

function recommendSpot(filters) {
  const scored = spots.map((spot) => {
    let score = 0
    if (filters.noise && spot.noise === filters.noise) score += 2
    if (filters.setting === 'Indoor' && spot.indoor) score += 2
    if (filters.setting === 'Outdoor' && !spot.indoor) score += 2
    if (filters.outlet && spot.outlet) score += 1
    if (filters.groupFriendly && spot.groupFriendly) score += 1
    if (filters.nearCoffee && spot.nearCoffee) score += 1
    if (filters.lateHours && spot.lateHours) score += 1
    return { ...spot, score }
  })

  return scored.sort((a, b) => b.score - a.score)[0]
}

function formatTime(seconds) {
  const mins = Math.floor(seconds / 60)
  const secs = seconds % 60
  return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`
}

export default function App() {
  const [theme, setTheme] = useState('light')
  const [screen, setScreen] = useState('morning')
  const [selectedTask, setSelectedTask] = useState(tasks[0])
  const [filters, setFilters] = useState({
    noise: 'Low',
    setting: 'Indoor',
    outlet: true,
    groupFriendly: false,
    nearCoffee: false,
    lateHours: true,
  })
  const [studyHours, setStudyHours] = useState(2)
  const [feedback, setFeedback] = useState(null)
  const [mode, setMode] = useState('focus')
  const [secondsLeft, setSecondsLeft] = useState(50 * 60)
  const [cycleSeconds, setCycleSeconds] = useState(0)
  const [sessionActive, setSessionActive] = useState(false)
  const [breakPromptOpen, setBreakPromptOpen] = useState(false)
  const intervalRef = useRef(null)

  useEffect(() => {
    const media = window.matchMedia('(prefers-color-scheme: dark)')
    const nextTheme = media.matches ? 'dark' : 'light'
    setTheme(nextTheme)
    document.documentElement.setAttribute('data-theme', nextTheme)
  }, [])

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
  }, [theme])

  useEffect(() => {
    if (!sessionActive) return
    intervalRef.current = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          if (mode === 'focus') {
            setMode('break')
            setCycleSeconds(0)
            return 10 * 60
          }
          setMode('focus')
          setCycleSeconds(0)
          return 50 * 60
        }
        return prev - 1
      })
      setCycleSeconds((prev) => prev + 1)
    }, 1000)

    return () => clearInterval(intervalRef.current)
  }, [sessionActive, mode])

  useEffect(() => {
    if (mode === 'focus' && cycleSeconds > 0 && cycleSeconds % (17 * 60) === 0) {
      setBreakPromptOpen(true)
    }
  }, [cycleSeconds, mode])

  const recommendation = useMemo(() => recommendSpot(filters), [filters])

  const startTaskFlow = (task) => {
    setSelectedTask(task)
    setScreen('preferences')
  }

  const startSession = () => {
    setScreen('session')
    setMode('focus')
    setSecondsLeft(50 * 60)
    setCycleSeconds(0)
    setSessionActive(true)
    setBreakPromptOpen(false)
  }

  const takeQuickBreak = () => {
    setMode('break')
    setSecondsLeft(5 * 60)
    setCycleSeconds(0)
    setBreakPromptOpen(false)
  }

  const completeSession = () => {
    setSessionActive(false)
    clearInterval(intervalRef.current)
    setScreen('feedback')
  }

  const toggleBoolean = (key) => setFilters((prev) => ({ ...prev, [key]: !prev[key] }))

  return (
    <div className="app-shell">
      <a className="skip-link" href="#main">Skip to content</a>
      <header className="topbar">
        <div className="brand">
          <div className="brand-mark" aria-hidden="true">
            <span />
            <span />
            <span />
          </div>
          <div>
            <p className="eyebrow">Campus study companion</p>
            <h1>StudySpot</h1>
          </div>
        </div>
        <button
          className="theme-toggle"
          onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          aria-label="Toggle theme"
        >
          {theme === 'dark' ? '☀️' : '🌙'}
        </button>
      </header>

      <main id="main" className="workspace">
        <aside className="journey-card">
          <p className="eyebrow">Today&apos;s flow</p>
          <div className="steps">
            {['Morning', 'Preferences', 'Recommendation', 'Session', 'Feedback'].map((label, index) => {
              const screens = ['morning', 'preferences', 'recommendation', 'session', 'feedback']
              const active = screens[index] === screen
              const complete = screens.indexOf(screen) > index
              return (
                <div key={label} className={`step ${active ? 'active' : ''} ${complete ? 'complete' : ''}`}>
                  <div className="step-dot">{index + 1}</div>
                  <span>{label}</span>
                </div>
              )
            })}
          </div>
        </aside>

        <section className="screen-panel">
          {screen === 'morning' && (
            <div className="screen-grid morning-grid">
              <section className="hero-card">
                <div className="hero-copy">
                  <p className="eyebrow">Morning planning</p>
                  <h2>{getGreeting()}, Layla</h2>
                  <p className="hero-text">
                    You have 2 hours before class. 
                  </p>
                </div>
                <div className="hero-metrics">
                  <div>
                    <strong>3</strong>
                    <span>Tasks due soon</span>
                  </div>
                  <div>
                    <strong>2 hr</strong>
                    <span>Free study window</span>
                  </div>
                  <div>
                    <strong>Low</strong>
                    <span>Campus noise nearby</span>
                  </div>
                </div>
              </section>

              <section className="task-card">
                <div className="section-head">
                  <div>
                    <p className="eyebrow">Recommended tasks</p>
                    <h3>Choose what to start</h3>
                  </div>
                  <button className="ghost-btn">View all</button>
                </div>
                <div className="task-list">
                  {tasks.map((task) => (
                    <button key={task.id} className="task-item" onClick={() => startTaskFlow(task)}>
                      <div>
                        <span className="task-course">{task.course}</span>
                        <h4>{task.title}</h4>
                        <p>{task.due}</p>
                      </div>
                      <div className="task-meta">
                        <span>{task.duration}h</span>
                        <span>{task.type}</span>
                      </div>
                    </button>
                  ))}
                </div>
              </section>

              <section className="insight-card">
                <p className="eyebrow">Quick suggestion</p>
                <h3>Best next move</h3>
                <p>Start with “{tasks[0].title}” in a quiet indoor space so you can finish a full review block before class.</p>
                <button className="primary-btn" onClick={() => startTaskFlow(tasks[0])}>Start recommended task</button>
              </section>
            </div>
          )}

          {screen === 'preferences' && (
            <div className="screen-grid preference-grid">
              <section className="preference-card main-preference-card">
                <div className="section-head">
                  <div>
                    <p className="eyebrow">Study preferences</p>
                    <h2>Find your ideal study spot</h2>
                  </div>
                  <button className="ghost-btn" onClick={() => setScreen('morning')}>Back</button>
                </div>
                <div className="selected-task-banner">
                  <span>Selected task</span>
                  <strong>{selectedTask.title}</strong>
                  <em>{selectedTask.course} · {selectedTask.duration} hour plan</em>
                </div>
                <div className="preference-sections">
                  {preferenceGroups.map((group) => (
                    <div key={group.key} className="choice-group">
                      <p>{group.title}</p>
                      <div className="pill-row">
                        {group.options.map((option) => (
                          <button
                            key={option}
                            className={`pill ${filters[group.key] === option ? 'selected' : ''}`}
                            onClick={() => setFilters((prev) => ({ ...prev, [group.key]: option }))}
                          >
                            {option}
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
                  <div className="choice-group">
                    <p>Must-have features</p>
                    <div className="toggle-grid">
                      {[
                        ['outlet', 'Outlets nearby'],
                        ['groupFriendly', 'Works for group study'],
                        ['nearCoffee', 'Near coffee or snacks'],
                        ['lateHours', 'Open later tonight'],
                      ].map(([key, label]) => (
                        <button
                          key={key}
                          className={`toggle-card ${filters[key] ? 'selected' : ''}`}
                          onClick={() => toggleBoolean(key)}
                        >
                          <span>{label}</span>
                          <strong>{filters[key] ? 'On' : 'Off'}</strong>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="footer-actions">
                  <button className="secondary-btn" onClick={() => setScreen('morning')}>Save for later</button>
                  <button className="primary-btn" onClick={() => setScreen('recommendation')}>See recommendation</button>
                </div>
              </section>

              <aside className="preference-card preview-card">
                <p className="eyebrow">Live preview</p>
                <h3>{recommendation.name}</h3>
                <p>{recommendation.reason}</p>
                <div className="preview-badges">
                  <span>{recommendation.noise} noise</span>
                  <span>{recommendation.comfort} comfort</span>
                  <span>{recommendation.indoor ? 'Indoor' : 'Outdoor'}</span>
                </div>
              </aside>
            </div>
          )}

          {screen === 'recommendation' && (
            <div className="skeleton-view">
              <p className="eyebrow">Recommended spot</p>
              <h2>{recommendation.name}</h2>
              <p>{recommendation.reason}</p>
              <div className="mini-grid">
                <div className="mini-card"><span>Noise</span><strong>{recommendation.noise}</strong></div>
                <div className="mini-card"><span>Availability</span><strong>High</strong></div>
                <div className="mini-card"><span>Best for</span><strong>{selectedTask.type}</strong></div>
              </div>
              <div className="footer-actions">
                <label className="hours-picker">
                  <span>Study hours</span>
                  <input type="range" min="1" max="4" value={studyHours} onChange={(e) => setStudyHours(Number(e.target.value))} />
                  <strong>{studyHours} hour session</strong>
                </label>
                <button className="primary-btn" onClick={startSession}>Start study session</button>
              </div>
            </div>
          )}

          {screen === 'session' && (
            <div className="skeleton-view">
              <p className="eyebrow">Active study</p>
              <h2>{mode === 'focus' ? 'Focus session' : 'Break time'}</h2>
              <p>{selectedTask.title} · {recommendation.name}</p>
              <div className="timer-ring">
                <div>
                  <span>{mode === 'focus' ? 'Time left' : 'Break left'}</span>
                  <strong>{formatTime(secondsLeft)}</strong>
                </div>
              </div>
              <div className="mini-grid">
                <div className="mini-card"><span>Cycle</span><strong>50 / 10</strong></div>
                <div className="mini-card"><span>Random break</span><strong>{breakPromptOpen ? 'Suggested now' : 'Available'}</strong></div>
                <div className="mini-card"><span>Goal</span><strong>{studyHours} hours</strong></div>
              </div>
              {breakPromptOpen && (
                <div className="break-banner">
                  <span>Need a quick reset?</span>
                  <button className="secondary-btn" onClick={takeQuickBreak}>Take a 5 min break</button>
                </div>
              )}
              <div className="footer-actions">
                <button className="secondary-btn" onClick={takeQuickBreak}>5 min break</button>
                <button className="ghost-btn" onClick={() => setSessionActive((prev) => !prev)}>{sessionActive ? 'Pause' : 'Resume'}</button>
                <button className="primary-btn" onClick={completeSession}>Complete session</button>
              </div>
            </div>
          )}

          {screen === 'feedback' && (
            <div className="skeleton-view">
              <p className="eyebrow">Feedback</p>
              <h2>Was this study spot helpful?</h2>
              <p>Your answer helps improve future spot recommendations.</p>
              <div className="feedback-row">
                <button className={`feedback-btn ${feedback === 'yes' ? 'selected' : ''}`} onClick={() => setFeedback('yes')}>Yes</button>
                <button className={`feedback-btn ${feedback === 'no' ? 'selected' : ''}`} onClick={() => setFeedback('no')}>No</button>
              </div>
              <button className="primary-btn" onClick={() => setScreen('morning')}>Back to morning view</button>
            </div>
          )}
        </section>
      </main>
    </div>
  )
}