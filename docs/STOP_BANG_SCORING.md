# STOP-BANG 점수 로직 샘플

```js
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

  if (score <= 2) return { score, riskLevel: 'low' };
  if (score <= 4) return { score, riskLevel: 'intermediate' };
  return { score, riskLevel: 'high' };
}
```

- Low Risk: 0–2
- Intermediate Risk: 3–4
- High Risk: 5+
