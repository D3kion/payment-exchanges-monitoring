import 'dotenv/config'
import { CronJob } from 'cron'
import { CurrencyService } from './currency.service'
import { ExchangeRateService } from './exchange-rate.service'
import { ByBitParser } from './bybit.parser'

const currencySrv = new CurrencyService()
const ratesSrv = new ExchangeRateService()
const bybitParser = new ByBitParser()

main()
new CronJob('*/5 * * * *', main, null, true, 'Europe/Moscow')

async function main() {
    try {
        const fiats = await currencySrv.getFiats()
        const cryptos = await currencySrv.getCryptos()
        console.log(
            fiats.map((x) => x.providerAlias).filter(Boolean),
            cryptos.map((x) => x.providerAlias).filter(Boolean)
        )

        const t0 = performance.now()
        for await (const fiat of fiats) {
            const fiatName = fiat.providerAlias
            if (!fiatName) continue
            for await (const crypto of cryptos) {
                const cryptoName = crypto.providerAlias
                if (!cryptoName) continue

                const bestRateSell = await bybitParser.getBestExchangeRate(
                    'SELL',
                    fiatName,
                    cryptoName
                )

                console.log(cryptoName, fiatName, bestRateSell)
                // TODO: commission
                ratesSrv.updateRate(crypto, fiat, bestRateSell)

                const bestRateBuy =
                    (await bybitParser.getBestExchangeRate(
                        'BUY',
                        fiatName,
                        cryptoName
                    )) || 1 / bestRateSell
                console.log(fiatName, cryptoName, bestRateBuy)
                // TODO: commission
                ratesSrv.updateRate(fiat, crypto, bestRateBuy)
            }
        }
        const secs = Math.round((performance.now() - t0) / 1000)
        console.log(`Parsing time: ${~~(secs / 60)}m ${secs % 60}s`)
    } catch (err) {
        console.error(err)
    }
}
