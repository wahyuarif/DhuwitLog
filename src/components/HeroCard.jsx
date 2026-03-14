import { Briefcase, ArrowUp, ArrowDown } from "lucide-react";
import { useStore } from "../store/useStore";

export default function HeroCard() {
  const { period, setPeriod, transactions, theme } = useStore();

  const periods = ["Hari ini", "Minggu ini", "Bulan ini", "Tahun ini", "Semua"];

  // Filter langsung di sini agar reactive
  const now = new Date();
  const filtered = transactions.filter((t) => {
    const d = new Date(t.date);
    if (period === "Hari ini") {
      return (
        d.getDate() === now.getDate() &&
        d.getMonth() === now.getMonth() &&
        d.getFullYear() === now.getFullYear()
      );
    }
    if (period === "Minggu ini") {
      const w = new Date(now);
      w.setDate(now.getDate() - 7);
      return d >= w;
    }
    if (period === "Bulan ini")
      return (
        d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear()
      );
    if (period === "Tahun ini") return d.getFullYear() === now.getFullYear();
    return true;
  });

  const inc = filtered
    .filter((t) => t.type === "income")
    .reduce((a, t) => a + t.amount, 0);
  const exp = filtered
    .filter((t) => t.type === "expense")
    .reduce((a, t) => a + t.amount, 0);
  const bal = inc - exp;

  const fmt = (n) => {
    if (Math.abs(n) >= 1000000)
      return "Rp " + (Math.abs(n) / 1000000).toFixed(1) + "jt";
    if (Math.abs(n) >= 1000)
      return "Rp " + Math.round(Math.abs(n) / 1000) + "rb";
    return "Rp " + Math.abs(n).toLocaleString("id-ID");
  };

  const fmtFull = (n) => "Rp " + Math.abs(n).toLocaleString("id-ID");

  return (
    <div>
      {/* Period Pills */}
      <div
        style={{
          display: "flex",
          gap: 7,
          padding: "14px 20px 0",
          overflowX: "auto",
          scrollbarWidth: "none",
        }}
      >
        {periods.map((p) => (
          <button
            key={p}
            onClick={() => setPeriod(p)}
            style={{
              background: period === p ? theme : "#fff",
              border: "none",
              color: period === p ? "#fff" : "#6B7280",
              padding: "7px 16px",
              borderRadius: 30,
              fontSize: 12,
              fontWeight: 600,
              fontFamily: "Plus Jakarta Sans, sans-serif",
              cursor: "pointer",
              whiteSpace: "nowrap",
              boxShadow:
                period === p
                  ? "0 4px 14px rgba(59,91,219,.3)"
                  : "0 2px 8px rgba(59,91,219,.07)",
              transition: ".2s",
            }}
          >
            {p}
          </button>
        ))}
      </div>

      {/* Balance Card */}
      <div
        style={{
          margin: "14px 20px 0",
          background: theme,
          borderRadius: 24,
          padding: 22,
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: -40,
            right: -40,
            width: 140,
            height: 140,
            background: "rgba(255,255,255,.07)",
            borderRadius: "50%",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: -50,
            left: 10,
            width: 110,
            height: 110,
            background: "rgba(255,255,255,.04)",
            borderRadius: "50%",
          }}
        />

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 5,
            marginBottom: 4,
          }}
        >
          <Briefcase size={11} color="rgba(255,255,255,.65)" />
          <span
            style={{
              fontSize: 11,
              color: "rgba(255,255,255,.65)",
              textTransform: "uppercase",
              letterSpacing: 1,
            }}
          >
            Total Saldo
          </span>
        </div>

        <div
          style={{
            fontSize: 34,
            fontWeight: 800,
            color: "#fff",
            letterSpacing: -1.5,
            marginBottom: 2,
          }}
        >
          {bal < 0 ? "-" : ""}
          {fmtFull(bal)}
        </div>
        <div style={{ fontSize: 11, color: "rgba(255,255,255,.55)" }}>
          {period}
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 8,
            marginTop: 16,
          }}
        >
          <div
            style={{
              background: "rgba(255,255,255,.13)",
              borderRadius: 12,
              padding: "10px 12px",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 4,
                fontSize: 10,
                color: "rgba(255,255,255,.6)",
                marginBottom: 3,
              }}
            >
              <ArrowUp size={10} />
              Pemasukan
            </div>
            <div style={{ fontSize: 15, fontWeight: 700, color: "#fff" }}>
              {fmt(inc)}
            </div>
          </div>
          <div
            style={{
              background: "rgba(255,255,255,.13)",
              borderRadius: 12,
              padding: "10px 12px",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 4,
                fontSize: 10,
                color: "rgba(255,255,255,.6)",
                marginBottom: 3,
              }}
            >
              <ArrowDown size={10} />
              Pengeluaran
            </div>
            <div style={{ fontSize: 15, fontWeight: 700, color: "#fff" }}>
              {fmt(exp)}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
