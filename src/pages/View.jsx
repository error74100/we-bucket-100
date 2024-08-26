import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase';
import Emotion from '../components/Emotion';
import Comment from '../components/Comment';

function View() {
  const param = useParams();
  const [data, setData] = useState(null);
  const [isImg, setisImg] = useState(false);
  const [image, setImage] = useState(null);
  const [emotion, setEmotion] = useState(3);
  const [withDate, setWithDate] = useState(null);
  const nav = useNavigate();

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
        const data = docSnap.data();

        setData({
          ...docSnap.data(),
        });

        // setData(data);

        // 각 articles 배열의 title 필드를 참조된 문서의 데이터로 대체
        // const articlesWithTitleData = await Promise.all(
        //   data.contents.map(async (item) => {
        //     console.log(item);
        //     const titleDocSnap = await getDoc(item.uid); // title 필드가 DocumentReference인 경우
        //     if (titleDocSnap.exists()) {
        //       return {
        //         ...item,
        //         uid: titleDocSnap.data().nickName, // 참조된 문서의 title 필드 값으로 대체
        //       };
        //     } else {
        //       return item; // 참조된 문서가 없을 경우 원래 값 유지
        //     }
        //   })
        // );

        // setData({ ...data, item: articlesWithTitleData });

        setWithDate(dateString);
        // 필드 값이 문자열이고 길이가 1 이상인지 확인
        if (docSnap.data().attachment.length > 1) {
          setisImg(true);
        } else {
          setisImg(false);
        }
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

  const onEdit = () => {
    nav(`/edit/${param.docId}`);
  };

  return (
    <>
      {data && (
        <div className="view_wrap">
          <div className="content_nav">
            <Link to="/" className="icon_back">
              뒤로가기
            </Link>
            <span className="title">{data.title}</span>
            <button onClick={onEdit} className="btn_basic3">
              수정
            </button>
          </div>

          <div className="img_view_wrap">
            <ul>
              <li>
                {isImg === true ? (
                  <div
                    className="l_inner"
                    style={{ backgroundImage: `url(${data.attachment})` }}
                  >
                    <span className="number">{data.seq}</span>
                  </div>
                ) : (
                  <div
                    className="l_inner blank_type"
                    style={{ backgroundImage: 'url(/img/sample_bg.jpg)' }}
                  >
                    <span className="number">{data.seq}</span>
                  </div>
                )}
              </li>
            </ul>
          </div>

          <div className="view_group">
            <div className="flex_wrap">
              <h2 className="h3_type">함께한 날짜</h2>
              <div>{withDate}</div>
            </div>
          </div>

          <div className="view_group">
            <h2 className="h3_type">감정 상태</h2>
            <Emotion emotionId={data.emotionId} onEmotion={'none'} />
          </div>

          <div className="view_group">
            <h2 className="h3_type">기록</h2>

            <Comment commentData={data.comment} />
          </div>
        </div>
      )}
    </>
  );
}

export default View;
