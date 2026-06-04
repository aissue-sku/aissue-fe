# AIssue — Frontend

> 최종 업데이트: 2026년 6월 4일

AIssue 서비스의 React 기반 프론트엔드 레포지토리입니다.  
뉴스 신뢰도 분석, 키워드 구독, AI 이슈 카드, 관련 종목 기술적 분석, 캐릭터 커스터마이징, 일일 퀴즈 기능을 제공하는 모바일 웹 앱(PWA)입니다.

---

## 기술 스택

| 분류 | 사용 기술 |
|---|---|
| 프레임워크 | React 19 + TypeScript 6 |
| 빌드 도구 | Vite 8 |
| 스타일 | Tailwind CSS 4 |
| 라우팅 | React Router DOM 7 |
| 아이콘 | Lucide React |
| API 통신 | Fetch (커스텀 client 레이어, 쿠키 기반 인증) |
| PWA | vite-plugin-pwa |

---

## 로컬 실행

```bash
# 의존성 설치
npm install

# 개발 서버 실행
npm run dev

# 빌드
npm run build
```

### 환경 변수

프로젝트 루트에 `.env` 파일을 생성합니다.

```env
VITE_API_BASE_URL=        # 게이트웨이 주소 (예: http://localhost:8080)
API_PROXY_TARGET=         # 로컬 프록시 대상 주소
```

---

## 프로젝트 구조

```
src/
├── pages/
│   ├── splash/          # 스플래시 화면
│   ├── login/           # 로그인
│   ├── signup/          # 회원가입
│   ├── home/            # 홈 (이슈 카드 + 키워드 뉴스)
│   ├── search/          # 검색 / 결과 / 기사 상세
│   ├── notification/    # 알림
│   ├── analysis/        # 신뢰도 분석 입력 / 결과 / 상세 (관련 종목 포함)
│   └── profile/         # 프로필 / 캐릭터 상점 / 키워드 관리 / 분석 이력 / 일일 퀴즈
├── components/
│   ├── layout/          # AppLayout, BottomNav
│   ├── common/          # NewsCard 등 공용 컴포넌트
│   └── analysis/        # CircularProgress, ScoreBar 등 분석 전용
├── services/            # API 호출 레이어 (auth, user, keywords, quiz 등)
├── hooks/               # useAuth, useKeywords 등 커스텀 훅
├── types/               # 공통 타입 정의
└── router/              # React Router 설정
```

---

## 화면 구성

| 경로 | 화면 | 설명 |
|---|---|---|
| `/` | SplashPage | 앱 진입 스플래시 |
| `/login` | LoginPage | 로그인 |
| `/signup` | SignupPage | 회원가입 |
| `/home` | HomePage | AI 이슈 카드 + 구독 키워드별 뉴스 |
| `/search` | SearchPage | 뉴스 검색 |
| `/search/result` | SearchResultPage | 검색 결과 목록 |
| `/search/article` | NewsArticlePage | 기사 상세 |
| `/notification` | NotificationPage | 키워드 매칭 알림 목록 |
| `/analysis` | AnalysisPage | 신뢰도 분석 URL 입력 |
| `/analysis/result` | AnalysisResultPage | 분석 결과 요약 |
| `/analysis/trust` | AnalysisTrustPage | 항목별 신뢰도 상세 + 관련 종목 기술적 분석 |
| `/profile` | ProfilePage | 내 정보 + 포인트 + 설정 |
| `/profile/shop` | CharacterShopPage | 캐릭터 아이템 상점 (모자·얼굴·옷·색상) |
| `/profile/keywords` | KeywordManagePage | 구독 키워드 관리 |
| `/profile/history` | AnalysisHistoryPage | 분석 이력 |
| `/profile/guide` | GuidePage | 사용 가이드 |
| `/profile/daily-quiz` | DailyQuizPage | 오늘의 퀴즈 (가짜 기사 찾기, 포인트 획득) |

---

## API 연동

모든 요청은 `src/services/client.ts`를 통해 게이트웨이(`VITE_API_BASE_URL`)로 전달됩니다.  
인증은 쿠키(ACCESS_TOKEN) 기반이며, 만료 시 Refresh Token으로 자동 재발급합니다.

| 서비스 파일 | 연동 API |
|---|---|
| `auth.ts` | 로그인 / 로그아웃 / 토큰 재발급 |
| `user.ts` | 내 정보 / 회원 탈퇴 / 캐릭터 조회·구매·착용 |
| `keywords.ts` | 구독 키워드 목록 / 추가 / 삭제 |
| `issues.ts` | AI 이슈 카드 목록 |
| `articles.ts` | 뉴스 검색 / 키워드별 뉴스 |
| `analysis.ts` | 신뢰도 분석 요청 / 결과 조회 / 분석 이력 |
| `notifications.ts` | 알림 목록 / 읽음 처리 |
| `quiz.ts` | 일일 퀴즈 조회 / 정답 제출 |

---

## 주요 기능

### 신뢰도 분석
뉴스 URL을 입력하면 출처 신뢰도·내용 정확성·편향성·교차검증·투명성 5개 항목으로 분석합니다.  
분석 결과에 기사와 관련된 종목의 기술적 분석(RSI, MACD, ADX, 피보나치 지지/저항)을 함께 제공합니다.  
주식 정보는 투자 참고용이며, 모든 투자 판단의 책임은 이용자 본인에게 있습니다.

### 캐릭터 상점
포인트로 모자·얼굴·옷·색상 카테고리의 아이템을 구매하고 캐릭터를 커스터마이징할 수 있습니다.

### 일일 퀴즈
매일 진짜 기사 2개와 가짜 기사 1개가 출제됩니다. 가짜 기사를 맞히면 포인트를 획득합니다.  
하루 1회 참여 가능하며, 제출 후 해설과 함께 결과를 확인할 수 있습니다.
