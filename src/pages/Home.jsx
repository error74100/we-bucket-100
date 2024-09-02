import ProgressBar from '@ramonak/react-progress-bar';
import { db } from '../firebase';
import { collection, getDocs, query, where, orderBy } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

function Home() {
  const [posts, setPosts] = useState([]);
  const [maxSeq, setMaxSeq] = useState(0);
  const [completeCount, setCompleteCount] = useState(0);
  const [completeRate, setCompleteRate] = useState(0);
  const [progress, setProgress] = useState(0);
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetchData();
    getPostsCount();
  }, []);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleScroll = () => {
    const winScroll = document.documentElement.scrollTop;
    const height =
      document.documentElement.scrollHeight -
      document.documentElement.clientHeight;
    const scrolled = (winScroll / height) * 100;

    setProgress(scrolled);
  };

  // Firestore에서 데이터 가져오기
  const fetchData = async () => {
    const q = query(collection(db, 'posts'), orderBy('seq', 'asc'));
    const querySnapshot = await getDocs(q);
    const docsData = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    setPosts(docsData);
  };

  const getPostsCount = async () => {
    let totalDocs;
    //setIsLoading(false);

    try {
      const postsSnapshot = await getDocs(collection(db, 'posts'));

      // 전체 문서 가져오기
      totalDocs = postsSnapshot.size;

      // 'isComplete'가 true인 문서 가져오기
      const q = query(collection(db, 'posts'), where('isComplete', '==', true));
      const querySnapshot = await getDocs(q);

      // 문서 개수 계산
      const completedTaskCount = querySnapshot.size;

      setMaxSeq(totalDocs);
      setCompleteCount(completedTaskCount);

      // 비율 계산 (퍼센트)
      const rate = totalDocs > 0 ? (completedTaskCount / totalDocs) * 100 : 0;
      setCompleteRate(rate);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const handleScrollTo = (id) => {
    const section = document.getElementById(id);
    if (section) {
      section.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // 검색어에 따라 posts 필터링
  const filteredPosts = posts.filter((post) =>
    post.title.toLowerCase().includes(search.toLowerCase())
  );

  const onSearch = (e) => {
    setSearch(e.target.value);
  };

  return (
    <>
      <div className="home">
        <div className="progress_scrollbar">
          <progress value={progress} max="100" />
        </div>

        <div className="progress_wrap">
          {posts && (
            <span>
              {completeCount}/{maxSeq}
            </span>
          )}

          <ProgressBar completed={completeRate} className="progress_item" />
        </div>

        <div className="search_wrap">
          <input
            type="text"
            value={search}
            onChange={onSearch}
            placeholder="검색어를 입력하세요."
          />
        </div>

        {filteredPosts.length > 0 ? (
          <div className="list_wrap">
            <ul>
              {filteredPosts.map((item) => (
                <li key={item.id}>
                  <Link
                    to={
                      item.isComplete === false
                        ? `/edit/${item.id}`
                        : `/view/${item.id}`
                    }
                    className={
                      item.attachment.length > 0
                        ? 'l_inner'
                        : 'l_inner blank_type'
                    }
                    style={
                      item.attachment.length > 0
                        ? { backgroundImage: `url(${item.attachment})` }
                        : { backgroundImage: 'url(/img/sample_bg.jpg)' }
                    }
                  >
                    <span className="number">{item.seq}</span>
                    <p className="title">{item.title}</p>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ) : (
          <div className="list_wrap no_result_type">
            <p>검색 결과가 없습니다.</p>
          </div>
        )}

        <div className="floating-menu">
          <button onClick={() => handleScrollTo('root')}>Top 바로가기</button>
        </div>
      </div>
    </>
  );
}

export default Home;
