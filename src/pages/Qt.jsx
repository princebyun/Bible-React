import {useEffect, useState} from 'react'
import {getTodayQt} from '../api/qt'
import {uploadImage} from '../api/image'
import './Qt.css'

const KAKAO_KEY = '58f34b0958d81c971284547077722431'

export function Qt() {
    const [data, setData] = useState(null)
    const [loading, setLoading] = useState(true)
    const [isDark, setIsDark] = useState(() => localStorage.getItem('qt-theme') === 'dark')

    useEffect(() => {
        getTodayQt().then(setData).finally(() => setLoading(false))
    }, [])

    useEffect(() => {
        if (window.Kakao && !window.Kakao.isInitialized()) {
            try {
                window.Kakao.init(KAKAO_KEY)
            } catch (e) {
                console.error('Kakao SDK 초기화 실패:', e)
            }
        }
    }, [])

    useEffect(() => {
        document.body.classList.add('qt-page')
        return () => {
            document.body.classList.remove('qt-page')
            document.documentElement.removeAttribute('data-theme')
        }
    }, [])

    useEffect(() => {
        document.documentElement.setAttribute('data-theme', isDark ? 'dark' : 'light')
        localStorage.setItem('qt-theme', isDark ? 'dark' : 'light')
    }, [isDark])

    const captureScreen = async () => {
        const el = document.getElementById('capture-area')
        if (!el) throw new Error('capture-area not found')
        const captureBg = getComputedStyle(document.documentElement).getPropertyValue('--qt-capture-bg').trim()
        const {default: html2canvas} = await import('html2canvas')
        return html2canvas(el, {
            scale: 2,
            backgroundColor: captureBg || '#f0f8ff',
            logging: false,
            useCORS: true,
            onclone: (clonedDoc) => {
                const textareas = clonedDoc.querySelectorAll('.note-textarea')
                textareas.forEach((textarea) => {
                    const div = clonedDoc.createElement('div')
                    div.className = textarea.className
                    div.style.whiteSpace = 'pre-wrap'
                    div.style.height = 'auto'
                    div.style.overflow = 'visible'
                    div.style.resize = 'none'
                    div.style.border = 'none'
                    div.removeAttribute('placeholder')
                    div.innerText = textarea.value
                    textarea.parentNode.replaceChild(div, textarea)
                })
            },
        })
    }

    const handleSaveImage = async () => {
        try {
            const canvas = await captureScreen()
            const link = document.createElement('a')
            link.href = canvas.toDataURL('image/png')
            link.download = `오늘의큐티_${new Date().toISOString().slice(0, 10)}.png`
            link.click()
        } catch (err) {
            console.error('이미지 저장 실패:', err)
            alert('이미지 저장에 실패했습니다.')
        }
    }

    const handleShareKakao = async () => {
        if (!window.Kakao?.isInitialized()) {
            alert('카카오 JavaScript 키가 설정되지 않았습니다. 코드를 확인해주세요.')
            return
        }

        try {
            const canvas = await captureScreen()
            const imageDataUrl = canvas.toDataURL('image/png')

            const blob = await new Promise((resolve) => canvas.toBlob(resolve, 'image/png'))
            const file = new File([blob], 'qt_share.png', {type: 'image/png'})

            const [serverData, kakaoData] = await Promise.all([
                uploadImage(imageDataUrl),
                window.Kakao.Share.uploadImage({file: [file]}),
            ])

            const shareUrl = window.location.origin + serverData.url
            const kakaoImageUrl = kakaoData.infos.original.url

            window.Kakao.Share.sendDefault({
                objectType: 'feed',
                content: {
                    title: data?.title || '오늘의 큐티',
                    description: `${data?.date || ''} 묵상 나눔`,
                    imageUrl: kakaoImageUrl,
                    imageWidth: canvas.width,
                    imageHeight: canvas.height,
                    link: {mobileWebUrl: shareUrl, webUrl: shareUrl},
                },
                buttons: [
                    {
                        title: '묵상 보기',
                        link: {mobileWebUrl: shareUrl, webUrl: shareUrl},
                    },
                ],
            })
        } catch (err) {
            console.error('카카오톡 공유 실패:', err)
            alert('카카오톡 공유에 실패했습니다.')
        }
    }

    if (loading) return <div className="container mt-4 text-center">로딩 중...</div>
    if (data?.error) return <div className="container mt-4">
        <div className="alert alert-danger">{data.error}</div>
    </div>

    return (
        <div className="qt-page-container">
            <div className="d-flex justify-content-end mb-2">
                <div className="theme-toggle-wrapper">
                    <div className="theme-toggle">
                        <span className={`theme-label ${!isDark ? 'active' : ''}`}>라이트 모드</span>
                        <label className="toggle-switch">
                            <input type="checkbox" checked={isDark} onChange={(e) => setIsDark(e.target.checked)}/>
                            <span className="toggle-knob"/>
                        </label>
                        <span className={`theme-label ${isDark ? 'active' : ''}`}>다크 모드</span>
                    </div>
                </div>
            </div>
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
                                <div className="verse" key={i}><p dangerouslySetInnerHTML={{__html: verse}}/></div>
                            ))}
                        </div>
                    </div>
                </div>
                <div className="col-md-6 h-100">
                    <div className="qt-note-area">
                        <h2 className="note-title">나의 묵상</h2>
                        <textarea className="note-textarea" placeholder="오늘 말씀을 통해 받은 은혜를 기록해보세요..."/>
                    </div>
                </div>
            </div>
            <div className="btn-area text-end">
                <button type="button" className="btn btn-primary btn-sm me-2" onClick={handleSaveImage}>이미지로 저장하기
                </button>
                <button type="button" className="btn btn-kakao btn-sm" onClick={handleShareKakao}>카카오톡으로 공유하기</button>
            </div>
        </div>
    )
}
