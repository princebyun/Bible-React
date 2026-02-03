import { useRef, useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import './Home.css'

const cards = [
  { to: '/bible', img: '/images/card_bible.png', title: '성경 읽기', desc: '원하는 구절을 찾아\n말씀을 묵상하세요.' },
  { to: '/qt', img: '/images/card_today.png', title: '오늘의 큐티본문', desc: '매일 주어지는 새로운\n은혜의 말씀을 만나보세요.' },
  { to: '/sermons', img: '/images/card_pray.png', title: '주일말씀', desc: '지난 주일의 은혜로운\n말씀을 다시 만나보세요.' },
  { to: '/cleanbot/chat', img: '/images/card_chat.png', title: '클린챗 검사', desc: '텍스트의 유해성을\n검사합니다.' },
  { to: '/cleanbot/image', img: '/images/card_image.png', title: '클린이미지 검사', desc: '이미지의 유해성을\n검사합니다.' },
]

function getScrollAmount() {
  const w = typeof window !== 'undefined' ? window.innerWidth : 1200
  if (w > 1100) return 320 + 30
  if (w >= 768) return 300 + 30
  return 280 + 20
}

export function Home() {
  const navigate = useNavigate()
  const keywordRef = useRef(null)
  const cardWrapperRef = useRef(null)
  const [prevVisible, setPrevVisible] = useState(false)
  const [nextVisible, setNextVisible] = useState(true)

  const handleSearch = (e) => {
    e.preventDefault()
    const q = keywordRef.current?.value?.trim()
    navigate(q ? `/bible?keyword=${encodeURIComponent(q)}` : '/bible')
  }

  const updateButtons = () => {
    const wrapper = cardWrapperRef.current
    if (!wrapper) return
    const screenWidth = window.innerWidth
    if (screenWidth < 768) {
      setPrevVisible(false)
      setNextVisible(false)
      return
    }
    const { scrollLeft, scrollWidth, clientWidth } = wrapper
    setPrevVisible(scrollLeft > 0)
    setNextVisible(Math.abs(scrollWidth - clientWidth - scrollLeft) >= 1)
  }

  useEffect(() => {
    const wrapper = cardWrapperRef.current
    if (!wrapper) return
    updateButtons()
    wrapper.addEventListener('scroll', updateButtons)
    window.addEventListener('resize', updateButtons)
    return () => {
      wrapper.removeEventListener('scroll', updateButtons)
      window.removeEventListener('resize', updateButtons)
    }
  }, [])

  return (
    <div className="home-page">
      <div className="top-bar">
        <Link to="/" className="logo">Worshiping Church Bible</Link>
      </div>
      <div className="main-content">
        <div className="search-wrapper">
          <h1 className="main-title">어떤 말씀을 찾고 계신가요??</h1>
          <form onSubmit={handleSearch} className="search-form">
            <i className="fas fa-search search-icon" aria-hidden="true" />
            <input ref={keywordRef} className="search-input" type="search" name="keyword" placeholder="성경 구절이나 단어를 검색해보세요..." aria-label="Search" />
          </form>
        </div>
        <div className="slider-container">
          <button type="button" className="slider-btn prev" aria-label="이전" style={{ opacity: prevVisible ? 1 : 0, visibility: prevVisible ? 'visible' : 'hidden' }} onClick={() => { const w = cardWrapperRef.current; if (w) w.scrollLeft -= getScrollAmount(); }}>&lt;</button>
          <div className="card-wrapper" ref={cardWrapperRef}>
            <div className="card-container">
              {cards.map((c) => (
                <Link key={c.to} to={c.to} className="custom-card">
                  <div className="card-image-wrapper">
                    <img src={c.img} alt={c.title} />
                  </div>
                  <div className="card-content">
                    <div className="card-title">{c.title}</div>
                    <div className="card-desc">{c.desc.split('\n').map((line, i) => <span key={i}>{line}<br /></span>)}</div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
          <button type="button" className="slider-btn next" aria-label="다음" style={{ opacity: nextVisible ? 1 : 0, visibility: nextVisible ? 'visible' : 'hidden' }} onClick={() => { const w = cardWrapperRef.current; if (w) w.scrollLeft += getScrollAmount(); }}>&gt;</button>
        </div>
      </div>
    </div>
  )
}
