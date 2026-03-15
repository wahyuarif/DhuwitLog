import { useState } from 'react';
import { getIconByName } from '../data/categories';
import { useStore } from '../store/useStore';
import ConfirmDialog from './ConfirmDialog';

export default function TransactionItem({ transaction }) {
  const { deleteTransaction, getCats, theme } = useStore();
  const { id, type, amount, cat, note, account } = transaction;
  const [showConfirm, setShowConfirm] = useState(false);

  const allCats = [...getCats('expense'), ...getCats('income')];
  const catData = allCats.find((c) => c.n === cat) || {
    c: '#888',
    iconName: 'CircleDollarSign',
  };
  const Icon = getIconByName(catData.iconName);

  const fmt = (n) => {
    if (n >= 1000000) return 'Rp ' + (n / 1000000).toFixed(1) + 'jt';
    if (n >= 1000) return 'Rp ' + Math.round(n / 1000) + 'rb';
    return 'Rp ' + n.toLocaleString('id-ID');
  };

  return (
    <>
      <div
        onClick={() => setShowConfirm(true)}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 12,
          padding: '12px 14px',
          cursor: 'pointer',
          transition: '.15s',
          borderRadius: 10,
        }}
        onMouseEnter={(e) => (e.currentTarget.style.background = '#F8FAFF')}
        onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
      >
        <div
          style={{
            width: 40,
            height: 40,
            borderRadius: 12,
            flexShrink: 0,
            background: catData.c + '18',
            color: catData.c,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Icon size={18} />
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 13, fontWeight: 600, color: '#1A1D2E' }}>
            {note || cat}
          </div>
          <div
            style={{
              fontSize: 10,
              color: '#9CA3AF',
              marginTop: 1,
              display: 'flex',
              alignItems: 'center',
              gap: 4,
            }}
          >
            <span>{cat}</span>
            <span>·</span>
            <span>{account}</span>
          </div>
        </div>
        <div
          style={{
            fontSize: 13,
            fontWeight: 700,
            color: type === 'expense' ? '#EF4444' : '#22C55E',
          }}
        >
          {type === 'expense' ? '−' : '+'}
          {fmt(amount)}
        </div>
      </div>

      {showConfirm && (
        <ConfirmDialog
          title="Hapus Transaksi?"
          desc={`${note || cat} · ${type === 'expense' ? '−' : '+'}${fmt(amount)}`}
          theme={theme}
          onConfirm={() => {
            deleteTransaction(id);
            setShowConfirm(false);
          }}
          onCancel={() => setShowConfirm(false)}
        />
      )}
    </>
  );
}
