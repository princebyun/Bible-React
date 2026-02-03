import { useState } from 'react'
import { checkImage } from '../api/cleanbot'
import './CleanBot.css'

const UNSAFE_IMAGE_PLACEHOLDER = '/images/unsafe_image.png'

export function CleanBotImage() {
  const [file, setFile] = useState(null)
  const [preview, setPreview] = useState('')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(null)
  const [error, setError] = useState(null)

  const handleFileChange = (e) => {
    const f = e.target.files?.[0]
    setFile(f)
    setResult(null)
    setError(null)
    if (f) {
      const r = new FileReader()
      r.onload = () => setPreview(r.result)
      r.readAsDataURL(f)
    } else setPreview('')
  }

  const handleCheck = async () => {
    if (!file) {
      alert('이미지를 선택해주세요.')
      return
    }
    setError(null)
    setResult(null)
    setLoading(true)
    try {
      const res = await checkImage(file)
      setResult(res)
    } catch (e) {
      setError(e.response?.data?.message || e.message || '검사 중 오류가 발생했습니다.')
    } finally {
      setLoading(false)
    }
  }

  const displayImage = result && !result.isSafe ? UNSAFE_IMAGE_PLACEHOLDER : preview

  return (
    <div className="container mt-4">
        <h1 className="page-title">클린이미지 검사</h1>
        <p className="text-muted">이미지를 업로드하고 유해성 여부를 검사합니다.</p>
        <div className="card">
          <div className="card-body">
            <div className="mb-3">
              <label htmlFor="imageInput" className="form-label">이미지 선택</label>
              <input type="file" id="imageInput" className="form-control" accept="image/*" onChange={handleFileChange} />
            </div>
            <button type="button" className="btn btn-primary" onClick={handleCheck} disabled={loading}>{loading ? '검사 중...' : '검사하기'}</button>
          </div>
        </div>
        {displayImage && (
          <div className="mt-4">
            <img src={displayImage} alt="미리보기" className="img-fluid rounded" style={{ maxHeight: 300 }} />
          </div>
        )}
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
