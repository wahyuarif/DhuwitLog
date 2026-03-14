import { ShoppingBag, Utensils, Car, Home, Heart, Gamepad2, Shirt, BookOpen, Briefcase, Award, TrendingUp, Gift, Monitor, Store, CircleDollarSign } from 'lucide-react'
import { useStore } from '../store/useStore'

const ICONS = {
  Belanja: ShoppingBag, Makan: Utensils, Transport: Car,
  Rumah: Home, Kesehatan: Heart, Hiburan: Gamepad2,
  Fashion: Shirt, Edukasi: BookOpen, Gaji: Briefcase,
  Bonus: Award, Investasi: TrendingUp, Hadiah: Gift,
  Freelance: Monitor, Bisnis: Store,
}

const CATS_COLOR = {
  Belanja: '#3B5BDB', Makan: '#F59E0B', Transport: '#06B6D4',
  Rumah: '#8B5CF6', Kesehatan: '#10B981', Hiburan: '#EF4444',
  Fashion: '#EC4899', Edukasi: '#F97316', Gaji: '#10B981',
  Bonus: '#F59E0B', Investasi: '#3B5BDB', Hadiah: '#8B5CF6',
  Freelance: '#EC4899', Bisnis: '#06B6D4',
}

export default function TransactionItem({ transaction }) {
  const { deleteTransaction } = useStore()
  const { id, type, amount, cat, note, account, date } = transaction

  const Icon = ICONS[cat] || CircleDollarSign
  const color = CATS_COLOR[cat] || '#888'

  const fmt = (n) => {
    if (n >= 1000000) return 'Rp ' + (n / 1000000).toFixed(1) + 'jt'
    if (n >= 1000) return 'Rp ' + Math.round(n / 1000) + 'rb'
    return 'Rp ' + n.toLocaleString('id-ID')
  }

  const handleDelete = () => {
    if (window.confirm('Hapus transaksi ini?')) {
      deleteTransaction(id)
    }
  }

  return (
    <div
      onClick={handleDelete}
      style={{
        display: 'flex', alignItems: 'center', gap: 12,
        padding: '12px 14px', cursor: 'pointer', transition: '.15s',
        borderRadius: 10,
      }}
      onMouseEnter={e => e.currentTarget.style.background = '#F8FAFF'}
      onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
    >
      {/* Icon */}
      <div style={{
        width: 40, height: 40, borderRadius: 12, flexShrink: 0,
        background: color + '18', color: color,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        <Icon size={18} />
      </div>

      {/* Info */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 13, fontWeight: 600, color: '#1A1D2E' }}>
          {note || cat}
        </div>
        <div style={{ fontSize: 10, color: '#9CA3AF', marginTop: 1, display: 'flex', alignItems: 'center', gap: 4 }}>
          <span>{cat}</span>
          <span>·</span>
          <span>{account}</span>
        </div>
      </div>

      {/* Amount */}
      <div style={{
        fontSize: 13, fontWeight: 700, textAlign: 'right',
        color: type === 'expense' ? '#EF4444' : '#22C55E',
      }}>
        {type === 'expense' ? '−' : '+'}{fmt(amount)}
      </div>
    </div>
  )
}