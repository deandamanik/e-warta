export function getNextSunday(fromDate: Date = new Date()): Date {
  const result = new Date(fromDate)
  const day = result.getDay() // 0 = Minggu
  const diff = day === 0 ? 7 : 7 - day // jika hari ini Minggu, ambil Minggu depan (bukan hari ini)
  result.setDate(result.getDate() + diff)
  result.setHours(0, 0, 0, 0)
  return result
}
