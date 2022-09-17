import { sumFunc, multiplyFunc, getAbsoluteValue } from '../src/lib/math'

describe('Math lib', () => {
  it('should be able to sum two numbers', () => {
    expect(sumFunc(2, 2)).toBe(4)
    expect(sumFunc(3, 3)).toBe(6)
  })

  it('should be able to multiply two numbers', () => {
    expect(multiplyFunc(5, 5)).toBe(25)
    expect(multiplyFunc(10, 10)).toBe(100)
  })

  it('should be able to get the absolute value of a number', () => {
    expect(getAbsoluteValue(-4)).toBe(4)
    expect(getAbsoluteValue(-15)).toBe(15)
  })
})
