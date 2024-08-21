import { useNavigate } from 'react-router-dom';

function NotFoundPage() {
  const nav = useNavigate();

  const onHome = () => {
    nav('/');
  };

  return (
    <div className="not_found_page">
      <h2 className="h2_type">Not Found Page</h2>
      <p>
        잘못된 경로의 페이지 입니다.
        <br />
        다시 한번 확인해 주세요.
      </p>
      <p className="type2">
        <button onClick={onHome} className="btn_basic2">
          메인으로 이동
        </button>
      </p>
    </div>
  );
}

export default NotFoundPage;
