import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { quizService } from "../../services/quiz";
import { ApiError } from "../../services/client";
import { useMascotConfig } from "../../hooks/useMascotConfig";
import mascotHand from "../../assets/mascot-hand.png";
import QuizResultModal from "../../components/common/QuizResultModal";
import { markAttendance, unmarkAttendance } from "../../utils/attendance";
import type { DailyQuizResponse } from "../../types/api";

type Phase = "loading" | "error" | "quiz" | "result" | "done";

const BackIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
    <path d="M15 18l-6-6 6-6" stroke="#1A1A1A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const DailyQuizPage = () => {
  const navigate = useNavigate();
  const mascotConfig = useMascotConfig();

  const [phase, setPhase] = useState<Phase>("loading");
  const [quiz, setQuiz] = useState<DailyQuizResponse | null>(null);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [isExiting, setIsExiting] = useState(false);
  const [showResultModal, setShowResultModal] = useState(false);

  // 결과
  const [correct, setCorrect] = useState(false);
  const [fakeIndex, setFakeIndex] = useState<number | null>(null);
  const [pointsEarned, setPointsEarned] = useState(0);
  const [explanation, setExplanation] = useState("");

  const loadCachedResult = (quizId: number) => {
    try {
      const cached = localStorage.getItem(`aissue_quiz_${quizId}`);
      if (cached) {
        const { explanation: exp, fakeIndex: fi } = JSON.parse(cached);
        if (exp) setExplanation(exp);
        if (fi !== undefined) setFakeIndex(fi);
      }
    } catch {}
  };

  const saveCachedResult = (quizId: number, exp: string, fi: number) => {
    try {
      localStorage.setItem(`aissue_quiz_${quizId}`, JSON.stringify({ explanation: exp, fakeIndex: fi }));
    } catch {}
  };

  useEffect(() => {
    quizService
      .getDailyQuiz()
      .then((data) => {
        setQuiz(data);
        if (data.alreadyAnswered) {
          setSelectedIndex(data.myAnswer);
          setCorrect(data.myAnswerCorrect);
          if (data.myAnswerCorrect && data.myAnswer !== null) {
            setFakeIndex(data.myAnswer);
          }
          loadCachedResult(data.quizId);
          markAttendance();
          setPhase("done");
        } else {
          unmarkAttendance();
          setPhase("quiz");
        }
      })
      .catch(() => setPhase("error"));
  }, []);

  const handleBack = () => {
    setIsExiting(true);
    setTimeout(() => navigate(-1), 280);
  };

  const handleSubmit = async () => {
    if (selectedIndex === null || submitting) return;
    setSubmitting(true);
    try {
      const res = await quizService.submitAnswer(selectedIndex);
      setCorrect(res.correct);
      setFakeIndex(res.fakeIndex);
      setPointsEarned(res.pointsEarned);
      setExplanation(res.explanation);
      if (quiz) saveCachedResult(quiz.quizId, res.explanation, res.fakeIndex);
      markAttendance();
      setPhase("result");
      setShowResultModal(true);
    } catch (e) {
      if (e instanceof ApiError && e.status === 409) {
        // 이미 제출한 경우 — 퀴즈 재조회 후 캐시된 해설 복원
        quizService.getDailyQuiz().then((data) => {
          setQuiz(data);
          setSelectedIndex(data.myAnswer);
          setCorrect(data.myAnswerCorrect);
          if (data.myAnswerCorrect && data.myAnswer !== null) setFakeIndex(data.myAnswer);
          loadCachedResult(data.quizId);
          setPhase("done");
        }).catch(() => {});
      }
    } finally {
      setSubmitting(false);
    }
  };

  // 각 카드의 시각 상태
  const cardState = (index: number): "idle" | "selected" | "fake" | "wrong" => {
    if (phase === "quiz") return selectedIndex === index ? "selected" : "idle";
    if (index === fakeIndex) return "fake";
    if (index === selectedIndex && !correct) return "wrong";
    return "idle";
  };

  return (
    <div className={`flex flex-col min-h-full w-full overflow-x-hidden bg-[#FBFBFB] ${isExiting ? "animate-slide-out" : "animate-slide-in"}`}>
      {/* 헤더 */}
      <header className="fixed top-6 left-0 right-0 z-10 h-16 flex items-end justify-center px-5 pb-3 bg-transparent">
        <button
          onClick={handleBack}
          className="absolute left-5 bottom-3 p-1 cursor-pointer active:opacity-60 transition-opacity"
          aria-label="뒤로 가기"
        >
          <BackIcon />
        </button>
        <h1 className="text-[18px] font-semibold text-[#1A1A1A] tracking-[-0.45px]">
          오늘의 퀴즈
        </h1>
      </header>

      <div className="flex-1 flex flex-col pt-32 pb-32 px-5 gap-5">

        {/* 마스코트 + 상태 메시지 */}
        <div className="flex flex-col items-center gap-3">
          <div className="relative w-24">
            <img
              src={mascotConfig.faceImage}
              alt="아이슈 마스코트"
              className="w-full h-auto object-contain"
              style={{ filter: mascotConfig.filter }}
            />
            {mascotConfig.clothImage && (
              <img src={mascotConfig.clothImage} alt="" className="absolute top-0 left-0 w-full h-auto" />
            )}
            {mascotConfig.hatImage && (
              <img src={mascotConfig.hatImage} alt="" className="absolute top-0 left-0 w-full h-auto" />
            )}
            <img
              src={mascotHand}
              alt=""
              className="absolute top-[30%] left-[75%] w-[48%] h-auto animate-hand"
              style={{ filter: mascotConfig.filter }}
            />
          </div>

          {phase === "loading" && (
            <div className="w-6 h-6 border-2 border-[var(--color-primary)] border-t-transparent rounded-full animate-spin mt-2" />
          )}

          {phase === "error" && (
            <p className="text-[14px] text-[#A8A8A8] text-center leading-[1.6]">
              퀴즈를 불러오지 못했습니다.<br />잠시 후 다시 시도해 주세요.
            </p>
          )}

          {phase === "quiz" && (
            <div className="flex flex-col items-center gap-2">
              <p className="text-[20px] font-bold text-[#1A1A1A] text-center leading-[1.4]">
                가짜 기사를 찾아라!
              </p>
              <div className="flex items-center gap-1.5 bg-[var(--color-primary-bg)] rounded-full px-4 py-1.5">
                <span className="text-[13px] font-semibold text-[var(--color-primary)]">
                  정답 시 포인트 획득
                </span>
              </div>
              <p className="text-[13px] text-[#A8A8A8] text-center">
                3개의 기사 중 가짜 기사 1개를 골라주세요
              </p>
            </div>
          )}

          {phase === "result" && (
            <div className="flex flex-col items-center gap-2">
              {correct ? (
                <>
                  <p className="text-[20px] font-bold text-[#2E7D32] text-center">정답이에요!</p>
                  <div className="flex items-center gap-1.5 bg-[#E8F5E9] rounded-full px-4 py-1.5">
                    <span className="text-[13px] font-semibold text-[#2E7D32]">+{pointsEarned}P 획득!</span>
                  </div>
                </>
              ) : (
                <>
                  <p className="text-[20px] font-bold text-[#C62828] text-center">아쉬워요!</p>
                  <p className="text-[13px] text-[#A8A8A8] text-center">가짜 기사가 표시됩니다</p>
                </>
              )}
            </div>
          )}

          {phase === "done" && (
            <div className="flex flex-col items-center gap-2">
              <p className="text-[20px] font-bold text-[#1A1A1A] text-center">오늘 퀴즈 완료!</p>
              <p className="text-[13px] text-[#A8A8A8] text-center">내일 새로운 퀴즈가 열려요</p>
            </div>
          )}
        </div>

        {/* 기사 카드 목록 */}
        {quiz && phase !== "loading" && phase !== "error" && (
          <div className="flex flex-col gap-3">
            {quiz.articles.map((article) => {
              const state = cardState(article.index);
              const isSelectable = phase === "quiz";

              const borderColor =
                state === "fake" ? "#4CAF50"
                : state === "wrong" ? "#EF5350"
                : state === "selected" ? "var(--color-primary)"
                : "#EEEEEE";

              const bgColor =
                state === "fake" ? "#F1F8F1"
                : state === "wrong" ? "#FFF1F1"
                : state === "selected" ? "var(--color-primary-bg)"
                : "#FFFFFF";

              const numBg =
                state === "selected" ? "var(--color-primary)"
                : state === "fake" ? "#4CAF50"
                : state === "wrong" ? "#EF5350"
                : "#E8E8E8";

              return (
                <button
                  key={article.index}
                  disabled={!isSelectable}
                  onClick={() => isSelectable && setSelectedIndex(article.index)}
                  className="w-full text-left rounded-[14px] px-4 py-4 flex flex-col gap-2.5 border transition-all duration-150 active:opacity-80"
                  style={{
                    borderColor,
                    backgroundColor: bgColor,
                    borderWidth: state !== "idle" ? "1.5px" : "1px",
                    boxShadow: state === "selected" ? "0 2px 8px rgba(81,162,255,0.12)" : "0 1px 3px rgba(0,0,0,0.04)",
                  }}
                >
                  {/* 번호 + 뱃지 */}
                  <div className="flex items-center justify-between">
                    <span
                      className="text-[12px] font-bold w-6 h-6 rounded-full flex items-center justify-center shrink-0"
                      style={{ backgroundColor: numBg, color: state === "idle" ? "#888" : "#fff" }}
                    >
                      {article.index + 1}
                    </span>
                    <div className="flex items-center gap-1.5">
                      {state === "fake" && (
                        <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-[#E8F5E9] text-[#2E7D32]">
                          가짜 기사
                        </span>
                      )}
                      {state === "wrong" && (
                        <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-[#FFEBEE] text-[#C62828]">
                          내 선택
                        </span>
                      )}
                    </div>
                  </div>

                  {/* 제목 */}
                  <p className="text-[15px] font-semibold text-[#1A1A1A] leading-[1.5]">
                    {article.title}
                  </p>

                  {/* 본문 요약 */}
                  <p className="text-[12px] text-[#888] leading-[1.6]">
                    {article.body}
                  </p>

                </button>
              );
            })}
          </div>
        )}

        {/* 해설 */}
        {(phase === "result" || phase === "done") && explanation && (
          <div className="bg-[var(--color-primary-bg)] rounded-[12px] px-4 py-4 flex flex-col gap-1.5">
            <p className="text-[12px] font-semibold" style={{ color: 'var(--color-primary)' }}>해설</p>
            <p className="text-[13px] text-[#444] leading-[1.7]">{explanation}</p>
          </div>
        )}
      </div>

      {/* 하단 버튼 */}
      {phase === "quiz" && (
        <div className="fixed bottom-0 left-0 right-0 px-5 py-4 bg-white border-t border-[#F0F0F0]">
          <button
            onClick={handleSubmit}
            disabled={selectedIndex === null || submitting}
            className="w-full h-[52px] rounded-[12px] text-[16px] font-bold text-white bg-[var(--color-primary)] active:opacity-80 transition-opacity disabled:opacity-40"
          >
            {submitting ? "제출 중..." : "정답 제출하기"}
          </button>
        </div>
      )}

      {(phase === "result" || phase === "done") && (
        <div className="fixed bottom-0 left-0 right-0 px-5 py-4 bg-white border-t border-[#F0F0F0]">
          <button
            onClick={handleBack}
            className="w-full h-[52px] rounded-[12px] text-[16px] font-bold text-white bg-[var(--color-primary)] active:opacity-80 transition-opacity"
          >
            확인
          </button>
        </div>
      )}

      {showResultModal && fakeIndex !== null && (
        <QuizResultModal
          correct={correct}
          pointsEarned={pointsEarned}
          fakeIndex={fakeIndex}
          onClose={() => setShowResultModal(false)}
        />
      )}
    </div>
  );
};

export default DailyQuizPage;
