import { useEffect, useState } from 'react';

function EmotionItem({ emotionId, active, onEmotion }) {
  const [emotionTxt, setEmotionTxt] = useState('');

  useEffect(() => {
    getEmotionTxt();
  }, []);

  const getEmotionTxt = () => {
    if (emotionId === 1) {
      setEmotionTxt('매우 나쁨');
    } else if (emotionId === 2) {
      setEmotionTxt('나쁨');
    } else if (emotionId === 3) {
      setEmotionTxt('보통');
    } else if (emotionId === 4) {
      setEmotionTxt('좋음');
    } else {
      setEmotionTxt('매우 좋음');
    }
  };

  return (
    <div className="emotion-box">
      <label>
        <input
          type="radio"
          name="emotionGroup"
          value={emotionId}
          checked={active ? active : false}
          onChange={() => {
            onEmotion !== 'none' ? onEmotion(emotionId) : '';
          }}
        />
        <img src="https://via.placeholder.com/150" alt={emotionTxt} />
        <span>{emotionTxt}</span>
      </label>
    </div>
  );
}

export default EmotionItem;
