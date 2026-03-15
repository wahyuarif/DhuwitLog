import { ArrowLeft, Calendar } from 'lucide-react';
import { useState } from 'react';
import {
  Bar,
  BarChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { useStore } from '../store/useStore';

export default function Stats({ onNavigate }) {
  const { transactions, theme, getCats } = useStore();
  const now = new Date();

  const getToday = () => now.toLocaleDateString('en-CA');
  const getWeekAgo = () => {
    const d = new Date(now);
    d.setDate(now.getDate() - 7);
    return d.toLocaleDateString('en-CA');
  };

  const [mode, setMode] = useState('7hari');
  const [startDate, setStartDate] = useState(getWeekAgo());
  const [endDate, setEndDate] = useState(getToday());

  const modes = [
    { id: '7hari', label: '7 Hari' },
    { id: '30hari', label: '30 Hari' },
    { id: 'bulanini', label: 'Bulan Ini' },
    { id: 'interval', label: 'Interval' },
  ];

  // Filter transaksi berdasarkan mode
  const getDateRange = () => {
    const end = new Date(now);
    end.setHours(23, 59, 59);

    if (mode === '7hari') {
      const start = new Date(now);
      start.setDate(now.getDate() - 7);
      start.setHours(0, 0, 0);
      return { start, end };
    }
    if (mode === '30hari') {
      const start = new Date(now);
      start.setDate(now.getDate() - 30);
      start.setHours(0, 0, 0);
      return { start, end };
    }
    if (mode === 'bulanini') {
      const start = new Date(now.getFullYear(), now.getMonth(), 1);
      start.setHours(0, 0, 0);
      return { start, end };
    }
    if (mode === 'interval') {
      const [sy, sm, sd] = startDate.split('-').map(Number);
      const [ey, em, ed] = endDate.split('-').map(Number);
      const start = new Date(sy, sm - 1, sd, 0, 0, 0);
      const endD = new Date(ey, em - 1, ed, 23, 59, 59);
      return { start, end: endD };
    }
    return { start: new Date(0), end };
  };

  const { start, end } = getDateRange();
  const filteredTx = transactions.filter((t) => {
    const d = new Date(t.date);
    return d >= start && d <= end;
  });

  const inc = filteredTx
    .filter((t) => t.type === 'income')
    .reduce((a, t) => a + t.amount, 0);
  const exp = filteredTx
    .filter((t) => t.type === 'expense')
    .reduce((a, t) => a + t.amount, 0);

  // Build chart data berdasarkan range
  const buildChartData = () => {
    const days = {};
    const diffDays = Math.round((end - start) / (1000 * 60 * 60 * 24));
    const limit = Math.min(diffDays + 1, 30);

    for (let i = limit - 1; i >= 0; i--) {
      const d = new Date(end);
      d.setDate(end.getDate() - i);
      const k = d.toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'short',
      });
      days[k] = { inc: 0, exp: 0, label: k };
    }

    filteredTx.forEach((t) => {
      const d = new Date(t.date);
      const k = d.toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'short',
      });
      if (days[k]) days[k][t.type === 'income' ? 'inc' : 'exp'] += t.amount;
    });

    return Object.values(days);
  };

  const chartData = buildChartData();

  // Budget bulan ini
  const monthTxs = transactions.filter((t) => {
    const d = new Date(t.date);
    return (
      d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear()
    );
  });
  const catTotals = {};
  monthTxs
    .filter((t) => t.type === 'expense')
    .forEach((t) => {
      catTotals[t.cat] = (catTotals[t.cat] || 0) + t.amount;
    });

  const fmt = (n) => {
    if (n >= 1000000) return 'Rp ' + (n / 1000000).toFixed(1) + 'jt';
    if (n >= 1000) return 'Rp ' + Math.round(n / 1000) + 'rb';
    return 'Rp ' + n.toLocaleString('id-ID');
  };

  return (
    <div style={{ paddingBottom: 90 }}>
      {/* Header */}
      <div
        style={{
          padding: '20px 20px 0',
          display: 'flex',
          alignItems: 'center',
          gap: 10,
          marginBottom: 16,
        }}
      >
        <button
          onClick={() => onNavigate('home')}
          style={{
            background: theme + '22',
            border: 'none',
            color: theme,
            width: 34,
            height: 34,
            borderRadius: 10,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
          }}
        >
          <ArrowLeft size={16} />
        </button>
        <div style={{ fontSize: 16, fontWeight: 800, color: '#1A1D2E' }}>
          Statistik
        </div>
      </div>

      {/* Mode Selector */}
      <div style={{ padding: '0 20px', marginBottom: 16 }}>
        <div
          style={{
            display: 'flex',
            gap: 6,
            background: '#fff',
            borderRadius: 14,
            padding: 4,
            boxShadow: '0 2px 8px rgba(59,91,219,.07)',
          }}
        >
          {modes.map((m) => (
            <button
              key={m.id}
              onClick={() => setMode(m.id)}
              style={{
                flex: 1,
                padding: '8px 4px',
                borderRadius: 10,
                border: 'none',
                fontFamily: 'Plus Jakarta Sans, sans-serif',
                fontSize: 11,
                fontWeight: 700,
                cursor: 'pointer',
                transition: '.2s',
                background: mode === m.id ? theme : 'transparent',
                color: mode === m.id ? '#fff' : '#9CA3AF',
                boxShadow: mode === m.id ? `0 2px 8px ${theme}44` : 'none',
              }}
            >
              {m.label}
            </button>
          ))}
        </div>
      </div>

      {/* Interval Picker */}
      {mode === 'interval' && (
        <div style={{ padding: '0 20px', marginBottom: 16 }}>
          <div
            style={{
              background: '#fff',
              borderRadius: 14,
              padding: 16,
              boxShadow: '0 2px 8px rgba(59,91,219,.07)',
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 6,
                marginBottom: 12,
              }}
            >
              <Calendar size={14} color={theme} />
              <span style={{ fontSize: 13, fontWeight: 700, color: '#1A1D2E' }}>
                Pilih Rentang Tanggal
              </span>
            </div>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: 10,
              }}
            >
              <div>
                <div
                  style={{
                    fontSize: 10,
                    fontWeight: 700,
                    color: '#9CA3AF',
                    textTransform: 'uppercase',
                    letterSpacing: 0.5,
                    marginBottom: 6,
                  }}
                >
                  Dari
                </div>
                <input
                  type="date"
                  value={startDate}
                  max={endDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  style={{
                    width: '100%',
                    background: '#F8FAFF',
                    border: `2px solid ${theme}33`,
                    borderRadius: 10,
                    padding: '10px 12px',
                    fontFamily: 'Plus Jakarta Sans, sans-serif',
                    fontSize: 12,
                    color: '#1A1D2E',
                    outline: 'none',
                  }}
                />
              </div>
              <div>
                <div
                  style={{
                    fontSize: 10,
                    fontWeight: 700,
                    color: '#9CA3AF',
                    textTransform: 'uppercase',
                    letterSpacing: 0.5,
                    marginBottom: 6,
                  }}
                >
                  Sampai
                </div>
                <input
                  type="date"
                  value={endDate}
                  min={startDate}
                  max={getToday()}
                  onChange={(e) => setEndDate(e.target.value)}
                  style={{
                    width: '100%',
                    background: '#F8FAFF',
                    border: `2px solid ${theme}33`,
                    borderRadius: 10,
                    padding: '10px 12px',
                    fontFamily: 'Plus Jakarta Sans, sans-serif',
                    fontSize: 12,
                    color: '#1A1D2E',
                    outline: 'none',
                  }}
                />
              </div>
            </div>

            {/* Summary interval */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: 8,
                marginTop: 12,
              }}
            >
              <div
                style={{
                  background: '#DCFCE7',
                  borderRadius: 10,
                  padding: '10px 12px',
                }}
              >
                <div
                  style={{
                    fontSize: 10,
                    color: '#15803D',
                    fontWeight: 700,
                    marginBottom: 2,
                  }}
                >
                  PEMASUKAN
                </div>
                <div
                  style={{ fontSize: 14, fontWeight: 800, color: '#15803D' }}
                >
                  {fmt(inc)}
                </div>
              </div>
              <div
                style={{
                  background: '#FEE2E2',
                  borderRadius: 10,
                  padding: '10px 12px',
                }}
              >
                <div
                  style={{
                    fontSize: 10,
                    color: '#B91C1C',
                    fontWeight: 700,
                    marginBottom: 2,
                  }}
                >
                  PENGELUARAN
                </div>
                <div
                  style={{ fontSize: 14, fontWeight: 800, color: '#B91C1C' }}
                >
                  {fmt(exp)}
                </div>
              </div>
            </div>
            <div
              style={{
                marginTop: 8,
                background: theme + '11',
                borderRadius: 10,
                padding: '10px 12px',
                textAlign: 'center',
              }}
            >
              <div
                style={{
                  fontSize: 10,
                  color: theme,
                  fontWeight: 700,
                  marginBottom: 2,
                }}
              >
                SELISIH
              </div>
              <div style={{ fontSize: 16, fontWeight: 800, color: theme }}>
                {fmt(Math.abs(inc - exp))} {inc >= exp ? '↑' : '↓'}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Summary Cards (non-interval) */}
      {mode !== 'interval' && (
        <div style={{ padding: '0 20px', marginBottom: 16 }}>
          <div
            style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}
          >
            <div
              style={{
                background: '#DCFCE7',
                borderRadius: 12,
                padding: '12px 14px',
              }}
            >
              <div
                style={{
                  fontSize: 10,
                  color: '#15803D',
                  fontWeight: 700,
                  marginBottom: 4,
                }}
              >
                PEMASUKAN
              </div>
              <div style={{ fontSize: 16, fontWeight: 800, color: '#15803D' }}>
                {fmt(inc)}
              </div>
            </div>
            <div
              style={{
                background: '#FEE2E2',
                borderRadius: 12,
                padding: '12px 14px',
              }}
            >
              <div
                style={{
                  fontSize: 10,
                  color: '#B91C1C',
                  fontWeight: 700,
                  marginBottom: 4,
                }}
              >
                PENGELUARAN
              </div>
              <div style={{ fontSize: 16, fontWeight: 800, color: '#B91C1C' }}>
                {fmt(exp)}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Bar Chart */}
      <div style={{ padding: '0 20px', marginBottom: 16 }}>
        <div
          style={{
            fontSize: 15,
            fontWeight: 700,
            color: '#1A1D2E',
            marginBottom: 12,
          }}
        >
          Grafik{' '}
          {mode === 'interval'
            ? `${startDate} — ${endDate}`
            : modes.find((m) => m.id === mode)?.label}
        </div>
        <div
          style={{
            background: '#fff',
            borderRadius: 14,
            padding: 16,
            boxShadow: '0 2px 8px rgba(59,91,219,.07)',
          }}
        >
          <div style={{ display: 'flex', gap: 16, marginBottom: 12 }}>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 5,
                fontSize: 11,
                color: '#6B7280',
              }}
            >
              <div
                style={{
                  width: 10,
                  height: 10,
                  borderRadius: 2,
                  background: theme,
                }}
              />
              Pemasukan
            </div>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 5,
                fontSize: 11,
                color: '#6B7280',
              }}
            >
              <div
                style={{
                  width: 10,
                  height: 10,
                  borderRadius: 2,
                  background: '#EF4444',
                }}
              />
              Pengeluaran
            </div>
          </div>
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={chartData} barGap={4}>
              <XAxis
                dataKey="label"
                tick={{ fontSize: 9, fill: '#9CA3AF' }}
                axisLine={false}
                tickLine={false}
                interval="preserveStartEnd"
              />
              <YAxis
                tick={{ fontSize: 10, fill: '#9CA3AF' }}
                axisLine={false}
                tickLine={false}
                tickFormatter={(v) =>
                  v >= 1000 ? Math.round(v / 1000) + 'rb' : v
                }
              />
              <Tooltip
                formatter={(val, name) => [
                  fmt(val),
                  name === 'inc' ? 'Pemasukan' : 'Pengeluaran',
                ]}
                contentStyle={{
                  borderRadius: 10,
                  border: 'none',
                  boxShadow: '0 4px 20px rgba(0,0,0,.1)',
                  fontSize: 12,
                }}
              />
              <Bar dataKey="inc" fill={theme} radius={[6, 6, 0, 0]} />
              <Bar dataKey="exp" fill="#EF4444" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Budget */}
      <div style={{ padding: '0 20px' }}>
        <div
          style={{
            fontSize: 15,
            fontWeight: 700,
            color: '#1A1D2E',
            marginBottom: 12,
          }}
        >
          Budget Bulan Ini
        </div>
        {getCats('expense').map((cat) => {
          const spent = catTotals[cat.n] || 0;
          const pct = Math.min(100, Math.round((spent / cat.b) * 100));
          const over = spent > cat.b;
          return (
            <div
              key={cat.n}
              style={{
                background: '#fff',
                borderRadius: 14,
                padding: 14,
                boxShadow: '0 2px 8px rgba(59,91,219,.07)',
                marginBottom: 8,
              }}
            >
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: 8,
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <div
                    style={{
                      width: 34,
                      height: 34,
                      borderRadius: 10,
                      background: cat.c + '18',
                      color: cat.c,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    💰
                  </div>
                  <div>
                    <div
                      style={{
                        fontSize: 12,
                        fontWeight: 700,
                        color: '#1A1D2E',
                      }}
                    >
                      {cat.n}
                    </div>
                    <div style={{ fontSize: 10, color: '#9CA3AF' }}>
                      {fmt(spent)} / {fmt(cat.b)}
                    </div>
                  </div>
                </div>
                <div
                  style={{
                    fontSize: 12,
                    fontWeight: 700,
                    color: over ? '#EF4444' : cat.c,
                  }}
                >
                  {pct}%
                </div>
              </div>
              <div
                style={{
                  height: 6,
                  background: '#F1F5F9',
                  borderRadius: 3,
                  overflow: 'hidden',
                }}
              >
                <div
                  style={{
                    width: pct + '%',
                    height: '100%',
                    borderRadius: 3,
                    background: over ? '#EF4444' : cat.c,
                    transition: '.6s',
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
