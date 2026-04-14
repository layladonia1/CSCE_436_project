import { useEffect, useMemo, useRef, useState } from 'react'
import './index.css'

const GOOGLE_SCRIPT_SRC = 'https://accounts.google.com/gsi/client'
const GOOGLE_STORAGE_KEY = 'studyspot.googleUser'
const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID

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
    address: 'Sterling C. Evans Library, 400 Spence St, College Station, TX 77843',
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
    address: 'Memorial Student Center, 275 Joe Routt Blvd, College Station, TX 77843',
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
    address: 'Zachry Engineering Education Complex, 125 Spence St, College Station, TX 77843',
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
    address: 'Academic Plaza, 766 Military Walk, College Station, TX 77840',
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
  {
    id: 5,
    name: 'Zachry HPE Tech Deck',
    address: 'Zachry Engineering Education Complex, 125 Spence St, College Station, TX 77843',
    vibe: 'Greenery with city views',
    noise: 'Low',
    outlet: false,
    groupFriendly: true,
    indoor: false,
    nearCoffee: false,
    lateHours: true,
    comfort: 'Medium',
    reason: 'Best if you want to study in a refreshing green space with views of the skyline.',
  },
  {
    id: 6,
    name: 'Quadbucks - Upper Floors',
    address: 'Starbucks - The Quad, 546 Coke St, College Station, TX 77843',
    vibe: 'Cafe vibes',
    noise: 'Medium',
    outlet: true,
    groupFriendly: true,
    indoor: true,
    nearCoffee: true,
    lateHours: false,
    comfort: 'High',
    reason: 'Best for a casual study environment with a nearby cafe.',
  },
  {
    id: 7,
    name: 'ETB',
    address: 'Emerging Technology Building, 101 Bizzell St, College Station, TX 77843',
    vibe: 'Study Chatter',
    noise: 'Medium',
    outlet: true,
    groupFriendly: true,
    indoor: true,
    nearCoffee: false,
    lateHours: false,
    comfort: 'High',
    reason: 'Best for group work or if you like some background noise while studying.',
  },
  {
    id: 8,
    name: 'Architecture Building',
    address: 'Department of Architecture, Center Building A, Langford Architecture Bldg, 798 Ross St #422, College Station, TX 77840',
    vibe: 'Spacious',
    noise: 'Medium',
    outlet: true,
    groupFriendly: true,
    indoor: true,
    nearCoffee: true,
    lateHours: true,
    comfort: 'High',
    reason: 'Best for longer study sessions when you want a change of scenery and access to food at Azimuth Cafe.',
  },
  {
    id: 9,
    name: 'Zachbucks',
    address: 'Zachry Engineering Education Complex, 125 Spence St, College Station, TX 77843',
    vibe: 'Cafe vibes',
    noise: 'Medium',
    outlet: true,
    groupFriendly: true,
    indoor: true,
    nearCoffee: true,
    lateHours: false,
    comfort: 'High',
    reason: 'Best for a casual study environment with a nearby cafe.',
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

function matchesFilters(spot, filters) {
  if (filters.noise && spot.noise !== filters.noise) return false
  if (filters.setting === 'Indoor' && !spot.indoor) return false
  if (filters.setting === 'Outdoor' && spot.indoor) return false
  if (filters.outlet && !spot.outlet) return false
  if (filters.groupFriendly && !spot.groupFriendly) return false
  if (filters.nearCoffee && !spot.nearCoffee) return false
  if (filters.lateHours && !spot.lateHours) return false
  return true
}

function recommendSpots(filters) {
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

  const exactMatches = scored.filter((spot) => matchesFilters(spot, filters))
  const ranked = exactMatches.length ? exactMatches : scored

  return ranked.sort((a, b) => b.score - a.score || a.name.localeCompare(b.name)).slice(0, 3)
}

function formatTime(seconds) {
  const mins = Math.floor(seconds / 60)
  const secs = seconds % 60
  return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`
}

function buildGoogleMapsEmbedUrl(query) {
  return `https://www.google.com/maps?q=${encodeURIComponent(query)}&output=embed`
}

function decodeJwtPayload(credential) {
  try {
    const [, payload] = credential.split('.')
    const normalized = payload.replace(/-/g, '+').replace(/_/g, '/')
    const json = decodeURIComponent(
      atob(normalized)
        .split('')
        .map((char) => `%${char.charCodeAt(0).toString(16).padStart(2, '0')}`)
        .join(''),
    )
    return JSON.parse(json)
  } catch {
    return null
  }
}

function getStoredGoogleUser() {
  try {
    const raw = localStorage.getItem(GOOGLE_STORAGE_KEY)
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
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
  const [selectedSpot, setSelectedSpot] = useState(null)
  const [studyHours, setStudyHours] = useState(2)
  const [mode, setMode] = useState('focus')
  const [secondsLeft, setSecondsLeft] = useState(50 * 60)
  const [cycleSeconds, setCycleSeconds] = useState(0)
  const [sessionActive, setSessionActive] = useState(false)
  const [breakPromptOpen, setBreakPromptOpen] = useState(false)
  const [googleUser, setGoogleUser] = useState(() => getStoredGoogleUser())
  const [authReady, setAuthReady] = useState(false)
  const [authMessage, setAuthMessage] = useState('')
  const intervalRef = useRef(null)
  const googleButtonRef = useRef(null)
  const googleInitializedRef = useRef(false)

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
    if (!googleUser) {
      setScreen('login')
      return
    }

    setScreen((currentScreen) => (currentScreen === 'login' ? 'morning' : currentScreen))
  }, [googleUser])

  useEffect(() => {
    if (!GOOGLE_CLIENT_ID) {
      setAuthMessage('Add VITE_GOOGLE_CLIENT_ID to enable Google sign-in.')
      return
    }

    let cancelled = false
    const existingScript = document.querySelector(`script[src="${GOOGLE_SCRIPT_SRC}"]`)

    const initializeGoogle = () => {
      if (cancelled || !window.google?.accounts?.id || googleInitializedRef.current) return

      window.google.accounts.id.initialize({
        client_id: GOOGLE_CLIENT_ID,
        callback: ({ credential }) => {
          const payload = decodeJwtPayload(credential)

          if (!payload) {
            setAuthMessage('Google sign-in succeeded, but the profile could not be read.')
            return
          }

          const nextUser = {
            firstName: payload.given_name || payload.name?.split(' ')[0] || 'there',
            fullName: payload.name || '',
            email: payload.email || '',
            picture: payload.picture || '',
          }

          localStorage.setItem(GOOGLE_STORAGE_KEY, JSON.stringify(nextUser))
          setGoogleUser(nextUser)
          setAuthMessage('')
        },
      })

      googleInitializedRef.current = true
      setAuthReady(true)
    }

    if (existingScript) {
      if (window.google?.accounts?.id) {
        initializeGoogle()
      } else {
        existingScript.addEventListener('load', initializeGoogle, { once: true })
      }
      return () => {
        cancelled = true
      }
    }

    const script = document.createElement('script')
    script.src = GOOGLE_SCRIPT_SRC
    script.async = true
    script.defer = true
    script.onload = initializeGoogle
    script.onerror = () => {
      if (!cancelled) setAuthMessage('Google sign-in failed to load. Please try again.')
    }
    document.head.appendChild(script)

    return () => {
      cancelled = true
    }
  }, [])

  useEffect(() => {
    if (!authReady || !googleButtonRef.current || googleUser || screen !== 'login' || !window.google?.accounts?.id) {
      return
    }

    googleButtonRef.current.innerHTML = ''
    window.google.accounts.id.renderButton(googleButtonRef.current, {
      theme: theme === 'dark' ? 'filled_black' : 'outline',
      size: 'large',
      text: 'signin_with',
      shape: 'pill',
      width: 260,
    })
  }, [authReady, googleUser, screen, theme])

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

  const recommendedSpots = useMemo(() => recommendSpots(filters), [filters])
  const closestSpot = recommendedSpots[0] ?? null
  const chosenSpot = selectedSpot ?? closestSpot
  const mapsEmbedUrl = closestSpot ? buildGoogleMapsEmbedUrl(closestSpot.address) : ''
  const displayName = googleUser?.firstName || 'there'

  useEffect(() => {
    if (!selectedSpot || !recommendedSpots.some((spot) => spot.id === selectedSpot.id)) {
      setSelectedSpot(recommendedSpots[0] ?? null)
    }
  }, [recommendedSpots, selectedSpot])

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
    setScreen('morning')
  }

  const toggleBoolean = (key) => setFilters((prev) => ({ ...prev, [key]: !prev[key] }))

  const signOut = () => {
    localStorage.removeItem(GOOGLE_STORAGE_KEY)
    setGoogleUser(null)
    setAuthMessage('')
    if (window.google?.accounts?.id) {
      window.google.accounts.id.disableAutoSelect()
    }
  }

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
        <div className="topbar-actions">
          {googleUser && (
            <div className="user-chip" aria-label={`Signed in as ${googleUser.fullName || googleUser.email}`}>
              {googleUser.picture ? <img src={googleUser.picture} alt="" /> : <span>{displayName.charAt(0)}</span>}
              <strong>{displayName}</strong>
            </div>
          )}
          {googleUser && (
            <button className="ghost-btn" onClick={signOut}>Sign out</button>
          )}
          <button
            className="theme-toggle"
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            aria-label="Toggle theme"
          >
            {theme === 'dark' ? '☀️' : '🌙'}
          </button>
        </div>
      </header>

      <main id="main" className="workspace">
        {screen !== 'login' && (
          <aside className="journey-card">
            <p className="eyebrow">Today&apos;s flow</p>
            <div className="steps">
              {['Morning', 'Preferences', 'Recommendation', 'Session'].map((label, index) => {
                const screens = ['morning', 'preferences', 'recommendation', 'session']
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
        )}

        <section className="screen-panel">
          {screen === 'login' && (
            <div className="screen-grid login-grid">
              <section className="login-card">
                <p className="eyebrow">Welcome</p>
                <h2>Welcome to StudySpot!</h2>
                <p className="hero-text">Please log in to continue.</p>
                {!googleUser && <div ref={googleButtonRef} className="google-button-slot" />}
                {authMessage && <p className="status-text">{authMessage}</p>}
              </section>
            </div>
          )}

          {screen === 'morning' && (
            <div className="screen-grid morning-grid">
              <section className="hero-card">
                <div className="hero-copy">
                  <p className="eyebrow">Morning planning</p>
                  <h2>{getGreeting()}, {displayName}</h2>
                  <p className="hero-text">
                    Welcome back{googleUser?.email ? `, ${googleUser.email}` : ''}. You have 2 hours before class.
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

              <section className="insight-card auth-card">
                <p className="eyebrow">Quick suggestion</p>
                <h3>Best next move</h3>
                <p>
                  Start with “{tasks[0].title}” in a quiet indoor space so you can finish a full review block before
                  class.
                </p>
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
                  <button
                    className="primary-btn"
                    onClick={() => {
                      setSelectedSpot(recommendedSpots[0] ?? null)
                      setScreen('recommendation')
                    }}
                  >
                    See recommendation
                  </button>
                </div>
              </section>

              <aside className="preference-card preview-card">
                <p className="eyebrow">Live preview</p>
                {closestSpot ? (
                  <>
                    <h3>{closestSpot.name}</h3>
                    <p>{closestSpot.reason}</p>
                    <div className="preview-badges">
                      <span>{closestSpot.noise} noise</span>
                      <span>{closestSpot.comfort} comfort</span>
                      <span>{closestSpot.indoor ? 'Indoor' : 'Outdoor'}</span>
                    </div>
                    <iframe
                      className="map-frame"
                      title={`${closestSpot.name} map preview`}
                      loading="lazy"
                      referrerPolicy="no-referrer-when-downgrade"
                      src={mapsEmbedUrl}
                    />
                  </>
                ) : (
                  <p className="status-text">No study spots match the current criteria.</p>
                )}
              </aside>
            </div>
          )}

          {screen === 'recommendation' && (
            <div className="skeleton-view">
              <p className="eyebrow">Recommended spot</p>
              {chosenSpot ? (
                <>
                  <h2>{chosenSpot.name}</h2>
                  <p>{chosenSpot.reason}</p>
                  <div className="recommendation-list">
                    {recommendedSpots.map((spot, index) => {
                      const isChosen = chosenSpot.id === spot.id
                      return (
                        <article key={spot.id} className={`recommendation-item ${isChosen ? 'featured' : ''}`}>
                          <div>
                            <p className="eyebrow">Option {index + 1}</p>
                            <h3>{spot.name}</h3>
                          </div>
                          <p>{spot.reason}</p>
                          <p className="spot-address">{spot.address}</p>
                          <div className="preview-badges">
                            <span>{spot.noise} noise</span>
                            <span>{spot.comfort} comfort</span>
                            <span>{spot.indoor ? 'Indoor' : 'Outdoor'}</span>
                          </div>
                          <iframe
                            className="map-frame recommendation-map"
                            title={`${spot.name} map preview`}
                            loading="lazy"
                            referrerPolicy="no-referrer-when-downgrade"
                            src={buildGoogleMapsEmbedUrl(spot.address)}
                          />
                          <button className="secondary-btn" onClick={() => setSelectedSpot(spot)}>
                            {isChosen ? 'Chosen spot' : 'Choose this spot'}
                          </button>
                        </article>
                      )
                    })}
                  </div>
                </>
              ) : (
                <div className="summary-text">
                  <span>No recommendations yet</span>
                  <strong>Adjust your filters to see spots</strong>
                </div>
              )}
              <div className="mini-grid">
                <div className="mini-card"><span>Noise</span><strong>{chosenSpot?.noise ?? 'N/A'}</strong></div>
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
              <p>{selectedTask.title} · {chosenSpot?.name ?? 'Selected spot'}</p>
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
        </section>
      </main>
    </div>
  )
}
