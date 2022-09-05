import { resolveSimilarity } from './lib'

interface TokenProps {
  strength: number
}

export class TokensList {
  category: string
  tokens = new Map<string, TokenProps>()
  constructor(category: string) {
    this.category = category
  }

  addKeyword(token: string) {
    const currentTokenProps = this.tokens.get(token)
    this.tokens.keys()
    this.tokens.set(token, { strength: (currentTokenProps?.strength ?? 0) + 1 })
  }

  getSimilarity(value: string) {
    const tokens = [...this.tokens.keys()]
    let currentValue = 0
    tokens.forEach((token) => {
      const similarity = resolveSimilarity(token, value)
      if (similarity > currentValue) currentValue = similarity
    })
    return currentValue
  }

  test(token: string) {
    return this.tokens.get(token)?.strength ?? this.getSimilarity(token)
  }
}
