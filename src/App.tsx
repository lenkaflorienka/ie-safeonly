import { HashRouter, Routes, Route, useLocation } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import { MusicProvider } from './context/MusicContext'
import { FlashbackProvider } from './context/FlashbackContext'
import { TopNav } from './components/TopNav'
import { MusicPlayer } from './components/MusicPlayer'
import { Opening } from './views/Opening'
import { Hub } from './views/Hub'
import { ChapterView } from './views/ChapterView'
import { PeopleView } from './views/PeopleView'
import { Replay } from './views/Replay'
import { Ending } from './views/Ending'

function Chrome() {
  const location = useLocation()
  const isOpening = location.pathname === '/' || location.pathname === ''

  return (
    <>
      {!isOpening && <TopNav />}
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={<Opening />} />
          <Route path="/map" element={<Hub />} />
          <Route path="/chapter/:id" element={<ChapterView />} />
          <Route path="/people" element={<PeopleView />} />
          <Route path="/replay" element={<Replay />} />
          <Route path="/ending" element={<Ending />} />
        </Routes>
      </AnimatePresence>
      {!isOpening && <MusicPlayer />}
    </>
  )
}

function App() {
  return (
    <MusicProvider>
      <FlashbackProvider>
        <HashRouter>
          <Chrome />
        </HashRouter>
      </FlashbackProvider>
    </MusicProvider>
  )
}

export default App
