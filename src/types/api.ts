import type { Article } from './index';

// ── 공통 래퍼 ────────────────────────────────────────────────────────────────
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

export interface PagedResponse<T> {
  content: T[];
  page: number;
  size: number;
  totalElements: number;
  hasNext: boolean;
}

// ── 인증 ─────────────────────────────────────────────────────────────────────
export interface LoginRequest {
  username: string;
  password: string;
}

export interface SignupRequest {
  username: string;
  name: string;
  password: string;
}

// ── 기사 ─────────────────────────────────────────────────────────────────────
export interface ArticleListParams {
  page?: number;
  size?: number;
  category?: string;
}

export interface ArticleSearchParams {
  q: string;
  page?: number;
  size?: number;
}

export type ArticleListResponse = PagedResponse<Article>;
export type ArticleSearchResponse = PagedResponse<Article>;

// ── 키워드 뉴스 ──────────────────────────────────────────────────────────────
export interface KeywordNewsItem {
  id: string;
  title: string;
  imageUrl: string | null;
  timeAgo: string;
  url: string;
}

export interface KeywordNewsPage {
  content: KeywordNewsItem[];
  lastCursor: number | null;
  hasNext: boolean;
  size: number;
}

// ── 인기 키워드 (GET /api/notifications/popular-keywords) ────────────────────
export interface PopularKeyword {
  keyword: string;
  subscriberCount: number;
}

// ── 키워드 ───────────────────────────────────────────────────────────────────
export interface TrendingKeyword {
  rank: number;
  keyword: string;
  count: number;
  hot: boolean;
  subscribed: boolean;
}

export interface TrendingResponse {
  keywords: TrendingKeyword[];
  updatedAt: string;
}

// ── 알림 ─────────────────────────────────────────────────────────────────────
export interface NotificationItem {
  id: number;
  keyword: string;
  title: string;
  url: string;
  contentId: number;
  createdAt: string;
  read: boolean;
}

// ── 분석 ─────────────────────────────────────────────────────────────────────
export interface AnalysisRequest {
  url: string;
}

export interface AnalysisResultItem {
  label: string;
  count: number;
  status: '확인' | '참고';
  description: string;
}

export interface AnalysisResponse {
  id: string;
  url: string;
  title: string;
  trustScore: number;
  results: AnalysisResultItem[];
  analyzedAt: string;
}

// ── 콘텐츠 비평 (GET /api/contents/{id}/critique) ────────────────────────────
export interface CritiqueItem {
  label: string;
  count: number;
  status: '주의' | '확인' | '참고';
  description: string;
}

export interface CritiqueResponse {
  trustReasons: string[];
  critiques: CritiqueItem[];
}

// ── 콘텐츠 신뢰도 분석 (GET /api/contents/{id}/analysis) ─────────────────────
export interface AnalysisSectionItem {
  label: string;
  score: number;
}

export interface AnalysisSection {
  score: number;
  reason: string;
  items: AnalysisSectionItem[];
}

export interface FactCheckItem {
  claim: string;
  status: string;
  evidence: string;
}

export interface ContentRelatedArticle {
  title: string;
  url: string;
  publisher: string;
  timeAgo: string;
  trustScore: number;
}

export interface ContentAnalysisResponse {
  url: string;
  totalScore: number;
  verdict: string;
  summary: string;
  credibility: AnalysisSection;
  accuracy: AnalysisSection;
  bias: AnalysisSection;
  crossVerification: AnalysisSection;
  transparency: AnalysisSection;
  factChecks: FactCheckItem[];
  relatedArticles: ContentRelatedArticle[];
}

// ── 콘텐츠 제출 (POST /api/contents/submit) ──────────────────────────────────
export interface ContentSubmitResponse {
  totalScore: number;
  credibility: number;
  accuracy: number;
  bias: number;
  crossVerification: number;
  transparency: number;
  verdict: string;
  reason: string;
}

// ── 분석 이력 (GET /api/contents/analysis/history) ───────────────────────────
export interface AnalysisHistoryItem {
  id: number;
  contentId: number | null;
  title: string;
  url: string | null;
  totalScore: number;
  verdict: string;
  analyzedAt: string;
}

// ── 캐릭터 상점 ──────────────────────────────────────────────────────────────
export interface CharacterItem {
  key: string;
  type?: string;
  name: string;
  purchased: boolean;
  price: number;
}

export interface CharacterDataResponse {
  equipped: {
    hat: CharacterItem | null;
    face: CharacterItem | null;
    clothes: CharacterItem | null;
    color: CharacterItem | null;
  };
  items: CharacterItem[];
}

// ── 유저 ─────────────────────────────────────────────────────────────────────
export interface UserProfile {
  userId: number;
  username: string;
  name: string;
  color: string;
  points: number;
}
