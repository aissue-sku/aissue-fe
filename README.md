# AIssue — Frontend

> 최종 업데이트: 2026년 5월 26일

AIssue 서비스의 React 기반 프론트엔드 레포지토리입니다.  
뉴스 신뢰도 분석, 키워드 구독, AI 이슈 카드, 캐릭터 커스터마이징 기능을 제공하는 모바일 웹 앱입니다.

---

## 기술 스택

| 분류 | 사용 기술 |
|---|---|
| 프레임워크 | React 19 + TypeScript 6 |
| 빌드 도구 | Vite 8 |
| 스타일 | Tailwind CSS 4 |
| 라우팅 | React Router DOM 7 |
| 아이콘 | Lucide React |
| API 통신 | Fetch (커스텀 client 레이어) |

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
│   ├── analysis/        # 신뢰도 분석 입력 / 결과 / 상세
│   └── profile/         # 프로필 / 캐릭터 상점 / 키워드 관리
├── components/
│   ├── layout/          # AppLayout, BottomNav
│   ├── common/          # NewsCard 등 공용 컴포넌트
│   └── analysis/        # CircularProgress, ScoreBar 등 분석 전용
├── services/            # API 호출 레이어 (auth, user, keywords 등)
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
| `/analysis/trust` | AnalysisTrustPage | 항목별 신뢰도 상세 |
| `/profile` | ProfilePage | 내 정보 + 포인트 + 설정 |
| `/profile/shop` | CharacterShopPage | 캐릭터 아이템 상점 |
| `/profile/keywords` | KeywordManagePage | 구독 키워드 관리 |

---

## API 연동

모든 요청은 `src/services/client.ts`를 통해 게이트웨이(`VITE_API_BASE_URL`)로 전달됩니다.  
JWT Access Token은 요청 헤더에 자동 첨부되며, 만료 시 Refresh Token으로 재발급합니다.

| 서비스 파일 | 연동 API |
|---|---|
| `auth.ts` | 로그인 / 로그아웃 / 토큰 재발급 |
| `user.ts` | 내 정보 / 회원 탈퇴 / 캐릭터 조회·구매·착용 |
| `keywords.ts` | 구독 키워드 목록 / 추가 / 삭제 |
| `issues.ts` | AI 이슈 카드 목록 |
| `articles.ts` | 뉴스 검색 / 키워드별 뉴스 |
| `analysis.ts` | 신뢰도 분석 요청 / 결과 조회 |
| `notifications.ts` | 알림 목록 / 읽음 처리 |
