import { levelOf, type EarlyWarning, type WarningReason } from '@/lib/levels'

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
export const shortDate = (iso: string) => `${Number(iso.slice(8, 10))} ${MONTHS[Number(iso.slice(5, 7)) - 1]}`

export function reasonText(w: EarlyWarning, r: WarningReason): string {
  switch (r) {
    case 'below_40':
      return `Below 40% · ${Math.round(w.latest.percent)}%`
    case 'dropped':
      return `L${levelOf(w.previous!.percent)} → L${levelOf(w.latest.percent)} since the last test`
    case 'month_drop':
      return `This month ${w.month!.now}%, last month ${w.month!.before}%`
    case 'falling':
      return 'Down three tests in a row'
  }
}
