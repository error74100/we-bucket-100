import { useNavigate } from 'react-router-dom';

function LoginCheck() {
  const nav = useNavigate();

  const onHome = () => {
    nav('/');
  };

  return (
    <div className="not_found_page">
      <p>회원정보 확인중..</p>
    </div>
  );
}

export default LoginCheck;
