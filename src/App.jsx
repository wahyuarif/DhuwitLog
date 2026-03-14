import { useState } from "react";
import { useStore } from "./store/useStore";
import Home from "./pages/Home";
import Stats from "./pages/Stats";
import Transactions from "./pages/Transactions";
import Accounts from "./pages/Accounts";
import BottomNav from "./components/BottomNav";
import Modal from "./components/Modal";
import ColorPicker from "./components/ColorPicker";
import Savings from "./pages/Savings";
import AIAnalysis from "./pages/AIAnalysis";

export default function App() {
  const [page, setPage] = useState("home");
  const [modalOpen, setModalOpen] = useState(false);
  const [modalType, setModalType] = useState("expense");
  const { theme } = useStore();

  const openModal = (type = "expense") => {
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

  return (
    <div
      style={{
        maxWidth: 400,
        margin: "0 auto",
        minHeight: "100vh",
        background: "#F0F4FF",
        position: "relative",
        "--primary": theme,
      }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&display=swap');
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: 'Plus Jakarta Sans', sans-serif; background: #F0F4FF; }
        ::-webkit-scrollbar { display: none; }
      `}</style>

      <PageComponent onNavigate={setPage} onOpenModal={openModal} />

      <BottomNav
        currentPage={page}
        onNavigate={setPage}
        onOpenModal={openModal}
      />

      <ColorPicker />

      {modalOpen && (
        <Modal type={modalType} onClose={() => setModalOpen(false)} />
      )}
    </div>
  );
}
