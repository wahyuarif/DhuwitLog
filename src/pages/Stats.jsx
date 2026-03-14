import { ArrowLeft } from 'lucide-react'
import { useStore } from '../store/useStore'
import { CATS } from '../data/categories'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts'

export default function Stats({ onNavigate }) {
  const { transactions, theme } = useStore()
  const now = new Date()

  // 7 hari terakhir
  const days = {}
  for (let i = 6; i >= 0; i--) {
    const d = new Date(now)
    d.setDate(now.getDate() - i)
    const k = d.toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })
    days[k] = { inc: 0, exp: 0, label: k }
  }
  transactions.forEach(t => {
    const d = new Date(t.date)
    const k = d.toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })
    if (days[k]) days[k][t.type === 'income' ? 'inc' : 'exp'] += t.amount
  })
  const chartData = Object.values(days)

  // Budget bulan ini
  const monthTxs = transactions.filter(t => {
    const d = new Date(t.date)
    return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear()
  })
  const catTotals = {}
  monthTxs.filter(t => t.type === 'expense').forEach(t => {
    catTotals[t.cat] = (catTotals[t.cat] || 0) + t.amount
  })

  const fmt = (n) => {
    if (n >= 1000000) return 'Rp ' + (n / 1000000).toFixed(1) + 'jt'
    if (n >= 1000) return 'Rp ' + Math.round(n / 1000) + 'rb'
    return 'Rp ' + n
  }

  return (
    <div style={{ paddingBottom: 90 }}>
      {/* Header */}
      <div style={{ padding: '20px 20px 0', display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
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
        <div style={{ fontSize: 16, fontWeight: 800, color: '#1A1D2E' }}>Statistik</div>
      </div>

      {/* Bar Chart */}
      <div style={{ padding: '16px 20px 0' }}>
        <div style={{ fontSize: 15, fontWeight: 700, color: '#1A1D2E', marginBottom: 12 }}>
          7 Hari Terakhir
        </div>
        <div style={{ background: '#fff', borderRadius: 14, padding: 16, boxShadow: '0 2px 8px rgba(59,91,219,.07)' }}>
          {/* Legend */}
          <div style={{ display: 'flex', gap: 16, marginBottom: 12 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 11, color: '#6B7280' }}>
              <div style={{ width: 10, height: 10, borderRadius: 2, background: theme }} />
              Pemasukan
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 11, color: '#6B7280' }}>
              <div style={{ width: 10, height: 10, borderRadius: 2, background: '#EF4444' }} />
              Pengeluaran
            </div>
          </div>
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={chartData} barGap={4}>
              <XAxis
                dataKey="label" tick={{ fontSize: 10, fill: '#9CA3AF' }}
                axisLine={false} tickLine={false}
              />
              <YAxis
                tick={{ fontSize: 10, fill: '#9CA3AF' }}
                axisLine={false} tickLine={false}
                tickFormatter={v => v >= 1000 ? Math.round(v / 1000) + 'rb' : v}
              />
              <Tooltip
                formatter={(val, name) => [fmt(val), name === 'inc' ? 'Pemasukan' : 'Pengeluaran']}
                contentStyle={{ borderRadius: 10, border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,.1)', fontSize: 12 }}
              />
              <Bar dataKey="inc" fill={theme} radius={[6, 6, 0, 0]} />
              <Bar dataKey="exp" fill="#EF4444" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Budget */}
      <div style={{ padding: '16px 20px 0' }}>
        <div style={{ fontSize: 15, fontWeight: 700, color: '#1A1D2E', marginBottom: 12 }}>
          Budget Bulan Ini
        </div>
        {CATS.expense.map(cat => {
          const spent = catTotals[cat.n] || 0
          const pct = Math.min(100, Math.round(spent / cat.b * 100))
          const over = spent > cat.b
          return (
            <div key={cat.n} style={{
              background: '#fff', borderRadius: 14, padding: 14,
              boxShadow: '0 2px 8px rgba(59,91,219,.07)', marginBottom: 8,
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <div style={{
                    width: 34, height: 34, borderRadius: 10,
                    background: cat.c + '18', color: cat.c,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 16,
                  }}>
                    💰
                  </div>
                  <div>
                    <div style={{ fontSize: 12, fontWeight: 700, color: '#1A1D2E' }}>{cat.n}</div>
                    <div style={{ fontSize: 10, color: '#9CA3AF' }}>{fmt(spent)} / {fmt(cat.b)}</div>
                  </div>
                </div>
                <div style={{ fontSize: 12, fontWeight: 700, color: over ? '#EF4444' : cat.c }}>
                  {pct}%
                </div>
              </div>
              <div style={{ height: 6, background: '#F1F5F9', borderRadius: 3, overflow: 'hidden' }}>
                <div style={{
                  width: pct + '%', height: '100%', borderRadius: 3,
                  background: over ? '#EF4444' : cat.c, transition: '.6s',
                }} />
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}