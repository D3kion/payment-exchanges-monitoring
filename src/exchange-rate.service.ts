import { DB } from 'payment-datacloud'
import type { ExchangeRates } from 'types'

export class ExchangeRateService {
    async getRatesWithCommision(rates: ExchangeRates): Promise<ExchangeRates> {
        const ratesWithCommission: ExchangeRates = {}

        for (let name in rates) {
            const currentRates = await DB.exchangeRate.findFirst({
                where: {
                    // TODO: is correct field?
                    currency_from: {
                        name: { contains: name },
                    },
                },
            })
            // if (currentRates && currentRates.commission) {
            //     const rate = (
            //         rates[name] -
            //         (rates[name] / 100) * currentRates.commission
            //     ).toFixed(4)
            //     ratesWithCommission[name] = Number(rate)
            // }
        }

        return ratesWithCommission
    }

    async updateRate(
        currencyName: string,
        rate: number,
        withCommission: number
    ): Promise<void> {
        await DB.exchangeRate.updateMany({
            where: {
                // TODO
                currency_from: { name: { contains: currencyName } },
            },
            data: {
                // originalValue: rate,
                value: withCommission,
            },
        })
    }
}
