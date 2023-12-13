import axios from 'axios'
import type { ExchangeRateParser, ExchangeRates } from './types'
import { CurrencyService } from './currency.service'

export class ByBitParser implements ExchangeRateParser {
    private readonly baseUrl = 'https://api2.bybit.com/fiat/otc/item/online'
    private readonly diffPercent = 0.01 // 0.01 - это 1% процент

    constructor(private currency: CurrencyService) {}

    async getBestExchangeRates(): Promise<ExchangeRates> {
        let bestExchangeRates: ExchangeRates = {}
        for (let currencyName of await this.currency.getFiatNames()) {
            const res = await this.loadExchangeRates(currencyName)
            const data = res.data.result.items as Array<any> | undefined
            if (!data) throw new Error("Can't get exchange rates")

            const best = data.find((pair, idx) =>
                this.isBestExchangeRate(
                    Number(pair.price),
                    Number(data[idx + 1].price)
                )
            )
            bestExchangeRates[currencyName] = Number(best.price)
        }

        return bestExchangeRates
    }

    private async loadExchangeRates(currencyId: string) {
        return axios.post(this.baseUrl, {
            currencyId,
            userId: '',
            tokenId: 'USDT',
            payment: [],
            side: '0',
            size: '10',
            page: '1',
            amount: '',
            authMaker: false,
            canTrade: false,
        })
    }
    private isBestExchangeRate(upPrice: number, downPrice: number): Boolean {
        const difference = upPrice - downPrice
        const averagePrice = (upPrice + downPrice) / 2

        return averagePrice * this.diffPercent > difference
    }
}
