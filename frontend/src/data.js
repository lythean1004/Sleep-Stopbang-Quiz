export const stages = [
  {
    key: 'snoring',
    title: '1. 코골이 동굴',
    question: '주변 사람이 큰 코골이를 지적한 적이 있나요?',
    type: 'choice',
    yesLabel: '네, 자주 있어요',
    noLabel: '아니요'
  },
  {
    key: 'tiredness',
    title: '2. 피로의 숲',
    question: '낮 동안 졸림/피곤함을 자주 느끼나요?',
    type: 'choice',
    yesLabel: '네, 집중이 어려워요',
    noLabel: '아니요'
  },
  {
    key: 'observedApnea',
    title: '3. 무호흡 관측소',
    question: '수면 중 숨이 멈춘 것을 목격당한 적이 있나요?',
    type: 'choice',
    yesLabel: '네, 들은 적 있어요',
    noLabel: '없어요'
  },
  {
    key: 'bloodPressure',
    title: '4. 혈압 게이트',
    question: '고혈압 진단을 받았거나 약을 복용 중인가요?',
    type: 'choice',
    yesLabel: '네',
    noLabel: '아니요'
  },
  {
    key: 'bmi',
    title: '5. BMI 미로',
    question: '현재 BMI를 선택해주세요.',
    type: 'slider',
    min: 18,
    max: 45,
    threshold: 35,
    unit: ''
  },
  {
    key: 'age',
    title: '6. 나이 시계탑',
    question: '현재 나이를 선택해주세요.',
    type: 'slider',
    min: 18,
    max: 90,
    threshold: 50,
    unit: '세'
  },
  {
    key: 'neckCircumference',
    title: '7. 목둘레 연구실',
    question: '목둘레를 선택해주세요.',
    type: 'slider',
    min: 28,
    max: 55,
    threshold: 40,
    unit: 'cm'
  },
  {
    key: 'gender',
    title: '8. 성별 터미널',
    question: '성별을 선택해주세요.',
    type: 'gender'
  }
];

export const defaultValues = {
  snoring: null,
  tiredness: null,
  observedApnea: null,
  bloodPressure: null,
  bmi: 25,
  age: 30,
  neckCircumference: 35,
  gender: null
};

export function calculateStopBangScore(values) {
  let score = 0;
  if (values.snoring) score += 1;
  if (values.tiredness) score += 1;
  if (values.observedApnea) score += 1;
  if (values.bloodPressure) score += 1;
  if (Number(values.bmi) > 35) score += 1;
  if (Number(values.age) > 50) score += 1;
  if (Number(values.neckCircumference) > 40) score += 1;
  if (values.gender === 'male') score += 1;

  const riskLevel = score <= 2 ? 'low' : score <= 4 ? 'intermediate' : 'high';
  return { score, riskLevel };
}
