const DAY = 86400000
const START = { year: 2025, month: 7, day: 15 }
const yearNames = ['零', '一', '二', '三', '四', '五', '六', '七', '八', '九', '十']
const yearName = (years) => yearNames[years] || String(years)
const dayNumber = ({ year, month, day }) => Date.UTC(year, month - 1, day)

const chinaDate = (date = new Date()) => {
  const parts = new Intl.DateTimeFormat('zh-CN', {
    timeZone: 'Asia/Shanghai',
    year: 'numeric',
    month: 'numeric',
    day: 'numeric',
  }).formatToParts(date)
  const value = (type) => Number(parts.find((part) => part.type === type).value)
  return { year: value('year'), month: value('month'), day: value('day') }
}

export const calculateAnniversaryState = (date = new Date()) => {
  const today = chinaDate(date)
  const todayNumber = dayNumber(today)
  const startNumber = dayNumber(START)
  const together = Math.max(0, Math.floor((todayNumber - startNumber) / DAY) + 1)
  const beforeAnniversary = today.month < START.month || (today.month === START.month && today.day < START.day)
  const completedYears = Math.max(0, today.year - START.year - (beforeAnniversary ? 1 : 0))
  const isAnniversary = today.month === START.month && today.day === START.day && completedYears > 0

  if (isAnniversary) {
    return { together, message: `${yearName(completedYears)}周年快乐` }
  }

  const nextYears = completedYears + 1
  const nextAnniversary = { year: START.year + nextYears, month: START.month, day: START.day }
  const daysToNext = Math.ceil((dayNumber(nextAnniversary) - todayNumber) / DAY)
  if (daysToNext > 0 && daysToNext <= 30) {
    return { together, message: `距离${yearName(nextYears)}周年还有 ${daysToNext} 天` }
  }

  if (completedYears === 0) {
    return { together, message: `我们已经携手走过 ${together} 天` }
  }

  const lastAnniversary = { year: START.year + completedYears, month: START.month, day: START.day }
  const daysAfter = Math.floor((todayNumber - dayNumber(lastAnniversary)) / DAY)
  return { together, message: `我们已经携手走过 ${completedYears} 年又 ${daysAfter} 天` }
}
