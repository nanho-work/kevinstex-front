'use client'

import { useMemo, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'

export default function ConsultToolAuthPage() {
  const router = useRouter()
  const sp = useSearchParams()
  const nextPath = useMemo(() => sp.get('next') || '/consult-tool', [sp])

  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const submit = async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch('/api/consult-tool/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      })
      if (!res.ok) {
        setError('비밀번호가 올바르지 않습니다.')
        return
      }
      router.replace(nextPath)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ maxWidth: 420, margin: '0 auto', padding: 24 }}>
      <div style={{ fontSize: 18, fontWeight: 800, marginBottom: 10 }}>
        상담용 계산기 접근
      </div>
      <div style={{ fontSize: 12, color: '#666', marginBottom: 16, lineHeight: 1.5 }}>
        공유받은 비밀번호를 입력해야 접속할 수 있습니다.
      </div>

      <div style={{ display: 'flex', gap: 8 }}>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          onKeyDown={(e) => (e.key === 'Enter' ? submit() : null)}
          placeholder="비밀번호"
          style={{
            flex: 1,
            padding: 10,
            border: '1px solid #ddd',
            borderRadius: 8,
          }}
        />
        <button
          onClick={submit}
          disabled={loading || !password}
          style={{
            padding: '10px 14px',
            borderRadius: 8,
            border: '1px solid #111',
            background: '#111',
            color: '#fff',
            opacity: loading || !password ? 0.6 : 1,
          }}
        >
          확인
        </button>
      </div>

      {error && <div style={{ marginTop: 10, color: '#d00', fontSize: 12 }}>{error}</div>}
    </div>
  )
}