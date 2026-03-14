import {
  ArrowLeft,
  Sparkles,
  TrendingUp,
  TrendingDown,
  AlertCircle,
  CheckCircle,
  RefreshCw,
} from "lucide-react";
import { useState } from "react";
import { useStore } from "../store/useStore";

export default function AIAnalysis({ onNavigate }) {
  const { transactions, accounts, theme } = useStore();
  const [loading, setLoading] = useState(false);
  const [analysis, setAnalysis] = useState(null);
  const [error, setError] = useState("");

  const fmt = (n) => {
    if (n >= 1000000) return "Rp " + (n / 1000000).toFixed(1) + "jt";
    if (n >= 1000) return "Rp " + Math.round(n / 1000) + "rb";
    return "Rp " + n.toLocaleString("id-ID");
  };

  const buildSummary = () => {
    const now = new Date();

    // Bulan ini
    const thisMonth = transactions.filter((t) => {
      const d = new Date(t.date);
      return (
        d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear()
      );
    });

    // Bulan lalu
    const lastMonth = transactions.filter((t) => {
      const d = new Date(t.date);
      const lm = new Date(now.getFullYear(), now.getMonth() - 1, 1);
      return (
        d.getMonth() === lm.getMonth() && d.getFullYear() === lm.getFullYear()
      );
    });

    const thisInc = thisMonth
      .filter((t) => t.type === "income")
      .reduce((a, t) => a + t.amount, 0);
    const thisExp = thisMonth
      .filter((t) => t.type === "expense")
      .reduce((a, t) => a + t.amount, 0);
    const lastInc = lastMonth
      .filter((t) => t.type === "income")
      .reduce((a, t) => a + t.amount, 0);
    const lastExp = lastMonth
      .filter((t) => t.type === "expense")
      .reduce((a, t) => a + t.amount, 0);

    const catTotals = {};
    thisMonth
      .filter((t) => t.type === "expense")
      .forEach((t) => {
        catTotals[t.cat] = (catTotals[t.cat] || 0) + t.amount;
      });

    const topCats = Object.entries(catTotals)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([cat, amt]) => `${cat}: Rp ${amt.toLocaleString("id-ID")}`);

    const totalBalance = accounts.reduce((a, acc) => a + acc.b, 0);

    return `
Data keuangan pengguna aplikasi DhuwitLog:

BULAN INI:
- Pemasukan: Rp ${thisInc.toLocaleString("id-ID")}
- Pengeluaran: Rp ${thisExp.toLocaleString("id-ID")}
- Selisih: Rp ${(thisInc - thisExp).toLocaleString("id-ID")}

BULAN LALU:
- Pemasukan: Rp ${lastInc.toLocaleString("id-ID")}
- Pengeluaran: Rp ${lastExp.toLocaleString("id-ID")}

TOP PENGELUARAN BULAN INI:
${topCats.join("\n") || "Belum ada data"}

TOTAL SALDO SEMUA AKUN: Rp ${totalBalance.toLocaleString("id-ID")}
JUMLAH TRANSAKSI: ${transactions.length} transaksi
    `.trim();
  };

  const getAnalysis = async () => {
    setLoading(true);
    setError("");
    setAnalysis(null);

    try {
      const summary = buildSummary();

      const response = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 1000,
          messages: [
            {
              role: "user",
              content: `Kamu adalah analis keuangan pribadi yang ramah. Analisis data keuangan berikut dan berikan insight dalam Bahasa Indonesia yang mudah dipahami.

${summary}

Berikan analisis dalam format JSON dengan struktur TEPAT seperti ini (jangan tambah field lain):
{
  "score": <angka 0-100 kesehatan keuangan>,
  "summary": "<ringkasan singkat 1-2 kalimat>",
  "insights": [
    {"type": "positive/negative/warning", "title": "<judul singkat>", "desc": "<penjelasan 1 kalimat>"}
  ],
  "tips": ["<tip 1>", "<tip 2>", "<tip 3>"]
}

Maksimal 3 insights dan 3 tips. Respond HANYA dengan JSON, tidak ada teks lain.`,
            },
          ],
        }),
      });

      const data = await response.json();

      if (data.error) {
        setError("API Error: " + data.error.message);
        return;
      }

      const text = data.content[0].text;
      const clean = text.replace(/```json|```/g, "").trim();
      const parsed = JSON.parse(clean);
      setAnalysis(parsed);
    } catch (err) {
      setError("Gagal menganalisis. Pastikan koneksi internet aktif.");
    } finally {
      setLoading(false);
    }
  };

  const scoreColor = analysis
    ? analysis.score >= 70
      ? "#22C55E"
      : analysis.score >= 40
        ? "#F59E0B"
        : "#EF4444"
    : theme;

  const insightIcon = (type) => {
    if (type === "positive") return <CheckCircle size={16} color="#22C55E" />;
    if (type === "negative") return <TrendingDown size={16} color="#EF4444" />;
    return <AlertCircle size={16} color="#F59E0B" />;
  };

  const insightBg = (type) => {
    if (type === "positive")
      return { bg: "#DCFCE7", border: "#BBF7D0", text: "#15803D" };
    if (type === "negative")
      return { bg: "#FEE2E2", border: "#FECACA", text: "#B91C1C" };
    return { bg: "#FEF3C7", border: "#FDE68A", text: "#92400E" };
  };

  return (
    <div style={{ paddingBottom: 90 }}>
      {/* Header */}
      <div
        style={{
          padding: "20px 20px 0",
          display: "flex",
          alignItems: "center",
          gap: 10,
          marginBottom: 16,
        }}
      >
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
        <div>
          <div style={{ fontSize: 16, fontWeight: 800, color: "#1A1D2E" }}>
            Analisis AI
          </div>
          <div style={{ fontSize: 10, color: "#9CA3AF" }}>Asisten keuangan</div>
        </div>
      </div>

      {/* Hero CTA */}
      {!analysis && !loading && (
        <div style={{ padding: "0 20px", marginBottom: 16 }}>
          <div
            style={{
              background: `linear-gradient(135deg, ${theme}, ${theme}cc)`,
              borderRadius: 20,
              padding: 24,
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
                background: "rgba(255,255,255,.08)",
                borderRadius: "50%",
              }}
            />
            <div
              style={{
                position: "absolute",
                bottom: -20,
                left: -20,
                width: 80,
                height: 80,
                background: "rgba(255,255,255,.05)",
                borderRadius: "50%",
              }}
            />
            <div style={{ fontSize: 32, marginBottom: 8 }}>🤖</div>
            <div
              style={{
                fontSize: 18,
                fontWeight: 800,
                color: "#fff",
                marginBottom: 6,
              }}
            >
              Analisis Keuanganmu
            </div>
            <div
              style={{
                fontSize: 12,
                color: "rgba(255,255,255,.7)",
                marginBottom: 20,
                lineHeight: 1.6,
              }}
            >
              Claude AI akan menganalisis pola pengeluaran, pemasukan, dan
              memberikan saran personal untukmu.
            </div>
            <button
              onClick={getAnalysis}
              style={{
                background: "#fff",
                border: "none",
                color: theme,
                padding: "12px 24px",
                borderRadius: 12,
                fontSize: 13,
                fontWeight: 800,
                fontFamily: "Plus Jakarta Sans, sans-serif",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: 8,
                boxShadow: "0 4px 16px rgba(0,0,0,.15)",
              }}
            >
              <Sparkles size={15} />
              Analisis Sekarang
            </button>
          </div>
        </div>
      )}

      {/* Loading */}
      {loading && (
        <div style={{ padding: "0 20px" }}>
          <div
            style={{
              background: "#fff",
              borderRadius: 16,
              padding: 40,
              textAlign: "center",
              boxShadow: "0 2px 8px rgba(59,91,219,.07)",
            }}
          >
            <div
              style={{
                fontSize: 40,
                marginBottom: 16,
                animation: "spin 1s linear infinite",
              }}
            >
              ⏳
            </div>
            <div
              style={{
                fontSize: 14,
                fontWeight: 700,
                color: "#1A1D2E",
                marginBottom: 6,
              }}
            >
              Menganalisis data keuanganmu...
            </div>
            <div style={{ fontSize: 12, color: "#9CA3AF" }}>
              Claude AI sedang bekerja
            </div>
          </div>
        </div>
      )}

      {/* Error */}
      {error && (
        <div style={{ padding: "0 20px", marginBottom: 16 }}>
          <div
            style={{
              background: "#FEE2E2",
              borderRadius: 14,
              padding: 16,
              display: "flex",
              gap: 10,
              alignItems: "flex-start",
            }}
          >
            <AlertCircle
              size={16}
              color="#EF4444"
              style={{ flexShrink: 0, marginTop: 2 }}
            />
            <div>
              <div
                style={{
                  fontSize: 13,
                  fontWeight: 700,
                  color: "#B91C1C",
                  marginBottom: 4,
                }}
              >
                Gagal menganalisis
              </div>
              <div style={{ fontSize: 11, color: "#B91C1C" }}>{error}</div>
            </div>
          </div>
          <button
            onClick={getAnalysis}
            style={{
              width: "100%",
              marginTop: 10,
              background: theme,
              border: "none",
              color: "#fff",
              padding: 14,
              borderRadius: 12,
              fontSize: 13,
              fontWeight: 700,
              fontFamily: "Plus Jakarta Sans, sans-serif",
              cursor: "pointer",
            }}
          >
            Coba Lagi
          </button>
        </div>
      )}

      {/* Analysis Result */}
      {analysis && (
        <div style={{ padding: "0 20px" }}>
          {/* Score */}
          <div
            style={{
              background: "#fff",
              borderRadius: 16,
              padding: 20,
              boxShadow: "0 2px 8px rgba(59,91,219,.07)",
              marginBottom: 12,
              textAlign: "center",
            }}
          >
            <div
              style={{
                fontSize: 11,
                color: "#9CA3AF",
                textTransform: "uppercase",
                letterSpacing: 1,
                marginBottom: 8,
              }}
            >
              Skor Kesehatan Keuangan
            </div>
            <div
              style={{
                fontSize: 56,
                fontWeight: 800,
                color: scoreColor,
                letterSpacing: -2,
                marginBottom: 4,
              }}
            >
              {analysis.score}
            </div>
            <div style={{ fontSize: 12, color: "#6B7280", marginBottom: 16 }}>
              {analysis.summary}
            </div>
            {/* Score bar */}
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
                  background: scoreColor,
                  width: analysis.score + "%",
                  transition: "1s",
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
              <span style={{ fontSize: 9, color: "#EF4444" }}>Buruk</span>
              <span style={{ fontSize: 9, color: "#F59E0B" }}>Cukup</span>
              <span style={{ fontSize: 9, color: "#22C55E" }}>Sehat</span>
            </div>
          </div>

          {/* Insights */}
          <div
            style={{
              fontSize: 13,
              fontWeight: 700,
              color: "#1A1D2E",
              marginBottom: 10,
            }}
          >
            💡 Insight
          </div>
          {analysis.insights?.map((insight, i) => {
            const style = insightBg(insight.type);
            return (
              <div
                key={i}
                style={{
                  background: style.bg,
                  border: `1px solid ${style.border}`,
                  borderRadius: 12,
                  padding: 14,
                  marginBottom: 8,
                  display: "flex",
                  gap: 10,
                }}
              >
                <div style={{ flexShrink: 0, marginTop: 2 }}>
                  {insightIcon(insight.type)}
                </div>
                <div>
                  <div
                    style={{
                      fontSize: 12,
                      fontWeight: 700,
                      color: style.text,
                      marginBottom: 3,
                    }}
                  >
                    {insight.title}
                  </div>
                  <div
                    style={{
                      fontSize: 11,
                      color: style.text,
                      opacity: 0.8,
                      lineHeight: 1.5,
                    }}
                  >
                    {insight.desc}
                  </div>
                </div>
              </div>
            );
          })}

          {/* Tips */}
          <div
            style={{
              fontSize: 13,
              fontWeight: 700,
              color: "#1A1D2E",
              margin: "16px 0 10px",
            }}
          >
            🎯 Rekomendasi
          </div>
          <div
            style={{
              background: "#fff",
              borderRadius: 14,
              padding: 16,
              boxShadow: "0 2px 8px rgba(59,91,219,.07)",
              marginBottom: 16,
            }}
          >
            {analysis.tips?.map((tip, i) => (
              <div
                key={i}
                style={{
                  display: "flex",
                  gap: 10,
                  alignItems: "flex-start",
                  padding: "8px 0",
                  borderTop: i > 0 ? "1px solid #F1F5F9" : "none",
                }}
              >
                <div
                  style={{
                    width: 22,
                    height: 22,
                    borderRadius: 6,
                    background: theme + "15",
                    color: theme,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 11,
                    fontWeight: 800,
                    flexShrink: 0,
                  }}
                >
                  {i + 1}
                </div>
                <div
                  style={{
                    fontSize: 12,
                    color: "#374151",
                    lineHeight: 1.6,
                    paddingTop: 2,
                  }}
                >
                  {tip}
                </div>
              </div>
            ))}
          </div>

          {/* Refresh */}
          <button
            onClick={getAnalysis}
            style={{
              width: "100%",
              background: theme + "11",
              border: `1.5px solid ${theme}33`,
              color: theme,
              borderRadius: 12,
              padding: 14,
              fontSize: 13,
              fontWeight: 700,
              fontFamily: "Plus Jakarta Sans, sans-serif",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 8,
              marginBottom: 8,
            }}
          >
            <RefreshCw size={14} /> Analisis Ulang
          </button>
        </div>
      )}
    </div>
  );
}
