const currencyFormatter = new Intl.NumberFormat('pt-BR', {
  style: 'currency',
  currency: 'BRL',
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
})

const dateFormatter = new Intl.DateTimeFormat('pt-BR', {
  day: '2-digit',
  month: '2-digit',
  year: 'numeric',
})

const monthFormatter = new Intl.DateTimeFormat('pt-BR', {
  month: 'short',
})

export function toNumber(value: unknown): number {
  if (typeof value === 'number') {
    return Number.isFinite(value) ? value : 0
  }

  if (typeof value === 'string') {
    const trimmedValue = value.trim()

    if (!trimmedValue) {
      return 0
    }

    const normalizedValue = trimmedValue.includes(',') && trimmedValue.includes('.')
      ? trimmedValue.replace(/\./g, '').replace(',', '.')
      : trimmedValue.replace(',', '.')

    const parsedValue = Number(normalizedValue)

    return Number.isFinite(parsedValue) ? parsedValue : 0
  }

  return 0
}

export function normalizeText(value: string | null | undefined, fallback = 'Não informado'): string {
  const normalizedValue = value?.replace(/\s+/g, ' ').trim()

  return normalizedValue ? normalizedValue : fallback
}

export function formatCurrencyBRL(value: number): string {
  return currencyFormatter.format(Number.isFinite(value) ? value : 0)
}

export function formatDateBR(value: string | null): string {
  if (!value) {
    return 'Sem data'
  }

  const parsedDate = new Date(value)

  return Number.isNaN(parsedDate.getTime()) ? 'Sem data' : dateFormatter.format(parsedDate)
}

export function formatCount(value: number, singular: string, plural: string): string {
  return `${value} ${value === 1 ? singular : plural}`
}

export function getTimestamp(value: string | null): number {
  if (!value) {
    return 0
  }

  const parsedDate = new Date(value)

  return Number.isNaN(parsedDate.getTime()) ? 0 : parsedDate.getTime()
}

export function getYearFromDate(value: string | null): string | null {
  if (!value) {
    return null
  }

  const parsedDate = new Date(value)

  return Number.isNaN(parsedDate.getTime()) ? null : String(parsedDate.getFullYear())
}

export function getMonthKey(value: string | null): string | null {
  if (!value) {
    return null
  }

  const parsedDate = new Date(value)

  if (Number.isNaN(parsedDate.getTime())) {
    return null
  }

  const month = String(parsedDate.getMonth() + 1).padStart(2, '0')

  return `${parsedDate.getFullYear()}-${month}`
}

export function getMonthLabel(key: string): string {
  const [year, month] = key.split('-')
  const parsedDate = new Date(Number(year), Number(month) - 1, 1)

  if (Number.isNaN(parsedDate.getTime())) {
    return key
  }

  const monthLabel = monthFormatter.format(parsedDate).replace('.', '')

  return `${monthLabel.charAt(0).toUpperCase()}${monthLabel.slice(1)} ${year}`
}
