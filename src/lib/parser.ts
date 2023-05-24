export function toPercent(value: number, precisionDigits?: number) {
  return value.toLocaleString('en', {
    style: 'percent',
    maximumFractionDigits: precisionDigits,
  })
}

export function toNumber(value: number | string) {
  if (typeof value === 'number') return value
  return Number(value.replace('%', ''))
}

export function toNormalizedString(input: string) {
  return input
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/\d/g, '9')
}
