/**
 * 상담/시뮬레이션용 세금 계산 로직 (UI와 분리)
 *
 * 용어 매핑(요청 리스트 기준)
 * - 업종코드: industryCode
 * - 경비율: expenseRate (예: 0.70 = 70%)
 * - 총수입금액: grossIncome
 * - 필요경비: (1) expenseRate로 계산된 requiredExpense 또는 (2) 사용자가 입력한 expenseItems 합
 * - 소득금액: incomeAmount
 * - 소득공제: deductionItems 합
 * - 과세표준: taxBase
 * - 세율: taxRate
 * - 산출세액: incomeTax
 * - 지방세: localTax
 * - 총세액: totalTax
 * - 기납부세액: prepaidTax
 * - 차(가)감세액: diffTax
 */

export type IndustryCode = string

export type Money = number // 원 단위 정수(권장). 내부 계산은 number로 하되 결과는 반올림 처리.

export interface ExpenseItems5 {
  /** 업무추진비 */
  businessPromotion: Money
  /** 지급수수료 */
  commission: Money
  /** 소모품비 */
  supplies: Money
  /** 여비교통비 */
  travel: Money
  /** 기타 */
  other: Money
}

export interface DeductionItems5 {
  /** 연금 */
  pension: Money
  /** 노란우산 */
  norangUmbrella: Money
  /** 퇴직연금 */
  retirementPension: Money
  /** 사용자 입력 1 */
  user1: Money
  /** 사용자 입력 2 */
  user2: Money
}

export type ExpenseMode = 'RATE' | 'ITEMS'

export interface BusinessTaxInput {
  /** 업종코드 */
  industryCode: IndustryCode

  /** 총수입금액 */
  grossIncome: Money

  /**
   * 경비율 (예: 0.70 = 70%)
   * - expenseMode가 'RATE'일 때 사용
   */
  expenseRate?: number

  /**
   * 필요경비 입력(5칸)
   * - expenseMode가 'ITEMS'일 때 사용
   */
  expenseItems?: Partial<ExpenseItems5>

  /**
   * 필요경비 산정 방식
   * - RATE: grossIncome * expenseRate
   * - ITEMS: expenseItems 합
   */
  expenseMode: ExpenseMode

  /**
   * 소득공제 총액(사용자가 한 번에 입력)
   * - deductionItems(상세 1~5칸)를 입력하지 않는 경우, 이 값으로 소득공제를 적용
   * - deductionItems가 입력되어 합계가 0보다 크면(>0) 상세 입력을 우선 적용
   */
  deductionTotal?: Money

  /** 소득공제 입력(5칸) */
  deductionItems?: Partial<DeductionItems5>

  /**
   * 귀속연도(세율표 선택용)
   * - 예: 2024 (2024년 귀속)
   * - 지정하면 국세청 '과세표준 × 세율 - 누진공제' 방식으로 자동 산출 가능
   */
  taxYear?: number

  /**
   * 세율(소득세 산출용) - 레거시/직접 입력용
   * - 예: 0.06 = 6%
   * - taxYear가 없거나, 강제로 고정세율을 쓰고 싶을 때만 사용
   */
  taxRate?: number

  /**
   * 지방세율(통상 소득세의 10% → 0.1)
   * - 미지정 시 0.1 사용
   */
  localTaxRate?: number

  /** 기납부세액 */
  prepaidTax: Money
}

export interface BusinessTaxResult {
  industryCode: IndustryCode

  /** 경비율(표시용) */
  expenseRate?: number

  /** 총수입금액 */
  grossIncome: Money

  /** 필요경비(결정된 값) */
  requiredExpense: Money

  /** 필요경비(5칸 합, ITEMS 모드 기준) */
  requiredExpenseFromItems: Money

  /** 소득금액 = 총수입금액 - 필요경비 */
  incomeAmount: Money

  /** 소득공제(5칸 합) */
  incomeDeduction: Money

  /** 과세표준 = 소득금액 - 소득공제 */
  taxBase: Money

  /** 적용된 세율(자동/직접 입력 결과) */
  taxRate: number

  /** 적용된 누진공제액(원). 자동 누진세율 계산 시에만 의미가 있음 */
  progressiveDeduction: Money

  /** 산출세액(소득세) = MAX(0, 과세표준) * 세율 */
  incomeTax: Money

  /** 지방세 = 산출세액 * 지방세율 */
  localTax: Money

  /** 총세액 = 산출세액 + 지방세 */
  totalTax: Money

