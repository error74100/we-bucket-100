import { useNavigate } from 'react-router-dom';
import { auth } from '../firebase';
import { signInWithPopup, GoogleAuthProvider } from 'firebase/auth';

function Login() {
  const nav = useNavigate();
  const provider = new GoogleAuthProvider();

  const googleLogin = () =>
    signInWithPopup(auth, provider)
      .then((result) => {
        const credential = GoogleAuthProvider.credentialFromResult(result);
        const token = credential.accessToken;
        const user = result.user;

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
