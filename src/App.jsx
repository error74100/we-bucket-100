import { useEffect, useState } from 'react';
import './assets/css/common.css';
import './App.css';
import { Route, Routes } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import Write from './pages/Write';
import Header from './components/Header';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import Mypage from './pages/Mypage';
import View from './pages/View';
import Edit from './pages/Edit';
import NotFoundPage from './pages/NotFoundPage';

function App() {
  const [isLogin, setIsLogin] = useState(false);
  const [user, setUser] = useState(null);
  const [userObj, setUserObj] = useState(null);
  const auth = getAuth();

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        const uid = user.uid;

        // setUser(auth.currentUser);
        setUser(user);
        setIsLogin(true);

        setUserObj(user);
      } else {
        // User is signed out
        setIsLogin(false);
      }
    });
  }, []);

  return (
    <div className="App">
      {isLogin && <Header userObj={userObj} />}

      <Routes>
        {isLogin === false ? (
          <Route path="/" element={<Login />} />
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
    </div>
  );
}

export default App;
