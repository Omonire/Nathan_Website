export type Currency = {
  code: string
  label: string
  symbol: string
}

export const CURRENCIES: Currency[] = [
  { code: 'USD', label: 'US Dollar', symbol: '$' },
  { code: 'EUR', label: 'Euro', symbol: '€' },
  { code: 'GBP', label: 'British Pound', symbol: '£' },
  { code: 'NGN', label: 'Nigerian Naira', symbol: '₦' },
  { code: 'CAD', label: 'Canadian Dollar', symbol: 'C$' },
  { code: 'AUD', label: 'Australian Dollar', symbol: 'A$' },
  { code: 'INR', label: 'Indian Rupee', symbol: '₹' },
  { code: 'ZAR', label: 'South African Rand', symbol: 'R' },
  { code: 'KES', label: 'Kenyan Shilling', symbol: 'KSh' },
  { code: 'GHS', label: 'Ghanaian Cedi', symbol: '₵' },
  { code: 'BRL', label: 'Brazilian Real', symbol: 'R$' },
  { code: 'JPY', label: 'Japanese Yen', symbol: '¥' },
  { code: 'AED', label: 'UAE Dirham', symbol: 'د.إ' },
  { code: 'PHP', label: 'Philippine Peso', symbol: '₱' },
]

const RATES_URL = 'https://open.er-api.com/v6/latest/USD'
const CACHE_KEY = 'slick_fx_rates'
const CACHE_TTL_MS = 12 * 60 * 60 * 1000

export type FxRates = {
  base: 'USD'
  rates: Record<string, number>
  fetchedAt: number
}

type ErApiResponse = {
  result?: string
  rates?: Record<string, number>
  time_last_update_unix?: number
}

type CachePayload = { rates: Record<string, number>; fetchedAt: number }

function readCache(): FxRates | null {
  try {
    const raw = localStorage.getItem(CACHE_KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw) as CachePayload
    if (!parsed.rates || Date.now() - parsed.fetchedAt > CACHE_TTL_MS) return null
    return { base: 'USD', rates: parsed.rates, fetchedAt: parsed.fetchedAt }
  } catch {
    return null
  }
}

function writeCache(rates: Record<string, number>): FxRates {
  const payload: FxRates = { base: 'USD', rates, fetchedAt: Date.now() }
  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify({ rates, fetchedAt: payload.fetchedAt }))
  } catch {
    /* storage unavailable */
  }
  return payload
}

let inflight: Promise<FxRates | null> | null = null

export async function getRates(): Promise<FxRates | null> {
  const cached = readCache()
  if (cached) return cached
  if (inflight) return inflight

  inflight = (async () => {
    try {
      const res = await fetch(RATES_URL)
      if (!res.ok) return null
      const data = (await res.json()) as ErApiResponse
      if (data.result !== 'success' || !data.rates) return null
      return writeCache(data.rates)
    } catch {
      return null
    } finally {
      inflight = null
    }
  })()

  return inflight
}

export function convert(usdAmount: number, code: string, rates: Record<string, number> | null): number | null {
  if (code === 'USD') return usdAmount
  if (!rates) return null
  const rate = rates[code]
  if (typeof rate !== 'number') return null
  return usdAmount * rate
}

export function parseUsd(price: string): number | null {
  const match = price.replace(/,/g, '').match(/(\d+(?:\.\d+)?)/)
  return match ? Number(match[1]) : null
}

export function formatPrice(value: number, currency: Currency): string {
  const symbol = currency.symbol
  const abs = Math.abs(value)
  let digits = 0
  let rounded = Math.round(value)

  if (currency.code === 'JPY' || currency.code === 'KES' || currency.code === 'NGN') {
    rounded = Math.round(value / 5) * 5
  } else if (abs >= 1000) {
    digits = 0
  }

  const formatted = rounded.toLocaleString('en-US', {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  })
  return `${symbol}${formatted}`
}
