import { useState } from "react";
import {
  X,
  Plus,
  ArrowDown,
  ArrowUp,
  Tag,
  PenLine,
  CreditCard,
  CalendarDays,
} from "lucide-react";
import { useStore } from "../store/useStore";
import { CATS } from "../data/categories";

export default function Modal({ type: initialType, onClose }) {
  const { accounts, addTransaction, theme } = useStore();
  const [type, setType] = useState(initialType);
  const [amount, setAmount] = useState("");
  const [selectedCat, setSelectedCat] = useState(0);
  const [note, setNote] = useState("");
  const [date, setDate] = useState(new Date().toLocaleDateString("en-CA"));
  const [accountId, setAccountId] = useState(accounts[0]?.id || 1);
  const [error, setError] = useState("");

  const cats = CATS[type];

  const handleSubmit = () => {
    const amt = parseFloat(amount);
    if (!amt || amt <= 0) {
      setError("Masukkan jumlah yang valid");
      return;
    }
    const acc = accounts.find((a) => a.id === parseInt(accountId));
    if (type === "expense" && acc?.b < amt) {
      setError("Saldo tidak mencukupi");
      return;
    }

    console.log("date:", date); // ← tambahkan baris ini

    const result = addTransaction({
      type,
      amount: amt,
      cat: cats[selectedCat].n,
      note,
      accountId: parseInt(accountId),
      account: acc?.n || "",
      date: new Date(date + "T12:00:00+07:00").toISOString(),
    });

    if (result === "insufficient") {
      setError("Saldo tidak mencukupi");
      return;
    }
    onClose();
  };

  const inputStyle = {
    width: "100%",
    background: "#F8FAFF",
    border: "2px solid transparent",
    borderRadius: 10,
    padding: "12px 14px",
    color: "#1A1D2E",
    fontFamily: "Plus Jakarta Sans, sans-serif",
    fontSize: 13,
    outline: "none",
    marginBottom: 12,
  };

  return (
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
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div
        style={{
          background: "#fff",
          borderRadius: "28px 28px 0 0",
          padding: "20px 20px 32px",
          width: "100%",
          maxWidth: 400,
          maxHeight: "92vh",
          overflowY: "auto",
        }}
      >
        {/* Handle */}
        <div
          style={{
            width: 40,
            height: 5,
            background: "#E5E7EB",
            borderRadius: 3,
            margin: "0 auto 18px",
          }}
        />

        {/* Header */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 16,
          }}
        >
          <div style={{ fontSize: 17, fontWeight: 800, color: "#1A1D2E" }}>
            Tambah {type === "expense" ? "Pengeluaran" : "Pemasukan"}
          </div>
          <button
            onClick={onClose}
            style={{
              background: "#F8FAFF",
              border: "none",
              borderRadius: 10,
              width: 34,
              height: 34,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              color: "#6B7280",
            }}
          >
            <X size={16} />
          </button>
        </div>

        {/* Type Toggle */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 6,
            background: "#F8FAFF",
            borderRadius: 14,
            padding: 4,
            marginBottom: 18,
          }}
        >
          {["expense", "income"].map((t) => (
            <button
              key={t}
              onClick={() => {
                setType(t);
                setSelectedCat(0);
                setError("");
              }}
              style={{
                padding: 10,
                borderRadius: 10,
                border: "none",
                fontFamily: "Plus Jakarta Sans, sans-serif",
                fontSize: 12,
                fontWeight: 700,
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 6,
                background:
                  type === t
                    ? t === "expense"
                      ? "#EF4444"
                      : "#22C55E"
                    : "transparent",
                color: type === t ? "#fff" : "#9CA3AF",
                boxShadow:
                  type === t
                    ? `0 4px 12px ${t === "expense" ? "rgba(239,68,68,.25)" : "rgba(34,197,94,.25)"}`
                    : "none",
                transition: ".2s",
              }}
            >
              {t === "expense" ? (
                <ArrowDown size={13} />
              ) : (
                <ArrowUp size={13} />
              )}
              {t === "expense" ? "Pengeluaran" : "Pemasukan"}
            </button>
          ))}
        </div>

        {/* Amount */}
        <div
          style={{
            background: "#F8FAFF",
            borderRadius: 14,
            padding: 18,
            marginBottom: 16,
            textAlign: "center",
          }}
        >
          <div
            style={{
              fontSize: 10,
              color: "#9CA3AF",
              marginBottom: 6,
              fontWeight: 600,
              letterSpacing: 0.5,
              textTransform: "uppercase",
            }}
          >
            Jumlah (IDR)
          </div>
          <input
            type="number"
            value={amount}
            onChange={(e) => {
              setAmount(e.target.value);
              setError("");
            }}
            placeholder="0"
            min="0"
            style={{
              background: "none",
              border: "none",
              fontFamily: "Plus Jakarta Sans, sans-serif",
              fontSize: 36,
              fontWeight: 800,
              color: "#1A1D2E",
              textAlign: "center",
              width: "100%",
              outline: "none",
            }}
          />
        </div>

        {/* Category */}
        <div
          style={{
            fontSize: 10,
            fontWeight: 700,
            color: "#9CA3AF",
            textTransform: "uppercase",
            letterSpacing: 0.8,
            marginBottom: 7,
            display: "flex",
            alignItems: "center",
            gap: 5,
          }}
        >
          <Tag size={11} /> Kategori
        </div>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(4, 1fr)",
            gap: 6,
            marginBottom: 16,
          }}
        >
          {cats.map((cat, i) => (
            <button
              key={cat.n}
              onClick={() => setSelectedCat(i)}
              style={{
                background: selectedCat === i ? cat.c + "15" : "#F8FAFF",
                border: `2px solid ${selectedCat === i ? cat.c : "transparent"}`,
                borderRadius: 10,
                padding: "10px 4px",
                cursor: "pointer",
                textAlign: "center",
                transition: ".2s",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 4,
              }}
            >
              <div
                style={{
                  width: 20,
                  height: 20,
                  color: cat.c,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Tag size={16} />
              </div>
              <span style={{ fontSize: 9, color: "#6B7280", fontWeight: 600 }}>
                {cat.n}
              </span>
            </button>
          ))}
        </div>

        {/* Note */}
        <div
          style={{
            fontSize: 10,
            fontWeight: 700,
            color: "#9CA3AF",
            textTransform: "uppercase",
            letterSpacing: 0.8,
            marginBottom: 7,
            display: "flex",
            alignItems: "center",
            gap: 5,
          }}
        >
          <PenLine size={11} /> Catatan
        </div>
        <input
          style={inputStyle}
          type="text"
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="Opsional..."
        />

        {/* Date */}
        <div
          style={{
            fontSize: 10,
            fontWeight: 700,
            color: "#9CA3AF",
            textTransform: "uppercase",
            letterSpacing: 0.8,
            marginBottom: 7,
            display: "flex",
            alignItems: "center",
            gap: 5,
          }}
        >
          <CalendarDays size={11} /> Tanggal
        </div>
        <input
          style={inputStyle}
          type="date"
          value={date}
          max={new Date().toLocaleDateString("en-CA")}
          onChange={(e) => setDate(e.target.value)}
        />

        {/* Account */}
        <div
          style={{
            fontSize: 10,
            fontWeight: 700,
            color: "#9CA3AF",
            textTransform: "uppercase",
            letterSpacing: 0.8,
            marginBottom: 7,
            display: "flex",
            alignItems: "center",
            gap: 5,
          }}
        >
          <CreditCard size={11} /> Akun
        </div>
        <select
          style={inputStyle}
          value={accountId}
          onChange={(e) => setAccountId(e.target.value)}
        >
          {accounts.map((a) => (
            <option key={a.id} value={a.id}>
              {a.n}
            </option>
          ))}
        </select>

        {/* Error */}
        {error && (
          <div
            style={{
              color: "#EF4444",
              fontSize: 12,
              marginBottom: 8,
              textAlign: "center",
            }}
          >
            {error}
          </div>
        )}

        {/* Submit */}
        <button
          onClick={handleSubmit}
          style={{
            width: "100%",
            background: type === "expense" ? "#EF4444" : "#22C55E",
            border: "none",
            borderRadius: 14,
            padding: 16,
            fontFamily: "Plus Jakarta Sans, sans-serif",
            fontSize: 14,
            fontWeight: 800,
            color: "#fff",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 8,
            marginTop: 4,
            boxShadow:
              type === "expense"
                ? "0 4px 16px rgba(239,68,68,.3)"
                : "0 4px 16px rgba(34,197,94,.3)",
            transition: ".2s",
          }}
        >
          <Plus size={16} />
          Tambah {type === "expense" ? "Pengeluaran" : "Pemasukan"}
        </button>
      </div>
    </div>
  );
}
