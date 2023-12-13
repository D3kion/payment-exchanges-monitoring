export type ExchangeRates = {
    [currencyId: string]: number
}

export interface ExchangeRateParser {
    getBestExchangeRates(): Promise<ExchangeRates>
}
