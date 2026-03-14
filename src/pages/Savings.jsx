import { ArrowLeft, Plus, Target, Trash2, TrendingUp } from "lucide-react";
import { useState } from "react";
import { useStore } from "../store/useStore";

export default function Savings({ onNavigate }) {
  const { theme, accounts } = useStore();
  const [goals, setGoals] = useState(() => {
    const saved = localStorage.getItem("dhuwitlog-goals");
    return saved
      ? JSON.parse(saved)
      : [
          {
            id: 1,
            name: "Beli Laptop",
            target: 15000000,
            saved: 3500000,
            emoji: "💻",
            deadline: "2026-12-31",
          },
          {
            id: 2,
            name: "Liburan Bali",
            target: 5000000,
            saved: 1200000,
            emoji: "🏖️",
            deadline: "2026-08-01",
          },
        ];
  });

  const [showForm, setShowForm] = useState(false);
  const [showTopup, setShowTopup] = useState(null);
  const [form, setForm] = useState({
    name: "",
    target: "",
    saved: "",
    emoji: "🎯",
    deadline: "",
  });
  const [topupAmount, setTopupAmount] = useState("");

  const saveToStorage = (data) => {
    localStorage.setItem("dhuwitlog-goals", JSON.stringify(data));
  };

  const fmt = (n) => {
    if (n >= 1000000) return "Rp " + (n / 1000000).toFixed(1) + "jt";
    if (n >= 1000) return "Rp " + Math.round(n / 1000) + "rb";
    return "Rp " + n.toLocaleString("id-ID");
  };

  const getDaysLeft = (deadline) => {
    if (!deadline) return null;
    const diff = new Date(deadline) - new Date();
    const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
    return days;
  };

  const getMonthlyNeeded = (goal) => {
    const days = getDaysLeft(goal.deadline);
    if (!days || days <= 0) return null;
    const remaining = goal.target - goal.saved;
    const months = Math.ceil(days / 30);
    return Math.ceil(remaining / months);
  };

  const handleAdd = () => {
    if (!form.name || !form.target) return;
    const newGoal = {
      id: Date.now(),
      name: form.name,
      target: parseFloat(form.target),
      saved: parseFloat(form.saved) || 0,
      emoji: form.emoji,
      deadline: form.deadline,
    };
    const updated = [...goals, newGoal];
    setGoals(updated);
    saveToStorage(updated);
    setForm({ name: "", target: "", saved: "", emoji: "🎯", deadline: "" });
    setShowForm(false);
  };

  const handleTopup = (id) => {
    const amt = parseFloat(topupAmount);
    if (!amt || amt <= 0) return;
    const updated = goals.map((g) =>
      g.id === id ? { ...g, saved: Math.min(g.saved + amt, g.target) } : g,
    );
    setGoals(updated);
    saveToStorage(updated);
    setTopupAmount("");
    setShowTopup(null);
  };

  const handleDelete = (id) => {
    if (!window.confirm("Hapus target ini?")) return;
    const updated = goals.filter((g) => g.id !== id);
    setGoals(updated);
    saveToStorage(updated);
  };

  const totalTarget = goals.reduce((a, g) => a + g.target, 0);
  const totalSaved = goals.reduce((a, g) => a + g.saved, 0);
  const emojis = ["🎯", "💻", "🏖️", "🚗", "🏠", "💍", "📱", "✈️", "🎓", "💪"];

  return (
    <div style={{ paddingBottom: 90 }}>
      {/* Header */}
      <div
        style={{
          padding: "20px 20px 0",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: 16,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <button
            onClick={() => onNavigate("home")}
            style={{
              background: theme + "22",
              border: "none",
              color: theme,
              width: 34,
              height: 34,
              borderRadius: 10,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
            }}
          >
            <ArrowLeft size={16} />
          </button>
          <div style={{ fontSize: 16, fontWeight: 800, color: "#1A1D2E" }}>
            Target Tabungan
          </div>
        </div>
        <button
          onClick={() => setShowForm(true)}
          style={{
            background: theme,
            border: "none",
            color: "#fff",
            padding: "7px 14px",
            borderRadius: 20,
            fontSize: 11,
            fontWeight: 700,
            fontFamily: "Plus Jakarta Sans, sans-serif",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: 5,
          }}
        >
          <Plus size={12} /> Tambah
        </button>
      </div>

      {/* Summary */}
      <div style={{ padding: "0 20px", marginBottom: 16 }}>
        <div
          style={{
            background: theme,
            borderRadius: 20,
            padding: 20,
            position: "relative",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              position: "absolute",
              top: -30,
              right: -30,
              width: 120,
              height: 120,
              background: "rgba(255,255,255,.07)",
              borderRadius: "50%",
            }}
          />
          <div
            style={{
              fontSize: 11,
              color: "rgba(255,255,255,.65)",
              textTransform: "uppercase",
              letterSpacing: 1,
              marginBottom: 4,
            }}
          >
            Total Terkumpul
          </div>
          <div
            style={{
              fontSize: 28,
              fontWeight: 800,
              color: "#fff",
              letterSpacing: -1,
              marginBottom: 2,
            }}
          >
            {fmt(totalSaved)}
          </div>
          <div
            style={{
              fontSize: 11,
              color: "rgba(255,255,255,.6)",
              marginBottom: 14,
            }}
          >
            dari {fmt(totalTarget)} target keseluruhan
          </div>
          {/* Overall progress */}
          <div
            style={{
              height: 8,
              background: "rgba(255,255,255,.2)",
              borderRadius: 4,
              overflow: "hidden",
            }}
          >
            <div
              style={{
                height: "100%",
                borderRadius: 4,
                background: "#fff",
                width:
                  totalTarget > 0
                    ? Math.round((totalSaved / totalTarget) * 100) + "%"
                    : "0%",
                transition: ".6s",
              }}
            />
          </div>
          <div
            style={{
              fontSize: 11,
              color: "rgba(255,255,255,.6)",
              marginTop: 6,
            }}
          >
            {totalTarget > 0 ? Math.round((totalSaved / totalTarget) * 100) : 0}
            % tercapai · {goals.length} target aktif
          </div>
        </div>
      </div>

      {/* Goals List */}
      <div style={{ padding: "0 20px" }}>
        {goals.length === 0 ? (
          <div
            style={{
              background: "#fff",
              borderRadius: 14,
              padding: 40,
              textAlign: "center",
              boxShadow: "0 2px 8px rgba(59,91,219,.07)",
            }}
          >
            <div style={{ fontSize: 40, marginBottom: 12 }}>🎯</div>
            <div
              style={{
                fontSize: 14,
                fontWeight: 700,
                color: "#1A1D2E",
                marginBottom: 4,
              }}
            >
              Belum ada target
            </div>
            <div style={{ fontSize: 12, color: "#9CA3AF" }}>
              Tambahkan target tabungan pertamamu!
            </div>
          </div>
        ) : (
          goals.map((goal) => {
            const pct = Math.round((goal.saved / goal.target) * 100);
            const daysLeft = getDaysLeft(goal.deadline);
            const monthly = getMonthlyNeeded(goal);
            const done = goal.saved >= goal.target;

            return (
              <div
                key={goal.id}
                style={{
                  background: "#fff",
                  borderRadius: 16,
                  padding: 16,
                  boxShadow: "0 2px 8px rgba(59,91,219,.07)",
                  marginBottom: 12,
                }}
              >
                {/* Top row */}
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                    marginBottom: 12,
                  }}
                >
                  <div
                    style={{ display: "flex", alignItems: "center", gap: 10 }}
                  >
                    <div
                      style={{
                        width: 44,
                        height: 44,
                        borderRadius: 12,
                        background: theme + "15",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: 22,
                      }}
                    >
                      {goal.emoji}
                    </div>
                    <div>
                      <div
                        style={{
                          fontSize: 14,
                          fontWeight: 700,
                          color: "#1A1D2E",
                        }}
                      >
                        {goal.name}
                      </div>
                      {daysLeft !== null && (
                        <div
                          style={{
                            fontSize: 10,
                            color: daysLeft < 30 ? "#EF4444" : "#9CA3AF",
                            marginTop: 2,
                          }}
                        >
                          {daysLeft > 0
                            ? `${daysLeft} hari lagi`
                            : "Sudah lewat deadline"}
                        </div>
                      )}
                    </div>
                  </div>
                  <button
                    onClick={() => handleDelete(goal.id)}
                    style={{
                      background: "#FEE2E2",
                      border: "none",
                      width: 30,
                      height: 30,
                      borderRadius: 8,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      cursor: "pointer",
                      color: "#EF4444",
                    }}
                  >
                    <Trash2 size={13} />
                  </button>
                </div>

                {/* Progress */}
                <div style={{ marginBottom: 10 }}>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      marginBottom: 6,
                    }}
                  >
                    <span
                      style={{ fontSize: 13, fontWeight: 700, color: theme }}
                    >
                      {fmt(goal.saved)}
                    </span>
                    <span style={{ fontSize: 11, color: "#9CA3AF" }}>
                      {fmt(goal.target)}
                    </span>
                  </div>
                  <div
                    style={{
                      height: 8,
                      background: "#F1F5F9",
                      borderRadius: 4,
                      overflow: "hidden",
                    }}
                  >
                    <div
                      style={{
                        height: "100%",
                        borderRadius: 4,
                        background: done ? "#22C55E" : theme,
                        width: Math.min(pct, 100) + "%",
                        transition: ".6s",
                      }}
                    />
                  </div>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      marginTop: 4,
                    }}
                  >
                    <span
                      style={{
                        fontSize: 10,
                        color: done ? "#22C55E" : theme,
                        fontWeight: 700,
                      }}
                    >
                      {done ? "✓ Tercapai!" : pct + "% terkumpul"}
                    </span>
                    {monthly && !done && (
                      <span style={{ fontSize: 10, color: "#9CA3AF" }}>
                        ~{fmt(monthly)}/bulan
                      </span>
                    )}
                  </div>
                </div>

                {/* Topup Button */}
                {!done && (
                  <>
                    {showTopup === goal.id ? (
                      <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
                        <input
                          type="number"
                          placeholder="Jumlah topup..."
                          value={topupAmount}
                          onChange={(e) => setTopupAmount(e.target.value)}
                          style={{
                            flex: 1,
                            background: "#F8FAFF",
                            border: `2px solid ${theme}33`,
                            borderRadius: 10,
                            padding: "9px 12px",
                            fontFamily: "Plus Jakarta Sans, sans-serif",
                            fontSize: 13,
                            color: "#1A1D2E",
                            outline: "none",
                          }}
                        />
                        <button
                          onClick={() => handleTopup(goal.id)}
                          style={{
                            background: theme,
                            border: "none",
                            color: "#fff",
                            padding: "9px 16px",
                            borderRadius: 10,
                            fontSize: 12,
                            fontWeight: 700,
                            fontFamily: "Plus Jakarta Sans, sans-serif",
                            cursor: "pointer",
                          }}
                        >
                          Simpan
                        </button>
                        <button
                          onClick={() => setShowTopup(null)}
                          style={{
                            background: "#F1F5F9",
                            border: "none",
                            color: "#6B7280",
                            padding: "9px 12px",
                            borderRadius: 10,
                            fontSize: 12,
                            fontWeight: 700,
                            fontFamily: "Plus Jakarta Sans, sans-serif",
                            cursor: "pointer",
                          }}
                        >
                          Batal
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => setShowTopup(goal.id)}
                        style={{
                          width: "100%",
                          background: theme + "11",
                          border: `1.5px solid ${theme}33`,
                          color: theme,
                          borderRadius: 10,
                          padding: "9px",
                          fontSize: 12,
                          fontWeight: 700,
                          fontFamily: "Plus Jakarta Sans, sans-serif",
                          cursor: "pointer",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          gap: 6,
                          marginTop: 4,
                        }}
                      >
                        <TrendingUp size={13} /> Tambah Tabungan
                      </button>
                    )}
                  </>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* Add Form Modal */}
      {showForm && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(26,29,46,.4)",
            zIndex: 200,
            display: "flex",
            alignItems: "flex-end",
            justifyContent: "center",
            backdropFilter: "blur(4px)",
          }}
          onClick={(e) => e.target === e.currentTarget && setShowForm(false)}
        >
          <div
            style={{
              background: "#fff",
              borderRadius: "28px 28px 0 0",
              padding: "20px 20px 32px",
              width: "100%",
              maxWidth: 400,
              maxHeight: "90vh",
              overflowY: "auto",
            }}
          >
            <div
              style={{
                width: 40,
                height: 5,
                background: "#E5E7EB",
                borderRadius: 3,
                margin: "0 auto 18px",
              }}
            />
            <div
              style={{
                fontSize: 17,
                fontWeight: 800,
                color: "#1A1D2E",
                marginBottom: 16,
              }}
            >
              Target Baru
            </div>

            {/* Emoji picker */}
            <div
              style={{
                fontSize: 10,
                fontWeight: 700,
                color: "#9CA3AF",
                textTransform: "uppercase",
                letterSpacing: 0.8,
                marginBottom: 8,
              }}
            >
              Ikon
            </div>
            <div
              style={{
                display: "flex",
                gap: 8,
                flexWrap: "wrap",
                marginBottom: 14,
              }}
            >
              {emojis.map((e) => (
                <button
                  key={e}
                  onClick={() => setForm((f) => ({ ...f, emoji: e }))}
                  style={{
                    width: 38,
                    height: 38,
                    borderRadius: 10,
                    border: `2px solid ${form.emoji === e ? theme : "transparent"}`,
                    background: form.emoji === e ? theme + "15" : "#F8FAFF",
                    fontSize: 20,
                    cursor: "pointer",
                  }}
                >
                  {e}
                </button>
              ))}
            </div>

            <div
              style={{
                fontSize: 10,
                fontWeight: 700,
                color: "#9CA3AF",
                textTransform: "uppercase",
                letterSpacing: 0.8,
                marginBottom: 6,
              }}
            >
              Nama Target
            </div>
            <input
              value={form.name}
              onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
              placeholder="Contoh: Beli Laptop"
              style={{
                width: "100%",
                background: "#F8FAFF",
                border: "2px solid transparent",
                borderRadius: 10,
                padding: "12px 14px",
                fontFamily: "Plus Jakarta Sans, sans-serif",
                fontSize: 13,
                color: "#1A1D2E",
                outline: "none",
                marginBottom: 12,
              }}
            />

            <div
              style={{
                fontSize: 10,
                fontWeight: 700,
                color: "#9CA3AF",
                textTransform: "uppercase",
                letterSpacing: 0.8,
                marginBottom: 6,
              }}
            >
              Target Dana (Rp)
            </div>
            <input
              type="number"
              value={form.target}
              onChange={(e) =>
                setForm((f) => ({ ...f, target: e.target.value }))
              }
              placeholder="0"
              style={{
                width: "100%",
                background: "#F8FAFF",
                border: "2px solid transparent",
                borderRadius: 10,
                padding: "12px 14px",
                fontFamily: "Plus Jakarta Sans, sans-serif",
                fontSize: 13,
                color: "#1A1D2E",
                outline: "none",
                marginBottom: 12,
              }}
            />

            <div
              style={{
                fontSize: 10,
                fontWeight: 700,
                color: "#9CA3AF",
                textTransform: "uppercase",
                letterSpacing: 0.8,
                marginBottom: 6,
              }}
            >
              Dana Awal (Rp)
            </div>
            <input
              type="number"
              value={form.saved}
              onChange={(e) =>
                setForm((f) => ({ ...f, saved: e.target.value }))
              }
              placeholder="0 (opsional)"
              style={{
                width: "100%",
                background: "#F8FAFF",
                border: "2px solid transparent",
                borderRadius: 10,
                padding: "12px 14px",
                fontFamily: "Plus Jakarta Sans, sans-serif",
                fontSize: 13,
                color: "#1A1D2E",
                outline: "none",
                marginBottom: 12,
              }}
            />

            <div
              style={{
                fontSize: 10,
                fontWeight: 700,
                color: "#9CA3AF",
                textTransform: "uppercase",
                letterSpacing: 0.8,
                marginBottom: 6,
              }}
            >
              Deadline (Opsional)
            </div>
            <input
              type="date"
              value={form.deadline}
              min={new Date().toLocaleDateString("en-CA")}
              onChange={(e) =>
                setForm((f) => ({ ...f, deadline: e.target.value }))
              }
              style={{
                width: "100%",
                background: "#F8FAFF",
                border: "2px solid transparent",
                borderRadius: 10,
                padding: "12px 14px",
                fontFamily: "Plus Jakarta Sans, sans-serif",
                fontSize: 13,
                color: "#1A1D2E",
                outline: "none",
                marginBottom: 16,
              }}
            />

            <button
              onClick={handleAdd}
              style={{
                width: "100%",
                background: theme,
                border: "none",
                borderRadius: 14,
                padding: 16,
                fontFamily: "Plus Jakarta Sans, sans-serif",
                fontSize: 14,
                fontWeight: 800,
                color: "#fff",
                cursor: "pointer",
                boxShadow: `0 4px 16px ${theme}44`,
              }}
            >
              Buat Target
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
