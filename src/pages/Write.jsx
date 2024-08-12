import { Link } from 'react-router-dom';
import { useState } from 'react';

function Write() {
  return (
    <>
      <div className="content_nav">
        <Link to="" className="icon_back">
          뒤로가기
        </Link>
        <span className="title">제목!!</span>
        <button>취소/완료</button>
      </div>

      <div className="write_wrap">
        <ul>
          <li>
            <div className="l_inner" style={{ backgroundImage: 'url(/img/sample_bg.jpg)' }}>
              <span className="number">1</span>
              <p className="title">구경하기 1</p>
            </div>
          </li>
        </ul>
      </div>

      <div>
        <h2 className="h3_type">사진</h2>
      </div>
      <div>
        <h2 className="h3_type">감정아이콘</h2>
      </div>
      <div>
        <h2 className="h3_type">날짜</h2>
      </div>
      <div>
        <h2 className="h3_type">내용</h2>
      </div>
    </>
  );
}

export default Write;
