import { motion } from 'framer-motion';

export default function QuizStage({ stage, value, onAnswer }) {
  return (
    <motion.section
      key={stage.key}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      className="card"
    >
      <h2>{stage.title}</h2>
      <p className="question">{stage.question}</p>

      {stage.type === 'choice' && (
        <div className="button-grid">
          <button className={value === true ? 'active' : ''} onClick={() => onAnswer(true)}>{stage.yesLabel}</button>
          <button className={value === false ? 'active' : ''} onClick={() => onAnswer(false)}>{stage.noLabel}</button>
        </div>
      )}

      {stage.type === 'slider' && (
        <div className="slider-wrap">
          <input
            type="range"
            min={stage.min}
            max={stage.max}
            value={value}
            onChange={(e) => onAnswer(Number(e.target.value))}
          />
          <p className="value-pill">
            {value}
            {stage.unit}
            {Number(value) > stage.threshold ? ' ⚠️ 위험 기준 초과' : ' ✅ 기준 이하'}
          </p>
        </div>
      )}

      {stage.type === 'gender' && (
        <div className="button-grid">
          <button className={value === 'male' ? 'active' : ''} onClick={() => onAnswer('male')}>남성</button>
          <button className={value === 'female' ? 'active' : ''} onClick={() => onAnswer('female')}>여성</button>
        </div>
      )}
    </motion.section>
  );
}
