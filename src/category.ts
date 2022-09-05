import { TokensList } from './tokensList'
const { isArray } = Array

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

  normalizeData(sentence: string) {
    return sentence.toLowerCase()
  }

  getWords(input: string[] | string) {
    return isArray(input) ? input.join(' ').split(' ') : input.split(' ')
  }

  analize() {
    this.getWords(this.sentences).forEach((word) =>
      this.inferedTokens.addKeyword(word)
    )
    return this
  }

  classify(sentence: string) {
    this.analize()
    return this.getWords(this.normalizeData(sentence))
      .map((word) => this.inferedTokens.test(word))
      .reduce((a, b) => a + b, 0)
  }
}
