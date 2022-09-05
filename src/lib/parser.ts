export function toPercent(value: number, precisionDigits?: number) {
  return value.toLocaleString('en', {
    style: 'percent',
    maximumFractionDigits: precisionDigits,
  })
}
