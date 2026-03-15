import { createRoot } from 'react-dom/client';
import App from './App.jsx';
import './index.css';

// Auto clear jika data lama corrupt
const stored = localStorage.getItem('dhuwitlog-storage');
if (stored) {
  try {
    const parsed = JSON.parse(stored);
    // Cek apakah format data valid
    if (!parsed?.state?.transactions || !parsed?.state?.accounts) {
      localStorage.removeItem('dhuwitlog-storage');
    }
  } catch (e) {
    localStorage.removeItem('dhuwitlog-storage');
  }
}

createRoot(document.getElementById('root')).render(<App />);
