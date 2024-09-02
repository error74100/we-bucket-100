import { useEffect, useRef, useState } from 'react';
import { arrayUnion, doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { useNavigate, useParams } from 'react-router-dom';

function CommentItem({ item, user, index }) {
  const [data, setData] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [comment, setComment] = useState('');
  const [newComment, setNewComment] = useState('');
  const [date, setDate] = useState(null);
  const commentRef = useRef();
  const param = useParams();
  const nav = useNavigate();

  useEffect(() => {
    getUserInfo();
  }, []);

  const getUserInfo = async () => {
    const docRef = doc(db, 'users', item.uid);
    const docSnap = await getDoc(docRef);

    const timestamp = item.date;
    const day = timestamp.toDate();
    let year = day.getFullYear();
    let month = ('0' + (day.getMonth() + 1)).slice(-2);
    let days = ('0' + day.getDate()).slice(-2);

    let hour = ('0' + day.getHours()).slice(-2);
    let minute = ('0' + day.getMinutes()).slice(-2);
    let dateString =
      year + '.' + month + '.' + days + '. ' + hour + ':' + minute;

    if (docSnap.exists()) {
      setData({
        ...docSnap.data(),
      });

      setDate(dateString);
    } else {
      console.log('No such document!');
    }
  };

  const fetchCommentUpdate = async () => {
    const postRef = doc(db, 'posts', param.docId);
    const docSnap = await getDoc(postRef);

    if (!docSnap.exists) {
      console.log('No such document!');
      return;
    }

    const comments = docSnap.data().comment;

    // 배열 안의 맵 요소 수정
    const updatedComments = comments.map((comment, idx) => {
      if (index === idx) {
        return { ...comment, content: newComment }; // text 값 수정
      }
      return comment;
    });

    await updateDoc(postRef, {
      comment: updatedComments,
    });

    location.reload();
  };

  const fetchCommentDelete = async () => {
    const postRef = doc(db, 'posts', param.docId);
    const docSnap = await getDoc(postRef);

    if (!docSnap.exists) {
      console.log('No such document!');
      return;
    }

    const comments = docSnap.data().comment;

    // 배열 안의 맵 요소 삭제
    const updatedComments = comments.filter((_, idx) => idx !== index);

    await updateDoc(postRef, {
      comment: updatedComments,
    });

    location.reload();
  };

  const onComment = (e) => {
    setNewComment(e.target.value);
  };

  const onCommentEdit = () => {
    setEditMode(true);
    setComment(item.content);
    setNewComment(item.content);
  };

  const onCommentSave = () => {
    setEditMode(false);
    fetchCommentUpdate();
    alert('기록수정이 완료 되었습니다.');
  };

  const onCommentDelete = () => {
    if (confirm('기록을 삭제 하시겠습니까?')) {
      fetchCommentDelete();
      alert('삭제 되었습니다.');
    }
  };

  const onCommentCancle = () => {
    setEditMode(false);
    setComment(item.content);
    setNewComment(item.content);
  };

  return (
    <>
      {data && (
        <div className="group" id={index}>
          <span
            className="img"
            style={
              data.photoURL.length > 0
                ? { backgroundImage: `url(${data.photoURL})` }
                : { backgroundImage: `url(${user.photoURL})` }
            }
          >
            profile image
          </span>
          <div className="cont">
            <p className="name">
              {data.nickName ? data.nickName : data.displayName}
            </p>

            {editMode === true ? (
              <p className="comment">
                <textarea
                  value={newComment}
                  ref={commentRef}
                  onChange={onComment}
                  placeholder="기록..."
                  className="type2"
                ></textarea>
              </p>
            ) : (
              <>
                <p className="comment">{item.content}</p>
                <p className="date">{date}</p>
              </>
            )}

            {user.uid === data.uid ? (
              <p className="btn_wrap">
                {editMode === false ? (
                  <button className="btn_basic3 xsmall" onClick={onCommentEdit}>
                    <i className="ico_com i_modify"></i>수정
                  </button>
                ) : (
                  <>
                    <button
                      className="btn_basic3 xsmall"
                      onClick={onCommentSave}
                    >
                      <i className="ico_com i_save"></i>저장
                    </button>
                    <button
                      className="btn_basic1 xsmall"
                      onClick={onCommentCancle}
                    >
                      <i className="ico_com i_cancle"></i>취소
                    </button>
                  </>
                )}

                <button className="btn_basic2 xsmall" onClick={onCommentDelete}>
                  <i className="ico_com i_delete"></i>삭제
                </button>
              </p>
            ) : (
              ''
            )}
          </div>
        </div>
      )}
    </>
  );
}

export default CommentItem;
