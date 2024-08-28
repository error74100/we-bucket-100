import { useEffect, useRef, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { arrayUnion, doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase';
import Emotion from '../components/Emotion';
import Comment from '../components/Comment';

function View({ user }) {
  const param = useParams();
  const [data, setData] = useState(null);
  const [isImg, setisImg] = useState(false);
  const [withDate, setWithDate] = useState(null);
  const [comment, setComment] = useState('');
  const commentRef = useRef();
  const [isChange, setIsChange] = useState(false);
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

  const onComment = (e) => {
    setComment(e.target.value);
  };

  const onCommentWrite = (e) => {
    if (commentRef.current.value.length > 0) {
      saveComment();
      setComment('');
      alert('기록이 등록 되었습니다.');
    } else {
      alert('기록을 작성해주세요.');
      commentRef.current.focus();
    }
  };

  const saveComment = async () => {
    const postRef = doc(db, 'posts', param.docId);

    const newComment = {
      uid: user.uid,
      content: comment,
      date: new Date(),
    };

    try {
      await updateDoc(postRef, {
        comment: arrayUnion(newComment),
      });

      setIsChange(true);
      location.reload();
    } catch (error) {
      console.error('Error saving image URL to Firestore: ', error);
    }
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
              <i className="ico_com i_modify"></i>수정
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

            <Comment user={user} commentData={data.comment} />

            <div className="comment_write_box">
              <textarea
                value={comment}
                ref={commentRef}
                onChange={onComment}
                placeholder="기록..."
              ></textarea>

              <button
                type="text"
                className="comment_write_btn"
                onClick={onCommentWrite}
              >
                등록
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default View;
