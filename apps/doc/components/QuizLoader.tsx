import { Quiz } from './Quiz'

interface QuizLoaderProps {
  topic: string
  type?: 'guide' | 'package'
}

export async function QuizLoader({ topic, type = 'guide' }: QuizLoaderProps) {
  try {
    const path = type === 'guide' 
      ? `../content/guide/quizzes/${topic}.json`
      : `../content/packages/quizzes/${topic}.json`
    
    const quizData = await import(path)
    
    return <Quiz data={quizData.default || quizData} />
  } catch (error) {
    console.error(`Failed to load quiz for ${topic}:`, error)
    return (
      <div className="my-8 rounded-lg border border-yellow-200 dark:border-yellow-800 bg-yellow-50 dark:bg-yellow-950 p-4">
        <p className="text-yellow-800 dark:text-yellow-200">
          ⚠️ Le quiz pour ce sujet n'est pas encore disponible.
        </p>
      </div>
    )
  }
}
