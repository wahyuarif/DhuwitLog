import {
  ArrowUpRight,
  BarChart2,
  Bell,
  ChevronRight,
  Search,
} from 'lucide-react';
import { useState } from 'react';
import EditTransactionModal from '../components/EditTransactionModal';
import TransactionItem from '../components/TransactionItem';
import { getIconByName } from '../data/categories';
import { useStore } from '../store/useStore';
export default function Home({ onNavigate, onOpenModal }) {
  const { userName, transactions, period, setPeriod, theme, getCats } =
    useStore();
  const [search, setSearch] = useState('');
  const [editingTx, setEditingTx] = useState(null);

  const now = new Date();
  const todayStr = `${now.getFullYear()}-${now.getMonth()}-${now.getDate()}`;

  const filtered = transactions.filter((t) => {
    const d = new Date(t.date);
    const dStr = `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;

    if (period === 'Hari ini') return dStr === todayStr;
    if (period === 'Minggu ini') {
      const w = new Date(now);
      w.setDate(now.getDate() - 7);
      return d >= w;
    }
    if (period === 'Bulan ini')
      return (
        d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear()
      );
    if (period === 'Tahun ini') return d.getFullYear() === now.getFullYear();
    return true;
  });

  const inc = filtered
    .filter((t) => t.type === 'income')
    .reduce((a, t) => a + t.amount, 0);
  const exp = filtered
    .filter((t) => t.type === 'expense')
    .reduce((a, t) => a + t.amount, 0);
  const bal = inc - exp;

  const recent = filtered.slice(-5).reverse();
  const searched = search
    ? filtered
        .filter(
          (t) =>
            (t.note || '').toLowerCase().includes(search.toLowerCase()) ||
            t.cat.toLowerCase().includes(search.toLowerCase())
        )
        .reverse()
    : recent;

  const catTotals = {};
  filtered
    .filter((t) => t.type === 'expense')
    .forEach((t) => {
      catTotals[t.cat] = (catTotals[t.cat] || 0) + t.amount;
    });
  const total = Object.values(catTotals).reduce((a, b) => a + b, 0);
  const topCats = Object.entries(catTotals)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 4);

  const fmt = (n) => {
    if (Math.abs(n) >= 1000000)
      return 'Rp ' + (Math.abs(n) / 1000000).toFixed(1) + 'jt';
    if (Math.abs(n) >= 1000)
      return 'Rp ' + Math.round(Math.abs(n) / 1000) + 'rb';
    return 'Rp ' + Math.abs(n).toLocaleString('id-ID');
  };

  return (
    <div style={{ paddingBottom: 90 }}>
      {/* Topbar */}
      <div
        style={{
          padding: '20px 20px 0',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div
            style={{
              width: 42,
              height: 42,
              borderRadius: 14,
              background: theme + '22',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              border: `2px solid ${theme}44`,
              fontSize: 20,
            }}
          >
            🧑
          </div>
          <div>
            <div style={{ fontSize: 11, color: '#6B7280', marginBottom: 1 }}>
              Selamat datang 👋
            </div>
            <div style={{ fontSize: 15, fontWeight: 700, color: '#1A1D2E' }}>
              {userName}
            </div>
          </div>
        </div>
        <button
          style={{
            width: 40,
            height: 40,
            background: '#fff',
            borderRadius: 12,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 2px 8px rgba(59,91,219,.07)',
            border: 'none',
            cursor: 'pointer',
            color: '#6B7280',
            position: 'relative',
          }}
        >
          <Bell size={18} />
          <div
            style={{
              width: 7,
              height: 7,
              background: '#EF4444',
              borderRadius: '50%',
              position: 'absolute',
              top: 8,
              right: 8,
              border: '2px solid #fff',
            }}
          />
        </button>
      </div>

      {/* Search */}
      <div
        style={{
          margin: '12px 20px 0',
          background: '#fff',
          borderRadius: 10,
          padding: '10px 14px',
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          boxShadow: '0 2px 8px rgba(59,91,219,.07)',
        }}
      >
        <Search size={14} color="#9CA3AF" />
        <input
          type="text"
          placeholder="Cari transaksi..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{
            border: 'none',
            background: 'none',
            flex: 1,
            fontFamily: 'Plus Jakarta Sans, sans-serif',
            fontSize: 13,
            color: '#1A1D2E',
            outline: 'none',
          }}
        />
      </div>

      {/* Period Pills */}
      <div
        style={{
          display: 'flex',
          gap: 7,
          padding: '14px 20px 0',
          overflowX: 'auto',
          scrollbarWidth: 'none',
        }}
      >
        {['Hari ini', 'Minggu ini', 'Bulan ini', 'Tahun ini', 'Semua'].map(
          (p) => (
            <button
              key={p}
              onClick={() => setPeriod(p)}
              style={{
                background: period === p ? theme : '#fff',
                border: 'none',
                color: period === p ? '#fff' : '#6B7280',
                padding: '7px 16px',
                borderRadius: 30,
                fontSize: 12,
                fontWeight: 600,
                fontFamily: 'Plus Jakarta Sans, sans-serif',
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                boxShadow:
                  period === p
                    ? '0 4px 14px rgba(59,91,219,.3)'
                    : '0 2px 8px rgba(59,91,219,.07)',
                transition: '.2s',
              }}
            >
              {p}
            </button>
          )
        )}
      </div>

      {/* Balance Card */}
      <div
        style={{
          margin: '14px 20px 0',
          background: theme,
          borderRadius: 24,
          padding: 22,
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            position: 'absolute',
            top: -40,
            right: -40,
            width: 140,
            height: 140,
            background: 'rgba(255,255,255,.07)',
            borderRadius: '50%',
          }}
        />
        <div
          style={{
            position: 'absolute',
            bottom: -50,
            left: 10,
            width: 110,
            height: 110,
            background: 'rgba(255,255,255,.04)',
            borderRadius: '50%',
          }}
        />
        <div
          style={{
            fontSize: 11,
            color: 'rgba(255,255,255,.65)',
            textTransform: 'uppercase',
            letterSpacing: 1,
            marginBottom: 4,
          }}
        >
          Total Saldo
        </div>
        <div
          style={{
            fontSize: 34,
            fontWeight: 800,
            color: '#fff',
            letterSpacing: -1.5,
            marginBottom: 2,
          }}
        >
          {bal < 0 ? '-' : ''}Rp {Math.abs(bal).toLocaleString('id-ID')}
        </div>
        <div style={{ fontSize: 11, color: 'rgba(255,255,255,.55)' }}>
          {period}
        </div>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: 8,
            marginTop: 16,
          }}
        >
          <div
            style={{
              background: 'rgba(255,255,255,.13)',
              borderRadius: 12,
              padding: '10px 12px',
            }}
          >
            <div
              style={{
                fontSize: 10,
                color: 'rgba(255,255,255,.6)',
                marginBottom: 3,
              }}
            >
              ↑ Pemasukan
            </div>
            <div style={{ fontSize: 15, fontWeight: 700, color: '#fff' }}>
              {fmt(inc)}
            </div>
          </div>
          <div
            style={{
              background: 'rgba(255,255,255,.13)',
              borderRadius: 12,
              padding: '10px 12px',
            }}
          >
            <div
              style={{
                fontSize: 10,
                color: 'rgba(255,255,255,.6)',
                marginBottom: 3,
              }}
            >
              ↓ Pengeluaran
            </div>
            <div style={{ fontSize: 15, fontWeight: 700, color: '#fff' }}>
              {fmt(exp)}
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: 10,
          padding: '14px 20px 0',
        }}
      >
        <button
          onClick={() => onOpenModal('expense')}
          style={{
            background: '#fff',
            border: 'none',
            borderRadius: 14,
            padding: 14,
            cursor: 'pointer',
            textAlign: 'left',
            boxShadow: '0 2px 8px rgba(59,91,219,.07)',
            transition: 'all .2s',
          }}
        >
          <div
            style={{
              width: 38,
              height: 38,
              borderRadius: 11,
              background: '#FEE2E2',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: 9,
            }}
          >
            <ArrowUpRight
              size={18}
              color="#EF4444"
              style={{ transform: 'rotate(90deg)' }}
            />
          </div>
          <div style={{ fontSize: 13, fontWeight: 700, color: '#1A1D2E' }}>
            Pengeluaran
          </div>
          <div style={{ fontSize: 10, color: '#9CA3AF', marginTop: 1 }}>
            Catat yang dibelanjakan
          </div>
        </button>
        <button
          onClick={() => onOpenModal('income')}
          style={{
            background: '#fff',
            border: 'none',
            borderRadius: 14,
            padding: 14,
            cursor: 'pointer',
            textAlign: 'left',
            boxShadow: '0 2px 8px rgba(59,91,219,.07)',
            transition: 'all .2s',
          }}
        >
          <div
            style={{
              width: 38,
              height: 38,
              borderRadius: 11,
              background: '#DCFCE7',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: 9,
            }}
          >
            <ArrowUpRight size={18} color="#22C55E" />
          </div>
          <div style={{ fontSize: 13, fontWeight: 700, color: '#1A1D2E' }}>
            Pemasukan
          </div>
          <div style={{ fontSize: 10, color: '#9CA3AF', marginTop: 1 }}>
            Catat yang diterima
          </div>
        </button>

        <button
          onClick={() => onNavigate('stats')}
          style={{
            background: '#fff',
            border: 'none',
            borderRadius: 14,
            padding: 14,
            cursor: 'pointer',
            textAlign: 'left',
            boxShadow: '0 2px 8px rgba(59,91,219,.07)',
            transition: 'all .2s',
            gridColumn: '1 / -1',
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div
                style={{
                  width: 38,
                  height: 38,
                  borderRadius: 11,
                  background: theme + '15',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <BarChart2 size={18} color={theme} />
              </div>
              <div>
                <div
                  style={{ fontSize: 13, fontWeight: 700, color: '#1A1D2E' }}
                >
                  Lihat Statistik
                </div>
                <div style={{ fontSize: 10, color: '#9CA3AF', marginTop: 1 }}>
                  Laporan & budget bulanan
                </div>
              </div>
            </div>
            <ChevronRight size={16} color="#9CA3AF" />
          </div>
        </button>
      </div>

      {/* Distribution */}
      {topCats.length > 0 && (
        <div style={{ padding: '16px 20px 0' }}>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: 12,
            }}
          >
            <div style={{ fontSize: 15, fontWeight: 700, color: '#1A1D2E' }}>
              Distribusi
            </div>
            <button
              onClick={() => onNavigate('stats')}
              style={{
                fontSize: 12,
                color: theme,
                fontWeight: 600,
                background: 'none',
                border: 'none',
                cursor: 'pointer',
              }}
            >
              Detail →
            </button>
          </div>
          <div
            style={{
              background: '#fff',
              borderRadius: 14,
              padding: 16,
              boxShadow: '0 2px 8px rgba(59,91,219,.07)',
            }}
          >
            {topCats.map(([cat, val]) => {
              const pct = total ? Math.round((val / total) * 100) : 0;
              const allCats = getCats('expense');
              const catData = allCats.find((c) => c.n === cat) || {
                c: '#888',
                iconName: 'ShoppingBag',
              };
              const CatIcon = getIconByName(catData.iconName);
              return (
                <div
                  key={cat}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 10,
                    marginBottom: 10,
                  }}
                >
                  <div
                    style={{
                      width: 32,
                      height: 32,
                      borderRadius: 9,
                      background: catData.c + '18',
                      color: catData.c,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                    }}
                  >
                    <CatIcon size={16} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        marginBottom: 4,
                      }}
                    >
                      <span
                        style={{
                          fontSize: 12,
                          fontWeight: 600,
                          color: '#1A1D2E',
                        }}
                      >
                        {cat}
                      </span>
                      <span
                        style={{
                          fontSize: 11,
                          fontWeight: 600,
                          color: catData.c,
                        }}
                      >
                        {pct}%
                      </span>
                    </div>
                    <div
                      style={{
                        height: 5,
                        background: '#F1F5F9',
                        borderRadius: 3,
                      }}
                    >
                      <div
                        style={{
                          width: pct + '%',
                          height: '100%',
                          background: catData.c,
                          borderRadius: 3,
                          transition: '.5s',
                        }}
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Recent Transactions */}
      <div style={{ padding: '16px 20px 0' }}>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: 12,
          }}
        >
          <div style={{ fontSize: 15, fontWeight: 700, color: '#1A1D2E' }}>
            Transaksi Terbaru
          </div>
          <button
            onClick={() => onNavigate('transactions')}
            style={{
              fontSize: 12,
              color: theme,
              fontWeight: 600,
              background: 'none',
              border: 'none',
              cursor: 'pointer',
            }}
          >
            Semua →
          </button>
        </div>
        <div
          style={{
            background: '#fff',
            borderRadius: 14,
            boxShadow: '0 2px 8px rgba(59,91,219,.07)',
            overflow: 'hidden',
          }}
        >
          {searched.length === 0 ? (
            <div
              style={{
                padding: 24,
                textAlign: 'center',
                fontSize: 12,
                color: '#9CA3AF',
              }}
            >
              Belum ada transaksi
            </div>
          ) : (
            searched.map((tx, i) => (
              <div
                key={tx.id}
                style={{ borderTop: i > 0 ? '1px solid #F1F5F9' : 'none' }}
                onClick={() => setEditingTx(tx)}
              >
                <TransactionItem transaction={tx} />
              </div>
            ))
          )}
        </div>

        {/* Modal di LUAR map */}
        {editingTx && (
          <EditTransactionModal
            transaction={editingTx}
            onClose={() => setEditingTx(null)}
          />
        )}
      </div>
    </div>
  );
}
