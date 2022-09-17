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
    await fs.promises.rm('test.json')
    await fs.promises.rm('test.yaml')
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
})
