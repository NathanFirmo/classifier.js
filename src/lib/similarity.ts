export function getChunks(input: string) {
  const CHUNK_SIZE = 3
  const chunks = []
  let currentChunk = 1
  while ((currentChunk - 1) * CHUNK_SIZE < input.length) {
    chunks.push(
      input.substring(
        (currentChunk - 1) * CHUNK_SIZE,
        currentChunk * CHUNK_SIZE
      )
    )
    currentChunk++
  }
  return makeIterator(chunks)
}

const makeIterator = <T>(array: Array<T>) => {
  let nextIndex = 0

  return {
    next: () => {
      return nextIndex < array.length
        ? { value: array[nextIndex++], done: false }
        : { done: true }
    },
  }
}

export function getRoot(base: string, newToken: string) {
  const chunks = getChunks(newToken)
  let currentChunk = chunks.next().value
  let root = ''
  while (currentChunk && base.includes(root + currentChunk)) {
    root += currentChunk
    currentChunk = chunks.next().value
  }
  if(root === '') return ''
  const subChunk = makeIterator(currentChunk?.split('') ?? [])
  let currentSubItem = subChunk.next().value
  while (currentSubItem && base.includes(root + currentSubItem)) {
    root += currentSubItem
    currentSubItem = subChunk.next().value
  }
  return root
}

export function resolveSimilarity(base: string, newToken: string) {
  const root = getRoot(base, newToken)
  return newToken.length > base.length
    ? root.length / newToken.length
    : root.length / base.length
}
