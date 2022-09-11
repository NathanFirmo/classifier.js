import { resolveSimilarity } from './lib'

export interface TokenProps {
  relevancy: number
}

export class TokensList {
  category: string
  tokens = new Map<string, TokenProps>()
  constructor(category: string) {
    this.category = category
  }

  increaseRelevancy(token: string) {
    const currentTokenProps = this.tokens.get(token)
    this.tokens.set(token, { relevancy: (currentTokenProps?.relevancy ?? 0) + 1 })
  }

  decreaseRelevancy(token: string) {
    const currentTokenProps = this.tokens.get(token)
    this.tokens.set(token, { relevancy: (currentTokenProps?.relevancy ?? 0) - 1 })
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
        strength = tokenProps.relevancy
      }
    })
    return similarity * strength
  }

  test(token: string) {
    return this.tokens.get(token)?.relevancy ?? this.getSimilarity(token)
  }
}
