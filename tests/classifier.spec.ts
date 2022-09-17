import { Classifier } from '../src/classifier'
import fs from 'fs'

describe('Classifier', () => {
  afterAll(async () => {
    await fs.promises.rm('test.json')
    await fs.promises.rm('nested-dir', { recursive: true })
  })

  describe('file system methods', () => {
    it('should be able to save data as json in the current directory', async () => {
      const classifier = new Classifier()
      classifier.learn('I love cats', ['animal'])
      classifier.learn('Brazilian eat rice and beans', ['food'])
      await classifier.toJSON('test.json')
    })

    it('should be able to save data as json in a nested directory', async () => {
      const classifier = new Classifier()
      classifier.learn('I love cats', ['animal'])
      classifier.learn('Brazilian eat rice and beans', ['food'])
      await classifier.toJSON('nested-dir/test.json')
    })
  })
})