  /** 기납부세액 */
  prepaidTax: Money

  /** 차(가)감세액 = 총세액 - 기납부세액 */
  diffTax: Money
}

const DEFAULT_LOCAL_TAX_RATE = 0.1

function n(v: unknown): number {
  const x = typeof v === 'number' ? v : Number(v)
  return Number.isFinite(x) ? x : 0
}

function roundWon(v: number): Money {
  // 엑셀 ROUND(...,0)와 동일: 원 단위 반올림
  return Math.round(v)
}

function sum5<T extends Record<string, any>>(obj: Partial<T> | undefined, keys: (keyof T)[]): Money {
  if (!obj) return 0
  let s = 0
  for (const k of keys) s += n(obj[k])
  return roundWon(s)
}

function clamp01(x: number) {
  return Math.min(1, Math.max(0, x))
}

/**
 * 사업장 1건의 공통 계산(중복 제거용)
 * - grossIncome 정리, 필요경비(RATE/ITEMS), 소득금액까지 산출
 */
function calcBusinessCore(input: {
  grossIncome: Money
  expenseMode: ExpenseMode
  expenseRate?: number
  expenseItems?: Partial<ExpenseItems5>
}) {
  const grossIncome = roundWon(n(input.grossIncome))

  const expenseRate = input.expenseRate != null ? clamp01(n(input.expenseRate)) : undefined
  const requiredExpenseFromItems = sum5<ExpenseItems5>(input.expenseItems, EXPENSE_KEYS)

  let requiredExpense = 0
  if (input.expenseMode === 'RATE') {
    const r = expenseRate ?? 0
    requiredExpense = roundWon(grossIncome * r)
  } else {
    requiredExpense = requiredExpenseFromItems
  }

  const incomeAmount = roundWon(grossIncome - requiredExpense)

  return {
    grossIncome,
    expenseRate,
    requiredExpenseFromItems,
    requiredExpense,
    incomeAmount,
  }
}

export const EXPENSE_KEYS: (keyof ExpenseItems5)[] = [
  'businessPromotion',
  'commission',
  'supplies',
  'travel',
  'other',
]

export const DEDUCTION_KEYS: (keyof DeductionItems5)[] = [
  'pension',
  'norangUmbrella',
  'retirementPension',
  'user1',
  'user2',
]

// ============================================================================
// 종합소득세(국세청) 세율표: 과세표준 × 세율 - 누진공제액
// - 출처: 국세청 개인신고안내 > 종합소득세 > 기본정보 > 세율
// - 사용: taxYear(귀속연도) + 과세표준(taxBase)로 적용 세율/누진공제 자동 산출
// ============================================================================

export interface IncomeTaxBracket {
  /** 구간 상한(포함). 마지막 구간은 null */
  upTo: Money | null
  /** 세율(0~1) */
  rate: number
  /** 누진공제액(원) */
  deduction: Money
}

const INCOME_TAX_BRACKETS_BY_YEAR: Array<{
  /** 적용 귀속연도 범위 (포함) */
  from: number
  to: number
  brackets: IncomeTaxBracket[]
}> = [
  {
    // 2023~2024년 귀속
    from: 2023,
    to: 2024,
    brackets: [
      { upTo: 14_000_000, rate: 0.06, deduction: 0 },
      { upTo: 50_000_000, rate: 0.15, deduction: 1_260_000 },
      { upTo: 88_000_000, rate: 0.24, deduction: 5_760_000 },
      { upTo: 150_000_000, rate: 0.35, deduction: 15_440_000 },
      { upTo: 300_000_000, rate: 0.38, deduction: 19_940_000 },
      { upTo: 500_000_000, rate: 0.40, deduction: 25_940_000 },
      { upTo: 1_000_000_000, rate: 0.42, deduction: 35_940_000 },
      { upTo: null, rate: 0.45, deduction: 65_940_000 },
    ],
  },
  {
    // 2021~2022년 귀속
    from: 2021,
    to: 2022,
    brackets: [
      { upTo: 12_000_000, rate: 0.06, deduction: 0 },
      { upTo: 46_000_000, rate: 0.15, deduction: 1_080_000 },
      { upTo: 88_000_000, rate: 0.24, deduction: 5_220_000 },
      { upTo: 150_000_000, rate: 0.35, deduction: 14_900_000 },
      { upTo: 300_000_000, rate: 0.38, deduction: 19_400_000 },
      { upTo: 500_000_000, rate: 0.40, deduction: 25_400_000 },
      { upTo: 1_000_000_000, rate: 0.42, deduction: 35_400_000 },
      { upTo: null, rate: 0.45, deduction: 65_400_000 },
    ],
  },
  {
    // 2018~2020년 귀속
    from: 2018,
    to: 2020,
    brackets: [
      { upTo: 12_000_000, rate: 0.06, deduction: 0 },
      { upTo: 46_000_000, rate: 0.15, deduction: 1_080_000 },
      { upTo: 88_000_000, rate: 0.24, deduction: 5_220_000 },
      { upTo: 150_000_000, rate: 0.35, deduction: 14_900_000 },
      { upTo: 300_000_000, rate: 0.38, deduction: 19_400_000 },
      { upTo: 500_000_000, rate: 0.40, deduction: 25_400_000 },
      { upTo: null, rate: 0.42, deduction: 35_400_000 },
    ],
  },
  {
    // 2017년 귀속
    from: 2017,
    to: 2017,
    brackets: [
      { upTo: 12_000_000, rate: 0.06, deduction: 0 },
      { upTo: 46_000_000, rate: 0.15, deduction: 1_080_000 },
      { upTo: 88_000_000, rate: 0.24, deduction: 5_220_000 },
      { upTo: 150_000_000, rate: 0.35, deduction: 14_900_000 },
      { upTo: 500_000_000, rate: 0.38, deduction: 19_400_000 },
      { upTo: null, rate: 0.40, deduction: 29_400_000 },
    ],
  },
]

