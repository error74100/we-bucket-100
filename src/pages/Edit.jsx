import { Link, useNavigate, useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import ko from 'date-fns/locale/ko';
import Emotion from '../components/Emotion';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db, storage } from '../firebase';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';

function Edit() {
  const param = useParams();
  const [data, setData] = useState({});
  const [title, setTitle] = useState('');
  const [previewImage, setPreviewImage] = useState(null);
  const [image, setImage] = useState(null);
  const [progress, setProgress] = useState(0);
  const [startDate, setStartDate] = useState(null);
  const [isImg, setisImg] = useState(false);
  const [url, setUrl] = useState('');
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

        // 필드 값이 문자열이고 길이가 1 이상인지 확인
        if (docSnap.data().attachment.length > 1) {
          console.log(
            'String field is valid:',
            docSnap.data().attachment.length
          );
          setisImg(true);
        } else {
          console.log('String field is invalid or too short.');
          setisImg(false);
        }
      } else {
        console.log('No such document!');
      }
    } catch (error) {
      console.error('Error fetching document:', error);
    }
  };

  const updatePostData = async () => {
    const postRef = doc(db, 'posts', param.docId);

    console.log('url= ' + url);

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
  const handleImageChange = (e) => {
    const file = e.target.files[0];

    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result); // 이미지 미리보기를 위해 상태로 저장
      };
      reader.readAsDataURL(file); // 파일을 base64 URL로 변환
      setImage(e.target.files[0]);
    }
  };

  const onEmotion = (emotion) => {
    setData({
      ...data,
      emotionId: emotion,
    });
  };

  const handleUpload = () => {
    if (!image) return;

    const storageRef = ref(storage, `posts/${param.docId}/attachment_img.jpg`);
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
          setUrl(downloadURL); // 상태에 URL 저장
          console.log('Download URL: ', downloadURL);

          // Firestore의 해당 문서 필드에 이미지 URL 저장
          const docRef = doc(db, 'posts', param.docId); // Firestore에서 업데이트할 문서 참조

          await updateDoc(docRef, {
            attachment: downloadURL, // 필드에 이미지 URL 저장
          });

          // 추가 작업이 있다면 여기서 호출
          alert('저장 되었습니다.');
          nav('/', { replace: true });
        } catch (error) {
          console.error('Error saving image URL to Firestore: ', error);
        }
      }
    );
  };

  const onSave = (e) => {
    if (confirm('저장 하시겠습니까?')) {
      onEmotion();
      handleUpload();
      updatePostData();
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

          <div className="write_wrap">
            <ul>
              <li>
                {/* <div className="l_inner" style={{ backgroundImage: 'url(/img/sample_bg.jpg)' }}> */}

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
            <h2 className="h3_type">사진</h2>

            <div>
              {/* 이미지 파일 선택 input */}
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
              />

              {/* 이미지 미리보기 */}
              {previewImage && (
                <div>
                  <p>
                    <img
                      src={previewImage}
                      alt="미리보기"
                      style={{
                        width: '300px',
                        height: '300px',
                        objectFit: 'cover',
                      }}
                    />
                  </p>
                  <p>[미리보기]</p>
                </div>
              )}
            </div>
          </div>

          <div className="view_group">
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

          <div className="view_group">
            <h2 className="h3_type">감정 상태 / {data.emotionId}</h2>
            <Emotion emotionId={data.emotionId} onEmotion={onEmotion} />
          </div>

          <div className="view_group">
            <h2 className="h3_type">내용</h2>
            <textarea
              value={data.contents}
              onChange={onContent}
              rows="5"
              placeholder="내용..."
            ></textarea>
          </div>

          {progress > 0 ? (
            <div className="loading_bar">
              <progress value={progress} max="100" />
            </div>
          ) : (
            ''
          )}
        </>
      )}
    </div>
  );
}

export default Edit;
