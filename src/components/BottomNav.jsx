import { Home, Target, CreditCard, Plus, Sparkles } from "lucide-react";

const navItems = [
  { id: "home", icon: Home, label: "Beranda" },
  { id: "savings", icon: Target, label: "Tabungan" },
  { id: "ai", icon: Sparkles, label: "AI" },
  { id: "accounts", icon: CreditCard, label: "Akun" },
];

export default function BottomNav({ currentPage, onNavigate, onOpenModal }) {
  return (
    <div
      style={{
        position: "fixed",
        bottom: 0,
        left: "50%",
        transform: "translateX(-50%)",
        width: "100%",
        maxWidth: 400,
        background: "#fff",
        borderTop: "1px solid #EEF2FF",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-around",
        padding: "10px 4px 20px",
        zIndex: 100,
        boxShadow: "0 -4px 20px rgba(59,91,219,.08)",
      }}
    >
      {/* Kiri: Home, Tabungan */}
      {navItems.slice(0, 2).map(({ id, icon: Icon, label }) => (
        <button
          key={id}
          onClick={() => onNavigate(id)}
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 3,
            cursor: "pointer",
            padding: "4px 14px",
            borderRadius: 10,
            background: "none",
            border: "none",
            fontFamily: "Plus Jakarta Sans, sans-serif",
            color: currentPage === id ? "#3B5BDB" : "#9CA3AF",
            transition: ".2s",
          }}
        >
          <Icon size={20} />
          <span style={{ fontSize: 9, fontWeight: 700, letterSpacing: 0.2 }}>
            {label}
          </span>
        </button>
      ))}

      {/* FAB tengah */}
      <button
        onClick={() => onOpenModal("expense")}
        style={{
          width: 52,
          height: 52,
          background: "#3B5BDB",
          borderRadius: 16,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          cursor: "pointer",
          border: "none",
          color: "#fff",
          boxShadow: "0 6px 20px rgba(59,91,219,.35)",
          transform: "translateY(-10px)",
          transition: "all .2s",
          flexShrink: 0,
        }}
      >
        <Plus size={22} />
      </button>

      {/* Kanan: AI, Akun */}
      {navItems.slice(2).map(({ id, icon: Icon, label }) => (
        <button
          key={id}
          onClick={() => onNavigate(id)}
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 3,
            cursor: "pointer",
            padding: "4px 14px",
            borderRadius: 10,
            background: "none",
            border: "none",
            fontFamily: "Plus Jakarta Sans, sans-serif",
            color: currentPage === id ? "#3B5BDB" : "#9CA3AF",
            transition: ".2s",
          }}
        >
          <Icon size={20} />
          <span style={{ fontSize: 9, fontWeight: 700, letterSpacing: 0.2 }}>
            {label}
          </span>
        </button>
      ))}
    </div>
  );
}