export function getIncomeTaxBracket(taxBase: Money, taxYear: number): IncomeTaxBracket | null {
  const year = Math.trunc(n(taxYear))
  if (!year) return null

  const table = INCOME_TAX_BRACKETS_BY_YEAR.find((t) => year >= t.from && year <= t.to)
  if (!table) return null

  const base = roundWon(n(taxBase))
  for (const b of table.brackets) {
    if (b.upTo == null) return b
    if (base <= b.upTo) return b
  }
  return table.brackets[table.brackets.length - 1] ?? null
}

/**
 * 국세청 방식 산출세액: MAX(0, 과세표준) × 세율 - 누진공제액
 * - 반환: 적용세율, 누진공제액, 산출세액(원)
 */
export function calcIncomeTaxByProgressiveRate(taxBase: Money, taxYear: number) {
  const taxableBase = Math.max(0, roundWon(n(taxBase)))
  const bracket = getIncomeTaxBracket(taxableBase, taxYear)
  if (!bracket) {
    // 세율표를 못 찾는 경우: 0 처리(혹은 추후 에러로 바꿀 수 있음)
    return { rate: 0, deduction: 0 as Money, incomeTax: 0 as Money }
  }
  const incomeTax = roundWon(taxableBase * bracket.rate - bracket.deduction)
  return { rate: bracket.rate, deduction: bracket.deduction, incomeTax: Math.max(0, incomeTax) as Money }
}

// ============================================================================
// 필요경비 산정 유틸 (업종 기본 경비율 + 사용자 입력 퍼센트 override)
// - 요구사항:
//   1) 사용자 퍼센트 미입력 → 업종코드에서 조회한 단순경비율(일반율) 적용
//   2) 사용자 퍼센트 입력 → 그 퍼센트로 전체금액(총수입금액) 기준 필요경비 산정
// - 참고: 필요경비 세부항목은 0~5개일 수 있으므로, 합산 유틸도 함께 제공
// ============================================================================

/**
 * 사용자 입력 퍼센트를 "비율(0~1)"로 정규화
 * - 입력 예:
 *   - "12.5"  -> 0.125   (퍼센트로 입력한 경우)
 *   - 12.5    -> 0.125
 *   - 0.125   -> 0.125   (이미 비율로 넣은 경우)
 *   - ""/null -> null    (미입력)
 */
export function normalizePercentToRate(input: unknown): number | null {
  if (input == null) return null
  const s = String(input).trim()
  if (!s) return null

  const v = Number(s.replace(/[%\s,]/g, ''))
  if (!Number.isFinite(v)) return null

  // 0~1이면 이미 비율로 간주, 그 외는 퍼센트(0~100+)로 간주해 /100
  if (v >= 0 && v <= 1) return v
  return v / 100
}

/**
 * 최종 경비율 결정
 * - baseRate: 업종코드 조회로 얻은 단순경비율(일반율) 등 (0~1)
 * - overridePercentInput: 사용자가 입력한 퍼센트(또는 비율)
 */
