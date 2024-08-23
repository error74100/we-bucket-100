import ReactDOM from 'react-dom/client';
import './assets/css/reset.css';
import App from './App.jsx';
import { authService } from './firebase.js';
import { BrowserRouter } from 'react-router-dom';

ReactDOM.createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <App />
  </BrowserRouter>
);
