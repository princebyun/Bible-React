import { useEffect, useState } from 'react'
import { getSermons } from '../api/sermons'

export function Sermons() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getSermons().then(setData).finally(() => setLoading(false))
  }, [])

  if (loading) return <div className="container mt-4 text-center">로딩 중...</div>
  const { videos = [], channelUrl, error } = data || {}

  return (
      <div className="container mt-4">
        <div className="text-end mb-4">
          <a href={channelUrl || 'https://www.youtube.com/@new_center/videos'} target="_blank" rel="noreferrer" className="btn btn-primary">
            전체 영상 보기
          </a>
        </div>
        {error && <div className="alert alert-danger">{error}</div>}
        {!videos?.length && !error && <div className="alert alert-info text-center py-5">최신 영상이 없습니다.</div>}
        {videos?.length > 0 && (
          <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-4 g-4">
            {videos.map((v) => (
              <div className="col" key={v.link}>
                <a href={v.link} target="_blank" rel="noreferrer" className="text-decoration-none">
                  <div className="card h-100 shadow-sm">
                    <img src={v.thumbnailUrl} className="card-img-top" alt={v.title} style={{ aspectRatio: '16/9', objectFit: 'cover' }} />
                    <div className="card-body">
                      <h6 className="card-title" style={{ display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{v.title}</h6>
                    </div>
                    <div className="card-footer text-end"><small className="text-muted">{v.publishedDate}</small></div>
                  </div>
                </a>
              </div>
            ))}
          </div>
        )}
      </div>
  )
}