export function resolveExpenseRate(baseRate: number, overridePercentInput: unknown): number {
  const override = normalizePercentToRate(overridePercentInput)
  const chosen = override == null ? baseRate : override
  return clamp01(n(chosen))
}

/**
 * 총수입금액과 최종 경비율로 필요경비 계산 (원 단위 반올림)
 */
export function calcRequiredExpenseByRate(grossIncome: Money, expenseRate: number): Money {
  return roundWon(roundWon(n(grossIncome)) * clamp01(n(expenseRate)))
}

/**
 * 필요경비 세부항목(0~5개) 합산 유틸
 * - UI에서 항목이 0개일 수도 있어 배열로 받는 형태를 제공
 */
export function sumExpenseItemList(items: Array<Money | undefined | null>): Money {
  const total = items.reduce<number>((acc, v) => acc + n(v), 0)
  return roundWon(total)
}

// ============================================================================
// 업종코드/경비율 조회 유틸 (프론트에서 "코드 검색" 용도)
// - 원본 CSV를 변환해 만든 industryRates_<year>.json을 페이지/컴포넌트에서 import 한 뒤,
//   아래 메소드에 주입해서 조회/표시/적용하면 됨.
// - 이 파일(taxCalculator.ts) 하나만 사용한다는 전제에서, 조회 로직도 여기 포함.
// ============================================================================

/**
 * industryRates_<year>.json 한 건(업종코드 1개)에 대한 타입
 * - 변환 스크립트에서 퍼센트(예: 93.5)를 비율(0.935)로 바꿨기 때문에,
 *   아래 rate 값들은 0~1 사이의 "비율"임.
 */
export interface IndustryRateRow {
  industryName: string
  simpleRateGeneral: number
  simpleRateExcess: number
  standardRateGeneral: number
  applyCriteria: string
  middleCategory?: string
  subCategory?: string
  detailCategory?: string
}

/**
 * industryRates_<year>.json 전체 맵
 * - key: 업종코드(문자열)
 */
export type IndustryRatesMap = Record<string, IndustryRateRow>

/**
 * 업종코드 정규화
 * - 공백/하이픈 제거, 문자열화
 */
export function normalizeIndustryCode(code: unknown): string {
  return String(code ?? '')
    .trim()
    .replace(/[\s-]/g, '')
}

/**
 * 화면 표시용: 0.935 -> "93.5%"
 */
export function formatRatePercent(rate: number, fractionDigits = 1): string {
  const r = n(rate)
  if (!Number.isFinite(r)) return '-'
  return `${(r * 100).toFixed(fractionDigits)}%`
}

/**
 * 업종코드로 경비율 레코드 조회
 * - rates: industryRates_<year>.json을 import 한 객체(맵)
 */
export function findIndustryRateByCode(rates: IndustryRatesMap, industryCode: unknown): IndustryRateRow | null {
  const code = normalizeIndustryCode(industryCode)
  if (!code) return null
  return rates[code] ?? null
}

/**
 * 조회 결과를 "상담용" 한글 요약 텍스트로 만들 때 사용
 */
export function describeIndustryRate(row: IndustryRateRow) {
  return {
    업태명: row.industryName,
    단순경비율_일반율: formatRatePercent(row.simpleRateGeneral),
    단순경비율_초과율: formatRatePercent(row.simpleRateExcess),
    기준경비율_일반율: formatRatePercent(row.standardRateGeneral),
    적용기준내용: row.applyCriteria,
    중분류: row.middleCategory ?? '',
    세분류: row.subCategory ?? '',
    세세분류: row.detailCategory ?? '',
  }
}

/**
 * 계산에 사용할 경비율 선택
 * - 사용처: 업종코드 조회 후, expenseMode='RATE'인 BusinessTaxInput에 expenseRate로 주입
 */
export type ExpenseRateKind = 'SIMPLE_GENERAL' | 'SIMPLE_EXCESS' | 'STANDARD_GENERAL'

export function pickExpenseRate(row: IndustryRateRow, kind: ExpenseRateKind): number {
  switch (kind) {
    case 'SIMPLE_GENERAL':
      return n(row.simpleRateGeneral)
    case 'SIMPLE_EXCESS':
      return n(row.simpleRateExcess)
    case 'STANDARD_GENERAL':
      return n(row.standardRateGeneral)
    default:
      return 0
  }
}

/**
 * 단일 사업자(업종코드 1개) 계산
 */
