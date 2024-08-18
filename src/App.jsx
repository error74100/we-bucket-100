import { useEffect, useState } from 'react';
import './assets/css/common.css';
import './App.css';
import { Route, Routes } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import Write from './pages/Write';
import Header from './components/Header';
import { auth } from './firebase';
import { onAuthStateChanged } from 'firebase/auth';
import Mypage from './pages/Mypage';
import View from './pages/View';
import Edit from './pages/Edit';

function App() {
  const [isLogin, setIsLogin] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        const uid = user.uid;

        setUser(auth.currentUser);
        setIsLogin(true);
      } else {
        // User is signed out
        setIsLogin(false);
      }
    });
  }, []);

  return (
    <div className="App">
      {isLogin && <Header />}

      <Routes>
        {isLogin === false ? (
          <>
            <Route path="/" element={<Login />} />
          </>
        ) : (
          <Route path="/" element={<Home />} />
        )}

        <Route path="/write" element={<Write />} />
        <Route path="/view/:docId" element={<View />} />
        <Route path="/edit/:docId" element={<Edit />} />
        <Route path="/mypage" element={<Mypage user={user} />} />
      </Routes>
    </div>
  );
}

export default App;
