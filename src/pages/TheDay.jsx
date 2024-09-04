import { useEffect, useRef } from 'react';
import { useState } from 'react';
import { calculateDate } from '../utill/calculateDate';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { db, storage } from '../firebase';

function TheDay() {
  const startDate = new Date('2024-01-01');
  const [daysPassed, setDaysPassed] = useState(0);
  const [progress, setProgress] = useState(0);
  const [isImageModify, setIsImageModify] = useState(false);
  const [image, setImage] = useState(null);
  const [newImage, setNewImage] = useState(null);
  const [photoUrl, setPhotoUrl] = useState('');
  const uploadRef = useRef(null);
  const todayRef = useRef(null);

  useEffect(() => {
    getThedaysDocument();

    // 현재 날짜와 기준일을 비교하여 며칠이 지났는지 계산
    const calculateDaysPassed = () => {
      const start = new Date(new Date('2024-01-01'));
      const today = new Date();
      const timeDifference = today - start; // 밀리초 단위 차이
      const daysDifference = Math.floor(timeDifference / (1000 * 60 * 60 * 24)); // 밀리초를 일 단위로 변환

      // 기준일을 1일로 계산.(+1)
      setDaysPassed(daysDifference + 1);
    };

    calculateDaysPassed();

    // 페이지 로드 후 '오늘' 영역으로 스크롤 이동.
    if (todayRef.current) {
      todayRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, []);

  useEffect(() => {
    const updateHeight = () => {
      document.documentElement.style.setProperty(
        '--vh',
        `${window.innerHeight * 0.01}px`
      );

      console.log(updateHeight);
    };

    updateHeight();
    window.addEventListener('resize', updateHeight);

    return () => {
      window.removeEventListener('resize', updateHeight);
    };
  }, []);

  const getThedaysDocument = async () => {
    const docRef = doc(db, 'thedays', 'img');

    try {
      const docSnap = await getDoc(docRef);

      // 문서가 존재하는지 확인
      if (docSnap.exists()) {
        setPhotoUrl(docSnap.data().photoURL);
      } else {
        console.log('No such document!');
      }
    } catch (error) {
      console.error('Error fetching document:', error);
    }
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

  const onImageCancle = () => {
    setIsImageModify((prev) => !prev);
    setNewImage(null);

    if (uploadRef.current) {
      uploadRef.current.value = '';
    }
  };

  const onImageSave = () => {
    if (confirm('저장 하시겠습니까?')) {
      setIsImageModify((prev) => !prev);

      handleUpload();
    } else {
      setIsImageModify((prev) => !prev);
      setNewImage(null);

      if (uploadRef.current) {
        uploadRef.current.value = '';
      }
    }
  };

  const handleUpload = () => {
    if (!image) return;

    const storageRef = ref(storage, `thedays/img/bg_img.jpg`);
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
          const docRef = doc(db, 'thedays', 'img'); // Firestore에서 업데이트할 문서 참조

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
      <div className="theday_wrap">
        <div
          className="inner"
          style={
            photoUrl.length > 0
              ? { backgroundImage: `url(${photoUrl})` }
              : { backgroundImage: '' }
          }
        >
          <p className="txt01">
            <b>Since</b>

            {calculateDate(startDate, 1)}
          </p>

          {daysPassed > 0 && <p className="txt02">{daysPassed}일</p>}
          <span className="upload_btn_wrap">
            <label htmlFor="file-upload" className="custom-file-upload">
              <i className="ico_com i_image_upload"></i>이미지 설정
            </label>
            {/* 이미지 파일 선택 input */}
            <input
              type="file"
              accept="image/*"
              id="file-upload"
              ref={uploadRef}
              onChange={handleImageChange}
            />

            {isImageModify ? (
              <>
                <button className="btn_basic1 xsmall" onClick={onImageCancle}>
                  <i className="ico_com i_cancle"></i>취소
                </button>

                <button className="btn_basic3 xsmall" onClick={onImageSave}>
                  <i className="ico_com i_save"></i>저장
                </button>
              </>
            ) : (
              ''
            )}
          </span>

          <div
            className="preview_wrap"
            style={newImage && { backgroundImage: `url(${newImage})` }}
          ></div>
        </div>

        <div className="heart type1"></div>
        <div className="heart type2"></div>
        <div className="heart type3"></div>
        <div className="heart type4"></div>
        <div className="heart type5"></div>
      </div>

      <div className="theday_cont_wrap">
        <div className="inner">
          <div className="group">
            <p className="tit">100일</p>
            <p>{calculateDate(startDate, 100)}</p>
          </div>
          <div className="group">
            <p className="tit">200일</p>
            <p>{calculateDate(startDate, 200)}</p>
          </div>
          <div className="group">
            <p className="tit point_type" ref={todayRef}>
              오늘
            </p>
            <p>{calculateDate(new Date(), 0)}</p>
          </div>
          <div className="group">
            <p className="tit">300일</p>
            <p>{calculateDate(startDate, 300)}</p>
          </div>
          <div className="group">
            <p className="tit">1주년</p>
            <p>{calculateDate(startDate, (365 + 2) * 1)}</p>
          </div>
          <div className="group">
            <p className="tit">400일</p>
            <p>{calculateDate(startDate, 400)}</p>
          </div>
          <div className="group">
            <p className="tit">500일</p>
            <p>{calculateDate(startDate, 500)}</p>
          </div>
          <div className="group">
            <p className="tit">600일</p>
            <p>{calculateDate(startDate, 600)}</p>
          </div>
          <div className="group">
            <p className="tit">700일</p>
            <p>{calculateDate(startDate, 700)}</p>
          </div>
          <div className="group">
            <p className="tit">2주년</p>
            <p>{calculateDate(startDate, (365 + 1) * 2)}</p>
          </div>
          <div className="group">
            <p className="tit">800일</p>
            <p>{calculateDate(startDate, 800)}</p>
          </div>
          <div className="group">
            <p className="tit">900일</p>
            <p>{calculateDate(startDate, 900)}</p>
          </div>
          <div className="group">
            <p className="tit">1000일</p>
            <p>{calculateDate(startDate, 1000)}</p>
          </div>
          <div className="group">
            <p className="tit">3주년</p>
            <p>{calculateDate(startDate, 1097)}</p>
          </div>
          <div className="group">
            <p className="tit">4주년</p>
            <p>{calculateDate(startDate, 1462)}</p>
          </div>
          <div className="group">
            <p className="tit">5주년</p>
            <p>{calculateDate(startDate, 1828)}</p>
          </div>
          <div className="group">
            <p className="tit">6주년</p>
            <p>{calculateDate(startDate, 2193)}</p>
          </div>
          <div className="group">
            <p className="tit">7주년</p>
            <p>{calculateDate(startDate, 2558)}</p>
          </div>
          <div className="group">
            <p className="tit">8주년</p>
            <p>{calculateDate(startDate, 2923)}</p>
          </div>
          <div className="group">
            <p className="tit">9주년</p>
            <p>{calculateDate(startDate, 3289)}</p>
          </div>
          <div className="group">
            <p className="tit">10주년</p>
            <p>{calculateDate(startDate, 3654)}</p>
          </div>
          <div className="group">
            <p className="tit">100주년</p>
            <p>{calculateDate(startDate, 36525)}</p>
          </div>
        </div>
      </div>

      <div className="theday_gap"></div>

      {progress > 0 ? (
        <div className="loading_bar">
          <progress value={progress} max="100" />
        </div>
      ) : (
        ''
      )}
    </>
  );
}

export default TheDay;
