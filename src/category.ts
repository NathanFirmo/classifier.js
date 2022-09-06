import { TokensList } from './tokensList'
const { isArray } = Array
import { getAbsoluteValue, sumFunc } from './lib'

export class Category {
  name: string
  sentences: string[] = []
  inferedTokens: TokensList

  constructor(name: string) {
    this.name = name
    this.inferedTokens = new TokensList(name)
  }

  addSentence(sentence: string) {
    const normalizedSentence = this.normalizeData(sentence)
    this.sentences?.push(normalizedSentence)
    return this
  }

  removeSentence(sentence: string) {
    this.sentences = this.sentences?.filter((item) => item !== sentence)
    return this
  }

  private normalizeData(sentence: string) {
    return sentence.toLowerCase()
  }

  getWords(input: string[] | string) {
    return isArray(input) ? input.join(' ').split(' ') : input.split(' ')
  }

  analize(categories: Category[]) {
    this.getWords(this.sentences).forEach((word) => {
      this.inferedTokens.strengthenKeyword(word)
    })

    categories
      .filter((category) => category.name !== this.name)
      .forEach((category) =>
        category
          .getWords(category.sentences)
          .forEach((word) => this.inferedTokens.weakenKeyword(word))
      )

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
}
