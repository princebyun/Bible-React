import { useParams } from 'react-router-dom'
import { getShareImageUrl } from '../api/image'

export function ShareView() {
  const { filename } = useParams()
  const imageUrl = filename ? getShareImageUrl(filename) : ''

  return (
    <div style={{ margin: 0, padding: 0, minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', backgroundColor: '#f0f0f0' }}>
      {filename ? (
        <img src={imageUrl} alt="공유된 이미지" style={{ maxWidth: '100%', maxHeight: '100vh', objectFit: 'contain' }} />
      ) : (
        <p>이미지를 찾을 수 없습니다.</p>
      )}
    </div>
  )
}
