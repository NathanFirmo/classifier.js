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

  strengthenKeyword(token: string) {
    const currentTokenProps = this.tokens.get(token)
    this.tokens.set(token, { strength: (currentTokenProps?.strength ?? 0) + 1 })
  }

  weakenKeyword(token: string) {
    const currentTokenProps = this.tokens.get(token)
    this.tokens.set(token, { strength: (currentTokenProps?.strength ?? 0) - 1 })
  }

  getSimilarity(value: string) {
    const entries = [...this.tokens.entries()]
    let similarity = 0,
      strength = 0
    entries.forEach((entry) => {
      const [token, tokenProps] = entry
      const currentSimilarity = resolveSimilarity(token, value)
      if (currentSimilarity > similarity) {
        similarity = currentSimilarity
        strength = tokenProps.strength
      }
    })
    return similarity * strength
  }

  test(token: string) {
    return this.tokens.get(token)?.strength ?? this.getSimilarity(token)
  }
}
