import { Category } from './category'
import { isArray, returnTypeParser, sumFunc, toNumber, toPercent } from './lib'
import { writeFile, readFile, mkdir } from 'fs/promises'
import { existsSync } from 'fs'
import { parse } from 'path'
import yaml from 'js-yaml'
import { ClassifierProps, ClassifierOptions, Dataset } from './types'

export class Classifier {
  private categories: Category[] = []
  options: ClassifierOptions = {}

  constructor(options?: ClassifierOptions) {
    this.options = options ?? {}
  }

  calculateAccuracy(
    trainData: Dataset,
    validationData: Dataset
  ): string | number {
    const validationSentencesQuantity = validationData.length
    let correctInferences = 0

    for (const { sentence, categories } of trainData) {
      this.learn(sentence, categories)
    }

    for (const { sentence, categories } of validationData) {
      const classification = this.classify(sentence)
      const match = (this.options.returnType === 'BEST_MATCH'
        ? classification
        : this.extractBestMatch(
            classification as unknown as Record<string, number>
          )) as unknown as string

      const categoriesToCheck = isArray(categories)
        ? categories
        : ([categories] as unknown as string[])

      if (categoriesToCheck.includes(match)) correctInferences++
    }

    return returnTypeParser(
      correctInferences / validationSentencesQuantity,
      this.options
    )
  }

  learn(sentence: string, inputs: string | string[]) {
    const classifications = Array.isArray(inputs) ? inputs : [inputs]

    classifications.forEach((classification) => {
      let category = this.categories.find(
        (categorie) => categorie.name === classification
      )
      const relatedCategories = classifications.filter(
        (item) => item !== classification
      )
      if (category) category.addSentence(sentence, relatedCategories)
      else {
        category = new Category(classification).addSentence(
          sentence,
          relatedCategories
        )
        this.categories.push(category)
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

    result.unknown =
      this.options?.returnType === 'PERCENTAGE'
        ? toPercent(!!relevancySum ? unknownScore / relevancySum : unknownScore)
        : !!relevancySum
        ? unknownScore / relevancySum
        : unknownScore

    for (const [name, relevancy] of Object.entries(classification)) {
      const value = relevancySum ? relevancy / relevancySum : 0
      result[name] = returnTypeParser(value ?? 0, this.options)
    }

    this.freeMemory()

    if (this.options.returnType === 'BEST_MATCH') {
      return this.extractBestMatch(result as unknown as Record<string, number>)
    }

    return result
  }

  private extractBestMatch(result: Record<string, number>) {
    const descendingSortedResult = Object.entries(result).sort(
      (a, b) => toNumber(b[1]) - toNumber(a[1])
    )
    const [[bestMatch]] = descendingSortedResult

    return bestMatch
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

  resetKnowledge() {
    this.categories = []
  }

  private async ensureAttributesForCreation(
    filepath: string,
    format: 'JSON' | 'YAML',
    allowedExtentions: string[]
  ) {
    const { ext, dir } = parse(filepath)
    if (!allowedExtentions.includes(ext))
      throw new Error(
        `'${filepath}' is an invalid filepath! The file must be a valid ${format}.`
      )

    if (dir && !existsSync(dir)) {
      await mkdir(dir, { recursive: true })
    }
  }

  getModel() {
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

    return json
  }

  async toYAML(filepath: string) {
    await this.ensureAttributesForCreation(filepath, 'YAML', ['.yml', '.yaml'])
    await writeFile(filepath, yaml.dump(this.getModel()))
  }

  async toJSON(filepath: string) {
    await this.ensureAttributesForCreation(filepath, 'JSON', ['.json'])
    await writeFile(filepath, JSON.stringify(this.getModel(), null, 2))
  }

  async fromYAML(filePath: string, options?: ClassifierOptions) {
    const file = await readFile(filePath)
    const classifierProps = yaml.load(
      file.toString()
    ) as unknown as ClassifierProps
    this.resetKnowledge()
    this.options = {
      ...classifierProps.options,
      ...options,
    }
    classifierProps.categories.forEach((category) =>
      this.categories.push(new Category(category.name, category.tokens))
    )
  }

  async fromJSON(filePath: string, options?: ClassifierOptions) {
    const file = await readFile(filePath)
    const classifierProps = JSON.parse(
      file.toString()
    ) as unknown as ClassifierProps
    this.resetKnowledge()
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
