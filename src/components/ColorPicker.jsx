import { Palette } from 'lucide-react'
import { useState } from 'react'
import { useStore } from '../store/useStore'
import { PALETTE } from '../data/categories'

export default function ColorPicker() {
  const { theme, setTheme, userName, setUserName } = useStore()
  const [open, setOpen] = useState(false)

  return (
    <>
      {/* FAB */}
      <button
        onClick={() => setOpen(!open)}
        style={{
          position: 'fixed', bottom: 108,
          right: 'calc(50% - 200px + 12px)',
          width: 40, height: 40, borderRadius: '50%',
          background: theme, border: '3px solid #fff',
          boxShadow: '0 4px 20px rgba(59,91,219,.12)',
          cursor: 'pointer', zIndex: 90,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          transition: '.3s',
        }}
      >
        <Palette size={17} color="#fff" />
      </button>

      {/* Panel */}
      {open && (
        <div style={{
          position: 'fixed', bottom: 160,
          right: 'calc(50% - 200px + 10px)',
          background: '#fff', borderRadius: 16, padding: 14,
          boxShadow: '0 8px 32px rgba(0,0,0,.15)',
          zIndex: 91, minWidth: 170,
        }}>
          {/* Close on outside click */}
          <div
            style={{ position: 'fixed', inset: 0, zIndex: -1 }}
            onClick={() => setOpen(false)}
          />

          <div style={{ fontSize: 10, fontWeight: 700, color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: .5, marginBottom: 8 }}>
            Warna Tema
          </div>

          {/* Swatches */}
          <div style={{ display: 'flex', gap: 7, flexWrap: 'wrap', marginBottom: 12 }}>
            {PALETTE.map(p => (
              <button
                key={p.val}
                onClick={() => {
                  setTheme(p.val)
                  document.documentElement.style.setProperty('--primary', p.val)
                }}
                title={p.name}
                style={{
                  width: 26, height: 26, borderRadius: 8,
                  background: p.val, cursor: 'pointer',
                  border: theme === p.val ? '3px solid #1A1D2E' : '3px solid transparent',
                  transition: '.2s',
                }}
              />
            ))}
          </div>

          <div style={{ fontSize: 10, fontWeight: 700, color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: .5, marginBottom: 6 }}>
            Nama Kamu
          </div>
          <input
            value={userName}
            onChange={e => setUserName(e.target.value)}
            placeholder="Masukkan nama..."
            style={{
              width: '100%', border: '1.5px solid #E5E7EB',
              borderRadius: 8, padding: '7px 10px',
              fontFamily: 'Plus Jakarta Sans, sans-serif',
              fontSize: 12, outline: 'none', color: '#1A1D2E',
            }}
          />
        </div>
      )}
    </>
  )
}