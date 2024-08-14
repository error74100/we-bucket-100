import { useState } from 'react';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { storage } from '../firebase';

function Mypage({ user }) {
  const [image, setImage] = useState(null);
  const [url, setUrl] = useState('');
  const [progress, setProgress] = useState(0);

  const handleImageChange = (e) => {
    if (e.target.files[0]) {
      setImage(e.target.files[0]);
    }
  };

  const handleUpload = () => {
    if (!image) return;

    const storageRef = ref(storage, `avatar/${user.uid}/avatar_img.jpg`);
    const uploadTask = uploadBytesResumable(storageRef, image);

    uploadTask.on(
      'state_changed',
      (snapshot) => {
        // 업로드 진행률 업데이트
        const progress = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
        setProgress(progress);
      },
      (error) => {
        console.error('Upload failed:', error);
      },
      () => {
        // 업로드 완료 후 이미지 URL 가져오기
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          setUrl(downloadURL);
        });
      }
    );
  };

  return (
    <>
      {user && (
        <>
          <div>Mypage</div>

          <div>
            <progress value={progress} max="100" />
            <br />
            <input type="file" onChange={handleImageChange} />
            <button onClick={handleUpload}>Upload</button>
            <br />
            {url && <img src={url} alt="Uploaded" style={{ width: '300px' }} />}
          </div>

          <div>
            <p>이미지 :</p>
          </div>
          <div>이름 : {user.displayName}</div>
          <div>mail : {user.email}</div>
        </>
      )}
    </>
  );
}

export default Mypage;
