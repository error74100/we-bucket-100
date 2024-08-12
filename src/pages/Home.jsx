import ProgressBar from '@ramonak/react-progress-bar';

function Home() {
  return (
    <div className="home">
      <div className="progress_wrap">
        <span>1/100</span>
        <ProgressBar completed={50} className="progress_item" />
      </div>

      <div className="list_wrap">
        <ul>
          <li>
            <div
              className="l_inner"
              style={{ backgroundImage: 'url(/img/sample_bg.jpg)' }}
            >
              <span className="number">1</span>
              <p className="title">구경하기 1</p>
            </div>
          </li>

          <li>
            <div
              className="l_inner"
              style={{ backgroundImage: 'url(/img/sample_bg.jpg)' }}
            >
              <span className="number">2</span>
              <p className="title">구경하기 2</p>
            </div>
          </li>

          <li>
            <div
              className="l_inner"
              style={{ backgroundImage: 'url(/img/sample_bg.jpg)' }}
            >
              <span className="number">3</span>
              <p className="title">구경하기 3</p>
            </div>
          </li>

          <li>
            <div className="l_inner" style={{ backgroundImage: 'url()' }}>
              <span className="number">4</span>
              <p className="title">구경하기 4</p>
            </div>
          </li>
        </ul>
      </div>
    </div>
  );
}

export default Home;
