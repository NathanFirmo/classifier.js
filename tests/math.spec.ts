import { sumFunc } from '../src/lib'

describe('Math lib', () => {
  it('should be able to sum two numbers', () => {
    expect(sumFunc(2, 2)).toBe(4)
  })
})
