import {
  ArrowLeft,
  Building2,
  CreditCard,
  Pencil,
  PiggyBank,
  Plus,
  Smartphone,
  Trash2,
  Wallet,
} from 'lucide-react';
import { useState } from 'react';
import ConfirmDialog from '../components/ConfirmDialog';
import { useStore } from '../store/useStore';

const ACCT_ICONS = {
  Tunai: Wallet,
  'Bank BCA': Building2,
  'Bank Mandiri': Building2,
  'Bank BRI': Building2,
  GoPay: Smartphone,
  OVO: Smartphone,
  Dana: Smartphone,
  Tabungan: PiggyBank,
};

const ACCT_COLORS = [
  '#3B5BDB',
  '#7C3AED',
  '#059669',
  '#EA580C',
  '#0891B2',
  '#DB2777',
  '#D97706',
  '#DC2626',
];

export default function Accounts({ onNavigate }) {
  const { accounts, addAccount, deleteAccount, transactions, theme } =
    useStore();
  const [showConfirm, setShowConfirm] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [editName, setEditName] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [newName, setNewName] = useState('');

  // Tambah deleteAccount & editAccount ke store
  const store = useStore();

  const fmt = (n) => {
    if (Math.abs(n) >= 1000000)
      return 'Rp ' + (Math.abs(n) / 1000000).toFixed(1) + 'jt';
    if (Math.abs(n) >= 1000)
      return 'Rp ' + Math.round(Math.abs(n) / 1000) + 'rb';
    return 'Rp ' + Math.abs(n).toLocaleString('id-ID');
  };

  const fmtFull = (n) => 'Rp ' + Math.abs(n).toLocaleString('id-ID');
  const totalBalance = accounts.reduce((a, acc) => a + acc.b, 0);

  const handleAdd = () => {
    if (!newName.trim()) return;
    addAccount(newName.trim());
    setNewName('');
    setShowAddForm(false);
  };

  const handleDelete = (acc) => {
    const hasTx = transactions.some((t) => t.account === acc.n);
    if (hasTx) {
      setShowConfirm({ ...acc, hasTx: true });
    } else {
      setShowConfirm(acc);
    }
  };

  const confirmDelete = () => {
    deleteAccount(showConfirm.id);
    setShowConfirm(null);
  };

  const handleEdit = (acc) => {
    setEditingId(acc.id);
    setEditName(acc.n);
  };

  const confirmEdit = (id) => {
    if (!editName.trim()) return;
    editAccount(id, editName.trim());
    setEditingId(null);
  };

  return (
    <div style={{ paddingBottom: 90 }}>
      {/* Header */}
      <div
        style={{
          padding: '20px 20px 0',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: 16,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
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
            Akun Saya
          </div>
        </div>
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          style={{
            background: theme,
            border: 'none',
            color: '#fff',
            padding: '7px 14px',
            borderRadius: 20,
            fontSize: 11,
            fontWeight: 700,
            fontFamily: 'Plus Jakarta Sans, sans-serif',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: 5,
          }}
        >
          <Plus size={12} /> Tambah
        </button>
      </div>

      {/* Add Form */}
      {showAddForm && (
        <div style={{ padding: '0 20px', marginBottom: 12 }}>
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
                fontSize: 12,
                fontWeight: 700,
                color: '#1A1D2E',
                marginBottom: 10,
              }}
            >
              Nama Akun Baru
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              <input
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
                placeholder="Contoh: Bank BNI"
                autoFocus
                style={{
                  flex: 1,
                  background: '#F8FAFF',
                  border: `2px solid ${theme}33`,
                  borderRadius: 10,
                  padding: '10px 14px',
                  fontFamily: 'Plus Jakarta Sans, sans-serif',
                  fontSize: 13,
                  color: '#1A1D2E',
                  outline: 'none',
                }}
              />
              <button
                onClick={handleAdd}
                style={{
                  background: theme,
                  border: 'none',
                  color: '#fff',
                  padding: '10px 16px',
                  borderRadius: 10,
                  fontSize: 12,
                  fontWeight: 700,
                  fontFamily: 'Plus Jakarta Sans, sans-serif',
                  cursor: 'pointer',
                }}
              >
                Simpan
              </button>
              <button
                onClick={() => {
                  setShowAddForm(false);
                  setNewName('');
                }}
                style={{
                  background: '#F1F5F9',
                  border: 'none',
                  color: '#6B7280',
                  padding: '10px 12px',
                  borderRadius: 10,
                  fontSize: 12,
                  fontWeight: 700,
                  fontFamily: 'Plus Jakarta Sans, sans-serif',
                  cursor: 'pointer',
                }}
              >
                Batal
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Total Balance Card */}
      <div style={{ padding: '0 20px', marginBottom: 16 }}>
        <div
          style={{
            background: theme,
            borderRadius: 20,
            padding: 20,
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          <div
            style={{
              position: 'absolute',
              top: -30,
              right: -30,
              width: 120,
              height: 120,
              background: 'rgba(255,255,255,.07)',
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
            Total Semua Akun
          </div>
          <div
            style={{
              fontSize: 30,
              fontWeight: 800,
              color: '#fff',
              letterSpacing: -1,
            }}
          >
            {fmtFull(totalBalance)}
          </div>
          <div
            style={{
              fontSize: 11,
              color: 'rgba(255,255,255,.55)',
              marginTop: 4,
            }}
          >
            {accounts.length} akun aktif
          </div>
        </div>
      </div>

      {/* Account List */}
      <div style={{ padding: '0 20px', marginBottom: 16 }}>
        <div
          style={{
            fontSize: 15,
            fontWeight: 700,
            color: '#1A1D2E',
            marginBottom: 12,
          }}
        >
          Daftar Akun
        </div>
        {accounts.map((acc, i) => {
          const Icon = ACCT_ICONS[acc.n] || CreditCard;
          const color = ACCT_COLORS[i % ACCT_COLORS.length];
          const txCount = transactions.filter(
            (t) => t.account === acc.n
          ).length;
          const isEditing = editingId === acc.id;

          return (
            <div
              key={acc.id}
              style={{
                background: '#fff',
                borderRadius: 14,
                padding: 14,
                boxShadow: '0 2px 8px rgba(59,91,219,.07)',
                marginBottom: 8,
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div
                  style={{
                    width: 44,
                    height: 44,
                    borderRadius: 12,
                    background: color + '18',
                    color,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                  }}
                >
                  <Icon size={20} />
                </div>

                <div style={{ flex: 1, minWidth: 0 }}>
                  {isEditing ? (
                    <div style={{ display: 'flex', gap: 6 }}>
                      <input
                        value={editName}
                        onChange={(e) => setEditName(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') confirmEdit(acc.id);
                          if (e.key === 'Escape') setEditingId(null);
                        }}
                        autoFocus
                        style={{
                          flex: 1,
                          background: '#F8FAFF',
                          border: `2px solid ${theme}`,
                          borderRadius: 8,
                          padding: '6px 10px',
                          fontFamily: 'Plus Jakarta Sans, sans-serif',
                          fontSize: 13,
                          color: '#1A1D2E',
                          outline: 'none',
                        }}
                      />
                      <button
                        onClick={() => confirmEdit(acc.id)}
                        style={{
                          background: theme,
                          border: 'none',
                          color: '#fff',
                          padding: '6px 12px',
                          borderRadius: 8,
                          fontSize: 11,
                          fontWeight: 700,
                          fontFamily: 'Plus Jakarta Sans, sans-serif',
                          cursor: 'pointer',
                        }}
                      >
                        ✓
                      </button>
                      <button
                        onClick={() => setEditingId(null)}
                        style={{
                          background: '#F1F5F9',
                          border: 'none',
                          color: '#6B7280',
                          padding: '6px 10px',
                          borderRadius: 8,
                          fontSize: 11,
                          fontWeight: 700,
                          fontFamily: 'Plus Jakarta Sans, sans-serif',
                          cursor: 'pointer',
                        }}
                      >
                        ✕
                      </button>
                    </div>
                  ) : (
                    <>
                      <div
                        style={{
                          fontSize: 14,
                          fontWeight: 700,
                          color: '#1A1D2E',
                        }}
                      >
                        {acc.n}
                      </div>
                      <div
                        style={{ fontSize: 11, color: '#9CA3AF', marginTop: 1 }}
                      >
                        {txCount} transaksi
                      </div>
                    </>
                  )}
                </div>

                {!isEditing && (
                  <div
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'flex-end',
                      gap: 6,
                    }}
                  >
                    <div
                      style={{
                        fontSize: 15,
                        fontWeight: 800,
                        color: '#1A1D2E',
                      }}
                    >
                      {fmt(acc.b)}
                    </div>
                    <div style={{ display: 'flex', gap: 6 }}>
                      <button
                        onClick={() => handleEdit(acc)}
                        style={{
                          width: 28,
                          height: 28,
                          borderRadius: 8,
                          background: theme + '15',
                          border: 'none',
                          color: theme,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          cursor: 'pointer',
                        }}
                      >
                        <Pencil size={12} />
                      </button>
                      <button
                        onClick={() => handleDelete(acc)}
                        style={{
                          width: 28,
                          height: 28,
                          borderRadius: 8,
                          background: '#FEE2E2',
                          border: 'none',
                          color: '#EF4444',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          cursor: 'pointer',
                        }}
                      >
                        <Trash2 size={12} />
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Income/Expense summary */}
              {!isEditing &&
                (() => {
                  const accTxs = transactions.filter(
                    (t) => t.account === acc.n
                  );
                  const inc = accTxs
                    .filter((t) => t.type === 'income')
                    .reduce((a, t) => a + t.amount, 0);
                  const exp = accTxs
                    .filter((t) => t.type === 'expense')
                    .reduce((a, t) => a + t.amount, 0);
                  return (
                    <div
                      style={{
                        display: 'grid',
                        gridTemplateColumns: '1fr 1fr',
                        gap: 8,
                        marginTop: 10,
                      }}
                    >
                      <div
                        style={{
                          background: '#DCFCE7',
                          borderRadius: 8,
                          padding: '8px 10px',
                        }}
                      >
                        <div
                          style={{
                            fontSize: 9,
                            color: '#15803D',
                            fontWeight: 700,
                            marginBottom: 2,
                          }}
                        >
                          MASUK
                        </div>
                        <div
                          style={{
                            fontSize: 12,
                            fontWeight: 700,
                            color: '#15803D',
                          }}
                        >
                          {fmt(inc)}
                        </div>
                      </div>
                      <div
                        style={{
                          background: '#FEE2E2',
                          borderRadius: 8,
                          padding: '8px 10px',
                        }}
                      >
                        <div
                          style={{
                            fontSize: 9,
                            color: '#B91C1C',
                            fontWeight: 700,
                            marginBottom: 2,
                          }}
                        >
                          KELUAR
                        </div>
                        <div
                          style={{
                            fontSize: 12,
                            fontWeight: 700,
                            color: '#B91C1C',
                          }}
                        >
                          {fmt(exp)}
                        </div>
                      </div>
                    </div>
                  );
                })()}
            </div>
          );
        })}
      </div>

      {/* Confirm Delete */}
      {showConfirm && (
        <ConfirmDialog
          title="Hapus Akun?"
          desc={
            showConfirm.hasTx
              ? `Akun "${showConfirm.n}" memiliki transaksi. Data transaksi tidak akan ikut terhapus.`
              : `Akun "${showConfirm.n}" dengan saldo ${fmt(showConfirm.b)} akan dihapus permanen.`
          }
          onConfirm={confirmDelete}
          onCancel={() => setShowConfirm(null)}
          theme={theme}
        />
      )}
    </div>
  );
}
