import { Classifier } from '../src/classifier'
import fs from 'fs'

describe('Classifier', () => {
  let classifier: Classifier
  const fromFileOutput = {
    animal: 0,
    food: 0.6666666666666666,
    unknown: 0.3333333333333333,
  }

  beforeAll(() => {
    classifier = new Classifier()
    classifier.learn('I love cats', ['animal'])
    classifier.learn('Brazilian eat rice and beans', ['food'])
  })

  afterAll(async () => {
    if (fs.existsSync('test.json')) await fs.promises.rm('test.json')
    if (fs.existsSync('test.yaml')) await fs.promises.rm('test.yaml')
    if (fs.existsSync('nested-dir'))
      await fs.promises.rm('nested-dir', { recursive: true })
  })

  describe('file system saving methods', () => {
    it('should be able to save data as json in the current directory', async () => {
      await classifier.toJSON('test.json')
      expect(fs.existsSync('test.json')).toBe(true)
    })

    it('should be able to save data as json in a nested directory', async () => {
      await classifier.toJSON('nested-dir/test.json')
      expect(fs.existsSync('nested-dir/test.json')).toBe(true)
    })

    it('should be able to save data as yaml in the current directory', async () => {
      await classifier.toYAML('test.yaml')
      expect(fs.existsSync('test.yaml')).toBe(true)
    })

    it('should be able to save data as yaml in a nested directory', async () => {
      await classifier.toYAML('nested-dir/test.yaml')
      expect(fs.existsSync('nested-dir/test.yaml')).toBe(true)
    })
  })

  describe('file system reading methods', () => {
    it('load data from a json file in the current directory', async () => {
      await classifier.fromJSON('test.json')
      expect(classifier.classify("They don't eat rice")).toEqual(fromFileOutput)
    })

    it('load data from a json file in a nested directory', async () => {
      await classifier.fromJSON('nested-dir/test.json')
      expect(classifier.classify("They don't eat rice")).toEqual(fromFileOutput)
    })

    it('load data from an yaml file in the current directory', async () => {
      await classifier.fromYAML('test.yaml')
      expect(classifier.classify("They don't eat rice")).toEqual(fromFileOutput)
    })

    it('load data from an yaml file in a nested directory', async () => {
      await classifier.fromYAML('nested-dir/test.yaml')
      expect(classifier.classify("They don't eat rice")).toEqual(fromFileOutput)
    })
  })

  describe('classifying method', () => {
    it('should be able to classify sentences with only one category', () => {
      classifier.resetKnowledge()
      classifier.learn('I like cats', ['animal'])
      classifier.learn('Cats are cool', ['animal'])
      classifier.learn('Dogs are noisy', ['animal'])
      classifier.learn('I love animals', ['animal'])
      classifier.learn('I like my horse', ['animal'])
      classifier.learn('Chocolate is good', ['food'])
      classifier.learn('I eat apple', ['food'])
      classifier.learn('Juice is very good', ['food'])
      classifier.learn('Brazilians eat rice and beans', ['food'])
      classifier.learn('Bananas are good for health', ['food'])

      expect(classifier.classify('Apple juice is awesome')).toEqual(
        expect.objectContaining({ unknown: 0.2, animal: 0, food: 0.8 })
      )
    })

    it('should be able to classify sentences with more than one category', () => {
      classifier.resetKnowledge()
      classifier.learn('I like cats', ['animal'])
      classifier.learn('Cats are cool', ['animal'])
      classifier.learn('Dogs are noisy', ['animal'])
      classifier.learn('I love animals', ['animal'])
      classifier.learn('I like my horse', ['animal', 'herbivorous'])
      classifier.learn('Chocolate is good', ['food'])
      classifier.learn('I eat apple', ['food', 'fruit'])
      classifier.learn('Juice is very good', ['food'])
      classifier.learn('Brazilians eat rice and beans', ['food'])
      classifier.learn('Bananas are good for health', ['food'])

      expect(classifier.classify('Apple juice is awesome')).toEqual(
        expect.objectContaining({
          unknown: 0.12727272727272726,
          animal: 0,
          herbivorous: 0,
          food: 0.509090909090909,
          fruit: 0.36363636363636365,
        })
      )
    })
  })
})
