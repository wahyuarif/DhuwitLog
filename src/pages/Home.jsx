import { Search, Bell, ArrowUpRight } from 'lucide-react'
import { useState } from 'react'
import { useStore } from '../store/useStore'
import HeroCard from '../components/HeroCard'
import TransactionItem from '../components/TransactionItem'

export default function Home({ onNavigate, onOpenModal }) {
  const { userName, getFiltered, theme } = useStore()
  const [search, setSearch] = useState('')

  const filtered = getFiltered()
  const recent = filtered.slice(-5).reverse()
  const searched = search
    ? filtered.filter(t =>
        (t.note || '').toLowerCase().includes(search.toLowerCase()) ||
        t.cat.toLowerCase().includes(search.toLowerCase())
      ).reverse()
    : recent

  const catTotals = {}
  filtered.filter(t => t.type === 'expense').forEach(t => {
    catTotals[t.cat] = (catTotals[t.cat] || 0) + t.amount
  })
  const total = Object.values(catTotals).reduce((a, b) => a + b, 0)
  const topCats = Object.entries(catTotals).sort((a, b) => b[1] - a[1]).slice(0, 4)

  return (
    <div style={{ paddingBottom: 90 }}>
      {/* Topbar */}
      <div style={{
        padding: '20px 20px 0', display: 'flex',
        alignItems: 'center', justifyContent: 'space-between',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{
            width: 42, height: 42, borderRadius: 14,
            background: theme + '22', display: 'flex',
            alignItems: 'center', justifyContent: 'center',
            border: `2px solid ${theme}44`,
            fontSize: 20,
          }}>
            🧑
          </div>
          <div>
            <div style={{ fontSize: 11, color: '#6B7280', marginBottom: 1 }}>Selamat datang 👋</div>
            <div style={{ fontSize: 15, fontWeight: 700, color: '#1A1D2E' }}>{userName}</div>
          </div>
        </div>
        <button style={{
          width: 40, height: 40, background: '#fff', borderRadius: 12,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: '0 2px 8px rgba(59,91,219,.07)', border: 'none',
          cursor: 'pointer', color: '#6B7280', position: 'relative',
        }}>
          <Bell size={18} />
          <div style={{
            width: 7, height: 7, background: '#EF4444', borderRadius: '50%',
            position: 'absolute', top: 8, right: 8, border: '2px solid #fff',
          }} />
        </button>
      </div>

      {/* Search */}
      <div style={{
        margin: '12px 20px 0', background: '#fff', borderRadius: 10,
        padding: '10px 14px', display: 'flex', alignItems: 'center', gap: 8,
        boxShadow: '0 2px 8px rgba(59,91,219,.07)',
      }}>
        <Search size={14} color="#9CA3AF" />
        <input
          type="text" placeholder="Cari transaksi..."
          value={search} onChange={e => setSearch(e.target.value)}
          style={{
            border: 'none', background: 'none', flex: 1,
            fontFamily: 'Plus Jakarta Sans, sans-serif',
            fontSize: 13, color: '#1A1D2E', outline: 'none',
          }}
        />
      </div>

      {/* Hero Card */}
      <HeroCard />

      {/* Quick Actions */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, padding: '14px 20px 0' }}>
        <button onClick={() => onOpenModal('expense')} style={{
          background: '#fff', border: 'none', borderRadius: 14, padding: 14,
          cursor: 'pointer', textAlign: 'left',
          boxShadow: '0 2px 8px rgba(59,91,219,.07)', transition: 'all .2s',
        }}>
          <div style={{ width: 38, height: 38, borderRadius: 11, background: '#FEE2E2', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 9 }}>
            <ArrowUpRight size={18} color="#EF4444" style={{ transform: 'rotate(90deg)' }} />
          </div>
          <div style={{ fontSize: 13, fontWeight: 700, color: '#1A1D2E' }}>Pengeluaran</div>
          <div style={{ fontSize: 10, color: '#9CA3AF', marginTop: 1 }}>Catat yang dibelanjakan</div>
        </button>
        <button onClick={() => onOpenModal('income')} style={{
          background: '#fff', border: 'none', borderRadius: 14, padding: 14,
          cursor: 'pointer', textAlign: 'left',
          boxShadow: '0 2px 8px rgba(59,91,219,.07)', transition: 'all .2s',
        }}>
          <div style={{ width: 38, height: 38, borderRadius: 11, background: '#DCFCE7', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 9 }}>
            <ArrowUpRight size={18} color="#22C55E" />
          </div>
          <div style={{ fontSize: 13, fontWeight: 700, color: '#1A1D2E' }}>Pemasukan</div>
          <div style={{ fontSize: 10, color: '#9CA3AF', marginTop: 1 }}>Catat yang diterima</div>
        </button>
      </div>

      {/* Distribution */}
      {topCats.length > 0 && (
        <div style={{ padding: '16px 20px 0' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
            <div style={{ fontSize: 15, fontWeight: 700, color: '#1A1D2E' }}>Distribusi</div>
            <button onClick={() => onNavigate('stats')} style={{ fontSize: 12, color: theme, fontWeight: 600, background: 'none', border: 'none', cursor: 'pointer' }}>
              Detail →
            </button>
          </div>
          <div style={{ background: '#fff', borderRadius: 14, padding: 16, boxShadow: '0 2px 8px rgba(59,91,219,.07)' }}>
            {topCats.map(([cat, val]) => {
              const pct = total ? Math.round(val / total * 100) : 0
              const colors = { Belanja: '#3B5BDB', Makan: '#F59E0B', Transport: '#06B6D4', Rumah: '#8B5CF6', Kesehatan: '#10B981', Hiburan: '#EF4444', Fashion: '#EC4899', Edukasi: '#F97316' }
              const c = colors[cat] || '#888'
              return (
                <div key={cat} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
                  <div style={{ width: 8, height: 8, borderRadius: 3, background: c, flexShrink: 0 }} />
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 3 }}>
                      <span style={{ fontSize: 11, fontWeight: 600, color: '#1A1D2E' }}>{cat}</span>
                      <span style={{ fontSize: 10, color: '#9CA3AF' }}>{pct}%</span>
                    </div>
                    <div style={{ height: 4, background: '#F1F5F9', borderRadius: 2 }}>
                      <div style={{ width: pct + '%', height: '100%', background: c, borderRadius: 2, transition: '.5s' }} />
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* Recent Transactions */}
      <div style={{ padding: '16px 20px 0' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
          <div style={{ fontSize: 15, fontWeight: 700, color: '#1A1D2E' }}>Transaksi Terbaru</div>
          <button onClick={() => onNavigate('transactions')} style={{ fontSize: 12, color: theme, fontWeight: 600, background: 'none', border: 'none', cursor: 'pointer' }}>
            Semua →
          </button>
        </div>
        <div style={{ background: '#fff', borderRadius: 14, boxShadow: '0 2px 8px rgba(59,91,219,.07)', overflow: 'hidden' }}>
          {searched.length === 0 ? (
            <div style={{ padding: 24, textAlign: 'center', fontSize: 12, color: '#9CA3AF' }}>
              Belum ada transaksi
            </div>
          ) : (
            searched.map((tx, i) => (
              <div key={tx.id} style={{ borderTop: i > 0 ? '1px solid #F1F5F9' : 'none' }}>
                <TransactionItem transaction={tx} />
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}