import { useEffect, useState } from 'react';
import BottomNav from './components/BottomNav';
import ColorPicker from './components/ColorPicker';
import Modal from './components/Modal';
import Accounts from './pages/Accounts';
import AIAnalysis from './pages/AIAnalysis';
import Home from './pages/Home';
import Savings from './pages/Savings';
import Stats from './pages/Stats';
import Transactions from './pages/Transactions';
import { useStore } from './store/useStore';

export default function App() {
  const [page, setPage] = useState('home');
  const [modalOpen, setModalOpen] = useState(false);
  const [modalType, setModalType] = useState('expense');
  const [darkMode, setDarkMode] = useState(
    () => localStorage.getItem('dhuwitlog-dark') === 'true'
  );
  const { theme } = useStore();

  useEffect(() => {
    localStorage.setItem('dhuwitlog-dark', darkMode);
  }, [darkMode]);

  const openModal = (type = 'expense') => {
    setModalType(type);
    setModalOpen(true);
  };

  const pages = {
    home: Home,
    stats: Stats,
    transactions: Transactions,
    accounts: Accounts,
    savings: Savings,
    ai: AIAnalysis,
  };
  const PageComponent = pages[page] || Home;

  const colors = darkMode
    ? {
        bg: '#0F1117',
        surface: '#1A1D2E',
        surface2: '#222640',
        text1: '#F0F4FF',
        text2: '#8B94B2',
        text3: '#4A5280',
        border: '#2A2F4A',
        white: '#1A1D2E',
        whiteSurface: '#222640',
      }
    : {
        bg: '#F0F4FF',
        surface: '#fff',
        surface2: '#F8FAFF',
        text1: '#1A1D2E',
        text2: '#6B7280',
        text3: '#9CA3AF',
        border: '#EEF2FF',
        white: '#fff',
        whiteSurface: '#F8FAFF',
      };

  return (
    <div
      style={{
        maxWidth: 400,
        margin: '0 auto',
        minHeight: '100vh',
        background: colors.bg,
        position: 'relative',
        '--primary': theme,
        '--bg': colors.bg,
        '--surface': colors.surface,
        '--surface2': colors.surface2,
        '--text1': colors.text1,
        '--text2': colors.text2,
        '--text3': colors.text3,
        '--border': colors.border,
        '--white': colors.white,
      }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&display=swap');
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: 'Plus Jakarta Sans', sans-serif; background: ${colors.bg}; }
        ::-webkit-scrollbar { display: none; }
      `}</style>

      <PageComponent
        onNavigate={setPage}
        onOpenModal={openModal}
        darkMode={darkMode}
        colors={colors}
      />

      <BottomNav
        currentPage={page}
        onNavigate={setPage}
        onOpenModal={openModal}
        darkMode={darkMode}
        colors={colors}
      />

      <ColorPicker
        darkMode={darkMode}
        onToggleDark={() => setDarkMode(!darkMode)}
      />

      {modalOpen && (
        <Modal
          type={modalType}
          onClose={() => setModalOpen(false)}
          darkMode={darkMode}
          colors={colors}
        />
      )}
    </div>
  );
}
