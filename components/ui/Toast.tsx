'use client'

import { createContext, useCallback, useContext, useRef, useState } from 'react'

type ToastKind = 'success' | 'error' | 'info'
interface Toast { id: number; message: string; kind: ToastKind }

interface ToastCtx {
  toast: (message: string, kind?: ToastKind) => void
}

const Ctx = createContext<ToastCtx>({ toast: () => {} })

export function useToast() { return useContext(Ctx) }

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([])
  const counter = useRef(0)

  const toast = useCallback((message: string, kind: ToastKind = 'success') => {
    const id = ++counter.current
    setToasts(prev => [...prev, { id, message, kind }])
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 3500)
  }, [])

  const COLORS: Record<ToastKind, { bg: string; border: string; color: string }> = {
    success: { bg: 'var(--ok-dim, rgba(34,197,94,0.12))', border: 'rgba(34,197,94,0.3)',  color: 'var(--ok, #22c55e)' },
    error:   { bg: 'var(--err-dim)',                      border: 'var(--err)',             color: 'var(--err)' },
    info:    { bg: 'var(--vd)',                            border: 'var(--vm)',              color: 'var(--v)' },
  }

  return (
    <Ctx.Provider value={{ toast }}>
      {children}
      <div style={{
        position: 'fixed', bottom: '24px', right: '24px',
        display: 'flex', flexDirection: 'column', gap: '8px',
        zIndex: 9999, pointerEvents: 'none',
      }}>
        {toasts.map(t => {
          const c = COLORS[t.kind]
          return (
            <div key={t.id} style={{
              background: c.bg, border: `1px solid ${c.border}`,
              color: c.color, borderRadius: '10px',
              padding: '11px 16px', fontSize: '13px', fontWeight: 500,
              maxWidth: '320px', lineHeight: 1.5,
              animation: 'fadeIn 150ms ease',
              backdropFilter: 'blur(8px)',
              boxShadow: '0 4px 24px rgba(0,0,0,0.25)',
            }}>
              {t.message}
            </div>
          )
        })}
      </div>
    </Ctx.Provider>
  )
}
