import { useEffect, useState } from 'react';
import { getAuth } from 'firebase/auth';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { useNavigate } from 'react-router-dom';

function Mypage({ user }) {
  const [isModify, setIsModify] = useState(false);
  const [nickname, setNickname] = useState('');
  const [newNickname, setNewNickname] = useState('');
  const nav = useNavigate();
  const auth = getAuth();

  useEffect(() => {
    getUserDocument(user.uid);
  }, []);

  const getUserDocument = async (uid) => {
    const docRef = doc(db, 'users', uid);

    try {
      const docSnap = await getDoc(docRef);

      // 문서가 존재하는지 확인
      if (docSnap.exists()) {
        setNickname(docSnap.data().nickName);
      } else {
        console.log('No such document!');
      }
    } catch (error) {
      console.error('Error fetching document:', error);
    }
  };

  const onNickname = (e) => {
    setIsModify((prev) => !prev);
    setNewNickname(nickname);
  };

  const onNicknameChange = (e) => {
    setNewNickname(e.target.value);
  };

  const onNicknameSave = () => {
    if (confirm('저장 하시겠습니까?')) {
      setIsModify((prev) => !prev);
      setNickname(newNickname);

      updateUserData(user.uid, newNickname);
    } else {
      setIsModify((prev) => !prev);
    }
  };

  const onNicknameCancle = () => {
    setIsModify((prev) => !prev);
  };

  const updateUserData = async (uid, newNickname) => {
    const postRef = doc(db, 'users', uid);

    try {
      await updateDoc(postRef, {
        nickName: newNickname,
      });

      alert('저장 되었습니다.');
      nav('/mypage');
    } catch (error) {
      console.error('Error saving image URL to Firestore: ', error);
    }
  };

  return (
    <>
      {user && (
        <div className="mypage_wrap">
          <h1 className="h2_type tc">Mypage</h1>

          <div className="mypage_inner">
            <span
              className="img"
              style={{ backgroundImage: `url(${user.photoURL})` }}
            ></span>

            <ul>
              <li>
                <span className="title">이름</span>
                <span className="cont">
                  <span className="inner_group">{user.displayName}</span>
                </span>
              </li>
              <li>
                <span className="title">닉네임</span>

                {isModify ? (
                  <span className="cont">
                    <span className="inner_group">
                      <input
                        type="text"
                        value={newNickname}
                        onChange={onNicknameChange}
                      />
                      <button
                        className="btn_basic1 xsmall"
                        onClick={onNicknameCancle}
                      >
                        취소
                      </button>
                      <button
                        className="btn_basic2 xsmall"
                        onClick={onNicknameSave}
                      >
                        저장
                      </button>
                    </span>
                  </span>
                ) : (
                  <span className="cont">
                    <span className="inner_group">
                      {nickname}
                      <button
                        className="btn_basic2 xsmall"
                        onClick={onNickname}
                      >
                        닉네임 설정
                      </button>
                    </span>
                  </span>
                )}
              </li>
              <li>
                <span className="title">이메일</span>
                <span className="cont">
                  <span className="inner_group">{user.email}</span>
                </span>
              </li>
            </ul>
          </div>
        </div>
      )}
    </>
  );
}

export default Mypage;
