'use client'

import { Component, ReactNode } from 'react'

interface Props { children: ReactNode; fallback?: ReactNode }
interface State { error: Error | null }

export class ErrorBoundary extends Component<Props, State> {
  state: State = { error: null }

  static getDerivedStateFromError(error: Error): State {
    return { error }
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    console.error('[ErrorBoundary]', error, info.componentStack)
  }

  render() {
    if (this.state.error) {
      return this.props.fallback ?? (
        <div style={{
          display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
          height: '100%', minHeight: '240px', padding: '40px', textAlign: 'center',
        }}>
          <div style={{
            width: '44px', height: '44px', borderRadius: '12px',
            background: 'var(--err-dim)', border: '1px solid var(--err)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px',
          }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--err)" strokeWidth="1.5">
              <circle cx="12" cy="12" r="10"/>
              <line x1="12" y1="8" x2="12" y2="12"/>
              <line x1="12" y1="16" x2="12.01" y2="16"/>
            </svg>
          </div>
          <p style={{ fontSize: '14px', fontWeight: 500, color: 'var(--t1)', marginBottom: '6px' }}>
            Something went wrong
          </p>
          <p style={{ fontSize: '12.5px', color: 'var(--t3)', marginBottom: '20px', maxWidth: '280px', lineHeight: 1.6 }}>
            {this.state.error.message}
          </p>
          <button
            className="btn-secondary btn-sm"
            onClick={() => this.setState({ error: null })}
          >
            Try again
          </button>
        </div>
      )
    }
    return this.props.children
  }
}
