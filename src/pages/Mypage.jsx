import { useEffect, useState } from 'react';
import { getAuth } from 'firebase/auth';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { db, storage } from '../firebase';
import { useNavigate } from 'react-router-dom';

function Mypage({ user }) {
  const [isNicknameModify, setIsNicknameModify] = useState(false);
  const [nickname, setNickname] = useState('');
  const [newNickname, setNewNickname] = useState('');
  const [progress, setProgress] = useState(0);
  const [isImageModify, setIsImageModify] = useState(false);
  const [image, setImage] = useState(null);
  const [newImage, setNewImage] = useState(null);
  const [photoUrl, setPhotoUrl] = useState('');
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
        setPhotoUrl(docSnap.data().photoURL);
      } else {
        console.log('No such document!');
      }
    } catch (error) {
      console.error('Error fetching document:', error);
    }
  };

  const onNickname = (e) => {
    setIsNicknameModify((prev) => !prev);
    setNewNickname(nickname);
  };

  const onNicknameChange = (e) => {
    setNewNickname(e.target.value);
  };

  const onNicknameSave = () => {
    if (confirm('저장 하시겠습니까?')) {
      setIsNicknameModify((prev) => !prev);
      setNickname(newNickname);

      updateUserData(user.uid, newNickname);
    } else {
      setIsNicknameModify((prev) => !prev);
    }
  };

  const onNicknameCancle = () => {
    setIsNicknameModify((prev) => !prev);
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

  const onImageSave = () => {
    if (confirm('저장 하시겠습니까?')) {
      setIsImageModify((prev) => !prev);

      handleUpload();
    } else {
      setIsImageModify((prev) => !prev);
      setNewImage(null);
    }
  };

  const onImageCancle = () => {
    setNewImage(null);
    setIsImageModify((prev) => !prev);
  };

  // 이미지 파일 선택 시 실행되는 함수
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    const maxSizeInMB = 5;
    const maxSizeInBytes = maxSizeInMB * 1024 * 1024;

    if (file.size > maxSizeInBytes) {
      alert('5MB 이하로 올려주세요.');
      e.target.value = ''; // 파일 input을 초기화하여 업로드를 막음
    } else {
      if (file) {
        const reader = new FileReader();
        reader.onloadend = () => {
          setNewImage(reader.result); // 이미지 미리보기를 위해 상태로 저장
        };
        reader.readAsDataURL(file); // 파일을 base64 URL로 변환
        setImage(e.target.files[0]);
        setIsImageModify(true);
      }
    }
  };

  const handleUpload = () => {
    if (!image) return;

    const storageRef = ref(storage, `users/${user.uid}/profile_img.jpg`);
    const uploadTask = uploadBytesResumable(storageRef, image);

    uploadTask.on(
      'state_changed',
      (snapshot) => {
        // 업로드 진행률 업데이트
        const progress = Math.round(
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100
        );
        setProgress(progress);
      },
      (error) => {
        console.error('Upload failed:', error);
      },
      async () => {
        // 업로드 완료 후 이미지 URL 가져오기
        try {
          const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);

          // Firestore의 해당 문서 필드에 이미지 URL 저장
          const docRef = doc(db, 'users', user.uid); // Firestore에서 업데이트할 문서 참조

          await updateDoc(docRef, {
            photoURL: downloadURL, // 필드에 이미지 URL 저장
          });
          // 추가 작업이 있다면 여기서 호출
          alert('저장 되었습니다.');
          location.reload();
        } catch (error) {
          console.error('Error saving image URL to Firestore: ', error);
        }
      }
    );
  };

  return (
    <>
      {user && (
        <div className="mypage_wrap">
          <h1 className="h2_type tc">Mypage</h1>

          <div className="mypage_inner">
            <div className="img_wrap">
              {/* 기본사진 & 업로드 사진 미리보기 */}
              {photoUrl && newImage === null ? (
                <span
                  className="img"
                  style={
                    photoUrl.length > 0
                      ? { backgroundImage: `url(${photoUrl})` }
                      : { backgroundImage: `url(${user.photoURL})` }
                  }
                ></span>
              ) : (
                <span
                  className="img"
                  style={{ backgroundImage: `url(${newImage})` }}
                >
                  업로드 사진 미리보기
                </span>
              )}

              {isImageModify ? (
                <p>
                  <button className="btn_basic1 xsmall" onClick={onImageCancle}>
                    <i className="ico_com i_cancle"></i>취소
                  </button>
                  <button className="btn_basic3 xsmall" onClick={onImageSave}>
                    <i className="ico_com i_save"></i>저장
                  </button>
                </p>
              ) : (
                <p>
                  <label htmlFor="file-upload" className="custom-file-upload">
                    <i className="ico_com i_setting"></i>이미지 설정
                  </label>
                  {/* 이미지 파일 선택 input */}
                  <input
                    type="file"
                    accept="image/*"
                    id="file-upload"
                    onChange={handleImageChange}
                  />
                </p>
              )}
            </div>

            <ul>
              <li>
                <span className="title">이름</span>
                <span className="cont">
                  <span className="inner_group">{user.displayName}</span>
                </span>
              </li>
              <li>
                <span className="title">닉네임</span>

                {isNicknameModify ? (
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
                        <i className="ico_com i_cancle"></i>취소
                      </button>
                      <button
                        className="btn_basic2 xsmall"
                        onClick={onNicknameSave}
                      >
                        <i className="ico_com i_save"></i>저장
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
                        <i className="ico_com i_setting"></i>닉네임 설정
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

          {progress > 0 ? (
            <div className="loading_bar">
              <progress value={progress} max="100" />
            </div>
          ) : (
            ''
          )}
        </div>
      )}
    </>
  );
}

export default Mypage;
