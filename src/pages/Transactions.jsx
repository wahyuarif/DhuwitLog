import { ArrowLeft, Search } from 'lucide-react'
import { useState } from 'react'
import { useStore } from '../store/useStore'
import TransactionItem from '../components/TransactionItem'

export default function Transactions({ onNavigate }) {
  const { transactions, theme } = useStore()
  const [search, setSearch] = useState('')

  const filtered = search
    ? transactions.filter(t =>
        (t.note || '').toLowerCase().includes(search.toLowerCase()) ||
        t.cat.toLowerCase().includes(search.toLowerCase())
      )
    : transactions

  const sorted = [...filtered].reverse()

  // Group by date
  const grouped = {}
  sorted.forEach(t => {
    const d = new Date(t.date)
    const key = d.toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long' })
    if (!grouped[key]) grouped[key] = []
    grouped[key].push(t)
  })

  return (
    <div style={{ paddingBottom: 90 }}>
      {/* Header */}
      <div style={{ padding: '20px 20px 12px', display: 'flex', alignItems: 'center', gap: 10 }}>
        <button
          onClick={() => onNavigate('home')}
          style={{
            background: theme + '22', border: 'none', color: theme,
            width: 34, height: 34, borderRadius: 10, display: 'flex',
            alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
          }}
        >
          <ArrowLeft size={16} />
        </button>
        <div style={{ fontSize: 16, fontWeight: 800, color: '#1A1D2E' }}>Semua Transaksi</div>
      </div>

      {/* Search */}
      <div style={{
        margin: '0 20px 16px', background: '#fff', borderRadius: 10,
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

      {/* Grouped Transactions */}
      <div style={{ padding: '0 20px' }}>
        {Object.keys(grouped).length === 0 ? (
          <div style={{
            background: '#fff', borderRadius: 14, padding: 32,
            textAlign: 'center', fontSize: 12, color: '#9CA3AF',
            boxShadow: '0 2px 8px rgba(59,91,219,.07)',
          }}>
            Belum ada transaksi
          </div>
        ) : (
          Object.entries(grouped).map(([date, txs]) => (
            <div key={date} style={{ marginBottom: 16 }}>
              {/* Date Label */}
              <div style={{
                display: 'flex', alignItems: 'center', gap: 5,
                fontSize: 10, fontWeight: 700, color: '#9CA3AF',
                textTransform: 'uppercase', letterSpacing: .5,
                marginBottom: 6,
              }}>
                {date}
              </div>

              {/* Transactions */}
              <div style={{
                background: '#fff', borderRadius: 14,
                boxShadow: '0 2px 8px rgba(59,91,219,.07)', overflow: 'hidden',
              }}>
                {txs.map((tx, i) => (
                  <div key={tx.id} style={{ borderTop: i > 0 ? '1px solid #F1F5F9' : 'none' }}>
                    <TransactionItem transaction={tx} />
                  </div>
                ))}
              </div>

              {/* Daily Summary */}
              <div style={{
                display: 'flex', justifyContent: 'flex-end', gap: 12,
                padding: '6px 4px 0', fontSize: 11,
              }}>
                <span style={{ color: '#22C55E', fontWeight: 600 }}>
                  +Rp {txs.filter(t => t.type === 'income').reduce((a, t) => a + t.amount, 0).toLocaleString('id-ID')}
                </span>
                <span style={{ color: '#EF4444', fontWeight: 600 }}>
                  −Rp {txs.filter(t => t.type === 'expense').reduce((a, t) => a + t.amount, 0).toLocaleString('id-ID')}
                </span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}