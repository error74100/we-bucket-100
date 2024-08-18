import { Link, useNavigate, useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import ko from 'date-fns/locale/ko';
import Emotion from '../components/Emotion';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase';

function Edit() {
  const param = useParams();
  const [data, setData] = useState({});
  const [title, setTitle] = useState('');
  const [image, setImage] = useState(null);
  const [progress, setProgress] = useState(0);
  const [startDate, setStartDate] = useState(null);
  const nav = useNavigate();

  useEffect(() => {
    getDocument();
  }, []);

  const getDocument = async () => {
    const docRef = doc(db, 'posts', param.docId);

    try {
      // 문서 데이터를 가져옴
      const docSnap = await getDoc(docRef);
      const timestamp = docSnap.data().withDate;
      const day = timestamp.toDate();

      let year = day.getFullYear();
      let month = ('0' + (day.getMonth() + 1)).slice(-2);
      let days = ('0' + day.getDate()).slice(-2);
      let dateString = year + '-' + month + '-' + days;

      // 문서가 존재하는지 확인
      if (docSnap.exists()) {
        setData({
          ...docSnap.data(),
        });
        setTitle(docSnap.data().title);
        setStartDate(day);
      } else {
        console.log('No such document!');
      }
    } catch (error) {
      console.error('Error fetching document:', error);
    }
  };

  const updatePostData = async () => {
    const postRef = doc(db, 'posts', param.docId);

    await updateDoc(postRef, {
      title: title,
      // attachment: '',
      withDate: startDate,
      emotionId: data.emotionId,
      contents: data.contents,
      // isComplete: false
    });
  };

  const onTitle = (e) => {
    setTitle(e.target.value);
  };

  const onContent = (e) => {
    setData({
      ...data,
      contents: e.target.value,
    });
  };

  // 이미지 파일 선택 시 실행되는 함수
  const handleImageChange = (event) => {
    const file = event.target.files[0];

    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result); // 이미지 미리보기를 위해 상태로 저장
      };
      reader.readAsDataURL(file); // 파일을 base64 URL로 변환
    }
  };

  const onEmotion = (emotion) => {
    setData({
      ...data,
      emotionId: emotion,
    });
  };

  const onSave = (e) => {
    if (confirm('저장 하시겠습니까?')) {
      onEmotion();
      updatePostData();

      alert('저장 되었습니다.');
      nav('/', { replace: true });
    }
  };

  return (
    <div>
      {data && (
        <>
          <div className="content_nav">
            <Link to="/" className="icon_back">
              뒤로가기
            </Link>
            <span className="title">
              <input type="text" value={title} onChange={onTitle} placeholder="제목..." />
            </span>

            <button onClick={onSave}>저장</button>
          </div>

          <div className="write_wrap">
            <ul>
              <li>
                <div className="l_inner" style={{ backgroundImage: 'url(/img/sample_bg.jpg)' }}>
                  <span className="number">1</span>
                  <p className="title">구경하기 1</p>
                </div>
              </li>
            </ul>
          </div>

          <div>
            <h2 className="h3_type">사진</h2>
            <div>
              <progress value={progress} max="100" />
              <br />
              {/* 이미지 파일 선택 input */}
              <input type="file" accept="image/*" onChange={handleImageChange} />

              {/* 이미지 미리보기 */}
              {image && (
                <div>
                  <img src={image} alt="미리보기" style={{ width: '300px', height: '300px', objectFit: 'cover' }} />
                </div>
              )}
            </div>
          </div>

          <div>
            <h2 className="h3_type">함께한 날짜</h2>
            <DatePicker
              locale={ko}
              selected={startDate}
              onChange={(date) => {
                setStartDate(date);
              }}
              dateFormat="yyyy년 MM월 dd일"
            />
          </div>

          <div>
            <h2 className="h3_type">감정 상태 / {data.emotionId}</h2>
            <Emotion emotionId={data.emotionId} onEmotion={onEmotion} />
          </div>
          <div>
            <h2 className="h3_type">내용</h2>
            <textarea value={data.contents} onChange={onContent} rows="4" cols="50" placeholder="내용..."></textarea>
          </div>
        </>
      )}
    </div>
  );
}

export default Edit;