export function calculateBusinessTax(input: BusinessTaxInput): BusinessTaxResult {
  const prepaidTax = roundWon(n(input.prepaidTax))

  const core = calcBusinessCore({
    grossIncome: input.grossIncome,
    expenseMode: input.expenseMode,
    expenseRate: input.expenseRate,
    expenseItems: input.expenseItems,
  })

  const { grossIncome, expenseRate, requiredExpenseFromItems, requiredExpense, incomeAmount } = core

  const incomeDeductionFromItems = sum5<DeductionItems5>(input.deductionItems, DEDUCTION_KEYS)
  const incomeDeduction = incomeDeductionFromItems > 0 ? incomeDeductionFromItems : roundWon(n(input.deductionTotal))
  const taxBase = roundWon(incomeAmount - incomeDeduction)

  const localTaxRate = clamp01(input.localTaxRate == null ? DEFAULT_LOCAL_TAX_RATE : n(input.localTaxRate))

  let taxRate = 0
  let progressiveDeduction: Money = 0
  let incomeTax: Money = 0

  if (input.taxYear != null) {
    const r = calcIncomeTaxByProgressiveRate(taxBase, input.taxYear)
    taxRate = r.rate
    progressiveDeduction = r.deduction
    incomeTax = r.incomeTax
  } else {
    // 레거시: taxRate 직접 입력(고정세율)
    taxRate = clamp01(n(input.taxRate))
    const taxableBase = Math.max(0, taxBase)
    incomeTax = roundWon(taxableBase * taxRate)
    progressiveDeduction = 0
  }

  const localTax = roundWon(incomeTax * localTaxRate)
  const totalTax = roundWon(incomeTax + localTax)

  const diffTax = roundWon(totalTax - prepaidTax)

  return {
    industryCode: input.industryCode,
    expenseRate,

    grossIncome,
    requiredExpense,
    requiredExpenseFromItems,

    incomeAmount,
    incomeDeduction,
    taxBase,

    taxRate,
    progressiveDeduction,
    incomeTax,
    localTax,
    totalTax,

    prepaidTax,
    diffTax,
  }
}

/**
 * @deprecated 누진세율(종합소득세)에서는 '사업장별 세액 계산'을 여러 건 수행하는 방식이 혼란을 줄 수 있음.
 * 동일인(1명) 합산 과세가 목적이면 `calculatePersonTax` 사용 권장.
 */
export function calculateManyBusinessTax(inputs: BusinessTaxInput[]): BusinessTaxResult[] {
  return inputs.map(calculateBusinessTax)
}

/**
 * @deprecated 누진세율(종합소득세)에서는 '사업장별 세액'을 단순 합산하면 정확하지 않을 수 있음.
 * 동일인(1명) 합산 과세가 목적이면 `calculatePersonTax`의 summary를 사용 권장.
 */
export function summarizeBusinessTax(results: BusinessTaxResult[]) {
  const totalGrossIncome = roundWon(results.reduce((a, r) => a + n(r.grossIncome), 0))
  const totalRequiredExpense = roundWon(results.reduce((a, r) => a + n(r.requiredExpense), 0))
  const totalIncomeAmount = roundWon(results.reduce((a, r) => a + n(r.incomeAmount), 0))
  const totalIncomeDeduction = roundWon(results.reduce((a, r) => a + n(r.incomeDeduction), 0))
  const totalTaxBase = roundWon(results.reduce((a, r) => a + n(r.taxBase), 0))
  const totalIncomeTax = roundWon(results.reduce((a, r) => a + n(r.incomeTax), 0))
  const totalLocalTax = roundWon(results.reduce((a, r) => a + n(r.localTax), 0))
  const totalTax = roundWon(results.reduce((a, r) => a + n(r.totalTax), 0))
  const totalPrepaidTax = roundWon(results.reduce((a, r) => a + n(r.prepaidTax), 0))
  const totalDiffTax = roundWon(results.reduce((a, r) => a + n(r.diffTax), 0))

  return {
    totalGrossIncome,
    totalRequiredExpense,
    totalIncomeAmount,
    totalIncomeDeduction,
    totalTaxBase,
    totalIncomeTax,
    totalLocalTax,
    totalTax,
    totalPrepaidTax,
    totalDiffTax,
  }
}

// ============================================================================
// 동일인(1명) 다사업자 합산 과세 계산
// - 사업장별: 업종코드/경비율/총수입/필요경비/소득금액 까지 개별 표시
// - 합산(1명): 소득공제~차가감세액은 "합산 과세표준" 기준으로 1번만 계산
//   (누진세율이므로 사업장별 세액을 더하는 방식은 정확하지 않음)
// ============================================================================

