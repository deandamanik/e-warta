export const SEKTOR_LIST = ['I', 'II', 'III', 'IV', 'V'] as const
export type Sektor = typeof SEKTOR_LIST[number]
