import { useMDXComponents as getDocsMDXComponents } from 'nextra-theme-docs'
import { QuizLoader } from './components/QuizLoader'

const docsComponents = getDocsMDXComponents()

export function useMDXComponents(components) {
  return {
    ...docsComponents,
    QuizLoader,
    ...components
  }
}
