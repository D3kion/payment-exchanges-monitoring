import { Currency, DB } from 'payment-datacloud'

export class CurrencyService {
    async getFiats(): Promise<Currency[]> {
        return DB.currency.findMany({
            where: {
                type: 'FIAT',
                // TODO: autoUpdate flag
            },
        })
    }

    async getCryptos(): Promise<Currency[]> {
        return DB.currency.findMany({
            where: {
                type: 'CRYPTO',
                // TODO: autoUpdate flag
            },
        })
    }
}
