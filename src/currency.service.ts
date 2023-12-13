import { DB } from 'payment-datacloud'

export class CurrencyService {
    async getFiatNames(): Promise<Array<string>> {
        const currencies = await DB.currency.findMany({
            where: {
                type: 'FIAT',
                // TODO: autoUpdate flag
            },
        })

        // TODO: check if prod is ok with that
        // return currencies.map((c) => c.name)
        return ['KZT']
    }
}
