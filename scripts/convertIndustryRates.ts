import fs from 'fs'
import path from 'path'
import csv from 'csv-parser'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const RAW_PATH = path.join(__dirname, '../src/data/raw/기준(단순)경비율.csv')
const OUTPUT_DIR = path.join(__dirname, '../src/data/normalized')

interface NormalizedRates {
  [year: string]: {
    [industryCode: string]: {
      industryName: string
      simpleRateGeneral: number
      simpleRateExcess: number
      standardRateGeneral: number
      applyCriteria: string
      // 필요하면 나중에 분류/기준내용 추가 확장 가능
      middleCategory?: string
      subCategory?: string
      detailCategory?: string
    }
  }
}

function safeNum(v: unknown): number {
  const s = String(v ?? '').trim()
  if (!s) return 0
  const n = Number(s.replace(/[%\s,]/g, ''))
  return Number.isFinite(n) ? n : 0
}

function toRate(v: unknown): number {
  // CSV가 85 또는 85.0 형태(%)로 들어오는 것을 0.85로 변환
  return safeNum(v) / 100
}

function detectParsingOptions(filePath: string) {
  // 1) 헤더 라인을 자동 탐지 (앞에 제목/설명 줄이 있을 수 있음)
  // 2) 구분자 자동 감지(탭/콤마/세미콜론)
  const buf = fs.readFileSync(filePath)
  const text = buf.toString('utf8')
  const lines = text.split(/\r?\n/)

  const normalize = (s: string) => s.replace(/^\uFEFF/, '').trim()

  // 헤더 후보를 앞에서부터 5줄까지 스캔
  let headerIndex = -1
  for (let i = 0; i < Math.min(5, lines.length); i++) {
    const line = normalize(lines[i] ?? '')
    if (!line) continue
    if (line.includes('귀속연도') && line.includes('업종코드')) {
      headerIndex = i
      break
    }
  }

  // 헤더가 못 잡히면, 첫 줄이 제목인 케이스가 많으므로 1줄 스킵을 기본으로 둠
  if (headerIndex === -1) headerIndex = 1

  const headerLine = normalize(lines[headerIndex] ?? '')

  const candidates: Array<{ sep: string; parts: number }> = [
    { sep: '\t', parts: headerLine.split('\t').length },
    { sep: ',', parts: headerLine.split(',').length },
    { sep: ';', parts: headerLine.split(';').length },
  ]

  // 가장 많은 컬럼을 만들어내는 구분자를 선택
  candidates.sort((a, b) => b.parts - a.parts)
  const separator = candidates[0].parts > 1 ? candidates[0].sep : '\t'

  const skipLines = headerIndex

  return { separator, skipLines }
}

async function convert() {
  if (!fs.existsSync(RAW_PATH)) {
    console.error(`❌ 원본 CSV를 찾을 수 없습니다: ${RAW_PATH}`)
    process.exit(1)
  }

  const { separator, skipLines } = detectParsingOptions(RAW_PATH)
  console.log('ℹ️ 감지된 옵션:', { separator: separator === '\t' ? '\\t' : separator, skipLines })

  const results: NormalizedRates = {}

  fs.createReadStream(RAW_PATH)
    .pipe(
      csv({
        separator,
        skipLines,
        // BOM 제거 + 공백 제거 (컬럼명 불일치 방지)
        mapHeaders: ({ header }) => (header ? header.replace(/^\uFEFF/, '').trim() : header),
        mapValues: ({ value }) => (typeof value === 'string' ? value.trim() : value),
      }),
    )
    .on('data', (row) => {
      const year = row['귀속연도']
      const code = row['업종코드']

      // 헤더가 매칭이 안 되면 여기서 undefined가 나옴 → 즉시 종료하고 키를 보여줌
      if (!year || !code) {
        console.error('❌ CSV 헤더/구분자 매칭 실패. 아래 키 목록을 확인하세요:')
        console.error(Object.keys(row))
        console.error('감지된 옵션:', { separator, skipLines })
        process.exit(1)
      }

      if (!results[year]) results[year] = {}

      results[year][code] = {
        industryName: row['업태명'] ?? '',
        simpleRateGeneral: toRate(row['단순경비율(일반율)']),
        simpleRateExcess: toRate(row['단순경비율(초과율)']),
        standardRateGeneral: toRate(row['기준경비율(일반율)']),
        applyCriteria: row['적용기준내용'] ?? '',
        middleCategory: row['중분류'] ?? '',
        subCategory: row['세분류'] ?? '',
        detailCategory: row['세세분류'] ?? '',
      }
    })
    .on('end', () => {
      fs.mkdirSync(OUTPUT_DIR, { recursive: true })

      for (const year of Object.keys(results)) {
        const filePath = path.join(OUTPUT_DIR, `industryRates_${year}.json`)
        fs.writeFileSync(filePath, JSON.stringify(results[year], null, 2), 'utf-8')
        console.log(`✅ ${year} 변환 완료 (${Object.keys(results[year]).length}개 업종)`)
      }

      console.log('🎉 전체 변환 완료')
    })
    .on('error', (err) => {
      console.error('❌ 변환 중 오류:', err)
      process.exit(1)
    })
}

convert()