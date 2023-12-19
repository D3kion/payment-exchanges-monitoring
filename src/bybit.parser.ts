import axios from 'axios'

export class ByBitParser {
    private readonly baseUrl = 'https://api2.bybit.com/fiat/otc/item/online'
    private readonly diffPercent = 0.01 // 0.01 - это 1% процент

    constructor() {}

    async getBestExchangeRate(
        type: 'BUY' | 'SELL',
        fiat: 'RUB' | 'KZT' | string,
        crypto: 'USDT' | 'BTC' | 'ETH' | 'USDC' | string
    ): Promise<number> {
        const res = await axios.post(this.baseUrl, {
            currencyId: fiat,
            tokenId: crypto,
            userId: '',
            payment: [], // banks
            side: type === 'BUY' ? '1' : '0',
            size: '10',
            page: '1',
            amount: '',
            authMaker: false,
            canTrade: false,
        })

        const data = res.data.result.items as Array<any> | undefined
        if (!data) throw new Error("Can't get exchange rates")

        const best = data.find((pair, idx) =>
            this.isBestExchangeRate(
                Number(pair.price),
                Number(data[idx + 1].price)
            )
        )
        return Number(best.price)
    }

    private isBestExchangeRate(upPrice: number, downPrice: number): Boolean {
        const difference = upPrice - downPrice
        const averagePrice = (upPrice + downPrice) / 2

        return averagePrice * this.diffPercent > difference
    }
}
