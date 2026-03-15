import { Moon, Palette, Sun } from 'lucide-react';
import { useState } from 'react';
import { PALETTE } from '../data/categories';
import { useStore } from '../store/useStore';

export default function ColorPicker({ darkMode, onToggleDark }) {
  const { theme, setTheme, userName, setUserName } = useStore();
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setOpen(!open)}
        style={{
          position: 'fixed',
          bottom: 108,
          right: 'calc(50% - 200px + 12px)',
          width: 40,
          height: 40,
          borderRadius: '50%',
          background: theme,
          border: '3px solid #fff',
          boxShadow: '0 4px 20px rgba(59,91,219,.2)',
          cursor: 'pointer',
          zIndex: 90,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          transition: '.3s',
        }}
      >
        <Palette size={17} color="#fff" />
      </button>

      {open && (
        <div
          style={{
            position: 'fixed',
            bottom: 160,
            right: 'calc(50% - 200px + 10px)',
            background: darkMode ? '#1A1D2E' : '#fff',
            borderRadius: 16,
            padding: 14,
            boxShadow: '0 8px 32px rgba(0,0,0,.2)',
            zIndex: 91,
            minWidth: 180,
            border: darkMode ? '1px solid #2A2F4A' : 'none',
          }}
        >
          <div
            style={{ position: 'fixed', inset: 0, zIndex: -1 }}
            onClick={() => setOpen(false)}
          />

          {/* Dark mode toggle */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: 12,
              paddingBottom: 12,
              borderBottom: `1px solid ${darkMode ? '#2A2F4A' : '#F1F5F9'}`,
            }}
          >
            <span
              style={{
                fontSize: 12,
                fontWeight: 700,
                color: darkMode ? '#8B94B2' : '#6B7280',
              }}
            >
              {darkMode ? 'Dark Mode' : 'Light Mode'}
            </span>
            <button
              onClick={onToggleDark}
              style={{
                width: 34,
                height: 34,
                borderRadius: 10,
                border: 'none',
                background: darkMode ? theme + '22' : '#F1F5F9',
                color: darkMode ? theme : '#6B7280',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
              }}
            >
              {darkMode ? <Sun size={16} /> : <Moon size={16} />}
            </button>
          </div>

          <div
            style={{
              fontSize: 10,
              fontWeight: 700,
              color: darkMode ? '#8B94B2' : '#9CA3AF',
              textTransform: 'uppercase',
              letterSpacing: 0.5,
              marginBottom: 8,
            }}
          >
            Warna Tema
          </div>
          <div
            style={{
              display: 'flex',
              gap: 7,
              flexWrap: 'wrap',
              marginBottom: 12,
            }}
          >
            {PALETTE.map((p) => (
              <button
                key={p.val}
                onClick={() => setTheme(p.val)}
                title={p.name}
                style={{
                  width: 26,
                  height: 26,
                  borderRadius: 8,
                  background: p.val,
                  cursor: 'pointer',
                  border:
                    theme === p.val
                      ? '3px solid #1A1D2E'
                      : '3px solid transparent',
                  transition: '.2s',
                }}
              />
            ))}
          </div>

          <div
            style={{
              fontSize: 10,
              fontWeight: 700,
              color: darkMode ? '#8B94B2' : '#9CA3AF',
              textTransform: 'uppercase',
              letterSpacing: 0.5,
              marginBottom: 6,
            }}
          >
            Nama Kamu
          </div>
          <input
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
            placeholder="Masukkan nama..."
            style={{
              width: '100%',
              border: `1.5px solid ${darkMode ? '#2A2F4A' : '#E5E7EB'}`,
              borderRadius: 8,
              padding: '7px 10px',
              fontFamily: 'Plus Jakarta Sans, sans-serif',
              fontSize: 12,
              outline: 'none',
              color: darkMode ? '#F0F4FF' : '#1A1D2E',
              background: darkMode ? '#222640' : '#fff',
            }}
          />
        </div>
      )}
    </>
  );
}
