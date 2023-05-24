import { ClassifierProps } from '../types'
import { toPercent } from './parser'
export const { isArray } = Array

export const returnTypeParser = (
  value: number,
  options: ClassifierProps['options']
) => {
  switch (options?.returnType) {
    case 'NUMBER':
      return value
    case 'PERCENTAGE':
      return toPercent(value)
    default:
      return value
  }
}
