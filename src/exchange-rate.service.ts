import { Currency, DB } from 'payment-datacloud'

export class ExchangeRateService {
    async updateRate(
        from: Currency,
        to: Currency,
        rate: number
        // withCommission: number
    ): Promise<void> {
        const where = {
            AND: {
                currencyFromId: from.id,
                currencyToId: to.id,
            },
        }

        const count = await DB.exchangeRate.count({ where })
        if (!count) {
            await DB.exchangeRate.create({
                data: {
                    currencyFromId: from.id,
                    currencyToId: to.id,
                    value: rate,
                },
            })
            return
        }
        await DB.exchangeRate.updateMany({
            where,
            data: {
                value: rate,
                // originalValue: rate,
                // value: withCommission,
            },
        })
    }

    // async getRatesWithCommision(rates: ExchangeRates): Promise<ExchangeRates> {
    //     const ratesWithCommission: ExchangeRates = {}

    //     for (let name in rates) {
    //         const currentRates = await DB.exchangeRate.findFirst({
    //             where: {
    //                 // TODO: is correct field?
    //                 currency_from: {
    //                     name: { contains: name },
    //                 },
    //             },
    //         })
    //         // if (currentRates && currentRates.commission) {
    //         //     const rate = (
    //         //         rates[name] -
    //         //         (rates[name] / 100) * currentRates.commission
    //         //     ).toFixed(4)
    //         //     ratesWithCommission[name] = Number(rate)
    //         // }
    //     }

    //     return ratesWithCommission
    // }
}
