'use client'

import { useState } from 'react'

interface QuizQuestion {
  id: number
  question: string
  options: string[]
  correctAnswer: number
  difficulty: 'facile' | 'expérimenté' | 'expert'
  explanation: string
}

interface QuizData {
  title: string
  description: string
  questions: QuizQuestion[]
}

interface QuizProps {
  data: QuizData
}

export function Quiz({ data }: QuizProps) {
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null)
  const [showExplanation, setShowExplanation] = useState(false)
  const [score, setScore] = useState(0)
  const [answeredQuestions, setAnsweredQuestions] = useState<Set<number>>(new Set())
  const [isQuizComplete, setIsQuizComplete] = useState(false)

  const question = data.questions[currentQuestion]

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'facile':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
      case 'expérimenté':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
      case 'expert':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
    }
  }

  const handleAnswerSelect = (answerIndex: number) => {
    if (!showExplanation) {
      setSelectedAnswer(answerIndex)
    }
  }

  const handleValidate = () => {
    if (selectedAnswer === null) return

    setShowExplanation(true)
    
    if (!answeredQuestions.has(currentQuestion)) {
      if (selectedAnswer === question.correctAnswer) {
        setScore(score + 1)
      }
      setAnsweredQuestions(new Set([...answeredQuestions, currentQuestion]))
    }
  }

  const handleNext = () => {
    if (currentQuestion < data.questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1)
      setSelectedAnswer(null)
      setShowExplanation(false)
    } else {
      setIsQuizComplete(true)
    }
  }

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1)
      setSelectedAnswer(null)
      setShowExplanation(false)
    }
  }

  const handleRestart = () => {
    setCurrentQuestion(0)
    setSelectedAnswer(null)
    setShowExplanation(false)
    setScore(0)
    setAnsweredQuestions(new Set())
    setIsQuizComplete(false)
  }

  const getScorePercentage = () => {
    return Math.round((score / data.questions.length) * 100)
  }

  const getScoreMessage = () => {
    const percentage = getScorePercentage()
    if (percentage >= 90) return '🎉 Excellent ! Vous maîtrisez parfaitement le sujet !'
    if (percentage >= 70) return '👍 Très bien ! Vous avez une bonne compréhension du sujet.'
    if (percentage >= 50) return '👌 Pas mal ! Continuez à réviser pour améliorer vos connaissances.'
    return '📚 Continuez vos efforts ! Relisez le cours et réessayez.'
  }

  if (isQuizComplete) {
    return (
      <div className="my-8 rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 p-6">
        <h3 className="text-2xl font-bold mb-4">Quiz terminé !</h3>
        <div className="mb-6">
          <div className="text-4xl font-bold text-center mb-4">
            {score} / {data.questions.length}
          </div>
          <div className="text-xl text-center mb-4">{getScorePercentage()}%</div>
          <div className="text-center text-lg">{getScoreMessage()}</div>
        </div>
        <div className="flex gap-4 justify-center">
          <button
            onClick={handleRestart}
            className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
          >
            Recommencer
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="my-8 rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 p-6">
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold">{data.title}</h3>
          <span className={`px-3 py-1 rounded-full text-sm font-medium ${getDifficultyColor(question.difficulty)}`}>
            {question.difficulty}
          </span>
        </div>
        <div className="text-sm text-gray-600 dark:text-gray-400 mb-2">
          Question {currentQuestion + 1} / {data.questions.length}
        </div>
        <div className="w-full bg-gray-200 dark:bg-gray-800 rounded-full h-2 mb-4">
          <div
            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${((currentQuestion + 1) / data.questions.length) * 100}%` }}
          />
        </div>
      </div>

      <div className="mb-6">
        <h4 className="text-lg font-semibold mb-4">{question.question}</h4>
        <div className="space-y-3">
          {question.options.map((option, index) => {
            const isSelected = selectedAnswer === index
            const isCorrect = index === question.correctAnswer
            const showResult = showExplanation

            let buttonClass = 'w-full text-left px-4 py-3 rounded-lg border-2 transition-all duration-200 '
            
            if (!showResult) {
              buttonClass += isSelected
                ? 'border-blue-600 bg-blue-50 dark:bg-blue-950'
                : 'border-gray-200 dark:border-gray-800 hover:border-gray-300 dark:hover:border-gray-700'
            } else {
              if (isCorrect) {
                buttonClass += 'border-green-600 bg-green-50 dark:bg-green-950'
              } else if (isSelected && !isCorrect) {
                buttonClass += 'border-red-600 bg-red-50 dark:bg-red-950'
              } else {
                buttonClass += 'border-gray-200 dark:border-gray-800'
              }
            }

            return (
              <button
                key={index}
                onClick={() => handleAnswerSelect(index)}
                disabled={showExplanation}
                className={buttonClass}
              >
                <div className="flex items-center gap-3">
                  <span className="font-medium">{String.fromCharCode(65 + index)}.</span>
                  <span>{option}</span>
                  {showResult && isCorrect && <span className="ml-auto text-green-600">✓</span>}
                  {showResult && isSelected && !isCorrect && <span className="ml-auto text-red-600">✗</span>}
                </div>
              </button>
            )
          })}
        </div>
      </div>

      {showExplanation && (
        <div className="mb-6 p-4 rounded-lg bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800">
          <div className="font-semibold mb-2 text-blue-900 dark:text-blue-100">💡 Explication</div>
          <div className="text-blue-800 dark:text-blue-200">{question.explanation}</div>
        </div>
      )}

      <div className="flex gap-4 justify-between">
        <button
          onClick={handlePrevious}
          disabled={currentQuestion === 0}
          className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          ← Précédent
        </button>

        {!showExplanation ? (
          <button
            onClick={handleValidate}
            disabled={selectedAnswer === null}
            className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Valider
          </button>
        ) : (
          <button
            onClick={handleNext}
            className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
          >
            {currentQuestion < data.questions.length - 1 ? 'Suivant →' : 'Terminer'}
          </button>
        )}
      </div>

      <div className="mt-4 text-center text-sm text-gray-600 dark:text-gray-400">
        Score actuel : {score} / {answeredQuestions.size}
      </div>
    </div>
  )
}
