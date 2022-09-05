import { Category } from './category'
import { toPercent } from './lib'

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

  classify(sentence: string) {
    let classification: Record<string, number> = {}
    this.categories.forEach((category) => {
      classification[category.name] = category.classify(sentence)
    })
    const sumStrength = Object.values(classification).reduce((a, b) => a + b, 0)
    let result: Record<string, string | number> = {}
    for (const [name, strength] of Object.entries(classification)) {
      const value = sumStrength ? strength / sumStrength : 0
      result[name] = this.options?.percentualReturn ? toPercent(value) : value
    }
    return result
  }

}
