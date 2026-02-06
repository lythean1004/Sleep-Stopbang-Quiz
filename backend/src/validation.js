import validator from 'validator';

const PHONE_REGEX = /^01[0-9]-?\d{3,4}-?\d{4}$/;

export function sanitizeInput(value) {
  return validator.escape(String(value || '').trim());
}

export function validateLeadPayload(body) {
  const errors = [];
  if (body.riskLevel !== 'high') {
    errors.push('고위험군에 한해 상담 신청이 가능합니다.');
  }
  if (typeof body.score !== 'number' || body.score < 5 || body.score > 8) {
    errors.push('점수 정보가 유효하지 않습니다.');
  }
  if (body.requiredConsent !== true) {
    errors.push('필수 동의가 필요합니다.');
  }
  if (!body.name || !body.city || !body.phone) {
    errors.push('필수 입력값이 누락되었습니다.');
  }
  if (!PHONE_REGEX.test(String(body.phone).trim())) {
    errors.push('휴대폰 번호 형식이 올바르지 않습니다.');
  }
  return errors;
}
