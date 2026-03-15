import {
  ArrowDown,
  ArrowUp,
  CalendarDays,
  CreditCard,
  PenLine,
  Plus,
  Settings,
  X,
} from 'lucide-react';
import { useState } from 'react';
import { ICON_LIST, getIconByName } from '../data/categories';
import { useStore } from '../store/useStore';

export default function Modal({ type: initialType, onClose }) {
  const {
    accounts,
    addTransaction,
    theme,
    getCats,
    addCategory,
    deleteCategory,
  } = useStore();
  const [type, setType] = useState(initialType);
  const [amount, setAmount] = useState('');
  const [selectedCat, setSelectedCat] = useState(0);
  const [note, setNote] = useState('');
  const [accountId, setAccountId] = useState(accounts[0]?.id || 1);
  const [error, setError] = useState('');
  const [date, setDate] = useState(new Date().toLocaleDateString('en-CA'));

  // Mode tambah kategori
  const [showCatForm, setShowCatForm] = useState(false);
  const [catForm, setCatForm] = useState({
    n: '',
    c: '#3B5BDB',
    iconName: 'ShoppingBag',
  });
  const [showIconPicker, setShowIconPicker] = useState(false);

  const cats = getCats(type);

  const COLOR_OPTIONS = [
    '#3B5BDB',
    '#7C3AED',
    '#DB2777',
    '#059669',
    '#EA580C',
    '#0891B2',
    '#EF4444',
    '#F59E0B',
    '#10B981',
    '#EC4899',
    '#F97316',
    '#06B6D4',
  ];

  const handleSubmit = () => {
    const amt = parseFloat(amount);
    if (!amt || amt <= 0) {
      setError('Masukkan jumlah yang valid');
      return;
    }
    const acc = accounts.find((a) => a.id === parseInt(accountId));
    if (type === 'expense' && acc?.b < amt) {
      setError('Saldo tidak mencukupi');
      return;
    }

    const [y, m, d] = date.split('-').map(Number);
    const localDate = new Date(y, m - 1, d, 12, 0, 0);

    const result = addTransaction({
      type,
      amount: amt,
      cat: cats[selectedCat].n,
      note,
      accountId: parseInt(accountId),
      account: acc?.n || '',
      date: localDate.toISOString(),
    });

    if (result === 'insufficient') {
      setError('Saldo tidak mencukupi');
      return;
    }
    onClose();
  };

  const handleAddCat = () => {
    if (!catForm.n.trim()) return;
    addCategory(type, catForm);
    setCatForm({ n: '', c: '#3B5BDB', iconName: 'ShoppingBag' });
    setShowCatForm(false);
    setShowIconPicker(false);
  };

  const inputStyle = {
    width: '100%',
    background: '#F8FAFF',
    border: '2px solid transparent',
    borderRadius: 10,
    padding: '12px 14px',
    color: '#1A1D2E',
    fontFamily: 'Plus Jakarta Sans, sans-serif',
    fontSize: 13,
    outline: 'none',
    marginBottom: 12,
  };

  const SelectedIcon = getIconByName(catForm.iconName);

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(26,29,46,.4)',
        zIndex: 200,
        display: 'flex',
        alignItems: 'flex-end',
        justifyContent: 'center',
        backdropFilter: 'blur(4px)',
      }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div
        style={{
          background: '#fff',
          borderRadius: '28px 28px 0 0',
          padding: '20px 20px 32px',
          width: '100%',
          maxWidth: 400,
          maxHeight: '92vh',
          overflowY: 'auto',
        }}
      >
        <div
          style={{
            width: 40,
            height: 5,
            background: '#E5E7EB',
            borderRadius: 3,
            margin: '0 auto 18px',
          }}
        />

        {/* Header */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: 16,
          }}
        >
          <div style={{ fontSize: 17, fontWeight: 800, color: '#1A1D2E' }}>
            Tambah {type === 'expense' ? 'Pengeluaran' : 'Pemasukan'}
          </div>
          <button
            onClick={onClose}
            style={{
              background: '#F8FAFF',
              border: 'none',
              borderRadius: 10,
              width: 34,
              height: 34,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              color: '#6B7280',
            }}
          >
            <X size={16} />
          </button>
        </div>

        {/* Type Toggle */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: 6,
            background: '#F8FAFF',
            borderRadius: 14,
            padding: 4,
            marginBottom: 18,
          }}
        >
          {['expense', 'income'].map((t) => (
            <button
              key={t}
              onClick={() => {
                setType(t);
                setSelectedCat(0);
                setError('');
              }}
              style={{
                padding: 10,
                borderRadius: 10,
                border: 'none',
                fontFamily: 'Plus Jakarta Sans, sans-serif',
                fontSize: 12,
                fontWeight: 700,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 6,
                background:
                  type === t
                    ? t === 'expense'
                      ? '#EF4444'
                      : '#22C55E'
                    : 'transparent',
                color: type === t ? '#fff' : '#9CA3AF',
                transition: '.2s',
              }}
            >
              {t === 'expense' ? (
                <ArrowDown size={13} />
              ) : (
                <ArrowUp size={13} />
              )}
              {t === 'expense' ? 'Pengeluaran' : 'Pemasukan'}
            </button>
          ))}
        </div>

        {/* Amount */}
        <div
          style={{
            background: '#F8FAFF',
            borderRadius: 14,
            padding: 18,
            marginBottom: 16,
            textAlign: 'center',
          }}
        >
          <div
            style={{
              fontSize: 10,
              color: '#9CA3AF',
              marginBottom: 6,
              fontWeight: 600,
              letterSpacing: 0.5,
              textTransform: 'uppercase',
            }}
          >
            Jumlah (IDR)
          </div>
          <input
            type="number"
            id="amtInput"
            value={amount}
            onChange={(e) => {
              setAmount(e.target.value);
              setError('');
            }}
            placeholder="0"
            min="0"
            style={{
              background: 'none',
              border: 'none',
              fontFamily: 'Plus Jakarta Sans, sans-serif',
              fontSize: 36,
              fontWeight: 800,
              color: '#1A1D2E',
              textAlign: 'center',
              width: '100%',
              outline: 'none',
            }}
          />
        </div>

        {/* Category */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: 7,
          }}
        >
          <div
            style={{
              fontSize: 10,
              fontWeight: 700,
              color: '#9CA3AF',
              textTransform: 'uppercase',
              letterSpacing: 0.8,
            }}
          >
            Kategori
          </div>
          <button
            onClick={() => {
              setShowCatForm(!showCatForm);
              setShowIconPicker(false);
            }}
            style={{
              background: theme + '15',
              border: 'none',
              color: theme,
              borderRadius: 8,
              padding: '4px 10px',
              fontSize: 10,
              fontWeight: 700,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: 4,
              fontFamily: 'Plus Jakarta Sans, sans-serif',
            }}
          >
            <Settings size={10} /> Kelola
          </button>
        </div>

        {/* Add Category Form */}
        {showCatForm && (
          <div
            style={{
              background: '#F8FAFF',
              borderRadius: 12,
              padding: 14,
              marginBottom: 12,
              border: `1.5px solid ${theme}22`,
            }}
          >
            <div
              style={{
                fontSize: 11,
                fontWeight: 700,
                color: '#1A1D2E',
                marginBottom: 10,
              }}
            >
              Tambah Kategori Baru
            </div>

            {/* Icon Picker */}
            <div style={{ marginBottom: 10 }}>
              <div
                style={{
                  fontSize: 10,
                  color: '#9CA3AF',
                  fontWeight: 600,
                  marginBottom: 6,
                }}
              >
                ICON
              </div>
              <button
                onClick={() => setShowIconPicker(!showIconPicker)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  background: '#fff',
                  border: `1.5px solid ${theme}33`,
                  borderRadius: 10,
                  padding: '8px 12px',
                  cursor: 'pointer',
                  width: '100%',
                }}
              >
                <div
                  style={{
                    width: 28,
                    height: 28,
                    borderRadius: 8,
                    background: catForm.c + '20',
                    color: catForm.c,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <SelectedIcon size={15} />
                </div>
                <span
                  style={{
                    fontSize: 12,
                    color: '#1A1D2E',
                    fontFamily: 'Plus Jakarta Sans, sans-serif',
                    fontWeight: 600,
                  }}
                >
                  {catForm.iconName}
                </span>
                <span
                  style={{ marginLeft: 'auto', fontSize: 10, color: '#9CA3AF' }}
                >
                  ▼
                </span>
              </button>

              {/* Icon Grid */}
              {showIconPicker && (
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(6,1fr)',
                    gap: 6,
                    marginTop: 8,
                    background: '#fff',
                    borderRadius: 10,
                    padding: 10,
                    border: '1px solid #EEF2FF',
                    maxHeight: 180,
                    overflowY: 'auto',
                  }}
                >
                  {ICON_LIST.map(({ name, Icon }) => (
                    <button
                      key={name}
                      onClick={() => {
                        setCatForm((f) => ({ ...f, iconName: name }));
                        setShowIconPicker(false);
                      }}
                      style={{
                        width: '100%',
                        aspectRatio: '1',
                        borderRadius: 8,
                        border: 'none',
                        background:
                          catForm.iconName === name
                            ? catForm.c + '20'
                            : '#F8FAFF',
                        color:
                          catForm.iconName === name ? catForm.c : '#6B7280',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'pointer',
                        outline:
                          catForm.iconName === name
                            ? `2px solid ${catForm.c}`
                            : 'none',
                      }}
                    >
                      <Icon size={16} />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Nama */}
            <div
              style={{
                fontSize: 10,
                color: '#9CA3AF',
                fontWeight: 600,
                marginBottom: 6,
              }}
            >
              NAMA KATEGORI
            </div>
            <input
              value={catForm.n}
              onChange={(e) => setCatForm((f) => ({ ...f, n: e.target.value }))}
              placeholder="Contoh: Investasi Saham"
              style={{ ...inputStyle, marginBottom: 10 }}
            />

            {/* Warna */}
            <div
              style={{
                fontSize: 10,
                color: '#9CA3AF',
                fontWeight: 600,
                marginBottom: 6,
              }}
            >
              WARNA
            </div>
            <div
              style={{
                display: 'flex',
                gap: 6,
                flexWrap: 'wrap',
                marginBottom: 12,
              }}
            >
              {COLOR_OPTIONS.map((c) => (
                <button
                  key={c}
                  onClick={() => setCatForm((f) => ({ ...f, c }))}
                  style={{
                    width: 26,
                    height: 26,
                    borderRadius: 8,
                    background: c,
                    border: 'none',
                    cursor: 'pointer',
                    outline:
                      catForm.c === c
                        ? `3px solid ${c}`
                        : '3px solid transparent',
                    outlineOffset: 2,
                    transition: '.2s',
                  }}
                />
              ))}
            </div>

            <div style={{ display: 'flex', gap: 8 }}>
              <button
                onClick={handleAddCat}
                style={{
                  flex: 1,
                  background: theme,
                  border: 'none',
                  color: '#fff',
                  borderRadius: 10,
                  padding: '10px',
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
                  setShowCatForm(false);
                  setShowIconPicker(false);
                }}
                style={{
                  background: '#F1F5F9',
                  border: 'none',
                  color: '#6B7280',
                  borderRadius: 10,
                  padding: '10px 14px',
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
        )}

        {/* Category Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4,1fr)',
            gap: 6,
            marginBottom: 16,
          }}
        >
          {cats.map((cat, i) => {
            const CatIcon = getIconByName(cat.iconName);
            const isCustom = !cat.b && cat.id;
            return (
              <div key={cat.n} style={{ position: 'relative' }}>
                <button
                  onClick={() => setSelectedCat(i)}
                  style={{
                    width: '100%',
                    background: selectedCat === i ? cat.c + '15' : '#F8FAFF',
                    border: `2px solid ${selectedCat === i ? cat.c : 'transparent'}`,
                    borderRadius: 10,
                    padding: '10px 4px',
                    cursor: 'pointer',
                    textAlign: 'center',
                    transition: '.2s',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: 4,
                  }}
                >
                  <div
                    style={{
                      width: 24,
                      height: 24,
                      color: cat.c,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <CatIcon size={18} />
                  </div>
                  <span
                    style={{
                      fontSize: 9,
                      color: '#6B7280',
                      fontWeight: 600,
                      lineHeight: 1.2,
                    }}
                  >
                    {cat.n}
                  </span>
                </button>
                {/* Hapus kategori custom */}
                {isCustom && (
                  <button
                    onClick={() => {
                      deleteCategory(type, cat.n);
                      if (selectedCat >= cats.length - 1) setSelectedCat(0);
                    }}
                    style={{
                      position: 'absolute',
                      top: -6,
                      right: -6,
                      width: 16,
                      height: 16,
                      background: '#EF4444',
                      border: '2px solid #fff',
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer',
                      color: '#fff',
                      fontSize: 9,
                      fontWeight: 700,
                      lineHeight: 1,
                    }}
                  >
                    ×
                  </button>
                )}
              </div>
            );
          })}
        </div>

        {/* Note */}
        <div
          style={{
            fontSize: 10,
            fontWeight: 700,
            color: '#9CA3AF',
            textTransform: 'uppercase',
            letterSpacing: 0.8,
            marginBottom: 7,
            display: 'flex',
            alignItems: 'center',
            gap: 5,
          }}
        >
          <PenLine size={11} /> Catatan
        </div>
        <input
          name="note"
          style={inputStyle}
          type="text"
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="Opsional..."
        />

        {/* Date */}
        <div
          style={{
            fontSize: 10,
            fontWeight: 700,
            color: '#9CA3AF',
            textTransform: 'uppercase',
            letterSpacing: 0.8,
            marginBottom: 7,
            display: 'flex',
            alignItems: 'center',
            gap: 5,
          }}
        >
          <CalendarDays size={11} /> Tanggal
        </div>
        <input
          name="date"
          style={inputStyle}
          type="date"
          value={date}
          max={new Date().toLocaleDateString('en-CA')}
          onChange={(e) => setDate(e.target.value)}
        />

        {/* Account */}
        <div
          style={{
            fontSize: 10,
            fontWeight: 700,
            color: '#9CA3AF',
            textTransform: 'uppercase',
            letterSpacing: 0.8,
            marginBottom: 7,
            display: 'flex',
            alignItems: 'center',
            gap: 5,
          }}
        >
          <CreditCard size={11} /> Akun
        </div>
        <select
          name="account"
          style={inputStyle}
          value={accountId}
          onChange={(e) => setAccountId(e.target.value)}
        >
          {accounts.map((a) => (
            <option key={a.id} value={a.id}>
              {a.n}
            </option>
          ))}
        </select>

        {error && (
          <div
            style={{
              color: '#EF4444',
              fontSize: 12,
              marginBottom: 8,
              textAlign: 'center',
            }}
          >
            {error}
          </div>
        )}

        <button
          onClick={handleSubmit}
          style={{
            width: '100%',
            background: type === 'expense' ? '#EF4444' : '#22C55E',
            border: 'none',
            borderRadius: 14,
            padding: 16,
            fontFamily: 'Plus Jakarta Sans, sans-serif',
            fontSize: 14,
            fontWeight: 800,
            color: '#fff',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 8,
            marginTop: 4,
            boxShadow:
              type === 'expense'
                ? '0 4px 16px rgba(239,68,68,.3)'
                : '0 4px 16px rgba(34,197,94,.3)',
          }}
        >
          <Plus size={16} />
          Tambah {type === 'expense' ? 'Pengeluaran' : 'Pemasukan'}
        </button>
      </div>
    </div>
  );
}
