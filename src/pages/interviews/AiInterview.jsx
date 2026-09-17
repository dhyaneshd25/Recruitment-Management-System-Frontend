import React, { useState, useRef, useEffect, useCallback } from 'react'
import { fetchQuestions, submitAnswers } from './interviewApi' // adjust path if moved
import './MockInterview.css'

const ROLES = [
  'Frontend Developer',
  'Backend Developer',
  'Full Stack Developer',
  'Data Scientist',
  'DevOps Engineer',
  'Product Manager',
  'UI/UX Designer',
  'QA Engineer',
]

const EXPERIENCE_LEVELS = [
  { value: '0-1', label: '0-1 years (Fresher)' },
  { value: '1-3', label: '1-3 years' },
  { value: '3-5', label: '3-5 years' },
  { value: '5-8', label: '5-8 years' },
  { value: '8+', label: '8+ years' },
]

const SECONDS_PER_QUESTION = 120

const SpeechRecognitionImpl =
  typeof window !== 'undefined'
    ? window.SpeechRecognition || window.webkitSpeechRecognition
    : null

export default function AiInterview() {
  const [stage, setStage] = useState('setup') // 'setup' | 'session' | 'scoring' | 'result'
  const [role, setRole] = useState(ROLES[0])
  const [experience, setExperience] = useState(EXPERIENCE_LEVELS[0].value)

  const [questions, setQuestions] = useState([])
  const [loadingQuestions, setLoadingQuestions] = useState(false)
  const [loadError, setLoadError] = useState(null)

  const [currentIndex, setCurrentIndex] = useState(0)
  const [answers, setAnswers] = useState([]) // [{ questionId, question, answer }]
  const [draftAnswer, setDraftAnswer] = useState('')
  const [secondsLeft, setSecondsLeft] = useState(SECONDS_PER_QUESTION)
  const [isListening, setIsListening] = useState(false)
  const [micError, setMicError] = useState(null)

  const [result, setResult] = useState(null)
  const [submitError, setSubmitError] = useState(null)

  const recognitionRef = useRef(null)
  const timerRef = useRef(null)
  const draftAnswerRef = useRef('')
  const processedIndexRef = useRef(-1)

  useEffect(() => {
    draftAnswerRef.current = draftAnswer
  }, [draftAnswer])

  // ---------------- Setup ----------------

  const handleStart = async () => {
    setLoadingQuestions(true)
    setLoadError(null)
    try {
      const qs = await fetchQuestions(role, experience)
      setQuestions(qs)
      setAnswers([])
      setCurrentIndex(0)
      setDraftAnswer('')
      processedIndexRef.current = -1
      setStage('session')
    } catch (err) {
      setLoadError('Could not load questions. Please try again.')
    } finally {
      setLoadingQuestions(false)
    }
  }

  // ---------------- Speak the current question ----------------

  useEffect(() => {
    if (stage !== 'session' || questions.length === 0) return
    const question = questions[currentIndex]
    if (!question) return

    window.speechSynthesis?.cancel()
    const utterance = new SpeechSynthesisUtterance(question.text)
    utterance.rate = 0.95
    window.speechSynthesis?.speak(utterance)

    return () => window.speechSynthesis?.cancel()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentIndex, stage])

  // ---------------- Per-question timer ----------------

  const goToNext = useCallback(() => {
    if (processedIndexRef.current === currentIndex) return
    processedIndexRef.current = currentIndex

    const question = questions[currentIndex]
    if (question) {
      setAnswers((prev) => [
        ...prev,
        {
          questionId: question.id,
          question: question.text,
          answer: draftAnswerRef.current.trim(),
        },
      ])
    }

    stopListening()
    setDraftAnswer('')
    setMicError(null)

    setCurrentIndex((i) => {
      const next = i + 1
      if (next >= questions.length) {
        setStage('scoring')
      }
      return next
    })
    setSecondsLeft(SECONDS_PER_QUESTION)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentIndex, questions])

  useEffect(() => {
    if (stage !== 'session') return

    clearInterval(timerRef.current)
    timerRef.current = setInterval(() => {
      setSecondsLeft((s) => {
        if (s <= 1) {
          clearInterval(timerRef.current)
          goToNext()
          return SECONDS_PER_QUESTION
        }
        return s - 1
      })
    }, 1000)

    return () => clearInterval(timerRef.current)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentIndex, stage])

  // ---------------- Submit once scoring stage is reached ----------------

  useEffect(() => {
    if (stage !== 'scoring') return

    let cancelled = false
    ;(async () => {
      try {
        const res = await submitAnswers(role, experience, answers)
        if (!cancelled) {
          setResult(res)
          setStage('result')
        }
      } catch (err) {
        if (!cancelled) setSubmitError('Could not score your interview. Please try again.')
      }
    })()

    return () => {
      cancelled = true
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stage])

  // ---------------- Speech-to-text ----------------

  const startListening = () => {
    if (!SpeechRecognitionImpl) return

    setMicError(null)
    const recognition = new SpeechRecognitionImpl()
    recognition.lang = 'en-US'
    recognition.continuous = true
    recognition.interimResults = true

    let finalTranscript = draftAnswerRef.current ? draftAnswerRef.current + ' ' : ''

    recognition.onstart = () => setIsListening(true)

    recognition.onresult = (event) => {
      let interim = ''
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript
        if (event.results[i].isFinal) {
          finalTranscript += transcript + ' '
        } else {
          interim += transcript
        }
      }
      setDraftAnswer((finalTranscript + interim).trim())
    }

    recognition.onerror = (event) => {
      setIsListening(false)
      if (event.error === 'not-allowed' || event.error === 'service-not-allowed') {
        setMicError('Microphone access was blocked. Allow it in your browser and try again.')
      } else if (event.error === 'no-speech') {
        setMicError('No speech detected - try again.')
      } else {
        setMicError('Speech recognition error: ' + event.error)
      }
    }

    recognition.onend = () => setIsListening(false)

    recognitionRef.current = recognition
    recognition.start()
  }

  const stopListening = () => {
    recognitionRef.current?.stop()
    setIsListening(false)
  }

  const toggleListening = () => (isListening ? stopListening() : startListening())

  // ---------------- Restart ----------------

  const handleRestart = () => {
    setStage('setup')
    setQuestions([])
    setAnswers([])
    setResult(null)
    setSubmitError(null)
    setCurrentIndex(0)
    setDraftAnswer('')
    setMicError(null)
    processedIndexRef.current = -1
  }

  const minutes = String(Math.floor(secondsLeft / 60)).padStart(2, '0')
  const seconds = String(secondsLeft % 60).padStart(2, '0')

  // ================= RENDER =================

  if (stage === 'setup') {
    return (
      <div className="iv-page">
        <div className="glass-card iv-card iv-setup">
          <h1>Practice interview</h1>
          <p className="iv-sub">
            Pick a role and experience level. You'll get five questions, spoken aloud one
            at a time, with two minutes each to answer out loud or in writing.
          </p>

          <div className="form-group">
            <label className="form-label" htmlFor="role">Role</label>
            <select
              id="role"
              className="form-control"
              value={role}
              onChange={(e) => setRole(e.target.value)}
            >
              {ROLES.map((r) => (
                <option key={r} value={r}>{r}</option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="experience">Experience</label>
            <select
              id="experience"
              className="form-control"
              value={experience}
              onChange={(e) => setExperience(e.target.value)}
            >
              {EXPERIENCE_LEVELS.map((e) => (
                <option key={e.value} value={e.value}>{e.label}</option>
              ))}
            </select>
          </div>

          {loadError && <div className="alert alert-error">{loadError}</div>}

          <button
            className="btn btn-primary btn-lg w-full"
            onClick={handleStart}
            disabled={loadingQuestions}
          >
            {loadingQuestions && <span className="spinner" />}
            {loadingQuestions ? 'Preparing questions…' : 'Start interview'}
          </button>
        </div>
      </div>
    )
  }

  if (stage === 'session') {
    const question = questions[currentIndex]
    if (!question) return null
    const progressPct = (secondsLeft / SECONDS_PER_QUESTION) * 100

    return (
      <div className="iv-page">
        <div className="glass-card iv-card iv-session">
          <div className="iv-progress-row">
            <span>Question {currentIndex + 1} of {questions.length}</span>
            <span className={secondsLeft <= 15 ? 'iv-timer iv-timer-low' : 'iv-timer'}>
              {minutes}:{seconds}
            </span>
          </div>
          <div className="iv-progress-track">
            <div className="iv-progress-fill" style={{ width: `${progressPct}%` }} />
          </div>

          <h2 className="iv-question">{question.text}</h2>

          <div className="form-group">
            <textarea
              className="form-control"
              placeholder="Speak using the mic, or type your answer here…"
              value={draftAnswer}
              onChange={(e) => setDraftAnswer(e.target.value)}
              rows={6}
            />
          </div>

          {micError && <div className="alert alert-error">{micError}</div>}

          <div className="iv-controls">
            <button
              type="button"
              className={isListening ? 'btn btn-danger iv-mic-active' : 'btn btn-secondary'}
              onClick={toggleListening}
              disabled={!SpeechRecognitionImpl}
              title={
                SpeechRecognitionImpl
                  ? isListening ? 'Stop recording' : 'Answer by speaking'
                  : 'Speech input not supported in this browser'
              }
            >
              {isListening ? '● Recording…' : '🎤 Speak answer'}
            </button>

            <button type="button" className="btn btn-primary" onClick={goToNext}>
              {currentIndex + 1 === questions.length ? 'Finish' : 'Next question'}
            </button>
          </div>
        </div>
      </div>
    )
  }

  if (stage === 'scoring') {
    return (
      <div className="iv-page">
        <div className="glass-card iv-card iv-scoring">
          <span className="spinner" />
          <p>Scoring your answers…</p>
          {submitError && (
            <>
              <div className="alert alert-error">{submitError}</div>
              <button className="btn btn-primary" onClick={handleRestart}>Start over</button>
            </>
          )}
        </div>
      </div>
    )
  }

  if (stage === 'result' && result) {
    return (
      <div className="iv-page">
        <div className="glass-card iv-card iv-result">
          <h1>Your score</h1>
          <div className="iv-score-circle">{result.overallScore}</div>
          <p className="iv-overall-feedback">{result.overallFeedback}</p>

          <div className="iv-breakdown">
            {result.perQuestion.map((pq, i) => (
              <div className="iv-breakdown-item" key={pq.questionId || i}>
                <div className="iv-breakdown-header">
                  <span>Question {i + 1}</span>
                  <span className="badge badge-green">{pq.score}/100</span>
                </div>
                <p className="iv-breakdown-question">{answers[i]?.question}</p>
                <p className="iv-breakdown-feedback">{pq.feedback}</p>
              </div>
            ))}
          </div>

          <button className="btn btn-primary btn-lg w-full" onClick={handleRestart}>
            Practice again
          </button>
        </div>
      </div>
    )
  }

  return null
}