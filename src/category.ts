import { TokensList } from './tokensList'
const { isArray } = Array
import { getAbsoluteValue, sumFunc, toNormalizedString } from './lib'
import { TokenProps } from './tokensList'

export class Category {
  name: string
  sentences: string[] = []
  inferedTokens: TokensList
  private isUpdated = true

  constructor(name: string, tokens: [string, TokenProps][] = []) {
    this.name = name
    this.inferedTokens = new TokensList(name)
    for (const [name, value] of tokens)
      this.inferedTokens.tokens.set(name, value)
  }

  addSentence(sentence: string) {
    this.isUpdated = false
    const normalizedSentence = this.normalizeData(sentence)
    this.sentences?.push(normalizedSentence)
    return this
  }

  private normalizeData(sentence: string) {
    return toNormalizedString(sentence.toLowerCase())
  }

  getWords(input: string[] | string) {
    return isArray(input) ? input.join(' ').split(' ') : input.split(' ')
  }

  analize(categories: Category[]) {
    if(this.isUpdated) return this
    this.getWords(this.sentences).forEach((word) => {
      this.inferedTokens.increaseRelevancy(word)
    })

    categories
      .filter((category) => category.name !== this.name)
      .forEach((category) =>
        category
          .getWords(category.sentences)
          .forEach((word) => this.inferedTokens.decreaseRelevancy(word))
      )

    this.isUpdated = true
    return this
  }

  private resolveScore(score: number[]) {
    const positiveValues = score.filter((item) => item >= 0)
    const negativeValues = score.filter((item) => item < 0)
    const sumOfPositiveValues = positiveValues.reduce(sumFunc, 0)
    const resolvedNegativeScore = getAbsoluteValue(
      negativeValues.reduce(sumFunc, 0)
    )
    return sumOfPositiveValues / (resolvedNegativeScore + sumOfPositiveValues)
  }

  classify(sentence: string, categories: Category[]) {
    this.analize(categories)
    const classifiedWords = this.getWords(this.normalizeData(sentence)).map(
      (word) => this.inferedTokens.test(word)
    )
    const score = this.resolveScore(classifiedWords)
    return score > 0 ? score : 0
  }

  getTokens() {
    return [...this.inferedTokens.tokens.entries()]
  }
}
