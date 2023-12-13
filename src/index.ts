import 'dotenv/config'
import { CronJob } from 'cron'
import { CurrencyService } from './currency.service'
import { ExchangeRateService } from './exchange-rate.service'
import { ByBitParser } from './bybit.parser'

const currencySrv = new CurrencyService()
const ratesSrv = new ExchangeRateService()
const bybitParser = new ByBitParser(currencySrv)

main()
new CronJob('*/5 * * * *', main, null, true, 'Europe/Moscow')

async function main() {
    const bestRates = await bybitParser.getBestExchangeRates()
    const ratesWithCommission = await ratesSrv.getRatesWithCommision(bestRates)
    console.log(bestRates)

    for (let name in bestRates) {
        ratesSrv.updateRate(name, bestRates[name], ratesWithCommission[name])
    }
}
