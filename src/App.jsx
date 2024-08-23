import { useEffect, useState } from 'react';
import './assets/css/common.css';
import './App.css';
import { Route, Routes, useNavigate } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import Write from './pages/Write';
import Header from './components/Header';
import { getAuth, onAuthStateChanged, signOut } from 'firebase/auth';
import Mypage from './pages/Mypage';
import View from './pages/View';
import Edit from './pages/Edit';
import NotFoundPage from './pages/NotFoundPage';
import LoginCheck from './pages/LoginCheck';
import Footer from './components/Footer';

function App() {
  const [init, setInit] = useState(false);
  const [isLogin, setIsLogin] = useState(false);
  const [user, setUser] = useState(null);
  const nav = useNavigate();
  const auth = getAuth();

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        const uid = user.uid;

        startLogoutTimer();

        setUser(user);
        setIsLogin(true);
      } else {
        // User is signed out
        setIsLogin(false);
      }
      setInit(true);
    });
  }, []);

  // 로그인 시 타이머 설정
  const startLogoutTimer = () => {
    // 24시간 후에 로그아웃
    setTimeout(() => {
      signOut(auth)
        .then(() => {
          alert('자동 로그아웃 되었습니다.');
          nav('/');
        })
        .catch((error) => {
          console.error('로그아웃 중 에러 발생:', error);
        });
    }, 24 * 3600 * 1000); // 24시간 = 24 * 3600초 * 1000밀리초
  };

  return (
    <div className="App">
      {init ? (
        <>
          {isLogin && <Header user={user} />}

          <Routes>
            {isLogin === false ? (
              <>
                <Route path="/" element={<Login />} />
                <Route path="*" element={<NotFoundPage />} />
              </>
            ) : (
              <>
                <Route path="/" element={<Home />} />
                <Route path="/write" element={<Write />} />
                <Route path="/view/:docId" element={<View />} />
                <Route path="/edit/:docId" element={<Edit />} />
                <Route path="/mypage" element={<Mypage user={user} />} />
                <Route path="*" element={<NotFoundPage />} />
              </>
            )}
          </Routes>

          <Footer />
        </>
      ) : (
        <LoginCheck />
      )}
    </div>
  );
}

export default App;
