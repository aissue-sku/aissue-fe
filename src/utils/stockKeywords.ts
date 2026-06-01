export interface StockInfo {
  name: string;
  code: string;
  market: 'KOSPI' | 'KOSDAQ';
}

// 기업명 키워드 → 종목 정보 매핑
// 긴 키워드를 먼저 배치해 짧은 키워드에 의해 덮어쓰이지 않도록 함
const STOCK_MAP: { keywords: string[]; stock: StockInfo }[] = [
  { keywords: ['삼성전자'], stock: { name: '삼성전자', code: '005930', market: 'KOSPI' } },
  { keywords: ['삼성바이오로직스', '삼성바이오'], stock: { name: '삼성바이오로직스', code: '207940', market: 'KOSPI' } },
  { keywords: ['삼성SDI'], stock: { name: '삼성SDI', code: '006400', market: 'KOSPI' } },
  { keywords: ['삼성물산'], stock: { name: '삼성물산', code: '028260', market: 'KOSPI' } },
  { keywords: ['삼성생명'], stock: { name: '삼성생명', code: '032830', market: 'KOSPI' } },
  { keywords: ['삼성화재'], stock: { name: '삼성화재', code: '000810', market: 'KOSPI' } },
  { keywords: ['SK하이닉스', 'SK Hynix'], stock: { name: 'SK하이닉스', code: '000660', market: 'KOSPI' } },
  { keywords: ['SK이노베이션'], stock: { name: 'SK이노베이션', code: '096770', market: 'KOSPI' } },
  { keywords: ['SK텔레콤', 'SKT'], stock: { name: 'SK텔레콤', code: '017670', market: 'KOSPI' } },
  { keywords: ['SK바이오사이언스'], stock: { name: 'SK바이오사이언스', code: '302440', market: 'KOSPI' } },
  { keywords: ['LG에너지솔루션', 'LG에너지'], stock: { name: 'LG에너지솔루션', code: '373220', market: 'KOSPI' } },
  { keywords: ['LG화학'], stock: { name: 'LG화학', code: '051910', market: 'KOSPI' } },
  { keywords: ['LG전자'], stock: { name: 'LG전자', code: '066570', market: 'KOSPI' } },
  { keywords: ['LG유플러스'], stock: { name: 'LG유플러스', code: '032640', market: 'KOSPI' } },
  { keywords: ['LG디스플레이'], stock: { name: 'LG디스플레이', code: '034220', market: 'KOSPI' } },
  { keywords: ['현대자동차', '현대차'], stock: { name: '현대자동차', code: '005380', market: 'KOSPI' } },
  { keywords: ['현대모비스'], stock: { name: '현대모비스', code: '012330', market: 'KOSPI' } },
  { keywords: ['HD현대중공업', '현대중공업'], stock: { name: 'HD현대중공업', code: '329180', market: 'KOSPI' } },
  { keywords: ['기아'], stock: { name: '기아', code: '000270', market: 'KOSPI' } },
  { keywords: ['POSCO홀딩스', 'POSCO', '포스코'], stock: { name: 'POSCO홀딩스', code: '005490', market: 'KOSPI' } },
  { keywords: ['카카오뱅크'], stock: { name: '카카오뱅크', code: '323410', market: 'KOSPI' } },
  { keywords: ['카카오페이'], stock: { name: '카카오페이', code: '377300', market: 'KOSPI' } },
  { keywords: ['카카오'], stock: { name: '카카오', code: '035720', market: 'KOSPI' } },
  { keywords: ['NAVER', '네이버'], stock: { name: 'NAVER', code: '035420', market: 'KOSPI' } },
  { keywords: ['셀트리온헬스케어'], stock: { name: '셀트리온헬스케어', code: '091990', market: 'KOSDAQ' } },
  { keywords: ['셀트리온'], stock: { name: '셀트리온', code: '068270', market: 'KOSPI' } },
  { keywords: ['KB금융', 'KB국민'], stock: { name: 'KB금융', code: '105560', market: 'KOSPI' } },
  { keywords: ['신한지주', '신한금융'], stock: { name: '신한지주', code: '055550', market: 'KOSPI' } },
  { keywords: ['하나금융지주', '하나금융', '하나은행'], stock: { name: '하나금융지주', code: '086790', market: 'KOSPI' } },
  { keywords: ['우리금융지주', '우리금융', '우리은행'], stock: { name: '우리금융지주', code: '316140', market: 'KOSPI' } },
  { keywords: ['한국전력', '한전'], stock: { name: '한국전력', code: '015760', market: 'KOSPI' } },
  { keywords: ['KT&G'], stock: { name: 'KT&G', code: '033780', market: 'KOSPI' } },
  { keywords: ['KT'], stock: { name: 'KT', code: '030200', market: 'KOSPI' } },
  { keywords: ['에코프로비엠', '에코프로BM'], stock: { name: '에코프로비엠', code: '247540', market: 'KOSDAQ' } },
  { keywords: ['에코프로'], stock: { name: '에코프로', code: '086520', market: 'KOSDAQ' } },
  { keywords: ['두산에너빌리티', '두산중공업'], stock: { name: '두산에너빌리티', code: '034020', market: 'KOSPI' } },
  { keywords: ['두산로보틱스'], stock: { name: '두산로보틱스', code: '454910', market: 'KOSPI' } },
  { keywords: ['롯데케미칼'], stock: { name: '롯데케미칼', code: '011170', market: 'KOSPI' } },
  { keywords: ['롯데쇼핑'], stock: { name: '롯데쇼핑', code: '023530', market: 'KOSPI' } },
  { keywords: ['S-Oil', 'S-OIL', 'S오일'], stock: { name: 'S-Oil', code: '010950', market: 'KOSPI' } },
  { keywords: ['삼성중공업'], stock: { name: '삼성중공업', code: '010140', market: 'KOSPI' } },
  { keywords: ['한화에어로스페이스', '한화에어로'], stock: { name: '한화에어로스페이스', code: '012450', market: 'KOSPI' } },
  { keywords: ['한화오션'], stock: { name: '한화오션', code: '042660', market: 'KOSPI' } },
  { keywords: ['크래프톤'], stock: { name: '크래프톤', code: '259960', market: 'KOSPI' } },
  { keywords: ['엔씨소프트', '엔씨'], stock: { name: '엔씨소프트', code: '036570', market: 'KOSPI' } },
  { keywords: ['넥슨게임즈'], stock: { name: '넥슨게임즈', code: '225570', market: 'KOSDAQ' } },
  { keywords: ['펄어비스'], stock: { name: '펄어비스', code: '263750', market: 'KOSDAQ' } },
  { keywords: ['카카오게임즈'], stock: { name: '카카오게임즈', code: '293490', market: 'KOSDAQ' } },
  { keywords: ['HMM', '현대머스크'], stock: { name: 'HMM', code: '011200', market: 'KOSPI' } },
  { keywords: ['대한항공'], stock: { name: '대한항공', code: '003490', market: 'KOSPI' } },
  { keywords: ['아시아나항공', '아시아나'], stock: { name: '아시아나항공', code: '020560', market: 'KOSPI' } },
  { keywords: ['CJ제일제당'], stock: { name: 'CJ제일제당', code: '097950', market: 'KOSPI' } },
  { keywords: ['오리온'], stock: { name: '오리온', code: '271560', market: 'KOSPI' } },
];

export function extractStocks(text: string): StockInfo[] {
  const found: StockInfo[] = [];
  const seenCodes = new Set<string>();

  for (const { keywords, stock } of STOCK_MAP) {
    if (seenCodes.has(stock.code)) continue;
    if (keywords.some((kw) => text.includes(kw))) {
      found.push(stock);
      seenCodes.add(stock.code);
    }
  }

  return found;
}

export function getNaverFinanceUrl(code: string): string {
  return `https://finance.naver.com/item/main.naver?code=${code}`;
}
