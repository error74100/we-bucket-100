import { Link, useNavigate, useParams } from 'react-router-dom';
import { useEffect, useRef, useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import ko from 'date-fns/locale/ko';
import Emotion from '../components/Emotion';
import { arrayUnion, doc, getDoc, updateDoc } from 'firebase/firestore';
import { db, storage } from '../firebase';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import Comment from '../components/Comment';

function Edit({ user }) {
  const param = useParams();
  const [data, setData] = useState({});
  const [title, setTitle] = useState('');
  const [previewImage, setPreviewImage] = useState(null);
  const [image, setImage] = useState(null);
  const [dataComment, setDataComment] = useState('');
  const [saveImage, setSaveImage] = useState('');
  const [progress, setProgress] = useState(0);
  const [startDate, setStartDate] = useState(null);
  const [isImg, setisImg] = useState(false);
  const [url, setUrl] = useState('');
  const [comment, setComment] = useState('');
  const commentRef = useRef();
  const [isChange, setIsChange] = useState(false);
  const nav = useNavigate();

  useEffect(() => {
    getDocument();
    setIsChange(false);
  }, [isChange]);

  const getDocument = async () => {
    const docRef = doc(db, 'posts', param.docId);

    try {
      // 문서 데이터를 가져옴
      const docSnap = await getDoc(docRef);
      const timestamp = docSnap.data().withDate;
      const day = timestamp.toDate();
      // 문서가 존재하는지 확인
      if (docSnap.exists()) {
        setData({
          ...docSnap.data(),
        });
        setTitle(docSnap.data().title);
        setStartDate(day);
        setDataComment(docSnap.data().comment);
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

  const updatePostData = async () => {
    const postRef = doc(db, 'posts', param.docId);

    const newComment = {
      uid: user.uid,
      content: comment,
      date: new Date(),
    };

    if (!image) {
      // 변경 이미지 없을 때.
      try {
        await updateDoc(postRef, {
          title: title,
          attachment: data.attachment,
          withDate: startDate,
          emotionId: data.emotionId,
          contents: data.contents,
          // comment: arrayUnion(newComment),
          isComplete: isImg,
        });
        if (image === null) {
          alert('저장 되었습니다.');
          nav(`/view/${param.docId}`, { replace: true });
        }
      } catch (error) {
        console.error('Error saving image URL to Firestore: ', error);
      }
    } else {
      // 변경 이미지 있을 때.
      try {
        await updateDoc(postRef, {
          title: title,
          withDate: startDate,
          emotionId: data.emotionId,
          contents: data.contents,
          // comment: arrayUnion(newComment),
          isComplete: isImg,
        });
        if (image === null) {
          alert('저장 되었습니다.');
          nav(`/view/${param.docId}`, { replace: true });
        }
      } catch (error) {
        console.error('Error saving image URL to Firestore: ', error);
      }
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
    } catch (error) {
      console.error('Error saving image URL to Firestore: ', error);
    }
  };

  const onTitle = (e) => {
    setTitle(e.target.value);
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
          setPreviewImage(reader.result); // 이미지 미리보기를 위해 상태로 저장
        };
        reader.readAsDataURL(file); // 파일을 base64 URL로 변환
        setImage(e.target.files[0]);
      }
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
          // Firestore의 해당 문서 필드에 이미지 URL 저장
          const docRef = doc(db, 'posts', param.docId); // Firestore에서 업데이트할 문서 참조
          await updateDoc(docRef, {
            attachment: downloadURL, // 필드에 이미지 URL 저장
            isComplete: true,
          });
          // 추가 작업이 있다면 여기서 호출
          alert('저장 되었습니다.');
          nav(`/view/${param.docId}`, { replace: true });
        } catch (error) {
          console.error('Error saving image URL to Firestore: ', error);
        }
      }
    );
  };

  const onDeleteImage = () => {
    if (confirm('이미지를 삭제 하시겠습니까? (삭제 후 복구 불가능)')) {
      const fileInput = document.getElementById('file-upload');

      data.attachment = '';
      setisImg(false);
    }
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
        <div className="edit_wrap">
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
                {isImg === true ? (
                  <div
                    className="l_inner"
                    style={{ backgroundImage: `url(${data.attachment})` }}
                  >
                    <span className="number">{data.seq}</span>
                    <span className="close_btn" onClick={onDeleteImage}>
                      이미지 삭제하기
                    </span>
                  </div>
                ) : (
                  <div
                    className="l_inner blank_type"
                    style={{ backgroundImage: 'url(/img/sample_bg.jpg)' }}
                  >
                    <span className="number">{data.seq}</span>
                  </div>
                )}

                {/* 업로드 사진 미리보기 */}
                {previewImage && (
                  <div
                    className="l_inner preview_type"
                    style={{ backgroundImage: `url(${previewImage})` }}
                  >
                    <span className="number">{data.seq}</span>
                  </div>
                )}

                <div className="upload_wrap">
                  <label htmlFor="file-upload" className="custom-file-upload">
                    파일 선택
                  </label>
                  {/* 이미지 파일 선택 input */}
                  <input
                    type="file"
                    accept="image/*"
                    id="file-upload"
                    onChange={handleImageChange}
                  />
                </div>
              </li>
            </ul>
          </div>

          <div className="view_group">
            <div className="flex_wrap">
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
          </div>

          <div className="view_group">
            <h2 className="h3_type">감정 상태</h2>
            <Emotion emotionId={data.emotionId} onEmotion={onEmotion} />
          </div>

          <div className="view_group">
            <h2 className="h3_type">기록</h2>

            <Comment user={user} commentData={dataComment} />

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

          {progress > 0 ? (
            <div className="loading_bar">
              <progress value={progress} max="100" />
            </div>
          ) : (
            ''
          )}
        </div>
      )}
    </div>
  );
}

export default Edit;
