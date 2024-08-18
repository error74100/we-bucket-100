import ProgressBar from '@ramonak/react-progress-bar';
import { db } from '../firebase';
import { collection, getDocs } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

function Home() {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    // Firestore에서 데이터 가져오기
    const fetchData = async () => {
      const querySnapshot = await getDocs(collection(db, 'posts'));
      const docsData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      setPosts(docsData);
    };

    fetchData();
  }, []);

  return (
    <div className="home">
      <div className="progress_wrap">
        <span>1/100</span>
        <ProgressBar completed={50} className="progress_item" />
      </div>

      <div className="list_wrap">
        <ul>
          {posts.map((item, idx) => (
            <li key={item.id}>
              <Link
                to={item.isComplete === false ? `/edit/${item.id}` : `/view/${item.id}`}
                className="l_inner"
                style={{ backgroundImage: 'url(/img/sample_bg.jpg)' }}
              >
                <span className="number">{idx + 1}</span>
                <p className="title">
                  {item.title} / {item.id}
                </p>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default Home;
