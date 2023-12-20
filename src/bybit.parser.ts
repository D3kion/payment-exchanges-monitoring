import axios from 'axios'

export class ByBitParser {
    private readonly baseUrl = 'https://api2.bybit.com/fiat/otc/item/online'
    private readonly diffPercent = 0.01 // 0.01 - это 1% процент

    constructor() {}

    async getAvgExchangeRate(
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
            size: '20',
            page: '1',
            amount: '',
            authMaker: false,
            canTrade: false,
        })

        const data = res.data.result.items as Array<any> | undefined
        if (!data) throw new Error("Can't get exchange rates")

        const slice = data.slice(5, 20).filter(Boolean)
        const sum = slice.reduce((prev, pair) => prev + Number(pair.price), 0)
        return Number((sum / slice.length).toFixed(2))
    }
}
