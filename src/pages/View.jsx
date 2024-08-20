import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';

import { db } from '../firebase';
import Emotion from '../components/Emotion';

function View({ onEmotion }) {
  const param = useParams();
  const [data, setData] = useState({});
  const [image, setImage] = useState(null);
  const [emotion, setEmotion] = useState(3);
  const [withDate, setWidthDate] = useState(null);

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
          withDate: dateString,
        });
        console.log(data);
      } else {
        console.log('No such document!');
      }
    } catch (error) {
      console.error('Error fetching document:', error);
    }
  };

  useEffect(() => {
    getDocument();
  }, []);

  return (
    <>
      {data && (
        <div className="view_wrap">
          <div className="content_nav">
            <Link to="/" className="icon_back">
              뒤로가기
            </Link>
            <span className="title">{data.title}</span>
          </div>

          <div className="write_wrap">
            <ul>
              <li>
                <div
                  className="l_inner blank_type"
                  style={{ backgroundImage: 'url(/img/sample_bg.jpg)' }}
                >
                  <span className="number">1</span>
                  <p className="title">구경하기 1</p>
                </div>
              </li>
            </ul>
          </div>

          <div className="view_group">
            <div className="flex_wrap">
              <h2 className="h3_type">함께한 날짜</h2>
              <div>{data.withDate}</div>
            </div>
          </div>

          <div className="view_group">
            <h2 className="h3_type">감정 상태</h2>
            <Emotion emotionId={data.emotionId} onEmotion={'none'} />
          </div>

          <div className="view_group">
            <h2 className="h3_type">기록</h2>
            <p>{data.contents}</p>
          </div>
        </div>
      )}
    </>
  );
}

export default View;
