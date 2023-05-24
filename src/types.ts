export type ReturnType = 'PERCENTAGE' | 'NUMBER' | 'BEST_MATCH'

export interface ClassifierOptions {
  returnType?: ReturnType
}

export interface ClassifierProps {
  options: ClassifierOptions
  categories: Record<'name' | 'tokens', any>[]
}

export type Dataset = Array<{
  sentence: string
  categories: string[] | string
}>
