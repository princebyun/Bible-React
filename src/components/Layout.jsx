import {Link, Outlet, useLocation} from 'react-router-dom'
import './Layout.css'

export function Layout() {
    const location = useLocation()
    const isHome = location.pathname === '/'
    if (isHome) return <Outlet/>
    return (
        <>
            <header className="site-header sticky-top">
                <nav className="navbar navbar-expand-md navbar-light">
                    <div className="container">
                        <Link className="navbar-brand" to="/">Oikos Church Bible</Link>
                        <button className="navbar-toggler" type="button" data-bs-toggle="collapse"
                                data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false"
                                aria-label="Toggle navigation">
                            <span className="navbar-toggler-icon"/>
                        </button>
                        <div className="collapse navbar-collapse" id="navbarNav">
                            <ul className="navbar-nav ms-auto">
                                <li className="nav-item"><Link className="nav-link" to="/bible">성경 읽기</Link></li>
                                <li className="nav-item"><Link className="nav-link" to="/qt">오늘의 큐티본문</Link></li>
                                <li className="nav-item"><Link className="nav-link" to="/sermons">주일말씀</Link></li>
                                <li className="nav-item dropdown">
                                    <a className="nav-link dropdown-toggle" href="#" id="navbarDropdown" role="button"
                                       data-bs-toggle="dropdown" aria-expanded="false">클린봇</a>
                                    <ul className="dropdown-menu" aria-labelledby="navbarDropdown">
                                        <li><Link className="dropdown-item" to="/cleanbot/chat">클린챗 검사</Link></li>
                                        <li><Link className="dropdown-item" to="/cleanbot/image">클린이미지 검사</Link></li>
                                    </ul>
                                </li>
                            </ul>
                        </div>
                    </div>
                </nav>
            </header>
            <main className="layout-main">
                <Outlet/>
            </main>
        </>
    )
}
