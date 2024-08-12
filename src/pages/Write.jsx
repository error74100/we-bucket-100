import ArrowBackIcon from '@mui/icons-material/ArrowBack';

function Write() {
  return (
    <>
      <div className="content_nav">
        <span className="icon_back">뒤로가기{ArrowBackIcon}</span>
        <span className="title">제목!!</span>
        <button>취소/완료</button>
      </div>

      <div>Write</div>
      <div>사진</div>
      <div>날짜</div>
      <div>내용</div>
    </>
  );
}

export default Write;
