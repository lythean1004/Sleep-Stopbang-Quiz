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
