import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { LANGUAGE_OPTIONS, QUESTION_KEYS, TOTAL_QUESTIONS } from './constants';
import { LANGUAGE_STORAGE_KEY } from './i18n';

const calculateRisk = (score) => {
  if (score <= 2) return 'low';
  if (score <= 5) return 'moderate';
  return 'high';
};

function LanguageSelection({ onSelect }) {
  const { t } = useTranslation();

  return (
    <section className="screen center-screen">
      <h1>{t('languageSelection.title')}</h1>
      <p>{t('languageSelection.subtitle')}</p>
      <div className="language-grid">
        {LANGUAGE_OPTIONS.map((language) => (
          <button
            key={language.code}
            className="language-button"
            onClick={() => onSelect(language.code)}
            type="button"
          >
            <span>{language.flag}</span>
            <span>{language.nativeLabel}</span>
          </button>
        ))}
      </div>
    </section>
  );
}

function IntroScreen({ onStart }) {
  const { t } = useTranslation();
  return (
    <section className="screen card-screen">
      <h1>{t('app.title')}</h1>
      <p>{t('intro.description')}</p>
      <ul>
        <li>{t('intro.instructions.1')}</li>
        <li>{t('intro.instructions.2')}</li>
        <li>{t('intro.instructions.3')}</li>
      </ul>
      <button type="button" onClick={onStart}>{t('buttons.start')}</button>
    </section>
  );
}

function QuestionScreen({ currentQuestion, selectedValue, onAnswer }) {
  const { t } = useTranslation();
  const key = QUESTION_KEYS[currentQuestion];

  return (
    <section className="screen card-screen">
      <h2>{t('progress', { current: currentQuestion + 1, total: TOTAL_QUESTIONS })}</h2>
      <h3>{t(`${key}.text`)}</h3>
      <div className="answers">
        {[0, 1].map((value) => (
          <button
            key={value}
            className={selectedValue === value ? 'selected' : ''}
            type="button"
            onClick={() => onAnswer(value)}
          >
            {t(`${key}.choices.${value}`)}
          </button>
        ))}
      </div>
    </section>
  );
}

function ResultScreen({ risk, score, onContinue }) {
  const { t } = useTranslation();
  return (
    <section className="screen card-screen">
      <h1>{t('result.title')}</h1>
      <p>{t('result.score', { score, total: TOTAL_QUESTIONS })}</p>
      <h2>{t(`result.levels.${risk}.label`)}</h2>
      <p>{t(`result.levels.${risk}.description`)}</p>
      <button type="button" onClick={onContinue}>{t('buttons.continue')}</button>
    </section>
  );
}

function ConsentScreen({ languageCode, onSubmit, consent }) {
  const { t } = useTranslation();
  const [checked, setChecked] = useState(consent.agreed);

  return (
    <section className="screen card-screen">
      <h1>{t('consent.title')}</h1>
      <p>{t('consent.description')}</p>
      <p>{t('consent.privacy')}</p>
      <label className="checkbox-row">
        <input type="checkbox" checked={checked} onChange={(e) => setChecked(e.target.checked)} />
        <span>{t('consent.checkbox')}</span>
      </label>
      <button
        type="button"
        onClick={() => onSubmit(checked)}
      >
        {t('buttons.submitConsent')}
      </button>
      <p>{t('consent.languageRecord', { code: languageCode })}</p>
    </section>
  );
}

function CompletionScreen({ onRestart }) {
  const { t } = useTranslation();
  return (
    <section className="screen card-screen">
      <h1>{t('completion.title')}</h1>
      <p>{t('completion.message')}</p>
      <button type="button" onClick={onRestart}>{t('buttons.restart')}</button>
    </section>
  );
}

export default function App() {
  const { i18n, t } = useTranslation();
  const [languageChosen, setLanguageChosen] = useState(false);
  const [stage, setStage] = useState('language');
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState(Array(TOTAL_QUESTIONS).fill(null));
  const [consentRecord, setConsentRecord] = useState({ agreed: false, consent_language: '' });

  useEffect(() => {
    const saved = localStorage.getItem(LANGUAGE_STORAGE_KEY);
    if (saved) {
      setLanguageChosen(true);
      setStage('intro');
    }
  }, []);

  const score = useMemo(
    () => answers.reduce((acc, value) => acc + (value === 1 ? 1 : 0), 0),
    [answers]
  );

  const risk = calculateRisk(score);

  const handleLanguageSelect = (code) => {
    i18n.changeLanguage(code);
    localStorage.setItem(LANGUAGE_STORAGE_KEY, code);
    setLanguageChosen(true);
    setStage('intro');
  };

  const handleAnswer = (value) => {
    const nextAnswers = [...answers];
    nextAnswers[currentQuestion] = value;
    setAnswers(nextAnswers);

    if (currentQuestion + 1 >= TOTAL_QUESTIONS) {
      setStage('result');
      return;
    }

    setCurrentQuestion((previous) => previous + 1);
  };

  const handleConsentSubmit = (agreed) => {
    if (!agreed) {
      window.alert(t('errors.consentRequired'));
      return;
    }

    const nextRecord = {
      agreed,
      consent_language: i18n.language
    };

    setConsentRecord(nextRecord);
    localStorage.setItem('consent_record', JSON.stringify(nextRecord));
    setStage('complete');
  };

  const handleResultContinue = () => {
    if (risk === 'high') {
      setStage('consent');
      return;
    }
    setStage('complete');
  };

  const restart = () => {
    setStage('intro');
    setCurrentQuestion(0);
    setAnswers(Array(TOTAL_QUESTIONS).fill(null));
  };

  if (!languageChosen) {
    return <LanguageSelection onSelect={handleLanguageSelect} />;
  }

  if (stage === 'intro') {
    return <IntroScreen onStart={() => setStage('question')} />;
  }

  if (stage === 'question') {
    return (
      <QuestionScreen
        currentQuestion={currentQuestion}
        selectedValue={answers[currentQuestion]}
        onAnswer={handleAnswer}
      />
    );
  }

  if (stage === 'result') {
    return <ResultScreen risk={risk} score={score} onContinue={handleResultContinue} />;
  }

  if (stage === 'consent') {
    return (
      <ConsentScreen
        consent={consentRecord}
        languageCode={i18n.language}
        onSubmit={handleConsentSubmit}
      />
    );
  }

  return <CompletionScreen onRestart={restart} />;
}
