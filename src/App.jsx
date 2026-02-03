import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Layout } from './components/Layout'
import { Home } from './pages/Home'
import { Bible } from './pages/Bible'
import { Qt } from './pages/Qt'
import { Sermons } from './pages/Sermons'
import { CleanBotChat } from './pages/CleanBotChat'
import { CleanBotImage } from './pages/CleanBotImage'
import { ShareView } from './pages/ShareView'
import './App.css'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="bible" element={<Bible />} />
          <Route path="qt" element={<Qt />} />
          <Route path="sermons" element={<Sermons />} />
          <Route path="cleanbot/chat" element={<CleanBotChat />} />
          <Route path="cleanbot/image" element={<CleanBotImage />} />
        </Route>
        <Route path="/share-view/:filename" element={<ShareView />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
