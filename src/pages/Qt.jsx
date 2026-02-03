import { useEffect, useState } from 'react'
import { getTodayQt } from '../api/qt'
import './Qt.css'

export function Qt() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getTodayQt().then(setData).finally(() => setLoading(false))
  }, [])

  const handleSaveImage = () => {
    const el = document.getElementById('capture-area')
    if (!el) return
    import('html2canvas').then(({ default: html2canvas }) => {
      html2canvas(el, { scale: 2, backgroundColor: '#f0f8ff', logging: false }).then((canvas) => {
        const link = document.createElement('a')
        link.href = canvas.toDataURL('image/png')
        link.download = `오늘의큐티_${new Date().toISOString().slice(0, 10)}.png`
        link.click()
      })
    })
  }

  if (loading) return <div className="container mt-4 text-center">로딩 중...</div>
  if (data?.error) return <div className="container mt-4"><div className="alert alert-danger">{data.error}</div></div>

  return (
      <div className="qt-page-container">
        <div className="row g-3 h-100" id="capture-area">
          <div className="col-md-6 h-100">
            <div className="qt-content-area">
              <div className="qt-header">
                <p className="qt-date">{data?.date}</p>
                <h1 className="qt-title">{data?.title}</h1>
                <p className="qt-passage">{data?.passage}</p>
              </div>
              <div className="qt-body">
                {(data?.verses || []).map((verse, i) => (
                  <div className="verse" key={i}><p dangerouslySetInnerHTML={{ __html: verse }} /></div>
                ))}
              </div>
            </div>
          </div>
          <div className="col-md-6 h-100">
            <div className="qt-note-area">
              <h2 className="note-title">나의 묵상</h2>
              <textarea className="note-textarea" placeholder="오늘 말씀을 통해 받은 은혜를 기록해보세요..." />
            </div>
          </div>
        </div>
        <div className="btn-area text-end">
          <button type="button" className="btn btn-primary btn-sm me-2" onClick={handleSaveImage}>이미지로 저장하기</button>
        </div>
      </div>
  )
}
