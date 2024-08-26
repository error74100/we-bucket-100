import { useEffect, useState } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase';

function CommentItem({ item }) {
  const [data, setData] = useState(null);

  useEffect(() => {
    getUserInfo();
  }, []);

  const getUserInfo = async () => {
    const docRef = doc(db, 'users', item.uid);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      setData({
        ...docSnap.data(),
      });
    } else {
      console.log('No such document!');
    }
  };

  return (
    <>
      {data && (
        <div className="group">
          <span
            className="img"
            style={
              data.photoURL.length > 0
                ? { backgroundImage: `url(${data.photoURL})` }
                : { backgroundImage: 'url(/img/sample_bg.jpg)' }
            }
          >
            profile image
          </span>
          <div className="cont">
            <p className="name">
              {data.nickName ? data.nickName : data.displayName}
            </p>
            <p className="comment">{item.content}</p>
          </div>
        </div>
      )}
    </>
  );
}

export default CommentItem;
