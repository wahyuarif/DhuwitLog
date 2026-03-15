export default function ConfirmDialog({
  title,
  desc,
  onConfirm,
  onCancel,
  theme,
}) {
  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(26,29,46,.5)',
        zIndex: 300,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20,
        backdropFilter: 'blur(4px)',
      }}
    >
      <div
        style={{
          background: '#fff',
          borderRadius: 24,
          padding: 24,
          width: '100%',
          maxWidth: 320,
          boxShadow: '0 20px 60px rgba(0,0,0,.15)',
        }}
      >
        <div
          style={{
            width: 48,
            height: 48,
            borderRadius: 14,
            background: '#FEE2E2',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 16px',
          }}
        >
          <svg
            width="22"
            height="22"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#EF4444"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="3 6 5 6 21 6" />
            <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
            <path d="M10 11v6" />
            <path d="M14 11v6" />
            <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
          </svg>
        </div>
        <div style={{ textAlign: 'center', marginBottom: 20 }}>
          <div
            style={{
              fontSize: 16,
              fontWeight: 800,
              color: '#1A1D2E',
              marginBottom: 6,
            }}
          >
            {title}
          </div>
          <div style={{ fontSize: 13, color: '#6B7280', lineHeight: 1.5 }}>
            {desc}
          </div>
        </div>
        <div
          style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}
        >
          <button
            onClick={onCancel}
            style={{
              padding: 12,
              borderRadius: 12,
              border: '1.5px solid #E5E7EB',
              background: '#fff',
              color: '#6B7280',
              fontSize: 13,
              fontWeight: 700,
              fontFamily: 'Plus Jakarta Sans, sans-serif',
              cursor: 'pointer',
            }}
          >
            Batal
          </button>
          <button
            onClick={onConfirm}
            style={{
              padding: 12,
              borderRadius: 12,
              border: 'none',
              background: '#EF4444',
              color: '#fff',
              fontSize: 13,
              fontWeight: 700,
              fontFamily: 'Plus Jakarta Sans, sans-serif',
              cursor: 'pointer',
              boxShadow: '0 4px 12px rgba(239,68,68,.3)',
            }}
          >
            Hapus
          </button>
        </div>
      </div>
    </div>
  );
}
