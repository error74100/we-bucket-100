import { useNavigate } from 'react-router-dom';
import { getAuth, signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
// import { db } from '../firebase';
import { useState } from 'react';

function Login() {
  const nav = useNavigate();
  const provider = new GoogleAuthProvider();
  const [uid, setUid] = useState('');
  const [photoURL, setPhotoURL] = useState('');
  const auth = getAuth();

  const googleLogin = () =>
    signInWithPopup(auth, provider)
      .then((result) => {
        const credential = GoogleAuthProvider.credentialFromResult(result);
        const token = credential.accessToken;
        const user = result.user;

        // 준비중
        // addUserInfo();

        alert('로그인 되었습니다.');
        nav('/');
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        const email = error.customData.email;
        const credential = GoogleAuthProvider.credentialFromError(error);

        console.log(errorCode);
        console.log(errorMessage);
        console.log(email);
        console.log(credential);
      });

  // Add a new document with a generated id.
  // const addUserInfo = async () => {
  //   const cityRef = doc(db, 'users', 'BJ');

  //   setUid();

  //   setDoc(
  //     cityRef,
  //     {
  //       uid: 'uid..',
  //       displayName: 'dis_name',
  //       profileURL: '',
  //     },
  //     { merge: true }
  //   );
  // };

  const onGoogleLogin = () => {
    googleLogin();
  };

  return (
    <div className="logout_wrap">
      <h1 className="h2_type">로그인 후 사용 가능합니다.</h1>

      <button onClick={onGoogleLogin} className="btn_basic2 round">
        Google Login
      </button>
    </div>
  );
}

export default Login;
