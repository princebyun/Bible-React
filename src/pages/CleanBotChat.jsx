import { useState } from 'react'
import { checkText } from '../api/cleanbot'
import './CleanBot.css'

export function CleanBotChat() {
  const [text, setText] = useState('')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(null)
  const [error, setError] = useState(null)

  const handleCheck = async () => {
    setError(null)
    setResult(null)
    setLoading(true)
    try {
      const res = await checkText(text)
      setResult(res)
    } catch (e) {
      setError(e.response?.data?.message || e.message || '검사 중 오류가 발생했습니다.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container mt-4">
        <h1 className="page-title">클린챗 검사</h1>
        <p className="text-muted">텍스트를 입력하고 유해성 여부를 검사합니다.</p>
        <div className="card">
          <div className="card-body">
            <div className="mb-3">
              <label htmlFor="textInput" className="form-label">검사할 텍스트</label>
              <textarea id="textInput" className="form-control" rows={8} placeholder="여기에 텍스트를 입력하세요..." value={text} onChange={(e) => setText(e.target.value)} />
            </div>
            <button type="button" className="btn btn-primary" onClick={handleCheck} disabled={loading}>{loading ? '검사 중...' : '검사하기'}</button>
          </div>
        </div>
        {error && <div className="alert alert-danger mt-4">{error}</div>}
        {result && (
          <div className={`card mt-4 ${result.isSafe ? 'result-safe' : 'result-unsafe'}`}>
            <div className="card-header"><strong>검사 결과</strong></div>
            <div className="card-body">
              <p className={`card-text ${result.isSafe ? 'text-success' : 'text-danger'}`}><strong>{result.isSafe ? '클린합니다' : '부적절합니다'}</strong></p>
              <p className="card-text"><strong>사유:</strong> {result.reason}</p>
            </div>
          </div>
        )}
      </div>
  )
}
