import { Link, useNavigate } from 'react-router-dom';
import { getAuth, signOut } from 'firebase/auth';

function Header({ user }) {
  const nav = useNavigate();
  const auth = getAuth();

  const onLogout = () => {
    if (confirm('로그아웃 하시겠습니까?')) {
      signOut(auth)
        .then(() => {
          alert('로그아웃 되었습니다.');
          nav('/');
        })
        .catch((error) => {
          alert('로그아웃 실패하였습니다.');
          console.log(error);
        });
    }
  };

  return (
    <>
      <header className="header">
        <h1>
          <Link to="/">
            <img src="/logo.png" alt="logo" />
          </Link>
        </h1>

        {user.email === import.meta.env.VITE_APP_ADMIN_EMAIL ? (
          <button
            onClick={() => {
              nav('/write');
            }}
            className="btn_basic1 small round"
          >
            Write
          </button>
        ) : (
          ''
        )}

        <button
          onClick={() => {
            nav('/mypage');
          }}
          className="btn_basic1 small round"
        >
          My page
        </button>
        <button onClick={onLogout} className="btn_basic1 small round">
          Logout
        </button>
      </header>
    </>
  );
}

export default Header;
