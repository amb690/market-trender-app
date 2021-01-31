import { Trend } from './trend'
import { ProfitsByIndicator } from './profits-by-indicator'
import { CandlesByIndicator } from './candles-by-indicator'
import { TrendsByIndicator } from './trends-by-indicator'

export class Strategy {
  trends: Trend[];
  totalRawProfit: number;
  totalAdjustedProfit: number;
  profitsByIndicator: ProfitsByIndicator;
  numProcessedTrendsByIndicator: TrendsByIndicator;
  numProcessedCandlesByIndicator: CandlesByIndicator;
}
