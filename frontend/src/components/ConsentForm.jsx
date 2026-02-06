import { useState } from 'react';

const PHONE_REGEX = /^01[0-9]-?\d{3,4}-?\d{4}$/;

export default function ConsentForm({ onSubmit, loading, error, successMessage }) {
  const [requiredConsent, setRequiredConsent] = useState(false);
  const [marketingConsent, setMarketingConsent] = useState(false);
  const [formData, setFormData] = useState({ name: '', phone: '', city: '' });
  const [validationError, setValidationError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setValidationError('');

    if (!requiredConsent) {
      setValidationError('개인정보 수집 및 이용 동의는 필수입니다.');
      return;
    }
    if (!formData.name.trim() || !formData.city.trim()) {
      setValidationError('이름과 거주 도시를 입력해주세요.');
      return;
    }
    if (!PHONE_REGEX.test(formData.phone.trim())) {
      setValidationError('휴대폰 번호 형식을 확인해주세요. 예: 010-1234-5678');
      return;
    }

    onSubmit({
      ...formData,
      requiredConsent,
      marketingConsent
    });
  };

  return (
    <section className="card">
      <h3>고위험군 후속 상담 신청</h3>
      <p className="risk-msg">
        결과상 수면무호흡증 고위험군입니다. 정확한 평가를 위해 PSG(수면다원검사)를 권장합니다.
      </p>

      <form onSubmit={handleSubmit} className="consent-form">
        <label className="checkbox-row">
          <input type="checkbox" checked={requiredConsent} onChange={(e) => setRequiredConsent(e.target.checked)} />
          <span>[필수] 개인정보 수집 및 이용 동의</span>
        </label>

        <label className="checkbox-row">
          <input type="checkbox" checked={marketingConsent} onChange={(e) => setMarketingConsent(e.target.checked)} />
          <span>[선택] 이벤트 및 상담 연락 동의</span>
        </label>

        <label>
          이름
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
            placeholder="홍길동"
            maxLength={30}
          />
        </label>

        <label>
          휴대폰 번호
          <input
            type="tel"
            value={formData.phone}
            onChange={(e) => setFormData((prev) => ({ ...prev, phone: e.target.value }))}
            placeholder="010-1234-5678"
            maxLength={13}
          />
        </label>

        <label>
          거주 도시 (시 단위)
          <input
            type="text"
            value={formData.city}
            onChange={(e) => setFormData((prev) => ({ ...prev, city: e.target.value }))}
            placeholder="서울"
            maxLength={20}
          />
        </label>

        {validationError && <p className="error">{validationError}</p>}
        {error && <p className="error">{error}</p>}
        {successMessage && <p className="success">{successMessage}</p>}

        <button disabled={loading} type="submit" className="submit-btn">
          {loading ? '저장 중...' : '상담 신청 보내기'}
        </button>
      </form>
    </section>
  );
}
