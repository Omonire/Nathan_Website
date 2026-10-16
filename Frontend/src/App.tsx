import { Route, Routes } from 'react-router-dom'
import { Home } from './pages/Home'
import { WorkDetail } from './pages/WorkDetail'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/work/:slug" element={<WorkDetail />} />
    </Routes>
  )
}
