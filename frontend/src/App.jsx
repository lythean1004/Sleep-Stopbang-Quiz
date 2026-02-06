import { useMemo, useState } from 'react';
import QuizStage from './components/QuizStage.jsx';
import ConsentForm from './components/ConsentForm.jsx';
import { calculateStopBangScore, defaultValues, stages } from './data.js';

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000';

function riskLabel(level) {
  if (level === 'low') return '저위험군';
  if (level === 'intermediate') return '중등도 위험군';
  return '고위험군';
}

function PrivacyPolicy() {
  return (
    <section className="card">
      <h2>개인정보 처리방침 요약</h2>
      <ul className="policy-list">
        <li>저위험/중등도 위험군은 개인정보를 수집하지 않습니다.</li>
        <li>고위험군에서 필수 동의 후에만 이름/연락처/도시 정보를 수집합니다.</li>
        <li>개인정보 보관 기간은 수집일로부터 1년이며 이후 안전하게 파기합니다.</li>
        <li>동의 로그는 별도 저장소에 기록됩니다.</li>
      </ul>
      <a href="/privacy-policy.md" target="_blank" rel="noreferrer">전체 정책 문서 보기</a>
    </section>
  );
}

export default function App() {
  const [answers, setAnswers] = useState(defaultValues);
  const [step, setStep] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState('');
  const [apiSuccess, setApiSuccess] = useState('');
  const [view, setView] = useState('game');

  const result = useMemo(() => calculateStopBangScore(answers), [answers]);
  const isDone = step >= stages.length;
  const currentStage = stages[step];

  const updateAnswer = (key, value) => {
    setAnswers((prev) => ({ ...prev, [key]: value }));
  };

  const canProceed = () => {
    if (!currentStage) return false;
    return answers[currentStage.key] !== null;
  };

  const submitLead = async (payload) => {
    try {
      setLoading(true);
      setApiError('');
      setApiSuccess('');
      const response = await fetch(`${API_BASE}/api/leads`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...payload,
          score: result.score,
          riskLevel: result.riskLevel
        })
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || '요청 처리 중 오류가 발생했습니다.');
      }
      setApiSuccess('전문의 제휴 파트너가 검토 후 연락드릴 예정입니다.');
      setSubmitted(true);
    } catch (error) {
      setApiError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="app">
      <header className="hero">
        <h1>🌙 STOP-BANG QUEST</h1>
        <p>Sleep Lab Adventure에서 8개 스테이지를 완료하고 수면무호흡 위험도를 확인하세요.</p>
        <div className="tabs">
          <button className={view === 'game' ? 'active' : ''} onClick={() => setView('game')}>게임 시작</button>
          <button className={view === 'policy' ? 'active' : ''} onClick={() => setView('policy')}>개인정보 안내</button>
        </div>
      </header>

      {view === 'policy' ? (
        <PrivacyPolicy />
      ) : (
        <>
          {!isDone && currentStage && (
            <>
              <p className="progress">진행도: {step + 1} / {stages.length}</p>
              <QuizStage
                stage={currentStage}
                value={answers[currentStage.key]}
                onAnswer={(value) => updateAnswer(currentStage.key, value)}
              />
              <div className="actions">
                <button disabled={step === 0} onClick={() => setStep((prev) => prev - 1)}>이전</button>
                <button disabled={!canProceed()} onClick={() => setStep((prev) => prev + 1)}>다음</button>
              </div>
            </>
          )}

          {isDone && (
            <section className="card">
              <h2>결과 리포트</h2>
              <p>STOP-BANG 점수: <strong>{result.score}</strong> / 8</p>
              <p>분류: <strong>{riskLabel(result.riskLevel)}</strong></p>

              {result.riskLevel === 'high' ? (
                <ConsentForm
                  onSubmit={submitLead}
                  loading={loading}
                  error={apiError}
                  successMessage={apiSuccess}
                />
              ) : (
                <p className="result-msg">현재 결과에서는 개인정보 수집 없이 교육 콘텐츠만 제공합니다.</p>
              )}

              <button
                className="restart"
                onClick={() => {
                  setAnswers(defaultValues);
                  setStep(0);
                  setSubmitted(false);
                  setApiError('');
                  setApiSuccess('');
                }}
              >
                다시 플레이
              </button>
              {submitted && <p className="success">접수가 완료되었습니다.</p>}
            </section>
          )}
        </>
      )}
    </main>
  );
}
