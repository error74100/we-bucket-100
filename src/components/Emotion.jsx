import EmotionItem from './EmotionItem';

function Emotion({ emotionId, onEmotion }) {
  return (
    <div className="emotion_item">
      <div className="emotion_container">
        {Array(5)
          .fill(null)
          .map((item, index) =>
            index === emotionId - 1 ? (
              <EmotionItem key={index} item={item} emotionId={index + 1} onEmotion={onEmotion} active={true} />
            ) : (
              <EmotionItem key={index} item={item} emotionId={index + 1} onEmotion={onEmotion} />
            )
          )}
      </div>
    </div>
  );
}

export default Emotion;
