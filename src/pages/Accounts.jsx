import { ArrowLeft, Plus, Wallet, CreditCard, Smartphone, PiggyBank, Building2, CircleDollarSign } from 'lucide-react'
import { useStore } from '../store/useStore'

const ACCT_ICONS = {
  'Tunai': Wallet,
  'Bank BCA': Building2,
  'Bank Mandiri': Building2,
  'Bank BRI': Building2,
  'GoPay': Smartphone,
  'OVO': Smartphone,
  'Dana': Smartphone,
  'Tabungan': PiggyBank,
}

const ACCT_COLORS = [
  '#3B5BDB', '#7C3AED', '#059669', '#EA580C',
  '#0891B2', '#DB2777', '#D97706', '#DC2626',
]

export default function Accounts({ onNavigate }) {
  const { accounts, addAccount, transactions, theme } = useStore()

  const fmt = (n) => {
    if (n >= 1000000) return 'Rp ' + (n / 1000000).toFixed(1) + 'jt'
    if (n >= 1000) return 'Rp ' + Math.round(n / 1000) + 'rb'
    return 'Rp ' + n.toLocaleString('id-ID')
  }

  const fmtFull = (n) => 'Rp ' + Math.abs(n).toLocaleString('id-ID')

  const totalBalance = accounts.reduce((a, acc) => a + acc.b, 0)

  const handleAddAccount = () => {
    const name = window.prompt('Nama akun baru:')
    if (name?.trim()) addAccount(name.trim())
  }

  return (
    <div style={{ paddingBottom: 90 }}>
      {/* Header */}
      <div style={{
        padding: '20px 20px 0', display: 'flex',
        alignItems: 'center', justifyContent: 'space-between', marginBottom: 16,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
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
          <div style={{ fontSize: 16, fontWeight: 800, color: '#1A1D2E' }}>Akun Saya</div>
        </div>
        <button
          onClick={handleAddAccount}
          style={{
            background: theme, border: 'none', color: '#fff',
            padding: '7px 14px', borderRadius: 20, fontSize: 11,
            fontWeight: 700, fontFamily: 'Plus Jakarta Sans, sans-serif',
            cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 5,
          }}
        >
          <Plus size={12} /> Tambah
        </button>
      </div>

      {/* Total Balance Card */}
      <div style={{ padding: '0 20px', marginBottom: 16 }}>
        <div style={{
          background: theme, borderRadius: 20, padding: 20,
          position: 'relative', overflow: 'hidden',
        }}>
          <div style={{
            position: 'absolute', top: -30, right: -30,
            width: 120, height: 120, background: 'rgba(255,255,255,.07)', borderRadius: '50%',
          }} />
          <div style={{ fontSize: 11, color: 'rgba(255,255,255,.65)', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 4 }}>
            Total Semua Akun
          </div>
          <div style={{ fontSize: 30, fontWeight: 800, color: '#fff', letterSpacing: -1 }}>
            {fmtFull(totalBalance)}
          </div>
          <div style={{ fontSize: 11, color: 'rgba(255,255,255,.55)', marginTop: 4 }}>
            {accounts.length} akun aktif
          </div>
        </div>
      </div>

      {/* Account Grid */}
      <div style={{
        display: 'grid', gridTemplateColumns: '1fr 1fr',
        gap: 10, padding: '0 20px', marginBottom: 16,
      }}>
        {accounts.map((acc, i) => {
          const Icon = ACCT_ICONS[acc.n] || CreditCard
          const color = ACCT_COLORS[i % ACCT_COLORS.length]

          // Hitung transaksi akun ini
          const txCount = transactions.filter(t => t.account === acc.n).length

          return (
            <div key={acc.id} style={{
              background: '#fff', borderRadius: 14, padding: 16,
              boxShadow: '0 2px 8px rgba(59,91,219,.07)',
              cursor: 'pointer', transition: '.2s',
            }}
              onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-2px)'}
              onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
            >
              <div style={{
                width: 40, height: 40, borderRadius: 12,
                background: color + '18', color: color,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                marginBottom: 10,
              }}>
                <Icon size={18} />
              </div>
              <div style={{ fontSize: 12, fontWeight: 600, color: '#6B7280', marginBottom: 2 }}>
                {acc.n}
              </div>
              <div style={{ fontSize: 16, fontWeight: 800, color: '#1A1D2E' }}>
                {fmt(acc.b)}
              </div>
              <div style={{ fontSize: 10, color: '#9CA3AF', marginTop: 4 }}>
                {txCount} transaksi
              </div>
            </div>
          )
        })}
      </div>

      {/* Recent by Account */}
      <div style={{ padding: '0 20px' }}>
        <div style={{ fontSize: 15, fontWeight: 700, color: '#1A1D2E', marginBottom: 12 }}>
          Ringkasan per Akun
        </div>
        {accounts.map((acc, i) => {
          const color = ACCT_COLORS[i % ACCT_COLORS.length]
          const accTxs = transactions.filter(t => t.account === acc.n)
          const inc = accTxs.filter(t => t.type === 'income').reduce((a, t) => a + t.amount, 0)
          const exp = accTxs.filter(t => t.type === 'expense').reduce((a, t) => a + t.amount, 0)

          return (
            <div key={acc.id} style={{
              background: '#fff', borderRadius: 14, padding: 14,
              boxShadow: '0 2px 8px rgba(59,91,219,.07)', marginBottom: 8,
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: '#1A1D2E' }}>{acc.n}</div>
                <div style={{ fontSize: 13, fontWeight: 800, color }}>
                  {fmt(acc.b)}
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                <div style={{ background: '#DCFCE7', borderRadius: 8, padding: '8px 10px' }}>
                  <div style={{ fontSize: 9, color: '#15803D', fontWeight: 700, marginBottom: 2 }}>MASUK</div>
                  <div style={{ fontSize: 12, fontWeight: 700, color: '#15803D' }}>{fmt(inc)}</div>
                </div>
                <div style={{ background: '#FEE2E2', borderRadius: 8, padding: '8px 10px' }}>
                  <div style={{ fontSize: 9, color: '#B91C1C', fontWeight: 700, marginBottom: 2 }}>KELUAR</div>
                  <div style={{ fontSize: 12, fontWeight: 700, color: '#B91C1C' }}>{fmt(exp)}</div>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}