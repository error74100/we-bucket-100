import { useEffect, useState } from 'react';
import './assets/css/common.css';
import './App.css';
import { Route, Routes, useNavigate } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import Write from './pages/Write';
import Header from './components/Header';
import { getAuth, onAuthStateChanged, signOut } from 'firebase/auth';
import { doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore';
import { db } from './firebase';
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
    onAuthStateChanged(auth, async (user) => {
      if (user) {
        const uid = user.uid;

        // 사용자가 로그인했을 때, 로그인 시간을 Firestore에 저장
        const userRef = doc(db, 'users', user.uid);
        const docSnap = await getDoc(userRef);

        await setDoc(
          userRef,
          {
            loginTime: serverTimestamp(), // 서버 시간을 기록
          },
          { merge: true }
        );

        if (docSnap.exists()) {
          const loginTime = docSnap.data().loginTime.toDate(); // Firestore 타임스탬프를 Date 객체로 변환
          const currentTime = new Date();
          const timeDiff = currentTime - loginTime;

          const hoursPassed = timeDiff / (1000 * 60 * 60); // 시간으로 변환

          if (hoursPassed >= 24) {
            // 24시간이 지났다면 로그아웃
            await signOut(auth);

            alert('자동 로그아웃 되었습니다.');
            nav('/');
            location.reload();
          }
        }

        setUser(user);
        setIsLogin(true);
      } else {
        // User is signed out
        setIsLogin(false);
      }
      setInit(true);
    });
  }, []);

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
                <Route path="/view/:docId" element={<View user={user} />} />
                <Route path="/edit/:docId" element={<Edit user={user} />} />
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
