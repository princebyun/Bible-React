import { useEffect, useRef, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { getBibleView, getChapters } from '../api/bible'
import './Bible.css'

export function Bible() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const keywordRef = useRef(null)
  const cate = searchParams.get('cate')
  const book = searchParams.get('book')
  const chapter = searchParams.get('chapter')
  const keyword = searchParams.get('keyword')

  useEffect(() => {
    const params = {}
    if (cate) params.cate = cate
    if (book) params.book = book
    if (chapter) params.chapter = chapter
    if (keyword) params.keyword = keyword
    getBibleView(params)
      .then(setData)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false))
  }, [cate, book, chapter, keyword])

  const handleFilterChange = (key, value) => {
    const next = new URLSearchParams(searchParams)
    if (value) next.set(key, value)
    else next.delete(key)
    setSearchParams(next)
  }

  const handleBookChange = async (bookId) => {
    handleFilterChange('book', bookId)
    if (bookId && Number(bookId) > 0) {
      try {
        const { maxChapter } = await getChapters(Number(bookId))
        const next = new URLSearchParams(searchParams)
        next.set('book', bookId)
        if (maxChapter) next.set('chapter', '1')
        setSearchParams(next)
      } catch (_) {}
    }
  }

  if (loading) return <div className="container mt-4 text-center">로딩 중...</div>
  if (error) return <div className="container mt-4 alert alert-danger">{error}</div>
  if (!data) return null

  const { verses, testaments, books, maxChapter, selectedCate, selectedBook, selectedChapter, selectedKeyword } = data

  return (
    <div className="container mt-4">
        <h1 className="page-title">성경 보기</h1>
        <form className="row g-3 align-items-end filter-form" onSubmit={(e) => { e.preventDefault(); handleFilterChange('keyword', keywordRef.current?.value?.trim() || null); }}>
          <div className="col-md-3">
            <label className="form-label">단어 검색</label>
            <input ref={keywordRef} type="text" className="form-control" placeholder="예: 사랑" defaultValue={selectedKeyword ?? ''} onBlur={(e) => handleFilterChange('keyword', e.target.value.trim() || null)} />
          </div>
          <div className="col-md-2">
            <label className="form-label">구분</label>
            <select className="form-select" value={selectedCate ?? ''} onChange={(e) => handleFilterChange('cate', e.target.value || null)}>
              <option value="">전체</option>
              {testaments?.map((t, i) => (
                <option key={i} value={i + 1}>{t}</option>
              ))}
            </select>
          </div>
          <div className="col-md-3">
            <label className="form-label">성경</label>
            <select className="form-select" value={selectedBook ?? ''} onChange={(e) => handleBookChange(e.target.value)}>
              <option value="">전체</option>
              {books?.map((b) => (
                <option key={b.book} value={b.book}>{b.longLabel}</option>
              ))}
            </select>
          </div>
          <div className="col-md-2">
            <label className="form-label">장</label>
            <select className="form-select" value={selectedChapter ?? ''} onChange={(e) => handleFilterChange('chapter', e.target.value || null)}>
              <option value="">전체</option>
              {Array.from({ length: maxChapter || 0 }, (_, i) => i + 1).map((n) => (
                <option key={n} value={n}>{n}장</option>
              ))}
            </select>
          </div>
          <div className="col-md-2">
            <button type="submit" className="btn btn-primary w-100 mt-4">검색</button>
          </div>
        </form>
        <div id="bible-content" className="mt-4">
          {!verses?.length && <div className="alert alert-info">검색 결과가 없습니다.</div>}
          {verses?.length > 0 && (
            <div className="accordion" id="bibleAccordion">
              {[...new Set(verses.map((v) => v.book))].map((bookId) => {
                const bookVerses = verses.filter((v) => v.book === bookId)
                const first = bookVerses[0]
                return (
                  <div className="accordion-item" key={bookId}>
                    <h2 className="accordion-header">
                      <button className={`accordion-button ${selectedBook ? '' : 'collapsed'}`} type="button" data-bs-toggle="collapse" data-bs-target={`#collapse-${bookId}`} aria-expanded={!!selectedBook}>
                        {first?.longLabel}
                      </button>
                    </h2>
                    <div id={`collapse-${bookId}`} className={`accordion-collapse collapse ${selectedBook ? 'show' : ''}`}>
                      <div className="accordion-body">
                        {bookVerses.map((v) => (
                          <div className="bible-verse" key={v.seq}>
                            <p><strong>{v.chapter}:{v.paragraph}</strong> <span>{v.sentence}</span></p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>
  )
}
