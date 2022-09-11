import { Category } from './category'
import { sumFunc, toPercent } from './lib'
import { writeFile, readFile } from 'fs/promises'

interface ClassifierOptions {
  percentualReturn?: boolean
}

export interface ClassifierProps {
  options: ClassifierOptions
  categories: Record<'name' | 'tokens', any>[]
}

export class Classifier {
  private categories: Category[] = []
  options?: ClassifierOptions = {}

  constructor(options?: ClassifierOptions) {
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
    const unknownScore = this.getUnknownScore(sentence)
    const relevancySum =
      Object.values(classification).reduce(sumFunc, 0) + unknownScore
    result.unknown = this.options?.percentualReturn
      ? toPercent(unknownScore / relevancySum)
      : unknownScore / relevancySum

    for (const [name, relevancy] of Object.entries(classification)) {
      const value = relevancySum ? relevancy / relevancySum : 0
      result[name] = this.options?.percentualReturn ? toPercent(value) : value
    }

    this.freeMemory()
    return result
  }

  private getTokens() {
    return [
      ...new Set(
        this.categories.flatMap((category) =>
          category.getTokens().map((token) => {
            const [tokenName] = token
            return tokenName
          })
        )
      ),
    ]
  }

  resetAcknowledgement() {
    this.categories = []
  }

  async toJSON(filename: string) {
    this.analize()
    const json: ClassifierProps = {
      options: this.options!,
      categories: [],
    }
    this.categories.forEach((category) =>
      json.categories.push({
        name: category.name,
        tokens: category.getTokens(),
      })
    )
    await writeFile(filename, JSON.stringify(json, null, 2))
    return json
  }

  async fromJSON(filePath: string, options?: ClassifierOptions) {
    const file = await readFile(filePath)
    const classifierProps = JSON.parse(
      file.toString()
    ) as unknown as ClassifierProps
    this.resetAcknowledgement()
    this.options = {
      ...classifierProps.options,
      ...options,
    }
    classifierProps.categories.forEach((category) =>
      this.categories.push(new Category(category.name, category.tokens))
    )
  }

  private freeMemory() {
    this.categories.forEach((category) => (category.sentences = []))
  }

  private analize() {
    this.categories.forEach((category) => category.analize(this.categories))
  }
}
