# STOP-BANG Quiz (Multi-language)

A React + Vite STOP-BANG quiz game with a fully localized flow:

1. Language Selection
2. Intro
3. 8 Questions
4. Result
5. Consent (High Risk only)
6. Completion / Thank You

## Supported languages

- Korean (`ko`)
- Japanese (`ja`)
- Chinese Simplified (`zh`)
- English (`en`)
- French (`fr`)
- Spanish (`es`)
- Portuguese (`pt`)

## Run

```bash
npm install
npm run dev
```

## i18n architecture

- Uses `i18next` + `react-i18next`.
- Translation files are JSON in `/locales`.
- Current language is persisted in `localStorage` under `quiz_language`.
- Returning users skip the language selection page.

## Folder structure

```text
.
├─ locales/
│  ├─ en.json
│  ├─ ko.json
│  ├─ ja.json
│  ├─ zh.json
│  ├─ fr.json
│  ├─ es.json
│  └─ pt.json
├─ src/
│  ├─ App.jsx
│  ├─ constants.js
│  ├─ i18n.js
│  ├─ main.jsx
│  └─ styles.css
├─ index.html
├─ package.json
└─ vite.config.js
```

## How to add a new language

Example: Add German (`de`)

1. Create a file: `locales/de.json`.
2. Copy all keys from `locales/en.json` and translate values.
3. Register the locale in `src/i18n.js`:
   - import `de` JSON
   - add `de` to `resources`
   - include `de` in `SUPPORTED_LANGUAGES`
4. Add language option to `LANGUAGE_OPTIONS` in `src/constants.js`:
   - `{ code: 'de', nativeLabel: 'Deutsch', flag: '🇩🇪' }`

## How to update translations

1. Edit the corresponding JSON file in `/locales`.
2. Keep translation keys identical across all language files.
3. Avoid hardcoded UI text in components; use `t('...')` keys only.
4. Run `npm run build` to validate the app compiles.
# STOP-BANG QUEST 🌙

수면무호흡증(OSA) 인지 개선과 고위험군 리드 전환을 위한 게임형 STOP-BANG 웹앱입니다.

## 1) 폴더 구조

```text
.
├─ frontend/                  # React + Vite 모바일 우선 게임 UI
│  ├─ public/privacy-policy.md
│  └─ src/
│     ├─ components/
│     ├─ styles/
│     ├─ App.jsx
│     └─ data.js
├─ backend/                   # Express API + SQLite + AES 암호화
│  ├─ src/
│  │  ├─ db.js
│  │  ├─ security.js
│  │  ├─ validation.js
│  │  └─ server.js
│  └─ data/dummy_leads.json
├─ docs/STOP_BANG_SCORING.md
└─ .env.example
```

## 2) 주요 기능

- 8개 스테이지 게임형 문진 (Snoring/Tiredness/Observed apnea/BP/BMI/Age/Neck/Gender)
- 즉시 피드백(버튼/슬라이더) 및 STOP-BANG 점수 자동 계산
- 위험도 분류
  - Low Risk: 0–2
  - Intermediate Risk: 3–4
  - High Risk: ≥5
- 고위험군 전용 개인정보 수집 플로우
  - `[필수] 개인정보 수집 및 이용 동의`
  - `[선택] 이벤트 및 상담 연락 동의`
  - 이름/휴대폰/거주 도시 입력 및 검증
- 개인정보 보호
  - AES-256-CBC 암호화 저장
  - 동의 로그 별도 테이블 저장
  - 1년 보관 정책(정책 문서 포함)

## 3) 로컬 실행 방법

### 사전 준비

- Node.js 20+

### 설치

```bash
cp .env.example .env
cd backend && npm install
cd ../frontend && npm install
```

### 실행

터미널 1:
```bash
cd backend
export $(grep -v '^#' ../.env | xargs)
npm run dev
```

터미널 2:
```bash
cd frontend
export $(grep -v '^#' ../.env | xargs)
npm run dev
```

브라우저: `http://localhost:5173`

## 4) API 요약

- `POST /api/leads`: 고위험군 + 필수동의 완료 사용자 리드 저장
- `GET /api/admin/leads`: 관리자 토큰 필요, 마스킹된 연락처 조회
- `GET /api/admin/export.csv`: 관리자 토큰 필요, CSV 내보내기
- `GET /api/health`: 헬스체크

관리자 헤더 예시:

```http
Authorization: Bearer demo-admin-token
```

## 5) 배포 노트

### Frontend (Vercel)

- Root Directory: `frontend`
- Build: `npm run build`
- Output: `dist`
- 환경변수: `VITE_API_BASE_URL=https://<backend-domain>`

### Backend (Render)

- Root Directory: `backend`
- Build: `npm install`
- Start: `npm start`
- 환경변수: `.env.example` 참고해서 `ENCRYPTION_SECRET`, `ADMIN_TOKEN` 반드시 강력한 값으로 변경
- Render Persistent Disk 또는 외부 PostgreSQL 사용 권장

## 6) 개인정보/컴플라이언스

- 저/중위험군 개인정보 미수집
- 고위험군에서 필수 동의 후 수집
- 개인정보 처리방침: `frontend/public/privacy-policy.md`
- 보관 기간: 1년
- 동의 로그 분리 저장(`consent_logs`)

## 7) 테스트 더미 데이터

`backend/data/dummy_leads.json` 파일로 샘플 payload를 확인할 수 있습니다.
