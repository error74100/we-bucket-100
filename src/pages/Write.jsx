import { Link, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import ko from 'date-fns/locale/ko';
import Emotion from '../components/Emotion';
import { collection, doc, setDoc, getDocs } from 'firebase/firestore';
import { db } from '../firebase';

function Write() {
  const [title, setTitle] = useState('');
  const [emotion, setEmotion] = useState(3);
  const [startDate, setStartDate] = useState(new Date());
  const [maxSeq, setMaxSeq] = useState(0);
  const nav = useNavigate();

  useEffect(() => {
    getPostsCount();
  }, []);

  const getPostsCount = async () => {
    let totalDocs;

    try {
      const querySnapshot = await getDocs(collection(db, 'posts'));
      totalDocs = querySnapshot.size;
      setMaxSeq(totalDocs);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const onTitle = (e) => {
    setTitle(e.target.value);
  };

  const writePostData = async () => {
    const currentTime = new Date();
    await setDoc(doc(db, 'posts', `doc-${maxSeq + 1}`), {
      seq: maxSeq + 1,
      title: title,
      attachment: '',
      withDate: startDate,
      emotionId: emotion,
      date: currentTime,
      isComplete: false,
    });
  };

  const onEmotion = (emotion) => {
    if (emotion === undefined) {
      setEmotion(emotion);
    } else {
      setEmotion(emotion);
    }
  };

  const onSave = (e) => {
    if (confirm('저장 하시겠습니까?')) {
      onEmotion();
      writePostData();

      alert('저장 되었습니다.');
      nav('/', { replace: true });
    }
  };

  return (
    <div className="write_wrap">
      <div className="content_nav">
        <Link to="/" className="icon_back">
          뒤로가기
        </Link>
        <span className="title">
          <input
            type="text"
            value={title}
            onChange={onTitle}
            placeholder="제목..."
          />
        </span>

        <button onClick={onSave} className="btn_basic2">
          저장
        </button>
      </div>

      <div className="img_view_wrap">
        <ul>
          <li>
            <div
              className="l_inner blank_type"
              style={{ backgroundImage: 'url(/img/sample_bg.jpg)' }}
            >
              <span className="number">{maxSeq + 1}</span>
            </div>
          </li>
        </ul>
      </div>

      <div className="view_group">
        <h2 className="h3_type">함께한 날짜</h2>
        <DatePicker
          locale={ko}
          selected={startDate}
          onChange={(date) => setStartDate(date)}
          dateFormat="yyyy년 MM월 dd일"
        />
      </div>

      <div className="view_group">
        <h2 className="h3_type">감정 상태</h2>

        <Emotion emotionId={emotion} onEmotion={onEmotion} />
      </div>
    </div>
  );
}

export default Write;