export interface BusinessIncomeRow {
  industryCode: IndustryCode
  expenseRate?: number
  grossIncome: Money
  requiredExpense: Money
  incomeAmount: Money
}

export interface PersonTaxInput {
  businesses: Array<{
    industryCode: IndustryCode
    grossIncome: Money
    expenseMode: ExpenseMode
    expenseRate?: number
    expenseItems?: Partial<ExpenseItems5>
  }>

  // 1명 기준 입력
  deductionTotal?: Money
  deductionItems?: Partial<DeductionItems5>

  prepaidTax: Money

  // 세율표(누진세) 적용용
  taxYear?: number
  // 레거시 고정세율용(옵션)
  taxRate?: number

  localTaxRate?: number
}

export interface PersonTaxResult {
  businessRows: BusinessIncomeRow[]
  summary: {
    totalGrossIncome: Money
    totalRequiredExpense: Money
    totalIncomeAmount: Money

    incomeDeduction: Money
    taxBase: Money

    taxRate: number
    progressiveDeduction: Money
    incomeTax: Money
    localTax: Money
    totalTax: Money

    prepaidTax: Money
    diffTax: Money
  }
}

/**
 * 사업장별 "소득금액"까지만 계산(합산 과세용)
 */
export function calculateBusinessIncomeRow(input: {
  industryCode: IndustryCode
  grossIncome: Money
  expenseMode: ExpenseMode
  expenseRate?: number
  expenseItems?: Partial<ExpenseItems5>
}): BusinessIncomeRow {
  const core = calcBusinessCore({
    grossIncome: input.grossIncome,
    expenseMode: input.expenseMode,
    expenseRate: input.expenseRate,
    expenseItems: input.expenseItems,
  })

  const { grossIncome, expenseRate, requiredExpense, incomeAmount } = core

  return {
    industryCode: input.industryCode,
    expenseRate,
    grossIncome,
    requiredExpense,
    incomeAmount,
  }
}

/**
 * 동일인(1명) 기준 합산 계산
 * - 누진세율은 합산 과세표준으로 1회 계산
 */
export function calculatePersonTax(input: PersonTaxInput): PersonTaxResult {
  const businessRows = input.businesses.map(calculateBusinessIncomeRow)

  const totalGrossIncome = roundWon(businessRows.reduce((a, r) => a + n(r.grossIncome), 0))
  const totalRequiredExpense = roundWon(businessRows.reduce((a, r) => a + n(r.requiredExpense), 0))
  const totalIncomeAmount = roundWon(businessRows.reduce((a, r) => a + n(r.incomeAmount), 0))

  const incomeDeductionFromItems = sum5<DeductionItems5>(input.deductionItems, DEDUCTION_KEYS)
  const incomeDeduction = incomeDeductionFromItems > 0 ? incomeDeductionFromItems : roundWon(n(input.deductionTotal))

  const taxBase = roundWon(totalIncomeAmount - incomeDeduction)

  const localTaxRate = clamp01(input.localTaxRate == null ? DEFAULT_LOCAL_TAX_RATE : n(input.localTaxRate))

  let taxRate = 0
  let progressiveDeduction: Money = 0
  let incomeTax: Money = 0

  if (input.taxYear != null) {
    const r = calcIncomeTaxByProgressiveRate(taxBase, input.taxYear)
    taxRate = r.rate
    progressiveDeduction = r.deduction
    incomeTax = r.incomeTax
  } else {
    // 레거시: taxRate 직접 입력(고정세율)
    taxRate = clamp01(n(input.taxRate))
    const taxableBase = Math.max(0, taxBase)
    incomeTax = roundWon(taxableBase * taxRate)
    progressiveDeduction = 0
  }

  const localTax = roundWon(incomeTax * localTaxRate)
  const totalTax = roundWon(incomeTax + localTax)

  const prepaidTax = roundWon(n(input.prepaidTax))
  const diffTax = roundWon(totalTax - prepaidTax)

  return {
    businessRows,
    summary: {
      totalGrossIncome,
      totalRequiredExpense,
      totalIncomeAmount,

      incomeDeduction,
      taxBase,

      taxRate,
      progressiveDeduction,
      incomeTax,
      localTax,
      totalTax,

      prepaidTax,
      diffTax,
    },
  }
}