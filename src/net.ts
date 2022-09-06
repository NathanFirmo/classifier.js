import { Category } from './category'
import { sumFunc, toPercent } from './lib'

interface NeuralNetworkOptions {
  percentualReturn?: boolean
}

export class NeuralNetwork {
  categories: Category[] = []
  options?: NeuralNetworkOptions = {}

  constructor(options?: NeuralNetworkOptions) {
    this.options = options
  }

  learn(sentence: string, classifications: string[]) {
    classifications.forEach((classification) => {
      let categorie = this.categories.find(
        (categorie) => categorie.name === classification
      )
      if (categorie) categorie.addSentence(sentence)
      else {
        categorie = new Category(classification).addSentence(sentence)
        this.categories.push(categorie)
      }
    })
  }

  private normalizeData(sentence: string) {
    return sentence.toLowerCase()
  }

  private getUnknownScore(sentence: string) {
    return (
      this.normalizeData(sentence)
        .split(' ')
        .filter((word) => !this.getTokens().includes(word)).length /
      sentence.split(' ').length
    )
  }

  classify(sentence: string) {
    let classification: Record<string, number> = {}
    this.categories.forEach((category) => {
      classification[category.name] = category.classify(
        sentence,
        this.categories
      )
    })
    let result: Record<string, string | number> = {}
    result.unknown = this.getUnknownScore(sentence)
    const sumStrength =
      Object.values(classification).reduce(sumFunc, 0) + result.unknown
    result.unknown = this.options?.percentualReturn
      ? toPercent(result.unknown / sumStrength)
      : result.unknown / sumStrength
    for (const [name, strength] of Object.entries(classification)) {
      const value = sumStrength ? strength / sumStrength : 0
      result[name] = this.options?.percentualReturn ? toPercent(value) : value
    }
    return result
  }

  getTokens() {
    return this.categories.flatMap((category) =>
      category.getWords(category.sentences)
    )
  }

  getCateforieByName(name: string) {
    return this.categories.find((category) => category.name === name)
  }
}
